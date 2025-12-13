import pytest
import httpx
from asgi_lifespan import LifespanManager

from app.main import app
from app.core.jwt import create_access_token


@pytest.mark.asyncio
async def test_protected_user_requires_token():
    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test"
        ) as client:
            response = await client.get("/api/protected/user")

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_protected_user_with_token():
    token = create_access_token({"sub": "user@test.com", "role": "user"})

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {token}"}
        ) as client:
            response = await client.get("/api/protected/user")

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_admin_route_forbidden_for_user():
    token = create_access_token({"sub": "user@test.com", "role": "user"})

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {token}"}
        ) as client:
            response = await client.get("/api/protected/admin")

    assert response.status_code == 403
