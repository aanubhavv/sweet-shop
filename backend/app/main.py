from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.mongo import get_client, get_database
from app.routes.auth import router as auth_router
from app.routes.sweets import router as sweets_router
from app.routes.inventory import router as inventory_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create MongoDB client on startup
    client = get_client()
    app.state.mongo_client = client
    app.state.db = get_database(client)

    yield  # Application runs here

    # Close MongoDB client on shutdown
    client.close()


app = FastAPI(
    title="Sweet Shop Management System",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Sweet Shop API is running"
    }


# --------------------
# Route registration
# --------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Auth routes: register, login
app.include_router(auth_router)

# Sweets routes: create, list, search, update, delete
app.include_router(sweets_router)

# Inventory router: purchase, restock
app.include_router(inventory_router)