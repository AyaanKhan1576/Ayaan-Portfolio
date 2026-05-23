from typing import Any

from app.core.config import get_settings
from app.db.client import get_supabase_client
from app.db.repositories.analytics_repository import AnalyticsRepository
from app.db.repositories.contact_repository import ContactRepository


class SystemService:
    def readiness(self) -> dict[str, Any]:
        settings = get_settings()
        client = get_supabase_client()
        analytics_available = AnalyticsRepository(client).table_available()
        contact_available = ContactRepository(client).table_available()

        return {
            "status": "ok" if analytics_available and contact_available else "degraded",
            "environment": settings.app_env,
            "supabase": {
                "configured": settings.supabase_configured,
                "analyticsTableAvailable": analytics_available,
                "contactTableAvailable": contact_available,
            },
            "resume": {
                "configured": bool(settings.resume_file_url),
            },
            "contact": {
                "emailConfigured": bool(settings.contact_email_to),
            },
        }
