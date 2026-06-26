# HakkımVar — Neden Bu Projeyi Yapmalıyız?

## Önce bir düşünce deneyi

Şu an Türkiye'de kirada oturanların sayısı 40 milyonun üzerinde. Bu insanların büyük çoğunluğu en az bir kez şu soruyu sormak zorunda kalmış:

> "Ev sahibim kirayı bu kadar artırabilir mi? Bu yasal mı?"

Cevabı bilen var mı? Pek yok. Çünkü mevzuat son 3 yılda 4 kez değişti, her değişiklikte ev sahipleri farklı bir şey iddia etti ve kiracılar doğruyu öğrenmek için ya avukata gitmek (₺3.000–10.000 tek seferlik danışmanlık) ya da forum postlarında çelişkili yorumlara bakmak zorunda kaldı.

Sonuç? Binlerce kişi yasadışı artışı kabullendi — sadece ne yapacağını bilmediği için.

**Biz bu boşluğu kapatıyoruz.**

## Problem: Hem Büyük, Hem Kişisel

İstanbul'da kira son 3 yılda ortalama %400 arttı. Türkiye'de bu dönemde kiracı ile ev sahibi arasındaki anlaşmazlık sayısı kayıt kıracak seviyelere ulaştı. Adli yardım bürolarında 6–8 aylık bekleme listesi oluştu. Ama daha da önemlisi:

**Bu sorun jürinin tamamı tarafından şahsen yaşanmış ya da birinci elden gözlemlenmiş bir sorun.**

Bunu söylüyorum çünkü bir projede "pazar büyük" demek ile "bu odadaki herkesin tanıdığı birinin başına geldi" demek çok farklı şeyler. HakkımVar ikinci kategoride.

## Ne Yapıyor?

Kiracı, telefonu ya da bilgisayarından kira sözleşmesinin fotoğrafını yüklüyor. Sistem 20–30 saniye içinde şunları yapıyor:

- Sözleşmedeki her maddeyi okuyup yasaya aykırı olanları işaretliyor — *"Bu madde Türk Borçlar Kanunu'nun 340. maddesine aykırıdır"* gibi spesifik atıflarla.
- Ev sahibinin talep ettiği artış oranını alıyor, o ay için geçerli yasal tavanı (TÜFE baz alınarak) hesaplıyor ve fazla talep edilen miktarı gösteriyor.
- Bir düğmeye basılınca noter formatında, yasal olarak geçerli ihtarname üretiyor — sadece imzalanıp gönderilmesi yeterli.
- *"15 gün içinde cevap vermezse ne olur?"* gibi kritik tarihleri takip ediyor, hatırlatma gönderiyor.

> **Önemli bir not:** Sistem hukuki tavsiye vermiyor, hukuki bilgi veriyor. Bu ayrım hem etik hem de yasal açıdan kritik, hem de ürünü daha hızlı geliştirip piyasaya sürmemizi sağlıyor.

## Yarışmada Neden Kazanır?

Bootcamp'in puanlama sistemine bakınca bu projenin neden öne çıktığı netleşiyor.

### En ağır kriter: AI model seçimi ve kullanımı (20 puan)

Bu projede 4 farklı modeli 4 farklı sebepten kullanıyoruz:

1. Sözleşme fotoğrafını okumak için görsel anlama kapasitesi yüksek bir model lazım
2. Hukuki muhakeme için kesin ve alıntılı analiz yapan, "belki" demeye alışık bir model lazım
3. Günlük konuşma arayüzü için ucuz ve hızlı çalışan bir model lazım
4. Belge sınıflandırması (bu tahliye bildirimi mi, zam talebi mi?) için Türkçe'ye uyarlanmış küçük bir model lazım

Her modelin seçiminin gerekçesi var. Bu, jüriye *"biz sadece API çağırdık"* değil *"biz neden hangi araç için hangi modelin en iyi olduğunu düşündük"* mesajını veriyor. Diğer ekiplerin büyük çoğunluğu bir modeli her şey için kullanacak.

