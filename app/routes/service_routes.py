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
