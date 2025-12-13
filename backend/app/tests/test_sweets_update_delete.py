import pytest
import httpx
from asgi_lifespan import LifespanManager

from app.main import app
from app.core.jwt import create_access_token


@pytest.mark.asyncio
async def test_update_sweet_admin_only():
    admin_token = create_access_token({"sub": "admin@test.com", "role": "admin"})
    user_token = create_access_token({"sub": "user@test.com", "role": "user"})

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)

        # Create sweet as admin
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {admin_token}"}
        ) as client:
            res = await client.post(
                "/api/sweets",
                json={
                    "name": "Halwa",
                    "category": "Indian",
                    "price": 25,
                    "quantity": 10
                }
            )
            sweet_id = res.json()["_id"]

        # Attempt update as user (should fail)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {user_token}"}
        ) as client:
            response = await client.put(
                f"/api/sweets/{sweet_id}",
                json={"price": 30}
            )

    assert response.status_code == 403


@pytest.mark.asyncio
async def test_delete_sweet_admin_only():
    admin_token = create_access_token({"sub": "admin@test.com", "role": "admin"})

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {admin_token}"}
        ) as client:
            res = await client.post(
                "/api/sweets",
                json={
                    "name": "Modak",
                    "category": "Indian",
                    "price": 40,
                    "quantity": 5
                }
            )
            sweet_id = res.json()["_id"]

            delete_res = await client.delete(f"/api/sweets/{sweet_id}")

    assert delete_res.status_code == 200
