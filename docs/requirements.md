# Proje Gereksinimleri

## Amaç

Sistem tek bir iş yerindeki üç şirkete bağlı araçların envanter, kilometre, bakım ve tamir kayıtlarını yönetir. Yalnızca yetkili adminler kullanır. İlk sürüm canlı GPS takibi içermez.

## Araç alanları

- Plaka, marka, model, model yılı ve araç türü
- Güncel kilometre
- Araç sahibi türü: kişi veya şirket
- Ruhsat sahibi kişi veya şirket
- Bağlı olduğu şirket ve aracı kullanan birim
- HGS durumu: var veya yok
- Son bakım kilometresi ve sonraki bakım kilometresi
- Açıklama/not

Şasi numarası, motor numarası ve aktif/serviste/kullanım dışı durumu tutulmaz.

## Bakım ve tamir alanları

- Araç ve işlem türü: bakım veya tamir
- İşlem tarihi ve işlem sırasındaki kilometre
- Yapılan işlemler ve değiştirilen parçalar
- Servis veya usta
- Toplam maliyet
- Açıklama/not
- Fatura veya belge
- Sonraki bakım kilometresi

İşçilik ve parça maliyetleri ayrı tutulmaz. Sonraki bakım tarihi bulunmaz. Sonraki bakım kilometresi tamir kayıtlarında zorunlu değildir.

## Uyarılar ve raporlar

- Normal, yaklaşan ve gecikmiş bakım durumları kilometre üzerinden hesaplanır.
- Sistem içi uyarı ve e-posta bildirimi oluşturulur.
- Tekrarlı e-posta gönderimleri bildirim geçmişiyle engellenir.
- Envanter, bakım, tamir, maliyet, değiştirilen parça ve bakım durumu raporları Excel'e aktarılır.

## Yetki

- Dışarıdan üyelik yoktur.
- Admin; şirket, birim, araç, kilometre, servis kaydı, bildirim ayarı ve raporları yönetir.

