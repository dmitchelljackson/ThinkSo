"""Postgres identity/session persistence."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from thinkso.features.identity.application import (
    ACCESS_LIFETIME,
    REFRESH_ABSOLUTE_LIFETIME,
    REFRESH_IDLE_LIFETIME,
)
from thinkso.features.identity.domain import (
    FirebaseIdentity,
    IdentityConflict,
    RetiredProfile,
    User,
)


class SqlIdentityRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

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
        async with self._session.begin():
            tombstone = await self._session.scalar(
                text(
                    "SELECT 1 FROM retired_identity_tombstones "
                    "WHERE (kind = 'firebase_uid' AND value = :uid) "
                    "OR (kind = 'firebase_email' AND value = :email) LIMIT 1"
                ),
                {"uid": identity.uid, "email": normalized_email},
            )
            if tombstone is not None:
                raise RetiredProfile

            row = (
                (
                    await self._session.execute(
                        text(
                            "SELECT id, firebase_uid, normalized_email, display_name, retired_at "
                            "FROM users WHERE firebase_uid = :uid FOR UPDATE"
                        ),
                        {"uid": identity.uid},
                    )
                )
                .mappings()
                .one_or_none()
            )
            if row is None:
                email_owner = await self._session.scalar(
                    text("SELECT id FROM users WHERE normalized_email = :email"),
                    {"email": normalized_email},
                )
                if email_owner is not None:
                    raise IdentityConflict
                user_id = uuid4()
                try:
                    await self._session.execute(
                        text(
                            "INSERT INTO users "
                            "(id, firebase_uid, normalized_email, display_name, "
                            "firebase_tokens_valid_after, firebase_revocation_checked_at, "
                            "retired_at, created_at, updated_at) VALUES "
                            "(:id, :uid, :email, NULL, :valid_after, :now, NULL, :now, :now)"
                        ),
                        {
                            "id": user_id,
                            "uid": identity.uid,
                            "email": normalized_email,
                            "valid_after": identity.tokens_valid_after,
                            "now": now,
                        },
                    )
                except IntegrityError as error:
                    raise IdentityConflict from error
                user = User(user_id, identity.uid, normalized_email, None, None)
            else:
                if row["retired_at"] is not None:
                    raise RetiredProfile
                update_values = {
                    "email": normalized_email,
                    "valid_after": identity.tokens_valid_after,
                    "now": now,
                    "id": row["id"],
                }
                if row["normalized_email"] != normalized_email:
                    existing = await self._session.scalar(
                        text("SELECT id FROM users WHERE normalized_email = :email"),
                        {"email": normalized_email},
                    )
                    if existing is not None:
                        raise IdentityConflict
                try:
                    await self._session.execute(
                        text(
                            "UPDATE users SET normalized_email = :email, "
                            "firebase_tokens_valid_after = :valid_after, "
                            "firebase_revocation_checked_at = :now, updated_at = :now "
                            "WHERE id = :id"
                        ),
                        update_values,
                    )
                except IntegrityError as error:
                    raise IdentityConflict from error
                user = User(
                    row["id"],
                    identity.uid,
                    normalized_email,
                    row["display_name"],
                    row["retired_at"],
                )

            try:
                await self._session.execute(
                    text(
                        "INSERT INTO user_sessions "
                        "(id, family_id, user_id, access_token_hash, refresh_token_hash, "
                        "firebase_auth_time, access_expires_at, idle_expires_at, "
                        "absolute_expires_at, "
                        "revoked_at, created_at, updated_at) VALUES "
                        "(:id, :family_id, :user_id, :access_hash, :refresh_hash, :auth_time, "
                        ":access_expires, :idle_expires, :absolute_expires, NULL, :now, :now)"
                    ),
                    {
                        "id": session_id,
                        "family_id": family_id,
                        "user_id": user.id,
                        "access_hash": access_token_hash,
                        "refresh_hash": refresh_token_hash,
                        "auth_time": identity.auth_time,
                        "access_expires": now + ACCESS_LIFETIME,
                        "idle_expires": now + REFRESH_IDLE_LIFETIME,
                        "absolute_expires": now + REFRESH_ABSOLUTE_LIFETIME,
                        "now": now,
                    },
                )
            except IntegrityError as error:
                raise IdentityConflict from error
            return user
