<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="50" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/FastAPI.svg" width="50" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Python-Dark.svg" width="50" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="50" />
  <br/>
  <h1>✨ VTRO - Virtual Try-On System ✨</h1>
  <p><strong>Next-Gen E-Commerce Try-On powered by Generative AI & DAA Optimizations</strong></p>
</div>

<hr/>

## 🚀 Overview

**VTRO (Virtual Try-On)** is a cutting-edge web application designed to revolutionize the online fashion retail experience. By seamlessly overlaying clothing items onto user images using advanced Deep Learning models (`CatVTON`, `DensePose`, `Stable Diffusion`), it provides highly accurate and realistic virtual try-ons. 

Beyond AI, the VTRO backend is fortified with **Design and Analysis of Algorithms (DAA)** core components to ensure server efficiency, robust request queuing, and simulated delivery routing.

---

## 🌟 Key Features

- 👕 **Hyper-Realistic Try-On:** Automatically detects human poses and applies selected garments dynamically using Diffusion models.
- 📏 **AI Biometric Fit Analysis:** Recommends the perfect clothing size based on height, weight, and preferred style.
- ⚡ **Priority Request Scheduling (DAA):** Utilizes **0-1 Knapsack Dynamic Programming & Greedy Algorithms** via `asyncio.PriorityQueue` to protect GPUs from Out-Of-Memory (OOM) crashes by prioritizing and scheduling incoming traffic efficiently.
- 🗺️ **Logistics Route Optimization (DAA):** Implements **Dijkstra's Algorithm and BFS** for simulated optimal delivery routing.
- 🎨 **Modern Frontend (Afsana):** A sleek, cyber-aesthetic UI built with Vite, React, and Tailwind CSS.
- ☁️ **Cloudflare Tunnel Integration:** Seamlessly bridges the frontend to high-powered Google Colab/Cloud GPU endpoints.

---

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Backend** | FastAPI, Python, Uvicorn, asyncio |
| **AI / Machine Learning** | CatVTON, DensePose, HuggingFace Diffusers, Gemini 2.5 Flash |
| **Algorithms** | Dynamic Programming, Greedy, Dijkstra, BFS |

---

## 📂 Project Structure

```text
VTRO/
├── afsana/               # 🌐 Frontend web application (React/Vite)
├── api/                  # ⚙️ FastAPI backend & GPU Scheduler (api/main.py)
├── CatVTON/              # 🧠 Deep Learning models & Inference pipelines
├── daa_algorithms/       # 🧮 DAA algorithm implementations & simulations
│   ├── api_scheduling.py # DP & Greedy Resource Allocation
│   ├── route_optimization.py # Dijkstra & BFS Network Routing
│   └── main_daa.py       # Standalone DAA Simulator
├── notebooks/            # 📓 Jupyter Notebooks for AI baseline testing
├── DAA_Project_Proposal.md # 📄 Comprehensive DAA Course Proposal
└── README.md             # 📖 Project Documentation
```

---

## ⚙️ Getting Started

### 1. Start the FastAPI Backend
```bash
cd api
uvicorn main:app --host 127.0.0.1 --port 8000
```
*(Note: Requires a CUDA-enabled GPU and PyTorch installed. It will download the necessary CatVTON models on the first run).*

### 2. Start the Frontend (Afsana)
```bash
cd afsana
npm install
npm run dev
```
Open `http://localhost:3000` (or the port specified by Vite) in your browser.

### 3. Run DAA Algorithm Simulations (Optional)
To test the theoretical algorithms without starting the web server:
```bash
python daa_algorithms/main_daa.py
```

---

<div align="center">
  <p>Built with ❤️ for the future of fashion tech.</p>
</div>
