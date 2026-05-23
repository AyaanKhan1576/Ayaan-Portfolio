# Ayaan's Room Architecture

The platform is split into a Vercel-hosted frontend and a Render-hosted FastAPI backend.

Frontend modules are data-driven. Projects, room objects, simulations, media, and experience live in `frontend/src/data`. Phaser renders the playable room, and React renders RPG-style portfolio menus.

Backend routes delegate to services, and services delegate persistence to repositories. Repository failures return best-effort results and log exceptions so analytics/contact subsystems do not crash the product experience.
