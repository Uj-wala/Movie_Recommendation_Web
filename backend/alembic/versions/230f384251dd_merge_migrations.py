"""merge migrations

Revision ID: 230f384251dd
Revises: 7a18fca28475, c87fba0ddb52
Create Date: 2026-06-19 12:53:54.646418

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '230f384251dd'
down_revision: Union[str, Sequence[str], None] = ('7a18fca28475', 'c87fba0ddb52')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
