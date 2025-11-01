from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, IntegerIDMixin, FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from app.models.user import UserTable
from app.database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from datetime import datetime, timedelta
import jwt


class UserManager(IntegerIDMixin, BaseUserManager[UserTable, int]):
    reset_password_token_secret = settings.secret_key
    verification_token_secret = settings.secret_key

    async def on_after_register(self, user: UserTable, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: UserTable, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: UserTable, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, UserTable)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


bearer_transport = BearerTransport(tokenUrl="api/auth/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=settings.secret_key, lifetime_seconds=settings.access_token_expire_minutes * 60)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


fastapi_users = FastAPIUsers[UserTable, int](
    get_user_manager,
    [auth_backend],
)


current_active_user = fastapi_users.current_user(active=True)


# Refresh Token 생성 함수
def create_refresh_token(user_id: int) -> str:
    """Refresh Token 생성"""
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "refresh"
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


# Access Token 생성 함수
def create_access_token(user_id: int) -> str:
    """Access Token 생성"""
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "aud": ["fastapi-users:auth"]
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


# Refresh Token 검증 함수
def verify_refresh_token(token: str) -> Optional[int]:
    """Refresh Token 검증 및 user_id 반환"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        if payload.get("type") != "refresh":
            return None
        user_id = payload.get("sub")
        return int(user_id) if user_id else None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None

