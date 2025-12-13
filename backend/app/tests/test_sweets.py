import pytest
import httpx
from asgi_lifespan import LifespanManager

from app.main import app
from app.core.jwt import create_access_token


@pytest.mark.asyncio
async def test_create_sweet_admin_only():
    admin_token = create_access_token(
        {"sub": "admin@test.com", "role": "admin"}
    )

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {admin_token}"}
        ) as client:
            response = await client.post(
                "/api/sweets",
                json={
                    "name": "Ladoo",
                    "category": "Indian",
                    "price": 10.0,
                    "quantity": 100
                }
            )

    assert response.status_code == 201
    assert response.json()["name"] == "Ladoo"


@pytest.mark.asyncio
async def test_create_sweet_forbidden_for_user():
    user_token = create_access_token(
        {"sub": "user@test.com", "role": "user"}
    )

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {user_token}"}
        ) as client:
            response = await client.post(
                "/api/sweets",
                json={
                    "name": "Barfi",
                    "category": "Indian",
                    "price": 15.0,
                    "quantity": 50
                }
            )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_list_sweets_requires_auth():
    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test"
        ) as client:
            response = await client.get("/api/sweets")

    assert response.status_code == 401
