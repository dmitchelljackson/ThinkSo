# Backend architecture

## Locked shape

ThinkSo is a feature-oriented FastAPI modular monolith backed by Postgres. Keep deployable complexity low while preserving boundaries that can grow with the product.

Feature modules include identity, Threads authorization, contracts, minting, judging, publication, and notifications. Each module may contain its own transport, application, domain, and persistence code. Do not reorganize the service into global controller/service/repository folders.

Each feature also owns its HTTP route adapters and durable-job adapters. Keep HTTP, worker, and scheduler as separate process entrypoints that compose feature-owned handlers and application operations; do not create top-level route or job folders that become alternate homes for feature logic. See [Repository organization](./repository-organization.md).

## Dependency injection

Use Dishka as the backend composition framework.

- `APP` scope owns configuration, database engine/session factory, provider clients, and other process-wide resources.
- `REQUEST` scope owns one SQLAlchemy `AsyncSession` and request application services.
- `JOB` scope owns one session and application-service graph for each durable worker job.
- Domain code receives explicit interfaces and never accesses Dishka or a global container.
- Workers and command-line entry points resolve the same application operations used by HTTP routes.

## Async I/O

Use async FastAPI handlers, SQLAlchemy `AsyncSession`, psycopg 3, async provider clients, and async workers. Pure domain rules remain ordinary synchronous Python. A provider SDK that only offers blocking I/O must sit behind an explicit thread adapter rather than block the event loop.

Never share an `AsyncSession` across concurrent tasks. One request or job scope owns one session.

## Transactions

One application operation owns one database transaction.

- Repositories may query, mutate, and flush; they do not commit.
- The application operation commits domain changes and durable queued work atomically.
- Never hold a database transaction open across a slow model, search, Threads, OAuth, or push-provider call.
- Persist intent and enqueue durable work first. The worker performs external I/O and then uses a short transaction to persist the result.

## Durable work

Use PgQueuer with Postgres for durable background work. Do not add Redis or Celery without a demonstrated requirement.

Representative jobs include minting turns, contract judgment, consequence publication, notifications, and provider-token revocation. Domain tables remain authoritative; queue records contain only execution details such as task name, payload, schedule, attempts, and status.

Hide PgQueuer behind a small `TaskQueue` application port. Jobs must be idempotent because workers can retry after timeouts or crashes. Never use fire-and-forget `asyncio.create_task()` for work that must survive a process exit.

## Test seams

- Unit-test domain rules without FastAPI, Dishka, Postgres, or provider SDKs.
- Unit-test application operations with fake ports where persistence behavior is not under test.
- Integration-test repositories, transactions, queue insertion, claims, retries, and state-transition races against Postgres.
- Test HTTP serialization and authorization separately through the FastAPI application.
