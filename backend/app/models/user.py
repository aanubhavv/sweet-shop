from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId


class UserBase(BaseModel):
    email: EmailStr
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserInDB(UserBase):
    id: Optional[str] = Field(alias="_id")
    hashed_password: str
