from fastapi import APIRouter
from app.services.system_service import SystemService

router = APIRouter(prefix="/api/health", tags=["health"])


@router.get("")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/ready")
def readiness_check() -> dict:
    return SystemService().readiness()
