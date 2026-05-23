from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from app.services.resume_service import ResumeService, ResumeUnavailableError

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.get("/download")
def download_resume() -> RedirectResponse:
    try:
        return RedirectResponse(ResumeService().get_resume_url(), status_code=302)
    except ResumeUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
