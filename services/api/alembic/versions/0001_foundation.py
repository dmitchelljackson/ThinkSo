"""Install PgQueuer's durable schema using its pinned query builder."""

from alembic import op
from pgqueuer.qb import QueryBuilderEnvironment

revision = "0001_foundation"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(QueryBuilderEnvironment().build_install_query())


def downgrade() -> None:
    op.execute(QueryBuilderEnvironment().build_uninstall_query())
