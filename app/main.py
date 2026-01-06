from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.config import get_settings
from app.database import init_db
from app.routers import auth, posts

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    # Seed demo data
    from app.seed import seed_database
    await seed_database()
    yield

app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files & Templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# API Routes
app.include_router(auth.router)
app.include_router(posts.router)

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "app": settings.app_name}

# Frontend routes (SPA fallback)
@app.get("/", response_class=HTMLResponse)
@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_spa(request: Request, path: str = ""):
    # API routes handled above
    if path.startswith("api/") or path.startswith("static/"):
        return None
    return templates.TemplateResponse("index.html", {"request": request})
