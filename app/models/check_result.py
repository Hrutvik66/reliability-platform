import uuid
from sqlalchemy import Column, Integer, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class CheckResult(Base):
    __tablename__ = "check_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id", ondelete="CASCADE"))

    status_code = Column(Integer)
    response_time_ms = Column(Float)
    is_up = Column(Boolean, nullable=False)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

    service = relationship("Service", back_populates="check_results")
