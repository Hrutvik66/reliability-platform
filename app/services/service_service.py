from sqlalchemy.orm import Session
from app.models.service import Service
from app.models.user import User
from app.exceptions import PermissionDenied, ResourceNotFound
from app.schemas.service import ServiceCreate

def get_user_service(
    db: Session,
    service_id: str,
    current_user: User,
) -> Service:
    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise ResourceNotFound("Service not found")

    # USER: must own the service
    # ADMIN: can access anything
    if current_user.role != "admin" and service.user_id != current_user.id:
        raise PermissionDenied("Not allowed to access this service")

    return service


def list_services(
    db: Session,
    current_user: User,
):
    # USER: only own services
    # ADMIN: all services
    if current_user.role == "admin":
        return db.query(Service).all()

    return db.query(Service).filter(Service.user_id == current_user.id).all()


def create_service(
    db: Session,
    data: ServiceCreate,
    current_user: User,
):
    service_data = data.model_dump()
    service_data["url"] = str(service_data["url"])
    service = Service(**service_data, user_id=current_user.id)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


def delete_service(
    db: Session,
    service_id: str,
    current_user: User,
):
    service = get_user_service(db, service_id, current_user)
    db.delete(service)
    db.commit()
