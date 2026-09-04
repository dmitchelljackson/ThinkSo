"""PgQueuer scheduler process seam."""

import asyncio

import psycopg
from pgqueuer import PsycopgDriver, SchedulerManager

from thinkso.config import get_settings, psycopg_dsn


async def run_scheduler() -> None:
    settings = get_settings()
    async with await psycopg.AsyncConnection.connect(
        psycopg_dsn(settings), autocommit=True
    ) as connection:
        driver = PsycopgDriver(connection)
        await SchedulerManager(driver).run()


if __name__ == "__main__":
    asyncio.run(run_scheduler())
