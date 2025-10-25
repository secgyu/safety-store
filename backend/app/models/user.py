from datetime import datetime
from typing import Optional
from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class UserTable(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(length=320), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(length=1024), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(default=False, nullable=False)
    is_verified: Mapped[bool] = mapped_column(default=False, nullable=False)
    
    # Additional fields
    name: Mapped[str] = mapped_column(String(length=100), nullable=False)
    business_name: Mapped[Optional[str]] = mapped_column(String(length=200), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(length=100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

