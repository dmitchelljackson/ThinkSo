from fastapi.testclient import TestClient

from thinkso.app import create_app
from thinkso.config import Settings


def test_health_endpoint_returns_canonical_wire_shape() -> None:
    app = create_app(Settings(_env_file=None, app_version="test"))  # type: ignore[call-arg]
    with TestClient(app) as client:
        response = client.get("/v1/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["service"] == "thinkso-api"
    assert payload["version"] == "test"
    assert payload["checked_at"].endswith("Z")
