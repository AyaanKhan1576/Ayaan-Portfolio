from fastapi import APIRouter
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/events", response_model=AnalyticsEventResponse)
def create_event(payload: AnalyticsEventCreate) -> AnalyticsEventResponse:
    persisted = AnalyticsService().track(payload.eventType, payload.metadata)
    return AnalyticsEventResponse(accepted=True, persisted=persisted)
