import os
from motor.motor_asyncio import AsyncIOMotorClient

ENV = os.getenv("ENV", "development")

if ENV == "development":
    # Local development defaults
    MONGODB_URL = os.getenv(
        "MONGODB_URL",
        "mongodb://localhost:27017"
    )
    MONGODB_DB_NAME = os.getenv(
        "MONGODB_DB_NAME",
        "sweet_shop"
    )
else:
    # Production / staging (Render)
    MONGODB_URL = os.getenv("MONGODB_URL")
    MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME")

    if not MONGODB_URL:
        raise RuntimeError("MONGODB_URL is not set in production")

    if not MONGODB_DB_NAME:
        raise RuntimeError("MONGODB_DB_NAME is not set in production")


def get_client() -> AsyncIOMotorClient:
    return AsyncIOMotorClient(MONGODB_URL)


def get_database(client: AsyncIOMotorClient):
    return client[MONGODB_DB_NAME]
