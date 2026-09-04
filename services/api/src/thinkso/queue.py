"""Durable-job seam shared by HTTP operations and worker processes."""

from pgqueuer import PgQueuer, SchedulerManager


class PgQueuerRuntime:
    """Typed composition seam for the worker and scheduler entrypoints.

    Feature tickets provide a psycopg connection/channel and construct these managers; keeping
    the types here ensures workers and schedulers share the same durable-job implementation.
    """

    worker: type[PgQueuer] = PgQueuer
    scheduler: type[SchedulerManager] = SchedulerManager
