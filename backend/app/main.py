from fastapi import FastAPI
from app.db.mongo import client

app = FastAPI(
    title="Sweet Shop Management System",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_db_client():
    # Trigger MongoDB connection
    client.server_info()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Sweet Shop API is running"
    }
