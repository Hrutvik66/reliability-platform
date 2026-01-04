import uuid
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Service(Base, TimestampMixin):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    check_interval = Column(Integer, default=5)  # minutes
    timeout = Column(Integer, default=5)
    is_active = Column(Boolean, default=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    check_results = relationship("CheckResult", back_populates="service")
    alerts = relationship("Alert", back_populates="service")
