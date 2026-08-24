# API Taslağı

Tüm uç noktalar `/api/v1` altında sürümlenir.

## Planlanan kaynaklar

- `POST /auth/login` — admin girişi
- `GET /auth/me` — aktif admin profili
- `/admins`
- `/companies`
- `/units`
- `/vehicles`
- `/vehicles/:vehicleId/mileage-records`
- `/service-records`
- `/maintenance-alerts`
- `/notifications`
- `/reports`

API hata yanıtları tutarlı bir kod, Türkçe kullanıcı mesajı ve gerektiğinde alan bazlı doğrulama ayrıntıları döndürür.

## Kimlik doğrulama

Korumalı uç noktalar `Authorization: Bearer <token>` başlığı bekler. JWT içindeki admin kimliği her istekte veritabanındaki aktif hesapla doğrulanır. Parola hash'i hiçbir API yanıtına dahil edilmez.
