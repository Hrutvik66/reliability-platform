import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from app.database import engine


def wait_for_db(retries: int = 10, delay: int = 3):
    for attempt in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✅ Database is ready")
            return
        except OperationalError:
            print(f"⏳ Waiting for database... ({attempt + 1}/{retries})")
            time.sleep(delay)

    raise RuntimeError("❌ Database not ready after retries")
