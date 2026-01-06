# Minimalist Blog - Python/FastAPI

Modern, minimalist blog uygulaması. FastAPI + Vanilla JS SPA.

## 🌐 Demo

**GitHub Pages:** [https://USERNAME.github.io/blog-app-python](https://USERNAME.github.io/blog-app-python)

> GitHub Pages'de localStorage ile çalışır (demo mode). VPS'de gerçek veritabanı kullanır.

## Özellikler

- 🎨 5 tema desteği (Light, Dark, Rose, Ocean, Forest)
- 🔐 JWT tabanlı authentication
- 📝 Rich Text Editor (WYSIWYG)
- 🚀 Production-ready (Gunicorn + Uvicorn)
- 🐳 Docker desteği
- ☁️ VPS deployment scriptleri (Oracle Cloud, Cloudflare Tunnel)
- 📴 **Dual-Mode:** Backend olmadan da çalışır (GitHub Pages, Netlify, Vercel)

## Deployment Seçenekleri

### 1. GitHub Pages (Statik - Demo Mode)

Backend gerektirmez, localStorage kullanır:

```bash
# GitHub repo oluştur ve push et
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/blog-app-python.git
git push -u origin main

# GitHub Settings > Pages > Source: main branch
```

### 2. Netlify / Vercel (Statik - Demo Mode)

1. GitHub'a push et
2. Netlify/Vercel'de repo'yu bağla
3. Build command: (boş bırak)
4. Publish directory: `.` (root)

### 3. VPS (Full Mode - Gerçek Veritabanı)

Aşağıdaki "Production Deployment" bölümüne bak.

---

## Hızlı Başlangıç (Local Development)

```bash
# Virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıklar
pip install -r requirements.txt

# Environment
cp .env.example .env

# Çalıştır
python run.py
```

Tarayıcıda: http://localhost:8000

## Production Deployment

### Docker ile

```bash
docker-compose up -d --build
```

### Oracle Cloud Free Tier

```bash
chmod +x deploy/oracle-cloud.sh
./deploy/oracle-cloud.sh
```

### Cloudflare Tunnel

```bash
chmod +x deploy/cloudflare-tunnel.sh
./deploy/cloudflare-tunnel.sh
```

### Systemd Service (Manuel)

```bash
sudo cp deploy/systemd/blog-app.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable blog-app
sudo systemctl start blog-app
```

## API Endpoints

| Method | Endpoint           | Açıklama          |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Kayıt             |
| POST   | /api/auth/login    | Giriş             |
| GET    | /api/auth/me       | Kullanıcı bilgisi |
| GET    | /api/posts         | Tüm yazılar       |
| GET    | /api/posts/{slug}  | Tek yazı          |
| POST   | /api/posts         | Yazı oluştur      |
| PUT    | /api/posts/{slug}  | Yazı güncelle     |
| DELETE | /api/posts/{slug}  | Yazı sil          |
| GET    | /api/health        | Health check      |

## Proje Yapısı

```
blog-app-python/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app
│   ├── config.py        # Settings
│   ├── database.py      # SQLAlchemy async
│   ├── models.py        # DB models
│   ├── schemas.py       # Pydantic schemas
│   ├── auth.py          # JWT auth
│   ├── utils.py         # Helpers
│   └── routers/
│       ├── auth.py
│       └── posts.py
├── static/
│   ├── css/
│   └── js/
├── templates/
├── deploy/
│   ├── cloudflare-tunnel.sh
│   ├── oracle-cloud.sh
│   └── systemd/
├── docker-compose.yml
├── Dockerfile
├── gunicorn.conf.py
├── nginx.conf
├── requirements.txt
└── run.py
```

## Lisans

MIT
