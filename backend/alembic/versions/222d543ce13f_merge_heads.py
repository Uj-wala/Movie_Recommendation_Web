"""merge heads

Revision ID: 222d543ce13f
Revises: 27be295b3cf4, c358f5fbb42f
Create Date: 2026-06-03 18:32:53.355263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '222d543ce13f'
down_revision: Union[str, Sequence[str], None] = ('27be295b3cf4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
