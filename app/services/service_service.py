from sqlalchemy.orm import Session
from uuid import UUID

from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate


def create_service(db: Session, data: ServiceCreate) -> Service:
    service_data = data.model_dump()
    service_data["url"] = str(service_data["url"])
    service = Service(**service_data)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def get_services(db: Session, user_id: UUID):
    return db.query(Service).filter(Service.user_id == user_id).all()


def get_service(db: Session, service_id: UUID):
    return db.query(Service).filter(Service.id == service_id).first()


def update_service(db: Session, service_id: UUID, data: ServiceUpdate):
    service = get_service(db, service_id)
    if not service:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        if key == "url" and value is not None:
            value = str(value)
        setattr(service, key, value)

    db.commit()
    db.refresh(service)
    return service


def delete_service(db: Session, service_id: UUID) -> bool:
    service = get_service(db, service_id)
    if not service:
        return False

    db.delete(service)
    db.commit()
    return True
