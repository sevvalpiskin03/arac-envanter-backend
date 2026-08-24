# Veritabanı Tasarımı

## Temel tablolar

| Tablo | Sorumluluk |
|---|---|
| `admins` | Admin hesapları |
| `companies` | Sistemdeki şirketler |
| `units` | Şirketlere bağlı birimler |
| `vehicles` | Araç envanteri ve güncel bakım değerleri |
| `mileage_records` | Araç kilometre değişim geçmişi |
| `service_records` | Bakım ve tamir işlemleri |
| `replaced_parts` | İşlemde değiştirilen parçalar |
| `attachments` | Fatura ve servis belgeleri |
| `notification_settings` | Bakım uyarı ve e-posta tercihleri |
| `notification_logs` | Gönderilmiş bildirimlerin geçmişi |

## İlişkiler

```text
Company 1 --- N Unit
Company 1 --- N Vehicle
Unit    1 --- N Vehicle
Vehicle 1 --- N MileageRecord
Vehicle 1 --- N ServiceRecord
ServiceRecord 1 --- N ReplacedPart
ServiceRecord 1 --- N Attachment
Vehicle 1 --- N NotificationLog
```

Bakım ve tamir tek `service_records` tablosunda bir işlem türüyle ayrılır. Para değerleri kayan noktalı sayı yerine hassas ondalık değer olarak saklanır.

