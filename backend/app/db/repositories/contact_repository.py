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
                {"name": name, "email": email, "subject": subject, "message": message}
            ).execute()
            return True
        except Exception:
            logger.exception("Failed to persist contact submission.")
            return False
