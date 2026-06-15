from datetime import datetime, timezone
 
from sqlalchemy.orm import Session
 
from app.models.refresh_token_model import RefreshToken
 
 
def create_refresh_token_record(
    db: Session,
    user_id: str,
    token_hash: str,
    expires_at: datetime
) -> RefreshToken:
    refresh_token = RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=False
    )
 
    db.add(refresh_token)
 
    return refresh_token
 
 
def get_refresh_token_by_hash(
    db: Session,
    token_hash: str
) -> RefreshToken | None:
    return (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == token_hash)
        .first()
    )
 
 
def revoke_refresh_token(
    refresh_token: RefreshToken
) -> RefreshToken:
    refresh_token.revoked = True
    refresh_token.revoked_at = datetime.now(timezone.utc)
 
    return refresh_token
 
 
def revoke_all_user_refresh_tokens(
    db: Session,
    user_id: str
) -> int:
    return (
        db.query(RefreshToken)
        .filter(
            RefreshToken.user_id == user_id,
            RefreshToken.revoked == False
        )
        .update(
            {
                RefreshToken.revoked: True,
                RefreshToken.revoked_at: datetime.now(timezone.utc)
            },
            synchronize_session=False
        )
    )
 