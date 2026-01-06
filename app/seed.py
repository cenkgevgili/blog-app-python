"""Seed database with initial data."""
from sqlalchemy import select
from app.database import async_session
from app.models import User, Post, Tag
from app.auth import hash_password

DEMO_POSTS = [
    {
        "title": "Tasarımda Minimalizm: Az Çoktur",
        "slug": "tasarimda-minimalizm",
        "excerpt": "Minimalist tasarım felsefesi, gereksiz öğeleri ortadan kaldırarak özün ön plana çıkmasını sağlar.",
        "content": """Minimalizm, sadece bir tasarım trendi değil, bir düşünce biçimidir. Her öğenin bir amacı olmalı, yoksa orada bulunmamalıdır.

## Temel Prensipler

### 1. Beyaz Alan Kullanımı
Beyaz alan (negative space), tasarımın nefes almasını sağlar. Öğeler arasındaki boşluk, görsel hiyerarşiyi güçlendirir.

### 2. Tipografi Odaklı Tasarım
Güçlü tipografi, görsel öğelere olan ihtiyacı azaltır. Doğru font seçimi ve boyutlandırma, mesajınızı net bir şekilde iletir.

### 3. Renk Paleti Sınırlaması
İki veya üç renk yeterlidir. Sınırlı palet, tutarlılık ve sofistike bir görünüm sağlar.

## Sonuç
Minimalizm, karmaşıklığı azaltarak kullanıcı deneyimini iyileştirir. Unutmayın: Her piksel bir amaç taşımalı.""",
        "tags": ["Tasarım", "UX", "Minimalizm"],
        "featured": True,
        "read_time": "5 dk"
    },
    {
        "title": "React Server Components Derinlemesine",
        "slug": "react-server-components",
        "excerpt": "RSC, React ekosisteminde devrim niteliğinde bir yenilik. Server ve client arasındaki sınırları yeniden tanımlıyor.",
        "content": """React Server Components (RSC), modern web geliştirmede paradigma değişikliği yaratıyor.

## Neden RSC?

- **Daha küçük bundle boyutu**: Server componentleri client'a gönderilmez
- **Doğrudan veritabanı erişimi**: API katmanına gerek kalmadan
- **Streaming**: Progressive rendering ile daha hızlı FCP

## Kullanım Alanları

Server Components, veri çekme ve statik içerik için idealdir. Client Components ise interaktif öğeler için kullanılmalıdır.

## Sonuç
RSC, performans ve geliştirici deneyimini bir üst seviyeye taşıyor.""",
        "tags": ["React", "Next.js", "Performance"],
        "featured": False,
        "read_time": "8 dk"
    },
    {
        "title": "TypeScript İpuçları ve Püf Noktaları",
        "slug": "typescript-tips",
        "excerpt": "Günlük geliştirmede işinize yarayacak TypeScript teknikleri ve best practice'ler.",
        "content": """TypeScript, JavaScript'e tip güvenliği katarak daha sağlam kod yazmamızı sağlar.

## Utility Types

### Partial<T>
Tüm property'leri opsiyonel yapar.

### Pick<T, K>
Belirli property'leri seçer.

### Omit<T, K>
Belirli property'leri hariç tutar.

## Generic Kullanımı

Generics, yeniden kullanılabilir ve tip-güvenli kod yazmanın anahtarıdır.

## Sonuç
TypeScript'i etkili kullanmak, kod kalitesini dramatik şekilde artırır.""",
        "tags": ["TypeScript", "JavaScript", "Tips"],
        "featured": False,
        "read_time": "6 dk"
    },
    {
        "title": "Tailwind CSS Best Practices",
        "slug": "tailwind-best-practices",
        "excerpt": "Tailwind CSS ile temiz, sürdürülebilir ve performanslı stil yazmanın yolları.",
        "content": """Tailwind, utility-first yaklaşımıyla CSS yazma şeklimizi değiştirdi.

## Organizasyon

### Component Extraction
Tekrar eden pattern'leri component'lere çıkarın.

### @apply Kullanımı
Sadece gerçekten gerektiğinde kullanın. Çoğu durumda utility class'lar yeterlidir.

## Performance

- PurgeCSS ile kullanılmayan stilleri temizleyin
- JIT mode ile development hızını artırın

## Sonuç
Tailwind, doğru kullanıldığında hem hızlı geliştirme hem de küçük bundle boyutu sağlar.""",
        "tags": ["CSS", "Tailwind", "Frontend"],
        "featured": False,
        "read_time": "4 dk"
    }
]

async def seed_database():
    """Seed the database with demo data."""
    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(select(Post))
        if result.scalars().first():
            print("Database already seeded.")
            return
        
        # Create demo user
        demo_user = User(
            name="Demo Yazar",
            email="demo@blog.com",
            hashed_password=hash_password("demo123"),
            provider="email"
        )
        db.add(demo_user)
        await db.flush()
        
        # Create tags and posts
        tag_cache = {}
        for post_data in DEMO_POSTS:
            # Get or create tags
            post_tags = []
            for tag_name in post_data["tags"]:
                if tag_name not in tag_cache:
                    tag = Tag(name=tag_name)
                    db.add(tag)
                    await db.flush()
                    tag_cache[tag_name] = tag
                post_tags.append(tag_cache[tag_name])
            
            # Create post
            post = Post(
                title=post_data["title"],
                slug=post_data["slug"],
                excerpt=post_data["excerpt"],
                content=post_data["content"],
                featured=post_data["featured"],
                read_time=post_data["read_time"],
                author_id=demo_user.id,
                tags=post_tags
            )
            db.add(post)
        
        await db.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed_database())
