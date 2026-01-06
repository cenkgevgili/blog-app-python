from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# Many-to-many: posts <-> tags
post_tags = Table(
    "post_tags", Base.metadata,
    Column("post_id", Integer, ForeignKey("posts.id", ondelete="CASCADE")),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar = Column(String(500), nullable=True)
    provider = Column(String(50), default="email")  # email, google, microsoft, x
    created_at = Column(DateTime, default=datetime.utcnow)
    
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    excerpt = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    featured = Column(Boolean, default=False)
    read_time = Column(String(20), default="5 dk")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    author = relationship("User", back_populates="posts")
    tags = relationship("Tag", secondary=post_tags, back_populates="posts")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    
    posts = relationship("Post", secondary=post_tags, back_populates="tags")
