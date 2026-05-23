from app.db.client import get_supabase_client
from app.db.repositories.analytics_repository import AnalyticsRepository
from app.db.repositories.contact_repository import ContactRepository


class ContactService:
    def __init__(
        self,
        contact_repository: ContactRepository | None = None,
        analytics_repository: AnalyticsRepository | None = None,
    ):
        client = get_supabase_client()
        self.contact_repository = contact_repository or ContactRepository(client)
        self.analytics_repository = analytics_repository or AnalyticsRepository(client)

    def submit(self, name: str, email: str, subject: str, message: str) -> bool:
        persisted = self.contact_repository.insert_submission(
            name=name,
            email=email,
            subject=subject,
            message=message,
        )
        self.analytics_repository.insert_event("contact_submit", {"subject": subject})
        return persisted
