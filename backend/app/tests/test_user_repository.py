import pytest
from asgi_lifespan import LifespanManager
from types import SimpleNamespace

from app.main import app
from app.repositories.user_repository import UserRepository
from app.models.user import UserCreate


@pytest.mark.asyncio
async def test_create_user():
    async with LifespanManager(app):
        request = SimpleNamespace(app=app)
        repo = UserRepository(request)

        user = UserCreate(
            email="testuser@example.com",
            password="password123"
        )

        created_user = await repo.create_user(user)

        assert created_user["email"] == "testuser@example.com"
        assert "hashed_password" in created_user
        assert "password" not in created_user

        # cleanup
        await app.state.db["users"].delete_one(
            {"email": "testuser@example.com"}
        )
