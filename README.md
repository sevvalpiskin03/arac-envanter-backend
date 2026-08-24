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

## Kontroller

```bash
npm run prisma:validate
npm run lint
npm test
npm run build
```

