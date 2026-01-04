import time
from app.utils.db_wait import wait_for_db
from app.services.scheduler import start_scheduler

def main():
    wait_for_db()
    start_scheduler()

    # Keep container alive
    while True:
        time.sleep(60)

if __name__ == "__main__":
    main()
