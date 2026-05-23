# Supabase Setup

This repo is React/Vite plus FastAPI, not Next.js. Do not add the Next.js `page.tsx` or middleware snippets from the Supabase quickstart.

## 1. Frontend Package Install

The frontend uses the browser-safe publishable key only:

```powershell
cd frontend
npm install @supabase/supabase-js @supabase/ssr
```

`@supabase/ssr` is installed for future auth/session work, but the current Vite app uses `@supabase/supabase-js` through `frontend/src/services/supabaseClient.ts`.

## 2. Environment Variables

Frontend `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_SITE_NAME=Ayaan's Room
VITE_ENABLE_AUDIO=true
VITE_SUPABASE_URL=https://kwcnenbmhykonjlggtow.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_upHuj_TL8YHKuX3z-AfgSQ_J4gEonOm
```

Backend `.env`:

```env
APP_ENV=local
API_HOST=127.0.0.1
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

SUPABASE_URL=https://kwcnenbmhykonjlggtow.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=

RESUME_FILE_URL=
CONTACT_EMAIL_TO=
```

Never put `SUPABASE_SERVICE_ROLE_KEY` in the frontend.

## 3. Create Database Tables

Open the Supabase dashboard for the project, go to **SQL Editor**, paste `docs/supabase_schema.sql`, and run it.

The schema creates:

- `analytics_events`
- `contact_submissions`

RLS is enabled and no anon policies are added. This is intentional: browser traffic goes to FastAPI, and FastAPI writes using the service-role key.

## 4. Verify Locally

Start the app:

```powershell
make dev
```

Check the backend:

```powershell
curl http://127.0.0.1:8000/api/health
```

Trigger a frontend interaction or submit the contact form, then confirm rows appear in the Supabase table editor.

## 5. Applying SQL From The CLI

To apply the schema from a terminal instead of the dashboard, set `DATABASE_URL` to the Supabase Postgres connection string and use `psql`:

```powershell
make db-setup
```

The service-role API key is not a Postgres password and cannot run this DDL by itself.

For this project, the transaction pooler URL should look like:

```text
postgresql://postgres.kwcnenbmhykonjlggtow:<database-password>@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres
```

The direct database URL usually looks like:

```text
postgresql://postgres:<database-password>@db.kwcnenbmhykonjlggtow.supabase.co:5432/postgres
```

If your password contains special characters such as `@`, `#`, `/`, `?`, or `:`, URL-encode them in `DATABASE_URL`.

After applying the schema, run:

```powershell
make backend-check
```

Expected healthy Supabase status:

```json
{
  "status": "ok",
  "supabase": {
    "configured": true,
    "analyticsTableAvailable": true,
    "contactTableAvailable": true
  }
}
```
