from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
)
from app.services.service_service import (
    create_service,
    get_services,
    get_service,
    update_service,
    delete_service,
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/services", tags=["Services"])


@router.post(
    "/",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(data: ServiceCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    service = create_service(db, data)
    service.user_id = user.id
    db.commit()
    return service


@router.get("/", response_model=list[ServiceResponse])
def list_all(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_services(db, user.id)


@router.get("/{service_id}", response_model=ServiceResponse)
def get_one(service_id: UUID, db: Session = Depends(get_db)):
    service = get_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.put("/{service_id}", response_model=ServiceResponse)
def update(service_id: UUID, data: ServiceUpdate, db: Session = Depends(get_db)):
    service = update_service(db, service_id, data)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(service_id: UUID, db: Session = Depends(get_db)):
    success = delete_service(db, service_id)
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
