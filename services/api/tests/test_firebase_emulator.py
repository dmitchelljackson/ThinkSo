import os
import uuid
from datetime import UTC, datetime, timedelta

import httpx
import jwt
import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from thinkso.app import create_app
from thinkso.config import Settings
from thinkso.features.identity.domain import InvalidFirebaseCredential
from thinkso.features.identity.firebase import AdminFirebaseIdentityVerifier

pytestmark = pytest.mark.skipif(
    not os.environ.get("FIREBASE_AUTH_EMULATOR_HOST"),
    reason="Firebase Auth Emulator is not running",
)


@pytest.mark.asyncio
async def test_admin_verifies_emulator_token_and_rejects_garbage() -> None:
    email = f"agent-{uuid.uuid4()}@example.test"
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp",
            params={"key": "demo-key"},
            json={"email": email, "password": "test-password", "returnSecureToken": True},
        )
    response.raise_for_status()
    token = response.json()["idToken"]
    claims = jwt.decode(token, options={"verify_signature": False})
    verifier = AdminFirebaseIdentityVerifier(
        Settings(  # type: ignore[call-arg]
            _env_file=None, firebase_project_id="demo-thinkso"
        )
    )
    try:
        identity = await verifier.verify(token)
        assert identity.email == email
        expired = jwt.encode(
            {**claims, "exp": datetime.now(UTC) - timedelta(minutes=1)},
            key="",
            algorithm="none",
        )
        wrong_project = jwt.encode({**claims, "aud": "another-project"}, key="", algorithm="none")
        for rejected in ("not-a-token", expired, wrong_project):
            with pytest.raises(InvalidFirebaseCredential):
                await verifier.verify(rejected)
    finally:
        verifier.close()


@pytest.mark.asyncio
async def test_firebase_token_exchanges_end_to_end_and_reuses_profile() -> None:
    email = f"agent-{uuid.uuid4()}@example.test"
    async with httpx.AsyncClient() as client:
        signup = await client.post(
            "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp",
            params={"key": "demo-key"},
            json={"email": email, "password": "test-password", "returnSecureToken": True},
        )
    signup.raise_for_status()
    firebase_token = signup.json()["idToken"]
    settings = Settings(  # type: ignore[call-arg]
        _env_file=None, firebase_project_id="demo-thinkso"
    )
    app = create_app(settings)
    async with app.router.lifespan_context(app):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=app), base_url="http://test"
        ) as client:
            first = await client.post("/v1/auth/login", json={"firebase_id_token": firebase_token})
            second = await client.post("/v1/auth/login", json={"firebase_id_token": firebase_token})
            invalid = await client.post("/v1/auth/login", json={"firebase_id_token": "not-a-token"})

            async with httpx.AsyncClient() as firebase_client:
                deleted = await firebase_client.post(
                    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:delete",
                    params={"key": "demo-key"},
                    json={"idToken": firebase_token},
                )
                replacement = await firebase_client.post(
                    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp",
                    params={"key": "demo-key"},
                    json={
                        "email": email,
                        "password": "replacement-password",
                        "returnSecureToken": True,
                    },
                )
            deleted.raise_for_status()
            replacement.raise_for_status()
            replacement_token = replacement.json()["idToken"]
            conflict = await client.post(
                "/v1/auth/login", json={"firebase_id_token": replacement_token}
            )

            engine = create_async_engine(settings.database_url)
            try:
                async with engine.begin() as connection:
                    await connection.execute(
                        text("UPDATE users SET retired_at = now() WHERE id = :id"),
                        {"id": first.json()["user"]["id"]},
                    )
                    await connection.execute(
                        text(
                            "INSERT INTO retired_identity_tombstones "
                            "(id, user_id, kind, value, created_at) "
                            "VALUES (:id, :user_id, 'firebase_email', :email, now())"
                        ),
                        {
                            "id": uuid.uuid4(),
                            "user_id": first.json()["user"]["id"],
                            "email": email,
                        },
                    )
                    profile_count = await connection.scalar(
                        text("SELECT count(*) FROM users WHERE normalized_email = :email"),
                        {"email": email},
                    )
                    session_count = await connection.scalar(
                        text("SELECT count(*) FROM user_sessions WHERE user_id = :user_id"),
                        {"user_id": first.json()["user"]["id"]},
                    )
            finally:
                await engine.dispose()
            retired = await client.post(
                "/v1/auth/login", json={"firebase_id_token": replacement_token}
            )

    assert first.status_code == 200
    assert second.status_code == 200
    assert invalid.status_code == 401
    assert conflict.status_code == 409
    assert retired.status_code == 403
    assert first.json()["user"]["id"] == second.json()["user"]["id"]
    assert first.json()["access_token"] != second.json()["access_token"]
    assert first.json()["access_token"] != firebase_token
    assert first.json()["refresh_token"] != firebase_token
    assert first.json()["onboarding_complete"] is False
    assert invalid.json()["error"]["code"] == "invalid_firebase_credential"
    assert conflict.json()["error"]["code"] == "identity_conflict"
    assert retired.json()["error"]["code"] == "profile_retired"
    assert profile_count == 1
    assert session_count == 2
