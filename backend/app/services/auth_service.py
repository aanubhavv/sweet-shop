from fastapi import Request
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate


class AuthService:
    def __init__(self, request: Request):
        self.repo = UserRepository(request)

    async def register_user(self, user: UserCreate):
        return await self.repo.create_user(user)

    async def login_user(self, email: str, password: str):
        user = await self.repo.collection.find_one({"email": email})
        if not user:
            return None

        if not verify_password(password, user["hashed_password"]):
            return None

        return create_access_token(
            {"sub": user["email"], "role": user.get("role", "user")}
        )
