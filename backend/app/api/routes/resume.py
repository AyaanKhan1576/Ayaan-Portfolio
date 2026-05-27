from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from app.core.security import rate_limiter
from app.services.resume_service import ResumeService, ResumeUnavailableError

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.get("/download", dependencies=[Depends(rate_limiter("resume", 10))])
def download_resume() -> RedirectResponse:
    try:
        return RedirectResponse(ResumeService().get_resume_url(), status_code=302)
    except ResumeUnavailableError as exc:
        raise HTTPException(status_code=503, detail="Request failed") from exc
