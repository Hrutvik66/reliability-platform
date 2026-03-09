from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.services.service_service import (
    list_services,
    create_service,
    delete_service,
)
from app.exceptions import PermissionDenied, ResourceNotFound
from app.schemas.service import ServiceCreate

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/")
def get_services(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return list_services(db, current_user)


@router.post("/")
def add_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return create_service(db, data, current_user)


@router.delete("/{service_id}")
def remove_service(
    service_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        delete_service(db, service_id, current_user)
        return {"status": "deleted"}
    except PermissionDenied as e:
        raise HTTPException(status_code=403, detail=str(e))
    except ResourceNotFound as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    from app.models.alert import Alert
    from sqlalchemy import or_
    
    # Get all services for the current user (or all if admin)
    user_services = list_services(db, current_user)
    service_ids = [s.id for s in user_services]
    
    if not service_ids:
        return []
    
    # Get alerts for user's services
    alerts = db.query(Alert).filter(Alert.service_id.in_(service_ids)).order_by(Alert.triggered_at.desc()).all()
    
    # Format alerts with service names
    result = []
    for alert in alerts:
        result.append({
            "id": str(alert.id),
            "service_id": str(alert.service_id),
            "serviceName": alert.service.name,
            "type": alert.type,
            "message": alert.message,
            "triggered_at": alert.triggered_at.isoformat() if alert.triggered_at else None,
            "resolved_at": alert.resolved_at.isoformat() if alert.resolved_at else None,
            "sent": alert.sent,
        })
    
    return result
