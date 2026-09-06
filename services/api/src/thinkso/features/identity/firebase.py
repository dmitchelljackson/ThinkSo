"""Firebase Admin credential verification adapter."""

import asyncio
from datetime import UTC, datetime
from typing import Protocol, cast

import firebase_admin  # type: ignore[import-untyped]
from firebase_admin import auth

from thinkso.config import Settings
from thinkso.features.identity.domain import FirebaseIdentity, InvalidFirebaseCredential


class FirebaseIdentityVerifier(Protocol):
    async def verify(self, id_token: str) -> FirebaseIdentity: ...


class AdminFirebaseIdentityVerifier:
    def __init__(self, settings: Settings) -> None:
        self._project_id = settings.firebase_project_id
        self._app = firebase_admin.initialize_app(
            options={"projectId": settings.firebase_project_id},
            name=f"thinkso-{id(self)}",
        )

    async def verify(self, id_token: str) -> FirebaseIdentity:
        try:
            decoded = await asyncio.to_thread(auth.verify_id_token, id_token, self._app, True)
            uid = decoded.get("uid") or decoded.get("sub")
            email = decoded.get("email")
            auth_time = decoded.get("auth_time")
            expires_at = decoded.get("exp")
            issued_at = decoded.get("iat")
            expected_issuer = f"https://securetoken.google.com/{self._project_id}"
            if (
                not isinstance(uid, str)
                or not isinstance(email, str)
                or not isinstance(auth_time, int)
                or not isinstance(expires_at, int)
                or not isinstance(issued_at, int)
                or decoded.get("aud") != self._project_id
                or decoded.get("iss") != expected_issuer
                or expires_at <= int(datetime.now(UTC).timestamp())
            ):
                raise InvalidFirebaseCredential
            record = await asyncio.to_thread(auth.get_user, uid, self._app)
            valid_after_ms = cast(int, record.tokens_valid_after_timestamp)
            return FirebaseIdentity(
                uid=uid,
                email=email,
                auth_time=datetime.fromtimestamp(auth_time, UTC),
                tokens_valid_after=datetime.fromtimestamp(valid_after_ms / 1000, UTC),
            )
        except InvalidFirebaseCredential:
            raise
        except Exception as error:
            raise InvalidFirebaseCredential from error

    def close(self) -> None:
        firebase_admin.delete_app(self._app)
