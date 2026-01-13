import time
from app.utils.db_wait import wait_for_db
from app.services.scheduler import start_scheduler

from prometheus_client import start_http_server

def main():
    wait_for_db()
    
    # Start Prometheus metrics server
    start_http_server(8001)
    
    start_scheduler()

    # Keep container alive
    while True:
        time.sleep(60)

if __name__ == "__main__":
    main()
