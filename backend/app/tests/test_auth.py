import pytest
import httpx
from asgi_lifespan import LifespanManager

from app.main import app


@pytest.mark.asyncio
async def test_register_user():
    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/auth/register",
                json={
                    "email": "auth@test.com",
                    "password": "secret123"
                }
            )

    assert response.status_code == 201


@pytest.mark.asyncio
async def test_login_user():
    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/auth/login",
                json={
                    "email": "auth@test.com",
                    "password": "secret123"
                }
            )

    assert response.status_code == 200
    assert "access_token" in response.json()
