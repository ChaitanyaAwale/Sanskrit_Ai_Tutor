# SanskritAI Backend

FastAPI backend for Sanskrit language learning.

## Setup

1. Create the isolated Python 3.11 environment used by the Paninian analyzer:
   ```bash
   python3.11 -m venv .venv-paninian
   .venv-paninian/Scripts/python.exe -m pip install -r requirements.txt -r requirements-grammar.txt
   ```

2. Run the server:
   ```bash
   .venv-paninian/Scripts/python.exe main.py
   ```
   Or using uvicorn:
   ```bash
   .venv-paninian/Scripts/python.exe -m uvicorn main:app --reload
   ```

   The optional `prakriya` analyzer is GPL-3.0 licensed. Its grammar data is downloaded on first startup to `data/paninian-appdata`.

   The shared NLLB translation base model is cached at `data/huggingface-cache` on first translation. Later requests and backend restarts reuse that cache; the cache is local and ignored by Git.

## API Documentation

Once the server is running, visit:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- Redoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
