from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, date
from typing import List

from . import auth, crud, models, schemas
from .database import SessionLocal, engine, get_db

# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Asset Management API")

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    # Check if a user already exists
    user = crud.get_user_by_email(db, email="test@example.com")
    if not user:
        print("Creating initial data...")
        # Create a test user
        user_in = schemas.UserCreate(email="test@example.com", password="string")
        user = crud.create_user(db, user_in)
        print(f"User 'test@example.com' created with password 'string'")
        
        # Check if assets exist
        asset_aapl = crud.get_asset_by_ticker(db, ticker_symbol="AAPL")
        if not asset_aapl:
            asset_aapl = crud.create_asset(db, schemas.AssetCreate(ticker_symbol="AAPL", name="Apple Inc."))
            crud.create_asset_price(db, schemas.AssetPriceCreate(date=date(2023, 10, 1), close_price=170.0), asset_id=asset_aapl.id)
            crud.create_asset_price(db, schemas.AssetPriceCreate(date=date(2023, 10, 2), close_price=172.5), asset_id=asset_aapl.id)
            print("Created asset AAPL with prices.")

        asset_goog = crud.get_asset_by_ticker(db, ticker_symbol="GOOGL")
        if not asset_goog:
            asset_goog = crud.create_asset(db, schemas.AssetCreate(ticker_symbol="GOOGL", name="Alphabet Inc."))
            crud.create_asset_price(db, schemas.AssetPriceCreate(date=date(2023, 10, 1), close_price=135.0), asset_id=asset_goog.id)
            crud.create_asset_price(db, schemas.AssetPriceCreate(date=date(2023, 10, 2), close_price=136.2), asset_id=asset_goog.id)
            print("Created asset GOOGL with prices.")
    else:
        print("Initial data already exists.")
    db.close()

@app.post("/auth/token", response_model=schemas.Token)
def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/assets/", response_model=List[schemas.Asset])
def read_assets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    assets = crud.get_assets(db, skip=skip, limit=limit)
    return assets

@app.get("/api/prices/{ticker_symbol}", response_model=List[schemas.AssetPrice])
def read_asset_prices(ticker_symbol: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_asset = crud.get_asset_by_ticker(db, ticker_symbol=ticker_symbol)
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    prices = crud.get_prices_by_asset_id(db, asset_id=db_asset.id)
    return prices

@app.get("/")
def read_root():
    return {"message": "Welcome to the Asset Management API. See /docs for documentation."}
