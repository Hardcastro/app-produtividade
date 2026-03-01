from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

# --- Asset Price Schemas ---
class AssetPriceBase(BaseModel):
    date: date
    close_price: float

class AssetPriceCreate(AssetPriceBase):
    pass

class AssetPrice(AssetPriceBase):
    id: int
    asset_id: int

    class Config:
        from_attributes = True

# --- Asset Schemas ---
class AssetBase(BaseModel):
    ticker_symbol: str
    name: str

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    prices: List[AssetPrice] = []

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
