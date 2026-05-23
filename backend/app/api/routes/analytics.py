from fastapi import APIRouter, Request
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/events", response_model=AnalyticsEventResponse)
def create_event(payload: AnalyticsEventCreate, request: Request) -> AnalyticsEventResponse:
    persisted = AnalyticsService().track(
        payload.eventType,
        payload.metadata,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return AnalyticsEventResponse(accepted=True, persisted=persisted)
