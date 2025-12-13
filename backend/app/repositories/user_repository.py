from fastapi import Request
from app.models.user import UserCreate
from app.core.security import hash_password


class UserRepository:
    def __init__(self, request: Request):
        self.collection = request.app.state.db["users"]

    async def create_user(self, user: UserCreate):
        user_dict = user.model_dump()
        user_dict["hashed_password"] = hash_password(user_dict.pop("password"))

        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        return user_dict
