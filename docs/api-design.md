# API Taslağı

Tüm uç noktalar `/api/v1` altında sürümlenir.

## Planlanan kaynaklar

- `POST /auth/login` — admin girişi
- `GET /auth/me` — aktif admin profili
- `/admins`
- `GET /companies` — şirketleri listeler
- `GET /companies/:id` — şirket detayını getirir
- `POST /companies` — şirket oluşturur
- `PATCH /companies/:id` — şirketi günceller
- `GET /companies/:companyId/units` — şirket birimlerini listeler
- `POST /companies/:companyId/units` — şirkete birim ekler
- `GET /units/:id` — birim detayını getirir
- `PATCH /units/:id` — birimi günceller
- `GET /vehicles` — araçları arama, şirket, birim, HGS ve bakım durumuna göre filtreler
- `GET /vehicles/:id` — araç detayını getirir
- `POST /vehicles` — envantere araç ekler
- `PATCH /vehicles/:id` — araç bilgilerini günceller
- `/vehicles/:vehicleId/mileage-records`
- `/service-records`
- `/maintenance-alerts`
- `/notifications`
- `/reports`

API hata yanıtları tutarlı bir kod, Türkçe kullanıcı mesajı ve gerektiğinde alan bazlı doğrulama ayrıntıları döndürür.

## Kimlik doğrulama

Korumalı uç noktalar `Authorization: Bearer <token>` başlığı bekler. JWT içindeki admin kimliği her istekte veritabanındaki aktif hesapla doğrulanır. Parola hash'i hiçbir API yanıtına dahil edilmez.
