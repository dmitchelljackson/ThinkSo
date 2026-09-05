import pytest
from dishka import make_async_container

from thinkso.config import Settings
from thinkso.di import providers


@pytest.mark.asyncio
async def test_application_graph_resolves_settings_and_queue() -> None:
    container = make_async_container(*providers())
    try:
        settings = await container.get(Settings)
        assert settings.app_name == "ThinkSo API"
    finally:
        await container.close()
