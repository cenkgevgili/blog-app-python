from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.auth import hash_password, verify_password, create_access_token, require_auth

router = APIRouter(prefix="/api/auth", tags=["auth"])

class OAuthDemoRequest(BaseModel):
    provider: str
    email: str
    name: str

@router.post("/register", response_model=Token)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")
    
    user = User(
        email=data.email,
        name=data.name,
        hashed_password=hash_password(data.password),
        provider="email"
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    token = create_access_token({"sub": user.id})
    return Token(access_token=token, user=UserResponse.model_validate(user))

@router.post("/oauth-demo", response_model=Token)
async def oauth_demo_login(data: OAuthDemoRequest, db: AsyncSession = Depends(get_db)):
    """Demo OAuth login - creates or finds user and returns real JWT token."""
    # Check if user exists
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    
    if not user:
        # Create new OAuth demo user (no password needed)
        user = User(
            email=data.email,
            name=data.name,
            hashed_password="",  # OAuth users don't have passwords
            provider=data.provider
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    # Generate real JWT token
    token = create_access_token({"sub": user.id})
    return Token(access_token=token, user=UserResponse.model_validate(user))

@router.post("/login", response_model=Token)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    token = create_access_token({"sub": user.id})
    return Token(access_token=token, user=UserResponse.model_validate(user))

@router.get("/me", response_model=UserResponse)
async def get_me(user: User = Depends(require_auth)):
    return UserResponse.model_validate(user)
