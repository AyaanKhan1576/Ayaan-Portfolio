from fastapi import APIRouter, Depends, Request
from app.core.security import rate_limiter, truncate_user_agent
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/events", response_model=AnalyticsEventResponse, dependencies=[Depends(rate_limiter("analytics", 40))])
def create_event(payload: AnalyticsEventCreate, request: Request) -> AnalyticsEventResponse:
    persisted = AnalyticsService().track(
        payload.eventType,
        payload.metadata,
        user_agent=truncate_user_agent(request.headers.get("user-agent")),
        ip_address=None,
    )
    return AnalyticsEventResponse(accepted=True, persisted=persisted)
