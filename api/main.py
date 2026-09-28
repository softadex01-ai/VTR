from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
import torch
import os
import io
from PIL import Image
from huggingface_hub import snapshot_download
from diffusers.image_processor import VaeImageProcessor
import sys
import asyncio
import time
from dataclasses import dataclass, field
from typing import Any

# Add CatVTON to python path so we can import its modules
# We assume the CatVTON repo is cloned in the parent directory of this api folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'CatVTON')))

from model.cloth_masker import AutoMasker
from model.pipeline import CatVTONPipeline
from utils import resize_and_crop, resize_and_padding, init_weight_dtype

app = FastAPI(title="VTRO VTON API", description="Headless API for Virtual Try-On using CatVTON")

# Global variables for models to keep them loaded in memory
pipeline = None
automasker = None
mask_processor = None

# --- DAA Scheduler Components ---
gpu_queue = asyncio.PriorityQueue()

@dataclass(order=True)
class PrioritizedRequest:
    priority: int
    timestamp: float
    person: Any = field(compare=False)
    cloth: Any = field(compare=False)
    future: asyncio.Future = field(compare=False)

def run_inference_sync(person, cloth):
    """Synchronous function for heavy PyTorch inference"""
    mask = automasker(person, "upper")['mask']
    mask = mask_processor.blur(mask, blur_factor=9)
    result_image = pipeline(
        image=person,
        condition_image=cloth,
        mask=mask,
        num_inference_steps=50,
        guidance_scale=2.5,
    )[0]
    return result_image

async def gpu_worker():
    """
    DAA Greedy Scheduler Worker (Priority Queue based).
    Ensures GPU processes one request at a time (OOM prevention)
    and always picks the highest priority request next.
    """
    while True:
        req = await gpu_queue.get()
        try:
            # Run heavy workload in a separate thread so event loop is not blocked
            result_image = await asyncio.to_thread(run_inference_sync, req.person, req.cloth)
            req.future.set_result(result_image)
        except Exception as e:
            req.future.set_exception(e)
        finally:
            gpu_queue.task_done()

@app.on_event("startup")
async def load_models():
    global pipeline, automasker, mask_processor
    print("Downloading/Loading CatVTON Models... (This takes a minute on first run)")
    repo_path = snapshot_download(repo_id="zhengchong/CatVTON")
    
    print("Initializing Pipeline...")
    pipeline = CatVTONPipeline(
        base_ckpt="booksforcharlie/stable-diffusion-inpainting",
        attn_ckpt=repo_path,
        attn_ckpt_version="mix",
        weight_dtype=init_weight_dtype("fp16"), # Half precision for T4 GPU compatibility
        use_tf32=True,
        device='cuda'
    )
    
    print("Initializing AutoMasker...")
    mask_processor = VaeImageProcessor(vae_scale_factor=8, do_normalize=False, do_binarize=True, do_convert_grayscale=True)
    automasker = AutoMasker(
        densepose_ckpt=os.path.join(repo_path, "DensePose"),
        schp_ckpt=os.path.join(repo_path, "SCHP"),
        device='cuda', 
    )
    print("✅ Models loaded and API is ready to receive requests!")
    # Start the DAA GPU Scheduler background task
    asyncio.create_task(gpu_worker())

@app.post("/try-on")
async def try_on(person_image: UploadFile = File(...), garment_image: UploadFile = File(...), priority: int = 1):
    """
    Endpoint that accepts a person image and a garment image,
    queues the request using a Priority Scheduler, applies the garment, 
    and returns the generated image.
    """
    # Read images from request
    person_bytes = await person_image.read()
    garment_bytes = await garment_image.read()
    
    # Load with PIL
    person = Image.open(io.BytesIO(person_bytes)).convert("RGB")
    cloth = Image.open(io.BytesIO(garment_bytes)).convert("RGB")
    
    # Preprocess and resize to standard CatVTON input size
    person = resize_and_crop(person, (768, 1024))
    cloth = resize_and_padding(cloth, (768, 1024))
    
    # DAA Integration: Enqueue request in Priority Queue
    loop = asyncio.get_running_loop()
    future = loop.create_future()
    
    # Negative priority because PriorityQueue returns the lowest value first.
    # Higher 'priority' int means it gets processed sooner (Greedy Scheduler).
    req = PrioritizedRequest(priority=-priority, timestamp=time.time(), person=person, cloth=cloth, future=future)
    await gpu_queue.put(req)
    
    # Wait for the background GPU worker to process this specific request
    result_image = await future
    
    # Convert result image to bytes and return as PNG response
    img_byte_arr = io.BytesIO()
    result_image.save(img_byte_arr, format='PNG')
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")
