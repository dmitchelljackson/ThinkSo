FROM python:3.13-slim@sha256:9d2e5553305c7c7b0097999bb17187c69b921ccd6bc9d40e4bb5ebe652c00285

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PYTHONPATH=/app/services/api/src \
    PATH=/app/services/api/.venv/bin:$PATH

WORKDIR /app

COPY services/api/pyproject.toml services/api/uv.lock /app/services/api/
RUN pip install --no-cache-dir uv==0.9.21 \
    && uv sync --directory /app/services/api --locked --no-dev

COPY services/api/src /app/services/api/src
COPY services/api/alembic /app/services/api/alembic
COPY services/api/alembic.ini /app/services/api/alembic.ini

WORKDIR /app/services/api
CMD ["uvicorn", "thinkso.entrypoints.http:app", "--host", "0.0.0.0", "--port", "8000"]
