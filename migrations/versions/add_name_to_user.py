"""add name column to user table

Revision ID: add_name_to_user
Revises: 46ac17f45d5a
Create Date: 2025-11-13
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_name_to_user'
down_revision = '46ac17f45d5a'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('name', sa.String(length=120), nullable=True))


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('name')
