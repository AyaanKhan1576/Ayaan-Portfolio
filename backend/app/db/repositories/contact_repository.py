import logging
from supabase import Client

logger = logging.getLogger(__name__)


class ContactRepository:
    def __init__(self, client: Client | None):
        self.client = client

    def insert_submission(self, name: str, email: str, subject: str, message: str) -> bool:
        if self.client is None:
            return False
        try:
            self.client.table("contact_submissions").insert(
                {
                    "name": name[:120],
                    "email": email[:254],
                    "subject": subject[:160],
                    "message": message[:2000],
                }
            ).execute()
            return True
        except Exception:
            logger.warning("Failed to persist contact submission.")
            return False

    def table_available(self) -> bool:
        if self.client is None:
            return False
        try:
            self.client.table("contact_submissions").select("id").limit(1).execute()
            return True
        except Exception:
            logger.warning("Contact submissions table is not reachable.")
            return False
