from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ContactSubmissionCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=160)
    message: str = Field(min_length=1, max_length=2000)

    @field_validator("name", "subject", "message", mode="before")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        return value.strip() if isinstance(value, str) else value


class ContactSubmissionResponse(BaseModel):
    accepted: bool
    persisted: bool
