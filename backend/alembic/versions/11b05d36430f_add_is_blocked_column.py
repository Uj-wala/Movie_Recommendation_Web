"""add is_blocked column

Revision ID: 11b05d36430f
Revises: 9f1883e7ad4c
Create Date: 2026-06-02 12:47:41.446038
"""

from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = "11b05d36430f"
down_revision: Union[str, Sequence[str], None] = "9f1883e7ad4c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Upgrade schema.

    The 'is_blocked' column already exists in the users table,
    so no action is required.
    """
    pass


def downgrade() -> None:
    """
    Downgrade schema.

    No action required.
    """
    pass