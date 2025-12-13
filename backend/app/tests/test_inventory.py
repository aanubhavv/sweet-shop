import pytest
import httpx
from asgi_lifespan import LifespanManager

from app.main import app
from app.core.jwt import create_access_token


@pytest.mark.asyncio
async def test_purchase_sweet_decreases_quantity():
    admin_token = create_access_token({"sub": "admin@test.com", "role": "admin"})
    user_token = create_access_token({"sub": "user@test.com", "role": "user"})

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {admin_token}"}
        ) as client:
            # create sweet
            res = await client.post(
                "/api/sweets",
                json={
                    "name": "Jalebi",
                    "category": "Indian",
                    "price": 12.0,
                    "quantity": 5
                }
            )
            sweet_id = res.json()["_id"]

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {user_token}"}
        ) as client:
            purchase = await client.post(f"/api/sweets/{sweet_id}/purchase")

    assert purchase.status_code == 200
    assert purchase.json()["quantity"] == 4


@pytest.mark.asyncio
async def test_purchase_fails_when_out_of_stock():
    admin_token = create_access_token({"sub": "admin@test.com", "role": "admin"})
    user_token = create_access_token({"sub": "user@test.com", "role": "user"})

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
                    "name": "Rasgulla",
                    "category": "Indian",
                    "price": 8.0,
                    "quantity": 0
                }
            )
            sweet_id = res.json()["_id"]

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {user_token}"}
        ) as client:
            purchase = await client.post(f"/api/sweets/{sweet_id}/purchase")

    assert purchase.status_code == 400


@pytest.mark.asyncio
async def test_restock_admin_only():
    admin_token = create_access_token({"sub": "admin@test.com", "role": "admin"})
    user_token = create_access_token({"sub": "user@test.com", "role": "user"})

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
                    "name": "Peda",
                    "category": "Indian",
                    "price": 20.0,
                    "quantity": 2
                }
            )
            sweet_id = res.json()["_id"]

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {user_token}"}
        ) as client:
            restock = await client.post(
                f"/api/sweets/{sweet_id}/restock",
                json={"quantity": 5}
            )

    assert restock.status_code == 403
