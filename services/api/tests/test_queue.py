from pgqueuer import PgQueuer, SchedulerManager

from thinkso.queue import PgQueuerRuntime


def test_runtime_uses_pgqueuer_managers() -> None:
    assert PgQueuerRuntime.worker is PgQueuer
    assert PgQueuerRuntime.scheduler is SchedulerManager
