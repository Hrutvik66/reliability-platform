from sqlalchemy.orm import Session
from app.models.user import User
from app.models.service import Service
from app.exceptions import PermissionDenied


def ensure_admin(current_user: User):
    if current_user.role != "admin":
        raise PermissionDenied("Admin privileges required")


def list_users(
    db: Session,
    current_user: User,
):
    ensure_admin(current_user)
    return db.query(User).all()


def list_all_services(
    db: Session,
    current_user: User,
):
    ensure_admin(current_user)
    return db.query(Service).all()


def promote_user_to_admin(
    db: Session,
    user_id: str,
    current_user: User,
):
    ensure_admin(current_user)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise PermissionDenied("User not found")

    user.role = "admin"
    db.commit()
    return user
