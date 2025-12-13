from fastapi import APIRouter, HTTPException, Request, status
from app.models.user import UserCreate
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, request: Request):
    service = AuthService(request)
    return await service.register_user(user)


@router.post("/login")
async def login(data: dict, request: Request):
    service = AuthService(request)
    token = await service.login_user(data["email"], data["password"])
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token, "token_type": "bearer"}
