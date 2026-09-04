"""Dishka application/request/job composition root."""

from collections.abc import AsyncIterator

from dishka import Provider, Scope, provide
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from thinkso.config import Settings, get_settings
from thinkso.db import create_engine, create_session_factory, session_scope


class ApplicationProvider(Provider):
    scope = Scope.APP

    def __init__(self, configured: Settings | None = None) -> None:
        super().__init__(Scope.APP)
        self._configured = configured

    @provide
    def settings(self) -> Settings:
        return self._configured or get_settings()

    @provide
    async def engine(self, settings: Settings) -> AsyncIterator[AsyncEngine]:
        engine = create_engine(settings)
        try:
            yield engine
        finally:
            await engine.dispose()

    @provide
    def session_factory(self, engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
        return create_session_factory(engine)


class RequestProvider(Provider):
    scope = Scope.REQUEST

    @provide
    async def session(
        self, factory: async_sessionmaker[AsyncSession]
    ) -> AsyncIterator[AsyncSession]:
        async for session in session_scope(factory):
            yield session


def providers(settings: Settings | None = None) -> list[Provider]:
    return [ApplicationProvider(settings), RequestProvider()]
