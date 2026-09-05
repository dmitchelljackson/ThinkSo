set dotenv-load := false

default:
    @just --list

format:
    pnpm format

format-check:
    pnpm format:check

check: format-check lint typecheck test

lint:
    pnpm lint

typecheck:
    pnpm typecheck

test:
    pnpm test

hygiene:
    pnpm hygiene
    gitleaks detect --source . --redact --no-banner

path-hygiene:
    pnpm hygiene

links-check:
    pnpm links:check

mobile-format:
    @if test -f apps/mobile/package.json; then pnpm --filter @thinkso/mobile format:check; else echo "SKIP mobile format: app is not present yet"; fi

mobile-lint:
    @if test -f apps/mobile/package.json; then pnpm --filter @thinkso/mobile lint; else echo "SKIP mobile lint: app is not present yet"; fi

mobile-typecheck:
    @if test -f apps/mobile/tsconfig.json; then pnpm --filter @thinkso/mobile typecheck; else echo "SKIP mobile typecheck: tsconfig.json is not present yet"; fi

mobile-test:
    @if test -f apps/mobile/jest.config.ts; then pnpm --filter @thinkso/mobile test; else echo "SKIP mobile tests: Jest config is not present yet"; fi

backend-format:
    @if test -d services/api/src; then uv run --locked --directory services/api ruff format --check src; else echo "SKIP backend format: source is not present yet"; fi

backend-lint:
    @if test -d services/api/src; then uv run --locked --directory services/api ruff check src; else echo "SKIP backend lint: source is not present yet"; fi

backend-typecheck:
    @if test -d services/api/src; then uv run --locked --directory services/api mypy src; else echo "SKIP backend typecheck: source is not present yet"; fi

backend-test:
    @if test -d services/api/tests; then uv run --locked --directory services/api pytest tests; else echo "SKIP backend tests: test suite is not present yet"; fi

backend-integration:
    @if test -d services/api/tests/integration; then uv run --locked --directory services/api pytest tests/integration; else echo "SKIP backend integration: integration suite is not present yet"; fi

openapi-drift:
    pnpm openapi:check

container-build:
    docker compose config --quiet
    docker build --file services/api/Dockerfile --tag thinkso-api:ci .
