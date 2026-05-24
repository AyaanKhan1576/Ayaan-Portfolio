# Ayaan's Room Architecture

The platform is split into a Vercel-hosted frontend and same-origin Vercel API routes.

Frontend modules are data-driven. Projects, room objects, simulations, media, and experience live in `frontend/src/data`. Phaser renders the playable room, and React renders RPG-style portfolio menus.

Vercel API routes handle server-only Supabase operations for analytics and resume tracking. API failures return best-effort responses so analytics never crashes the portfolio experience.
