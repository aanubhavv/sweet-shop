from fastapi import FastAPI

app = FastAPI(
    title="Sweet Shop Management System",
    version="1.0.0"
)

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Sweet Shop API is running"
    }
