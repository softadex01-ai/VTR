# Semester Project Proposal

## Title Block
- **Project Title:** VTRO - Virtual Try-On System
- **Domain/Application Area:** E-Commerce / Fashion Tech (Virtual Try-On)
- **Group Members & Roll Numbers:** [Placeholder for Group Members & Roll Numbers]
- **Course Name/Code/Submission Date:** [Placeholder for Course Name/Code/Submission Date]

## Central Question of the Project
How can we automate the process of visually fitting a garment onto a person's image using deep learning and computer vision to enhance the online shopping experience?

## 1. Problem Statement
The current online shopping system lacks the ability to let customers see how a garment would look on them before purchasing, leading to high return rates and poor user satisfaction. The proposed system aims to provide a working application (headless API and a frontend) that accepts a person's image and a garment image, processes them under memory and processing constraints (e.g., using half precision for T4 GPU compatibility), and outputs a composite image of the person wearing the garment. A working application is required.

## 2. Scenario Description
The system models customers (person images) and products (garment images). The primary constraint is executing complex image processing pipelines (masking, diffusion models) within realistic time limits and GPU memory constraints.

## 3. Main Objective
To seamlessly apply a source garment onto a target person's image, handling pose estimation, semantic segmentation (masking), and conditional image generation (inpainting).

## 4. Required Problem Components

### Component 1: API Request Scheduling (Resource Assignment)
- **Entity Attributes:** API Requests (`id`, `processing_time`, `priority`)
- **Sample Data:** `[Req_1: 120ms (P:10), Req_2: 80ms (P:8), Req_3: 150ms (P:15)]`
- **Objective:** To maximize the priority of requests processed within a fixed GPU time window.
- **Algorithm:** Dynamic Programming (0-1 Knapsack) vs. Greedy Approach.

### Component 2: Delivery Route Optimization (Network Route Optimization)
- **Entity Attributes:** Nodes (Warehouse, Customers), Edges (Distance/Weight)
- **Sample Data:** `Warehouse -> B (2), B -> C (1), C -> Customer_1 (3)`
- **Objective:** Find the shortest path for physical delivery of ordered try-on garments to customers.
- **Algorithm:** Dijkstra's Algorithm vs. Breadth-First Search (BFS).

### Component 3: Semantic Masking (AutoMasker)
- **Entity Attributes:** Person Image, Garment Image
- **Objective:** To detect and generate a binary mask of the upper body for garment replacement.
- **Algorithm:** SCHP (Self-Correction Human Parsing) / DensePose deep learning inference.

### Component 4: Conditional Image Generation
- **Entity Attributes:** Conditioned Garment Image, Masked Person Image
- **Objective:** To synthesize a realistic image of the person wearing the garment.
- **Algorithm:** Latent Diffusion (CatVTONPipeline via Stable Diffusion inpainting).

## 5. Algorithm Comparison — Core Requirement

| Component | Approach 1 | Approach 2 |
| :--- | :--- | :--- |
| API Request Scheduling | Dynamic Programming (Optimal) | Greedy Approach (Sub-optimal, Faster) |
| Delivery Route Optimization | Dijkstra's Algorithm (Shortest Path) | Breadth-First Search (Fewest Hops) |
| Semantic Masking | AutoMasker (Deep Learning) | *N/A* |
| Image Synthesis | CatVTONPipeline | *N/A* |

## 6. Input Size Experimentation

| Dataset Size | Image Resolution / Nodes | Metrics Measured |
| :--- | :--- | :--- |
| Small | 8 requests / 5 nodes | Execution time (ms), Path Distance, Max Priority |
| Medium | 50 requests / 50 nodes | Execution time (ms), Path Distance, Max Priority |
| Large | 500 requests / 200 nodes | Execution time (ms), Path Distance, Max Priority |
| Very Large | 1000+ requests / 1000+ nodes | Execution time (ms), Path Distance, Max Priority |

## 7. Theoretical Complexity Analysis

- **API Request Scheduling**
  - **Dynamic Programming:** Time Complexity `O(N * W)`, Space Complexity `O(N * W)` where N is number of requests and W is the max time window.
  - **Greedy Approach:** Time Complexity `O(N log N)` for sorting, Space Complexity `O(N)`.
- **Delivery Route Optimization**
  - **Dijkstra's Algorithm:** Time Complexity `O(V + E log V)`, Space Complexity `O(V)` where V is vertices and E is edges.
  - **Breadth-First Search:** Time Complexity `O(V + E)`, Space Complexity `O(V)`.
- **Deep Learning Components (Masking & Diffusion)**
  - **Time Complexity:** O(P) per forward pass where P is the number of pixels.
  - **Space Complexity:** O(W) where W represents the model weights loaded into GPU VRAM.

## 8. Application Requirement
The application integrates a FastAPI headless backend (`api/main.py`) that loads the deep learning models on startup. It exposes a `POST /try-on` endpoint where users can upload a person image and a garment image. The application resizes these images, computes the mask, runs the diffusion inference, and returns a PNG. A frontend UI is also present in the `afsana` directory (Node.js based) which presumably allows users to trigger this component visually.

## 9. Minimum Requirements Checklist

- ✅ **Clear Problem Statement:** Problem is well-defined, bridging Deep Learning and DAA optimization.
- ✅ **Scenario Description:** Exists, now including logistics and task scheduling.
- ✅ **Main Objective:** Clear objective (virtual try-on and optimized system scheduling).
- ✅ **Required Problem Components (Min 4):** 4 components covered (Scheduling, Routing, Masking, Synthesis).
- ✅ **DAA Core Techniques Used:** DP, Greedy, BFS, Dijkstra implemented.
- ✅ **Algorithm Comparison:** DP vs Greedy (Scheduling) and BFS vs Dijkstra (Routing).
- ⚠️ **Test Datasets:** Scripts added for simulation with generated data, though full external datasets are missing.
- ✅ **Input Size Experimentation Plan:** Included.
- ✅ **Theoretical Complexity Analysis:** Provided for all components.
- ✅ **Application Requirement:** FastAPI backend (`api/main.py`) and a frontend exist.
- ✅ **Code Matches Proposal:** `daa_algorithms` folder created with the matching implementations.
