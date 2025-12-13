import pytest
import httpx
from asgi_lifespan import LifespanManager

from app.main import app
from app.core.jwt import create_access_token


@pytest.mark.asyncio
async def test_search_sweets_by_name():
    admin_token = create_access_token({"sub": "admin@test.com", "role": "admin"})

    async with LifespanManager(app):
        transport = httpx.ASGITransport(app=app)

        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://test",
            headers={"Authorization": f"Bearer {admin_token}"}
        ) as client:
            await client.post(
                "/api/sweets",
                json={
                    "name": "Kaju Katli",
                    "category": "Indian",
                    "price": 30,
                    "quantity": 10
                }
            )

            response = await client.get(
                "/api/sweets/search?name=Kaju"
            )

    assert response.status_code == 200
    assert len(response.json()) >= 1
