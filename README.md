# Araç Envanter Backend

Araç envanter ve bakım/tamir takip sisteminin NestJS tabanlı REST API uygulamasıdır.

## Özellikler

- Admin kimlik doğrulama
- Şirket ve birim yönetimi
- Araç envanteri ve kilometre geçmişi
- Bakım ve tamir kayıtları
- Kilometre bazlı bakım uyarıları
- E-posta bildirimleri
- Excel raporları
- Fatura ve belge ekleri

## Teknolojiler

- NestJS ve TypeScript
- PostgreSQL
- Prisma ORM
- Swagger
- Jest

## Kurulum

```bash
npm install
copy .env.example .env
npm run prisma:generate
npm run start:dev
```

API varsayılan olarak `http://localhost:3001/api/v1`, Swagger ise `http://localhost:3001/api/docs` adresinde çalışır.

## İlk admin

Veritabanı migration'ları çalıştırıldıktan sonra `.env` dosyasındaki `INITIAL_ADMIN_NAME`, `INITIAL_ADMIN_EMAIL` ve `INITIAL_ADMIN_PASSWORD` değerlerini ayarlayın:

```bash
npm run admin:create-initial
```

Komut yalnızca sistemde hiç admin yokken çalışır. İlk admin oluşturulduktan sonra `INITIAL_ADMIN_PASSWORD` değerini `.env` dosyasından kaldırın.

## Kimlik doğrulama

- `POST /api/v1/auth/login`: E-posta ve şifreyle JWT erişim anahtarı üretir.
- `GET /api/v1/auth/me`: Bearer token ile giriş yapan adminin güvenli profilini döndürür.

Şirket ve birim yönetimi endpoint'leri JWT ile korunur. Güncel istek/yanıt sözleşmeleri Swagger ekranından incelenebilir.

## Kontroller

```bash
npm run prisma:validate
npm run lint
npm test
npm run build
```
