# Uganda Laws Assistant 🇺🇬⚖️

An AI-powered legal assistant designed to provide instant answers regarding Uganda's business laws, tax regulations, and NSSF compliance.

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_FastAPI_|_MUI-purple)

## 🚀 Features

- **🤖 AI Chat Interface**: Interactive chat capable of answering legal queries with citations (currently using a simulated RAG engine).
- **📂 Admin Dashboard**: A dedicated portal for managing the knowledge base.
- **📄 Document Ingestion**: Drag-and-drop upload for PDF and Text documents with auto-titling and deduplication.
- **✨ Modern UI**: Built with **Material UI** and **Framer Motion** for a premium, animated user experience.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Material UI, Framer Motion.
- **Backend**: Python FastAPI, SQLite (Metadata), Mock RAG Engine (Simulated Embeddings/Retrieval).

## 📦 Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
