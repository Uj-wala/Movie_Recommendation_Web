"""merge heads

Revision ID: 5f6ce18702d6
Revises: 13dca6926197, 21742d0e807b
Create Date: 2026-06-07 15:27:19.800116

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f6ce18702d6'
down_revision: Union[str, Sequence[str], None] = ('13dca6926197', '21742d0e807b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
