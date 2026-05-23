import logging
from typing import Any
from supabase import Client

logger = logging.getLogger(__name__)


class AnalyticsRepository:
    def __init__(self, client: Client | None):
        self.client = client

    def insert_event(self, event_type: str, metadata: dict[str, Any] | None = None) -> bool:
        if self.client is None:
            return False
        try:
            self.client.table("analytics_events").insert(
                {"event_type": event_type, "metadata": metadata or {}}
            ).execute()
            return True
        except Exception:
            logger.exception("Failed to persist analytics event.")
            return False
