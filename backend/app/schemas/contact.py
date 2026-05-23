from pydantic import BaseModel, EmailStr, Field


class ContactSubmissionCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=160)
    message: str = Field(min_length=1, max_length=5000)


class ContactSubmissionResponse(BaseModel):
    accepted: bool
    persisted: bool
