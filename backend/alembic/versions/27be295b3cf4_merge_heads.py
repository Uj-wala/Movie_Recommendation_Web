"""merge_heads

Revision ID: 27be295b3cf4
Revises: 0069bda61840, 4226fe6b2ab6
Create Date: 2026-06-03 09:58:44.487022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '27be295b3cf4'
down_revision: Union[str, Sequence[str], None] = ('0069bda61840', '4226fe6b2ab6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
