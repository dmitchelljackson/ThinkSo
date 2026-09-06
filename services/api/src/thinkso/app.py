"""FastAPI application factory."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from dishka import make_async_container
from dishka.integrations.fastapi import FastapiProvider, setup_dishka
from fastapi import FastAPI

from thinkso.config import Settings, get_settings
from thinkso.di import providers
from thinkso.features.health.transport import router as health_router
from thinkso.features.identity.transport import router as identity_router


def create_app(settings: Settings | None = None) -> FastAPI:
    configured = settings or get_settings()
    container = make_async_container(*providers(configured), FastapiProvider())

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        app.state.dishka_container = container
        try:
            yield
        finally:
            await container.close()

    app = FastAPI(title=configured.app_name, version=configured.app_version, lifespan=lifespan)
    app.state.settings = configured
    app.include_router(health_router, prefix="/v1")
    app.include_router(identity_router, prefix="/v1")
    setup_dishka(container, app)
    return app


app = create_app()
