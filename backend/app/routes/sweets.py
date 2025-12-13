from fastapi import APIRouter, Depends, Request, status

from app.models.sweet import SweetCreate
from app.repositories.sweet_repository import SweetRepository
from app.core.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/sweets", tags=["Sweets"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_sweet(
    sweet: SweetCreate,
    request: Request,
    user=Depends(require_admin),
):
    repo = SweetRepository(request)
    return await repo.create(sweet)


@router.get("")
async def list_sweets(
    request: Request,
    user=Depends(get_current_user),
):
    repo = SweetRepository(request)
    return await repo.list_all()
