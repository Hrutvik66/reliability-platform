from datetime import datetime, timedelta
from jose import jwt
from app.config import settings

ALGORITHM = "HS256"


def create_access_token(user_id: str, minutes: int = 1440):
    payload = {
        "sub": user_id,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def create_refresh_token(user_id: str, days: int = 7):
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=days),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)
