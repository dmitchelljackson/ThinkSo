"""Identity domain types and failures."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID


@dataclass(frozen=True)
class FirebaseIdentity:
    uid: str
    email: str
    auth_time: datetime
    tokens_valid_after: datetime


@dataclass(frozen=True)
class User:
    id: UUID
    firebase_uid: str
    normalized_email: str
    display_name: str | None
    retired_at: datetime | None


@dataclass(frozen=True)
class SessionCredentials:
    access_token: str
    refresh_token: str
    expires_in: int
    user: User


class InvalidFirebaseCredential(Exception):
    pass


class RetiredProfile(Exception):
    pass


class IdentityConflict(Exception):
    pass
