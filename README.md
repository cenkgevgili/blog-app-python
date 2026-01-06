# Minimalist Blog - Python/FastAPI

Modern, minimalist blog uygulaması. FastAPI + Vanilla JS SPA.

## Özellikler

- 🎨 5 tema desteği (Light, Dark, Rose, Ocean, Forest)
- 🔐 JWT tabanlı authentication
- 📝 Markdown destekli blog yazıları
- 🚀 Production-ready (Gunicorn + Uvicorn)
- 🐳 Docker desteği
- ☁️ VPS deployment scriptleri (Oracle Cloud, Cloudflare Tunnel)

## Hızlı Başlangıç

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
