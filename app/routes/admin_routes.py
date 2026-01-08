from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.services.admin_service import (
    list_users,
    list_all_services,
)
from app.exceptions import PermissionDenied

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        return list_users(db, current_user)
    except PermissionDenied as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.get("/services")
def get_services(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    try:
        return list_all_services(db, current_user)
    except PermissionDenied as e:
        raise HTTPException(status_code=403, detail=str(e))
