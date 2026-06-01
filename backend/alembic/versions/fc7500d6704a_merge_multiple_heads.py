"""merge_multiple_heads

Revision ID: fc7500d6704a
Revises: c1b0f060c495, 4759d1534839, 9f1883e7ad4c
Create Date: 2026-06-01 17:26:44.436151

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fc7500d6704a'
down_revision: Union[str, Sequence[str], None] = ('c1b0f060c495', '4759d1534839', '9f1883e7ad4c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
