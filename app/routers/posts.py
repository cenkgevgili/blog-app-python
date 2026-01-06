from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional
from app.database import get_db
from app.models import User, Post, Tag
from app.schemas import PostCreate, PostUpdate, PostResponse, PostListResponse
from app.auth import get_current_user, require_auth
from app.utils import slugify, calculate_read_time, generate_excerpt

router = APIRouter(prefix="/api/posts", tags=["posts"])

async def get_or_create_tags(db: AsyncSession, tag_names: list[str]) -> list[Tag]:
    tags = []
    for name in tag_names:
        result = await db.execute(select(Tag).where(Tag.name == name))
        tag = result.scalar_one_or_none()
        if not tag:
            tag = Tag(name=name)
            db.add(tag)
        tags.append(tag)
    return tags

@router.get("", response_model=list[PostListResponse])
async def list_posts(
    featured: Optional[bool] = None,
    tag: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Post).options(selectinload(Post.author), selectinload(Post.tags))
    
    if featured is not None:
        query = query.where(Post.featured == featured)
    if tag:
        query = query.join(Post.tags).where(Tag.name == tag)
    
    query = query.order_by(Post.created_at.desc())
    result = await db.execute(query)
    return [PostListResponse.model_validate(p) for p in result.scalars().all()]

@router.get("/{slug}", response_model=PostResponse)
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.author), selectinload(Post.tags))
        .where(Post.slug == slug)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    return PostResponse.model_validate(post)

@router.post("", response_model=PostResponse, status_code=201)
async def create_post(
    data: PostCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_auth)
):
    slug = slugify(data.title)
    
    # Check unique slug
    result = await db.execute(select(Post).where(Post.slug == slug))
    if result.scalar_one_or_none():
        slug = f"{slug}-{user.id}"
    
    post = Post(
        slug=slug,
        title=data.title,
        excerpt=data.excerpt or generate_excerpt(data.content),
        content=data.content,
        featured=data.featured,
        read_time=calculate_read_time(data.content),
        author_id=user.id
    )
    
    if data.tags:
        post.tags = await get_or_create_tags(db, data.tags)
    
    db.add(post)
    await db.commit()
    await db.refresh(post, ["author", "tags"])
    return PostResponse.model_validate(post)

@router.put("/{slug}", response_model=PostResponse)
async def update_post(
    slug: str,
    data: PostUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_auth)
):
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.tags))
        .where(Post.slug == slug)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    if post.author_id != user.id:
        raise HTTPException(status_code=403, detail="Bu yazıyı düzenleme yetkiniz yok")
    
    if data.title:
        post.title = data.title
        post.slug = slugify(data.title)
    if data.content:
        post.content = data.content
        post.read_time = calculate_read_time(data.content)
        if not data.excerpt:
            post.excerpt = generate_excerpt(data.content)
    if data.excerpt is not None:
        post.excerpt = data.excerpt
    if data.featured is not None:
        post.featured = data.featured
    if data.tags is not None:
        post.tags = await get_or_create_tags(db, data.tags)
    
    await db.commit()
    await db.refresh(post, ["author", "tags"])
    return PostResponse.model_validate(post)

@router.delete("/{slug}", status_code=204)
async def delete_post(
    slug: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_auth)
):
    result = await db.execute(select(Post).where(Post.slug == slug))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(status_code=404, detail="Yazı bulunamadı")
    if post.author_id != user.id:
        raise HTTPException(status_code=403, detail="Bu yazıyı silme yetkiniz yok")
    
    await db.delete(post)
    await db.commit()
