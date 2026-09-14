import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from thinkso.config import Settings


@pytest.mark.asyncio
async def test_migrated_database_has_foundation_revision() -> None:
    engine = create_async_engine(Settings().database_url)
    try:
        async with engine.connect() as connection:
            revision = await connection.scalar(text("SELECT version_num FROM alembic_version"))
            queue_table = await connection.scalar(text("SELECT to_regclass('pgqueuer')"))
            queue_columns = set(
                (
                    await connection.scalars(
                        text(
                            "SELECT column_name FROM information_schema.columns "
                            "WHERE table_schema = 'public' AND table_name = 'pgqueuer'"
                        )
                    )
                ).all()
            )
            queue_objects = set(
                (
                    await connection.scalars(
                        text(
                            "SELECT to_regclass(name) FROM (VALUES "
                            "('pgqueuer_log'), ('pgqueuer_statistics'), ('pgqueuer_schedules')) "
                            "AS expected(name)"
                        )
                    )
                ).all()
            )
            queue_status_type = await connection.scalar(
                text("SELECT typname FROM pg_type WHERE typname = 'pgqueuer_status'")
            )
            legacy_table = await connection.scalar(text("SELECT to_regclass('job_queue')"))
            identity_tables = set(
                (
                    await connection.scalars(
                        text(
                            "SELECT to_regclass(name) FROM (VALUES "
                            "('users'), ('retired_identity_tombstones'), ('user_sessions')) "
                            "AS expected(name)"
                        )
                    )
                ).all()
            )
        assert revision == "0002_identity_sessions"
        assert queue_table == "pgqueuer"
        assert {
            "id",
            "priority",
            "queue_manager_id",
            "created",
            "updated",
            "heartbeat",
            "execute_after",
            "status",
            "entrypoint",
            "dedupe_key",
            "payload",
        } <= queue_columns
        assert queue_objects == {"pgqueuer_log", "pgqueuer_statistics", "pgqueuer_schedules"}
        assert queue_status_type == "pgqueuer_status"
        assert legacy_table is None
        assert identity_tables == {"users", "retired_identity_tombstones", "user_sessions"}
    finally:
        await engine.dispose()
