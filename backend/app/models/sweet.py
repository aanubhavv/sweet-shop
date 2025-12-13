from pydantic import BaseModel, Field
from typing import Optional


class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int


class SweetCreate(SweetBase):
    pass


class SweetInDB(SweetBase):
    id: Optional[str] = Field(alias="_id")
