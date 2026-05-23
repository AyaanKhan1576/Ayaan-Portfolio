from app.core.config import get_settings
from app.db.client import get_supabase_client
from app.db.repositories.analytics_repository import AnalyticsRepository


class ResumeUnavailableError(RuntimeError):
    pass


class ResumeService:
    def __init__(self, analytics_repository: AnalyticsRepository | None = None):
        self.settings = get_settings()
        self.analytics_repository = analytics_repository or AnalyticsRepository(get_supabase_client())

    def get_resume_url(self) -> str:
        self.analytics_repository.insert_event("resume_download", {})
        if not self.settings.resume_file_url:
            raise ResumeUnavailableError("Resume URL is not configured.")
        return str(self.settings.resume_file_url)
