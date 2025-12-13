from fastapi import HTTPException, status, Request
from bson import ObjectId

from app.models.sweet import SweetCreate


class SweetRepository:
    def __init__(self, request: Request):
        self.collection = request.app.state.db["sweets"]

    # -----------------------------
    # Create a new sweet
    # -----------------------------
    async def create(self, sweet: SweetCreate) -> dict:
        sweet_dict = sweet.model_dump()
        result = await self.collection.insert_one(sweet_dict)

        sweet_dict["_id"] = str(result.inserted_id)
        return sweet_dict

    # -----------------------------
    # List all sweets
    # -----------------------------
    async def list_all(self) -> list[dict]:
        sweets = []

        async for sweet in self.collection.find():
            sweet["_id"] = str(sweet["_id"])
            sweets.append(sweet)

        return sweets

    # -----------------------------
    # Purchase a sweet (decrement stock)
    # -----------------------------
    async def purchase(self, sweet_id: str) -> dict:
        sweet = await self.collection.find_one(
            {"_id": ObjectId(sweet_id)}
        )

        if not sweet:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sweet not found",
            )

        if sweet["quantity"] <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sweet is out of stock",
            )

        await self.collection.update_one(
            {"_id": ObjectId(sweet_id)},
            {"$inc": {"quantity": -1}}
        )

        sweet["quantity"] -= 1
        sweet["_id"] = str(sweet["_id"])
        return sweet

    # -----------------------------
    # Restock a sweet (increment stock)
    # -----------------------------
    async def restock(self, sweet_id: str, quantity: int) -> dict:
        if quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than zero",
            )

        result = await self.collection.update_one(
            {"_id": ObjectId(sweet_id)},
            {"$inc": {"quantity": quantity}}
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sweet not found",
            )

        sweet = await self.collection.find_one(
            {"_id": ObjectId(sweet_id)}
        )

        sweet["_id"] = str(sweet["_id"])
        return sweet
