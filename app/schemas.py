from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# ============ Auth ============
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    avatar: Optional[str] = None
    provider: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ============ Tags ============
class TagBase(BaseModel):
    name: str

class TagResponse(TagBase):
    id: int
    class Config:
        from_attributes = True

# ============ Posts ============
class PostCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    excerpt: Optional[str] = None
    content: str = Field(..., min_length=1)
    tags: list[str] = []
    featured: bool = False

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    excerpt: Optional[str] = None
    content: Optional[str] = Field(None, min_length=10)
    tags: Optional[list[str]] = None
    featured: Optional[bool] = None

class PostResponse(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: Optional[str]
    content: str
    featured: bool
    read_time: str
    created_at: datetime
    updated_at: datetime
    author: UserResponse
    tags: list[TagResponse]
    
    class Config:
        from_attributes = True

class PostListResponse(BaseModel):
    id: int
    slug: str
    title: str
    excerpt: Optional[str]
    featured: bool
    read_time: str
    created_at: datetime
    author: UserResponse
    tags: list[TagResponse]
    
    class Config:
        from_attributes = True
