"""fresh

Revision ID: 7a18fca28475
Revises: 4554dcd39f6a
Create Date: 2026-06-18 12:33:00.248521

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = "7a18fca28475"
down_revision: Union[str, Sequence[str], None] = "4554dcd39f6a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Change years_of_experience from Integer -> String
    op.alter_column(
        "teacher_profiles",
        "years_of_experience",
        existing_type=mysql.INTEGER(),
        type_=sa.String(length=50),
        existing_nullable=True,
    )

    # Add registration_number column
    op.add_column(
        "users",
        sa.Column("registration_number", sa.String(length=30), nullable=True),
    )

    # Create unique index
    op.create_index(
        "ix_users_registration_number",
        "users",
        ["registration_number"],
        unique=True,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # Drop registration_number index
    op.drop_index(
        "ix_users_registration_number",
        table_name="users",
    )

    # Drop registration_number column
    op.drop_column(
        "users",
        "registration_number",
    )

    # Revert years_of_experience String -> Integer
    op.alter_column(
        "teacher_profiles",
        "years_of_experience",
        existing_type=sa.String(length=50),
        type_=mysql.INTEGER(),
        existing_nullable=True,
    )