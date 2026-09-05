from thinkso.config import Settings, psycopg_dsn


def test_settings_validate_and_keep_safe_defaults() -> None:
    settings = Settings(_env_file=None)
    assert settings.environment == "development"
    assert settings.database_url.startswith("postgresql+psycopg://")
    assert psycopg_dsn(settings).startswith("postgresql://")
