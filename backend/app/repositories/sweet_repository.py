from fastapi import HTTPException, status, Request
from bson import ObjectId
from typing import Optional

from app.models.sweet import SweetCreate


class SweetRepository:
    def __init__(self, request: Request):
        self.collection = request.app.state.db["sweets"]

    # -----------------------------
    # Create Sweet
    # -----------------------------
    async def create(self, sweet: SweetCreate) -> dict:
        data = sweet.model_dump()
        result = await self.collection.insert_one(data)
        data["_id"] = str(result.inserted_id)
        return data

    # -----------------------------
    # List All Sweets
    # -----------------------------
    async def list_all(self) -> list[dict]:
        sweets = []
        async for sweet in self.collection.find():
            sweet["_id"] = str(sweet["_id"])
            sweets.append(sweet)
        return sweets

    # -----------------------------
    # Search Sweets
    # -----------------------------
    async def search(
        self,
        name: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> list[dict]:
        query: dict = {}

        if name:
            query["name"] = {"$regex": name, "$options": "i"}

        if category:
            query["category"] = category

        if min_price is not None or max_price is not None:
            query["price"] = {}
            if min_price is not None:
                query["price"]["$gte"] = min_price
            if max_price is not None:
                query["price"]["$lte"] = max_price

        sweets = []
        async for sweet in self.collection.find(query):
            sweet["_id"] = str(sweet["_id"])
            sweets.append(sweet)

        return sweets

    # -----------------------------
    # Purchase Sweet
    # -----------------------------
    async def purchase(self, sweet_id: str) -> dict:
        sweet = await self.collection.find_one({"_id": ObjectId(sweet_id)})

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
            {"$inc": {"quantity": -1}},
        )

        sweet["quantity"] -= 1
        sweet["_id"] = str(sweet["_id"])
        return sweet

    # -----------------------------
    # Restock Sweet
    # -----------------------------
    async def restock(self, sweet_id: str, quantity: int) -> dict:
        if quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Quantity must be greater than zero",
            )

        result = await self.collection.update_one(
            {"_id": ObjectId(sweet_id)},
            {"$inc": {"quantity": quantity}},
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sweet not found",
            )

        sweet = await self.collection.find_one({"_id": ObjectId(sweet_id)})
        sweet["_id"] = str(sweet["_id"])
        return sweet
