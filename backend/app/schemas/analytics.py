from typing import Any, Literal
from pydantic import BaseModel


AnalyticsEventType = Literal[
    "visit",
    "object_interaction",
    "project_view",
    "resume_download",
    "simulation_launch",
    "contact_submit",
]


class AnalyticsEventCreate(BaseModel):
    eventType: AnalyticsEventType
    metadata: dict[str, Any] | None = None


class AnalyticsEventResponse(BaseModel):
    accepted: bool
    persisted: bool
