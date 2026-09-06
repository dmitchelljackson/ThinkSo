from datetime import UTC, datetime, timedelta
from uuid import UUID

import pytest

from thinkso.features.identity.application import (
    FIREBASE_REVOCATION_RECHECK_INTERVAL,
    IdentityService,
    firebase_revocation_check_is_stale,
    firebase_session_is_revoked,
    hash_token,
    normalize_email,
)
from thinkso.features.identity.domain import FirebaseIdentity, RetiredProfile, User


class FakeVerifier:
    async def verify(self, _token: str) -> FirebaseIdentity:
        instant = datetime(2026, 9, 5, tzinfo=UTC)
        return FirebaseIdentity("firebase-user", " User@Example.COM ", instant, instant)


class RecordingRepository:
    def __init__(self, retired: bool = False) -> None:
        self.retired = retired
        self.calls: list[dict[str, object]] = []

    async def login(
        self,
        identity: FirebaseIdentity,
        normalized_email: str,
        session_id: UUID,
        family_id: UUID,
        access_token_hash: str,
        refresh_token_hash: str,
        now: datetime,
    ) -> User:
        self.calls.append(
            {
                "identity": identity,
                "normalized_email": normalized_email,
                "session_id": session_id,
                "family_id": family_id,
                "access_token_hash": access_token_hash,
                "refresh_token_hash": refresh_token_hash,
                "now": now,
            }
        )
        if self.retired:
            raise RetiredProfile
        return User(
            UUID("00000000-0000-0000-0000-000000000001"),
            "firebase-user",
            "user@example.com",
            None,
            None,
        )


@pytest.mark.asyncio
async def test_login_normalizes_identity_and_issues_only_opaque_credentials() -> None:
    repository = RecordingRepository()
    now = datetime(2026, 9, 5, 12, tzinfo=UTC)
    result = await IdentityService(FakeVerifier(), repository, lambda: now).login("firebase-token")

    assert result.expires_in == 86400
    assert result.user.normalized_email == "user@example.com"
    assert result.access_token != "firebase-token"
    assert result.refresh_token != "firebase-token"
    call = repository.calls[0]
    assert call["normalized_email"] == "user@example.com"
    assert call["access_token_hash"] == hash_token(result.access_token)
    assert call["refresh_token_hash"] == hash_token(result.refresh_token)
    assert result.access_token not in str(call)
    assert result.refresh_token not in str(call)


@pytest.mark.asyncio
async def test_retired_identity_never_receives_credentials() -> None:
    with pytest.raises(RetiredProfile):
        await IdentityService(FakeVerifier(), RecordingRepository(retired=True)).login("token")


def test_email_normalization_is_stable() -> None:
    assert normalize_email(" Person@Example.COM ") == "person@example.com"


def test_firebase_revocation_policy_has_a_bounded_staleness_window() -> None:
    now = datetime(2026, 9, 5, 12, tzinfo=UTC)
    assert not firebase_revocation_check_is_stale(
        now - FIREBASE_REVOCATION_RECHECK_INTERVAL + timedelta(seconds=1), now
    )
    assert firebase_revocation_check_is_stale(now - FIREBASE_REVOCATION_RECHECK_INTERVAL, now)
    assert firebase_session_is_revoked(now, now + timedelta(seconds=1))
    assert not firebase_session_is_revoked(now, now)
