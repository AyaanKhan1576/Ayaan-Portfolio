from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import analytics, contact, health, resume
from app.core.config import get_settings
from app.core.logging_config import configure_logging
from app.core.security import security_headers


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()
    app = FastAPI(title="Ayaan's Room API", version="1.0.0")

    @app.middleware("http")
    async def harden_requests(request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and content_length.isdigit() and int(content_length) > 8192:
            return JSONResponse({"detail": "Request failed"}, status_code=413, headers=security_headers())
        response = await call_next(request)
        for key, value in security_headers().items():
            response.headers[key] = value
        return response

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

    app.include_router(health.router)
    app.include_router(analytics.router)
    app.include_router(resume.router)
    app.include_router(contact.router)
    return app


app = create_app()
