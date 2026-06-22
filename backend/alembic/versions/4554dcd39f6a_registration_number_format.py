"""registration number format

Revision ID: 4554dcd39f6a
Revises: b404682c2a85
Create Date: 2026-06-18 12:30:09.210707

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4554dcd39f6a'
down_revision: Union[str, Sequence[str], None] = 'b404682c2a85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
