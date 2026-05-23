# Ayaan's Room Backend

FastAPI service for health checks, analytics, resume download redirects, and contact submissions.

Run locally:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Analytics and contact persistence are best-effort. Supabase failures are logged but do not break user-facing flows.