### İkinci ağır kriter: AI agent hafızası ve orkestrasyonu (15 puan)

Bu projede agent mimarisi doğal olarak gerekli — sonradan eklenmiş değil. Şöyle açıklayayım:

- **Birinci ajan** sözleşmeyi analiz ediyor.
- **İkinci ajan** bu analizin çıktısını alarak hakların ne olduğunu söylüyor.
- **Üçüncü ajan** ikincinin çıktısını kullanarak belge üretiyor.
- **Dördüncü ajan** üçüncünün yarattığı eylem planını alıp tarih takibine dönüştürüyor.

Hafıza ise kiracının tüm süreci boyunca geçmişini saklıyor — 6 ay sonra ev sahibi ödeme yapmadığını iddia etse sistem elimizdeki kayıtları hazır tutuyor.

**Bu bir chat botu değil. Bu bir iş akışı.** Jüri bu farkı görecek.

### Özgünlük (10 puan)

Türkiye'de bunu yapan kimse yok. DoNotPay benzeri ürünler Türkiye'de hiç olmadı. Türkçe hukuki yardım araçları statik makale siteleri düzeyinde. Dünya genelinde benzer ürünler var ama Türk hukuku çok spesifik (Türk Borçlar Kanunu, değişen TÜFE hesaplama yöntemi, noter ihtarnamesi prosedürü) — bunlar direkt çeviri ile çözülmüyor.

## Demo Günü Sahnesi

Yarışmada en çok puan alan ekipler genellikle şu şeyi yapıyor: jürinin kafasında *"bu gerçekten çalışıyor"* anını yaratıyorlar.

**Bizim demo anımız şu:**

1. Sahnede kendi kira sözleşmemizi yüklüyoruz.
2. 20 saniye içinde ekranda *"3. madde yasadışı — ev sahibi bu masrafı kiracıya yükleyemez"* yazısı beliriyor.
3. Sonra *"ihtarname oluştur"* butonuna basıyoruz ve hazır, imzalanmayı bekleyen resmi belge geliyor.

Jürideki herkesin ya kendi kira sözleşmesi var ya da yakınının. Biri o an telefonunu çıkarıp kendi sözleşmesini denemek isteyecek — **bu olursa oyunu kazandık demektir.**

## Altı Haftada Ne Yapacağız?

Projeyi ikişer haftalık üç sprint'e bölüyoruz:

### Sprint 1 (Hafta 1–2)

- Sözleşme analiz motoru çalışıyor.
- Fotoğraf yükle, yasadışı madde bul akışı tamamlandı.
- Türk Borçlar Kanunu'nun ilgili maddeleri bilgi tabanına eklendi.

### Sprint 2 (Hafta 3–4)

- Haklar danışmanı ve ihtarname üreteci tamamlandı.
- Kullanıcı hafızası sistemi kuruldu — kiracının sözleşme detaylarını her seferinde tekrar girmesine gerek yok.
- LangGraph orkestrasyon çalışıyor.

### Sprint 3 (Hafta 5–6)

- Ürün canlıya alındı.
- 10 gerçek kiracıyla test edildi (herkese *"kira sözleşmen var mı?"* diye sormak yeterli).
- Tarih takip sistemi eklendi.
- Demo senaryosu hazır.

## Sonuç

Bazı projeler *"iyi fikir ama kim kullanır?"* sorusunu beraberinde getirir. HakkımVar'da bu soru yok. Türkiye'de 40 milyon kiracı var ve bunların önemli bir kısmı şu an aktif bir anlaşmazlık içinde.

- Ürün somut.
- Pazar var.
- Mimari bootcamp kriterlerine göre tasarlandı.
- Demo anı güçlü.

Ve en önemlisi — bunu yaparsak jüri üyelerinden en az biri kalkıp *"benim de böyle bir şeye ihtiyacım vardı"* diyecek.

---

*Bu doküman ekip içi tartışma için hazırlanmıştır.*
