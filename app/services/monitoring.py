import time
import requests
from sqlalchemy.orm import Session

from app.models.service import Service
from app.models.check_result import CheckResult
from app.models.alert import Alert

from app.metrics import (
    CHECK_TOTAL,
    CHECK_FAILURES,
    RESPONSE_TIME,
)



def check_service(db: Session, service: Service):
    start_time = time.time()

    try:
        response = requests.get(
            service.url,
            timeout=service.timeout
        )
        latency_ms = (time.time() - start_time) * 1000
        is_up = response.status_code < 500
        status_code = response.status_code

        CHECK_TOTAL.labels(service.name).inc()

        if latency_ms is not None:
            RESPONSE_TIME.labels(service.name).observe(latency_ms)

        if not is_up:
            CHECK_FAILURES.labels(service.name).inc()


    except requests.RequestException:
        latency_ms = None
        is_up = False
        status_code = None

    # Save check result
    result = CheckResult(
        service_id=service.id,
        status_code=status_code,
        response_time_ms=latency_ms,
        is_up=is_up,
    )
    db.add(result)

    # Alert logic (basic for now)
    last_alert = (
        db.query(Alert)
        .filter(Alert.service_id == service.id)
        .order_by(Alert.triggered_at.desc())
        .first()
    )

    if not is_up and (not last_alert or last_alert.type != "DOWN"):
        alert = Alert(
            service_id=service.id,
            type="DOWN",
            message=f"{service.name} is DOWN"
        )
        db.add(alert)

    if is_up and last_alert and last_alert.type == "DOWN":
        alert = Alert(
            service_id=service.id,
            type="RECOVERED",
            message=f"{service.name} has RECOVERED"
        )
        last_alert.resolved_at = result.checked_at
        db.add(alert)

    db.commit()
