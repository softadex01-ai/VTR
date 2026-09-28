
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { virtualTryOn } from '../services/geminiService';
import { FitCalibrator } from './FitCalibrator';

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ product, onClose }) => {
  const [step, setStep] = useState<'mode' | 'camera' | 'upload' | 'processing' | 'result' | 'error'>('mode');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [tryOnSize, setTryOnSize] = useState<string>(product.sizes[0] || 'M');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Initializing Neural Link...');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle Camera Stream
  useEffect(() => {
    if (step === 'camera') {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1440 } } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera Access Failed:", err);
          try {
            alert("Could not access camera. Switching to upload mode.");
          } catch (e) {
            console.warn("Could not access camera. Switching to upload mode.");
          }
          setStep('upload');
        }
      };
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [step]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setUserImage(dataUrl);
        setStep('upload');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setStep('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const startSynthesis = async () => {
    if (!userImage) return;
    setStep('processing');
    setStatusMessage('Analyzing Physique Geometry...');
    
    try {
      setStatusMessage('Optimizing Selected Variant...');
      const result = await virtualTryOn(userImage, product.images[selectedVariantIndex], product.title, tryOnSize);
      setResultImage(result);
      setStep('result');
    } catch (err: any) {
      console.error(err);
      setStatusMessage(err.message || "Synthesis Protocol Failed. Please check the API connection or try again.");
      setStep('error');
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white/90 dark:bg-black/95 backdrop-blur-2xl p-4 sm:p-6 transition-colors duration-500">
      <div className="glass w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col rounded-2xl border-rose-500/30 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5 backdrop-blur-md">
          <div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-950 dark:text-white">Virtual Try-On Protocol</h3>
            <p className="text-[10px] text-rose-500 font-bold tracking-[0.3em] uppercase">Gemini 2.5 Flash Synthesis</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-slate-950 dark:hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 text-slate-900 dark:text-white">
          {step === 'mode' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-8">
              <div className="text-center max-w-lg mb-8">
                <h4 className="text-3xl font-black italic uppercase mb-4 text-slate-950 dark:text-white">Select Input Method</h4>
                <p className="text-slate-500 dark:text-slate-400 font-light">Choose how you want to provide your silhouette for the neural synthesis.</p>
              </div>
              <div className="flex justify-center w-full max-w-md">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full glass group p-8 flex flex-col items-center justify-center gap-6 hover:bg-rose-600 transition-all border-slate-200 dark:border-white/10"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-rose-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-white transition-colors">Upload Asset</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </button>
              </div>
            </div>
          )}

          {step === 'camera' && (
            <div className="flex flex-col items-center gap-8 h-full">
              <div className="relative w-full max-w-md aspect-3/4 glass rounded-2xl overflow-hidden bg-slate-200 dark:bg-black shadow-2xl border-rose-500/20">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-110" />
                <div className="absolute inset-0 pointer-events-none border-20 border-black/10 dark:border-black/20"></div>
                {/* HUD */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest drop-shadow-md">Live Feed // Silhouette Lock</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('mode')} className="px-8 py-4 glass border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all">Cancel</button>
                <button onClick={capturePhoto} className="px-12 py-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/30 hover:scale-105 transition-all">Capture Silhouette</button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h4 className="text-3xl font-black italic uppercase mb-4 text-slate-950 dark:text-white leading-none">Confirm Protocol</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-6">
                    Ready to map the asset to your physique. Select the preferred garment angle below for the best result.
                  </p>
                  
                  {/* Variant Selector */}
                  <div className="space-y-3 mb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Angle Option</span>
                    <div className="grid grid-cols-4 gap-2.5">
                      {product.images.map((img, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setSelectedVariantIndex(idx)}
                          className={`aspect-3/4 glass p-0.5 rounded-sm overflow-hidden transition-all ${selectedVariantIndex === idx ? 'ring-2 ring-rose-500 scale-105 border-transparent' : 'opacity-40 hover:opacity-100 grayscale'}`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt={`Variant ${idx}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Try-On size selection */}
                  <div className="space-y-3 mb-5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">TRY-ON SIZE</span>
                    <div className="flex gap-2.5">
                      {product.sizes.map((size) => (
                        <button 
                          key={size} 
                          onClick={() => setTryOnSize(size)}
                          className={`flex-1 py-2 text-xs font-black border transition-all rounded-sm ${tryOnSize === size ? 'bg-slate-950 dark:bg-white text-white dark:text-black border-transparent font-black ring-1 ring-offset-1 ring-rose-500' : 'text-slate-400 hover:text-slate-950 dark:hover:text-white border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/5'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Low profile sizing calibrator */}
                  <div className="mb-6">
                    <FitCalibrator 
                      product={product} 
                      selectedSize={tryOnSize} 
                      onSizeSelect={setTryOnSize} 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={startSynthesis}
                    className="w-full py-5 bg-rose-600 text-white font-black uppercase tracking-widest text-xs hover:bg-rose-700 transition-all transform active:scale-95 shadow-xl shadow-rose-600/10 rounded-sm"
                  >
                    Initiate Sized Virtual Try-On
                  </button>
                  <button 
                    onClick={() => setStep('mode')}
                    className="w-full py-3.5 glass border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-950 dark:hover:text-white transition-all rounded-sm"
                  >
                    Change My Silhouette
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-3/4 glass bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl border-slate-200 dark:border-white/5">
                  <img src={userImage!} className="w-full h-full object-cover" alt="User Preview" />
                  <div className="absolute top-4 left-4 glass px-2 py-1 text-[7px] font-black uppercase tracking-widest text-slate-900 dark:text-white bg-white/40 dark:bg-black/40">You</div>
                </div>
                <div className="aspect-3/4 glass bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl border-rose-500/20">
                  <img src={product.images[selectedVariantIndex]} className="w-full h-full object-cover" alt="Garment Preview" />
                  <div className="absolute top-4 left-4 glass px-2 py-1 text-[7px] font-black uppercase tracking-widest text-slate-900 dark:text-white bg-white/40 dark:bg-black/40">Target</div>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="relative w-72 h-96 mb-12 glass p-2 rounded-2xl overflow-hidden">
                <img src={userImage!} className="w-full h-full object-cover grayscale opacity-40 blur-[2px]" alt="" />
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-full h-[3px] bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-rose-500/30 rounded-full animate-ping"></div>
                </div>
              </div>
              <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-slate-950 dark:text-white animate-pulse">{statusMessage}</h4>
              <p className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.4em]">Processing multi-modal vectors...</p>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-24 h-24 rounded-full bg-rose-500/20 flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-rose-500">Protocol Failed</h4>
              <p className="text-slate-500 dark:text-slate-400 font-light mb-8 max-w-md">{statusMessage}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep('upload')}
                  className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 hover:text-white transition-all rounded-sm"
                >
                  Retry Synthesis
                </button>
                <button 
                  onClick={onClose}
                  className="px-8 py-4 glass border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-950 dark:hover:text-white transition-all rounded-sm"
                >
                  Abort
                </button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <span className="bg-rose-600 text-white px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm mb-6 inline-block">Synthesis Complete</span>
                  <h4 className="text-4xl font-black italic uppercase mb-4 text-slate-950 dark:text-white leading-none">Digital Prototype</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    The asset has been successfully mapped. This high-fidelity rendering simulates the physical drape and texture of the <span className="text-slate-950 dark:text-white font-bold">{product.title}</span> on your unique silhouette.
                  </p>
                </div>
                <div className="flex gap-4">
                  <a 
                    href={resultImage!} 
                    download={`AFSANA-TRYON-${product.id}.jpg`}
                    className="flex-1 py-6 bg-slate-950 dark:bg-white text-white dark:text-black text-center font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                  >
                    Export Asset
                  </a>
                  <button 
                    onClick={() => { setStep('upload'); setResultImage(null); }}
                    className="flex-1 py-6 glass border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-950 dark:hover:text-white transition-all"
                  >
                    New Angle
                  </button>
                </div>
              </div>
              <div className="aspect-3/4 glass p-2 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative shadow-[0_50px_100px_-20px_rgba(244,63,94,0.3)]">
                <img src={resultImage!} className="w-full h-full object-cover animate-[reveal_1.5s_cubic-bezier(0.23,1,0.32,1)]" alt="Virtual Result" />
                <div className="absolute top-6 left-6 glass px-4 py-2 text-[10px] font-black italic tracking-widest uppercase border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-md text-slate-950 dark:text-white">Render 01 // Master</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(384px); }
        }
        @keyframes reveal {
          from { opacity: 0; filter: blur(40px); transform: scale(1.1); }
          to { opacity: 1; filter: blur(0); transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
