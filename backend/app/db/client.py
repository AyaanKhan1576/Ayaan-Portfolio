import logging
from functools import lru_cache
from supabase import Client, create_client
from app.core.config import get_settings

logger = logging.getLogger(__name__)


@lru_cache
def get_supabase_client() -> Client | None:
    settings = get_settings()
    if not settings.supabase_configured:
        logger.info("Supabase is not configured; persistence disabled.")
        return None
    try:
        return create_client(settings.supabase_url, settings.supabase_service_role_key)
    except Exception:
        logger.exception("Failed to initialize Supabase client.")
        return None
