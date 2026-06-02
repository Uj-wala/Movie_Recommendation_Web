"""merge heads

Revision ID: c1b0f060c495
Revises: 24fac6de3670
Create Date: 2026-05-31 18:09:36.161505

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1b0f060c495'
down_revision: Union[str, Sequence[str], None] = '24fac6de3670'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
