from fastapi import Request
from bson import ObjectId

from app.models.sweet import SweetCreate


class SweetRepository:
    def __init__(self, request: Request):
        self.collection = request.app.state.db["sweets"]

    async def create(self, sweet: SweetCreate):
        sweet_dict = sweet.model_dump()
        result = await self.collection.insert_one(sweet_dict)
        sweet_dict["_id"] = str(result.inserted_id)
        return sweet_dict

    async def list_all(self):
        sweets = []
        async for sweet in self.collection.find():
            sweet["_id"] = str(sweet["_id"])
            sweets.append(sweet)
        return sweets
