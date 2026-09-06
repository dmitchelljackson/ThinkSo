import pytest
from pydantic import ValidationError

from thinkso.config import Settings, psycopg_dsn


def test_settings_validate_and_keep_safe_defaults() -> None:
    settings = Settings(_env_file=None)  # type: ignore[call-arg]
    assert settings.environment == "development"
    assert settings.database_url.startswith("postgresql+psycopg://")
    assert psycopg_dsn(settings).startswith("postgresql://")


def test_production_rejects_firebase_emulator() -> None:
    with pytest.raises(ValidationError):
        Settings(  # type: ignore[call-arg]
            _env_file=None,
            environment="production",
            firebase_auth_emulator_host="127.0.0.1:9099",
        )
