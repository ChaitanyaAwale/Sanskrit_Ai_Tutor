# SanskritAI - Modern Architecture

Intelligent Sanskrit Language Revival Through Adaptive Learning.
Migrated from Streamlit to a full-stack Next.js + FastAPI architecture.

## Folder Structure

- `/frontend`: Next.js app with TypeScript and React.
- `/backend`: FastAPI Python server with core logic modules.

## Getting Started

### Backend
The grammar checker uses the Paninian `prakriya` analyzer. Set it up in its isolated Python 3.11 environment (the optional analyzer is GPL-3.0):

```powershell
cd backend
& "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe" -m venv .venv-paninian
.\.venv-paninian\Scripts\python.exe -m pip install -r requirements.txt -r requirements-grammar.txt
.\.venv-paninian\Scripts\python.exe main.py
```

On first startup, Prakriya downloads its grammar data into `backend/data/paninian-appdata`.

The NLLB translation base model is cached locally in `backend/data/huggingface-cache` when a translation first needs it. Subsequent translations and backend restarts reuse the cached files.

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Navigate to `http://localhost:3000` to use the application.
Backend API documentation is available at `http://localhost:8000/docs`.
