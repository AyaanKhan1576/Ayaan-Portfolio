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

Useful checks:

```powershell
curl http://127.0.0.1:8000/api/health
curl http://127.0.0.1:8000/api/health/ready
```

You can run the same readiness check without starting Uvicorn:

```powershell
make backend-check
```

`/api/health/ready` reports whether Supabase is configured and whether the required analytics/contact tables are reachable. It does not expose credentials.
