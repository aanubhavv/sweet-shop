from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/protected", tags=["Protected"])


@router.get("/user")
async def protected_user(user=Depends(get_current_user)):
    return {
        "message": "Hello user",
        "user": user,
    }


@router.get("/admin")
async def protected_admin(user=Depends(require_admin)):
    return {
        "message": "Hello admin",
        "user": user,
    }
