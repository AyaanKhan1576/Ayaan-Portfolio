from typing import Any
from app.db.client import get_supabase_client
from app.db.repositories.analytics_repository import AnalyticsRepository


class AnalyticsService:
    def __init__(self, repository: AnalyticsRepository | None = None):
        self.repository = repository or AnalyticsRepository(get_supabase_client())

    def track(
        self,
        event_type: str,
        metadata: dict[str, Any] | None = None,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> bool:
        return self.repository.insert_event(event_type, metadata, user_agent, ip_address)
