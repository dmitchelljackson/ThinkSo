"""Validated process configuration for every API entrypoint."""

from functools import lru_cache

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), extra="ignore")

    app_name: str = "ThinkSo API"
    app_version: str = "0.0.0"
    environment: str = "development"
    log_level: str = "INFO"
    firebase_project_id: str = "thinkso-5768a"
    firebase_auth_emulator_host: str | None = None
    database_url: str = Field(
        default="postgresql+psycopg://thinkso:local-development-only@localhost:5432/thinkso",
        description="Async SQLAlchemy URL using psycopg 3.",
    )

    @model_validator(mode="after")
    def prevent_production_emulator(self) -> "Settings":
        if self.environment == "production" and self.firebase_auth_emulator_host:
            raise ValueError("Firebase Auth Emulator cannot be enabled in production")
        return self


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


def psycopg_dsn(settings: Settings) -> str:
    """Convert SQLAlchemy's async dialect URL into a psycopg connection DSN."""

    return settings.database_url.replace("postgresql+psycopg://", "postgresql://", 1)
