from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.models.service import Service
from app.services.monitoring import check_service


def start_scheduler():
    scheduler = BackgroundScheduler()

    def run_checks():
        db = SessionLocal()
        try:
            services = db.query(Service).filter(Service.is_active == True).all()
            for service in services:
                check_service(db, service)
        finally:
            db.close()

    # Run every minute (per-service intervals later)
    scheduler.add_job(run_checks, "interval", minutes=1)

    scheduler.start()
