from sqlalchemy.orm import Session
from . import models, schemas, auth

# --- User CRUD ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Asset CRUD ---
def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()

def get_asset_by_ticker(db: Session, ticker_symbol: str):
    return db.query(models.Asset).filter(models.Asset.ticker_symbol == ticker_symbol).first()

def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(**asset.model_dump())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

# --- AssetPrice CRUD ---
def get_prices_by_asset_id(db: Session, asset_id: int):
    return db.query(models.AssetPrice).filter(models.AssetPrice.asset_id == asset_id).all()

def create_asset_price(db: Session, price: schemas.AssetPriceCreate, asset_id: int):
    db_price = models.AssetPrice(**price.model_dump(), asset_id=asset_id)
    db.add(db_price)
    db.commit()
    db.refresh(db_price)
    return db_price
