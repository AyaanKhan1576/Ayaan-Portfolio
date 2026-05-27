from fastapi import APIRouter, Depends
from app.core.security import rate_limiter
from app.schemas.contact import ContactSubmissionCreate, ContactSubmissionResponse
from app.services.contact_service import ContactService

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactSubmissionResponse, dependencies=[Depends(rate_limiter("contact", 5))])
def submit_contact(payload: ContactSubmissionCreate) -> ContactSubmissionResponse:
    persisted = ContactService().submit(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    return ContactSubmissionResponse(accepted=True, persisted=persisted)
