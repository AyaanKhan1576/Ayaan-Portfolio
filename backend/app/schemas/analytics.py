from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator


AnalyticsEventType = Literal[
    "site_visit",
    "visit",
    "object_interaction",
    "section_open",
    "project_view",
    "resume_download",
    "simulation_launch",
    "contact_submit",
]

ALLOWED_METADATA_KEYS = {"section", "projectId", "objectId", "displayName", "route", "mode"}


class AnalyticsEventCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    eventType: AnalyticsEventType
    metadata: dict[str, Any] | None = Field(default=None)

    @field_validator("metadata")
    @classmethod
    def sanitize_metadata(cls, value: dict[str, Any] | None) -> dict[str, Any]:
        if not value or not isinstance(value, dict):
            return {}
        sanitized: dict[str, Any] = {}
        for key, raw in value.items():
            if key not in ALLOWED_METADATA_KEYS:
                continue
            if isinstance(raw, str):
                sanitized[key] = raw[:160]
            elif isinstance(raw, (bool, int, float)):
                sanitized[key] = raw
        return sanitized


class AnalyticsEventResponse(BaseModel):
    accepted: bool
    persisted: bool
