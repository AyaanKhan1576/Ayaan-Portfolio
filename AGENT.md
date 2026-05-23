# AGENT.md

## Engineering Standard

This repository is the source for Ayaan's Room, a production-oriented playable 2D RPG portfolio.

Follow these standards:

- Keep frontend and backend concerns separate.
- Prefer typed, reusable modules over monolithic files.
- Keep portfolio content data-driven.
- Never hardcode credentials, private URLs, or deployment-only settings.
- Analytics, audio, media, iframe, and backend failures must degrade gracefully.
- Use clear environment variable names and document them.
- Keep UI immersive, recruiter-friendly, readable, responsive, and playable.
- Avoid conventional landing-page structure; the frontend should feel like a small RPG room.
- Add tests for core service behavior and frontend logic where practical.
- Keep dependencies minimal and common.

## Commands

Frontend:

```powershell
cd frontend
npm install
npm run dev
npm run build
npm run test
```

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest
uvicorn app.main:app --reload
```

## Deployment Targets

- Frontend: Vercel from `frontend/`
- Backend: Render from `backend/`
- Database: Supabase Postgres
