from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.db.mongo import get_client, get_database
from app.routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    client = get_client()
    app.state.mongo_client = client
    app.state.db = get_database(client)
    yield
    client.close()


app = FastAPI(
    title="Sweet Shop Management System",
    version="1.0.0",
    lifespan=lifespan
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Sweet Shop API is running"
    }


app.include_router(auth_router)
