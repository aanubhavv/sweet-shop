import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()  # 🔥 REQUIRED

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "sweet_shop")


def get_client():
    return AsyncIOMotorClient(MONGO_URI)


def get_database(client: AsyncIOMotorClient):
    return client[DB_NAME]
