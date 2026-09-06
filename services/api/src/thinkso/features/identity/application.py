"""Authenticate Firebase identities and issue opaque ThinkSo sessions."""

import hashlib
import secrets
from collections.abc import Callable
from datetime import UTC, datetime, timedelta
from typing import Protocol
from uuid import UUID, uuid4

from thinkso.features.identity.domain import (
    FirebaseIdentity,
    IdentityConflict,
    RetiredProfile,
    SessionCredentials,
    User,
)
from thinkso.features.identity.firebase import FirebaseIdentityVerifier

ACCESS_LIFETIME = timedelta(hours=24)
REFRESH_IDLE_LIFETIME = timedelta(days=30)
REFRESH_ABSOLUTE_LIFETIME = timedelta(days=180)
FIREBASE_REVOCATION_RECHECK_INTERVAL = timedelta(minutes=5)


class IdentityRepository(Protocol):
    async def login(
        self,
        identity: FirebaseIdentity,
        normalized_email: str,
        session_id: UUID,
        family_id: UUID,
        access_token_hash: str,
        refresh_token_hash: str,
        now: datetime,
    ) -> User: ...


class IdentityService:
    def __init__(
        self,
        verifier: FirebaseIdentityVerifier,
        repository: IdentityRepository,
        clock: Callable[[], datetime] = lambda: datetime.now(UTC),
    ) -> None:
        self._verifier = verifier
        self._repository = repository
        self._clock = clock

    async def login(self, firebase_id_token: str) -> SessionCredentials:
        identity = await self._verifier.verify(firebase_id_token)
        normalized_email = normalize_email(identity.email)
        now = self._clock()
        access_token = secrets.token_urlsafe(32)
        refresh_token = secrets.token_urlsafe(48)
        user = await self._repository.login(
            identity=identity,
            normalized_email=normalized_email,
            session_id=uuid4(),
            family_id=uuid4(),
            access_token_hash=hash_token(access_token),
            refresh_token_hash=hash_token(refresh_token),
            now=now,
        )
        return SessionCredentials(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=int(ACCESS_LIFETIME.total_seconds()),
            user=user,
        )


def normalize_email(email: str) -> str:
    normalized = email.strip().casefold()
    if not normalized or "@" not in normalized:
        from thinkso.features.identity.domain import InvalidFirebaseCredential

        raise InvalidFirebaseCredential
    return normalized


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def firebase_session_is_revoked(auth_time: datetime, tokens_valid_after: datetime) -> bool:
    """Match Firebase's revocation rule for a previously issued ThinkSo session."""
    return auth_time < tokens_valid_after


def firebase_revocation_check_is_stale(last_checked_at: datetime, now: datetime) -> bool:
    return now - last_checked_at >= FIREBASE_REVOCATION_RECHECK_INTERVAL


__all__ = [
    "ACCESS_LIFETIME",
    "FIREBASE_REVOCATION_RECHECK_INTERVAL",
    "REFRESH_ABSOLUTE_LIFETIME",
    "REFRESH_IDLE_LIFETIME",
    "IdentityConflict",
    "IdentityRepository",
    "IdentityService",
    "RetiredProfile",
    "hash_token",
    "firebase_revocation_check_is_stale",
    "firebase_session_is_revoked",
    "normalize_email",
]
