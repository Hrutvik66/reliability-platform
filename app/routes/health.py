from fastapi import APIRouter
from sqlalchemy import text
from app.database import engine

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}
