from fastapi import (
    APIRouter,
    Depends,
    Request,
    HTTPException,
    status,
)

from app.models.sweet import SweetCreate
from app.repositories.sweet_repository import SweetRepository
from app.core.dependencies import get_current_user, require_admin

router = APIRouter(
    prefix="/api/sweets",
    tags=["Sweets"],
)

# -----------------------------
# Create Sweet (ADMIN)
# -----------------------------
@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_sweet(
    sweet: SweetCreate,
    request: Request,
    user=Depends(require_admin),
):
    repo = SweetRepository(request)
    return await repo.create(sweet)


# -----------------------------
# List All Sweets (AUTH)
# -----------------------------
@router.get("")
async def list_sweets(
    request: Request,
    user=Depends(get_current_user),
):
    repo = SweetRepository(request)
    return await repo.list_all()


# -----------------------------
# Search Sweets (AUTH)
# -----------------------------
@router.get("/search")
async def search_sweets(
    request: Request,
    name: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    user=Depends(get_current_user),
):
    repo = SweetRepository(request)
    return await repo.search(name, category, min_price, max_price)


# -----------------------------
# Purchase Sweet (AUTH)
# -----------------------------
@router.post("/{sweet_id}/purchase")
async def purchase_sweet(
    sweet_id: str,
    request: Request,
    user=Depends(get_current_user),
):
    repo = SweetRepository(request)
    return await repo.purchase(sweet_id)


# -----------------------------
# Restock Sweet (ADMIN)
# -----------------------------
@router.post("/{sweet_id}/restock")
async def restock_sweet(
    sweet_id: str,
    data: dict,
    request: Request,
    user=Depends(require_admin),
):
    quantity = data.get("quantity", 0)

    if quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than zero",
        )

    repo = SweetRepository(request)
    return await repo.restock(sweet_id, quantity)

@router.put("/{sweet_id}")
async def update_sweet(
    sweet_id: str,
    data: dict,
    request: Request,
    user=Depends(require_admin),
):
    repo = SweetRepository(request)
    return await repo.update(sweet_id, data)


@router.delete("/{sweet_id}")
async def delete_sweet(
    sweet_id: str,
    request: Request,
    user=Depends(require_admin),
):
    repo = SweetRepository(request)
    await repo.delete(sweet_id)
    return {"message": "Sweet deleted successfully"}
