# Mimari

## Genel yapı

Proje backend ve frontend olarak ayrılır. Backend modüler monolit olarak geliştirilir.

```text
HTTP Request
    -> Route / Controller
    -> Application Service
    -> Repository
    -> PostgreSQL
```

## Backend modülleri

- auth
- admins
- companies
- units
- vehicles
- mileage-records
- service-records
- notifications
- reports
- attachments

Her modül kendi controller, service, repository, DTO/validation ve testlerini barındırır. Modüller doğrudan birbirlerinin veritabanı detaylarına bağımlı olmaz.

## Güvenlik

- Parolalar düz metin saklanmaz.
- Parolalar Argon2 ile hashlenir.
- Korumalı API uç noktaları kısa ömürlü JWT Bearer token kullanır.
- Gizli anahtarlar ortam değişkenlerinden okunur.
- Gerçek şirket verileri kaynak kod deposunda tutulmaz.
- Yüklenen belgeler herkese açık klasörlerde saklanmaz.
- Admin işlemleri denetlenebilir biçimde kaydedilir.
