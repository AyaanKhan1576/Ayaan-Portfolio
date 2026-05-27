import logging
from typing import Any
from supabase import Client

logger = logging.getLogger(__name__)


class AnalyticsRepository:
    def __init__(self, client: Client | None):
        self.client = client

    def insert_event(
        self,
        event_type: str,
        metadata: dict[str, Any] | None = None,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> bool:
        if self.client is None:
            return False
        try:
            payload: dict[str, Any] = {
                "event_type": event_type[:64],
                "metadata": metadata or {},
            }
            if user_agent:
                payload["user_agent"] = user_agent[:180]
            if ip_address:
                payload["ip_address"] = ip_address
            self.client.table("analytics_events").insert(
                payload
            ).execute()
            return True
        except Exception:
            logger.warning("Failed to persist analytics event.")
            return False

    def table_available(self) -> bool:
        if self.client is None:
            return False
        try:
            self.client.table("analytics_events").select("id").limit(1).execute()
            return True
        except Exception:
            logger.warning("Analytics table is not reachable.")
            return False
