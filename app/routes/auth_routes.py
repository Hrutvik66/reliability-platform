from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import UserCreate, UserLogin, TokenResponse
from app.services.auth_service import create_user, authenticate_user
from datetime import datetime, timedelta
from app.models.refresh_token import RefreshToken
from app.utils.jwt import create_access_token, create_refresh_token
from app.utils.security import hash_token
from jose import JWTError, jwt
from app.config import settings


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, data)

@router.post("/login", response_model=TokenResponse)
def login(
    form_data: UserLogin,
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    db.query(RefreshToken).filter(
        RefreshToken.user_id == user.id
    ).delete()

    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_token(refresh_token),
            expires_at=datetime.utcnow() + timedelta(days=7),
        )
    )
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 86400
    }

@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, settings.jwt_secret, algorithms=["HS256"])
        if payload.get("type") != "refresh":
            raise Exception()
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    token_hash = hash_token(refresh_token)

    db_token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.user_id == user_id,
            RefreshToken.token_hash == token_hash,
            RefreshToken.expires_at > datetime.utcnow(),
        )
        .first()
    )

    if not db_token:
        raise HTTPException(status_code=401, detail="Refresh token expired or revoked")

    new_access_token = create_access_token(user_id)

    return {"access_token": new_access_token}
