"""Public Firebase-token exchange endpoint."""

from typing import Annotated, Literal
from uuid import UUID

from dishka.integrations.fastapi import FromDishka, inject
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

from thinkso.features.identity.application import IdentityService
from thinkso.features.identity.domain import (
    IdentityConflict,
    InvalidFirebaseCredential,
    RetiredProfile,
)


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    firebase_id_token: Annotated[str, Field(min_length=1, max_length=8192)]


class SocialIdentityResponse(BaseModel):
    provider: Literal["threads"]
    username: str
    profile_url: str


class UserResponse(BaseModel):
    id: UUID
    display_name: str | None
    is_retired: bool
    social_identity: SocialIdentityResponse | None


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    user: UserResponse
    onboarding_complete: bool


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: dict[str, object]


class ErrorResponse(BaseModel):
    error: ErrorDetail


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
    },
    summary="Exchange a Firebase identity token",
)
@inject
async def login(
    request: LoginRequest,
    service: FromDishka[IdentityService],
) -> LoginResponse | JSONResponse:
    try:
        session = await service.login(request.firebase_id_token)
    except InvalidFirebaseCredential:
        return problem(401, "invalid_firebase_credential", "Authentication could not be verified.")
    except RetiredProfile:
        return problem(403, "profile_retired", "This profile was permanently retired.")
    except IdentityConflict:
        return problem(409, "identity_conflict", "This identity cannot be linked automatically.")
    return LoginResponse(
        access_token=session.access_token,
        refresh_token=session.refresh_token,
        expires_in=session.expires_in,
        user=UserResponse(
            id=session.user.id,
            display_name=session.user.display_name,
            is_retired=False,
            social_identity=None,
        ),
        onboarding_complete=False,
    )


def problem(status: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status,
        content={"error": {"code": code, "message": message, "details": {}}},
    )
