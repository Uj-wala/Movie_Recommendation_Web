"""add profile image url to student profiles

Revision ID: 4d6c333c4c16
Revises: 94f6f6aebc39
Create Date: 2026-06-11 13:00:31.652564

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4d6c333c4c16"
down_revision: Union[str, Sequence[str], None] = "94f6f6aebc39"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "student_profiles",
        sa.Column(
            "profile_image_url",
            sa.String(length=500),
            nullable=True
        )
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "student_profiles",
        "profile_image_url"
    )