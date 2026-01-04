from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

ALGORITHM = "HS256"


def create_access_token(user_id: str, expires_minutes: int = 60):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=expires_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)
