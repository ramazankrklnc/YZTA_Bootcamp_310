# **Takım İsmi**

HakkımVar Takımı

# Ürün İle İlgili Bilgiler

## Takım Elemanları

- [Ramazan Karakılınç]: Product Owner
- [Selin Zeydan]: Scrum Master
- [Arda Kocadoru]: Team Member/Developer
- [İzzet Mert Özyağlı]: Team Member/Developer
- [Mehmet Emin Akkaya]: Team Member/Developer

## Ürün İsmi

--HakkımVar--

## Ürün Açıklaması

HakkımVar, Türkiye'de kirada oturan 40 milyonun üzerindeki kiracının kira sözleşmelerindeki yasa dışı maddeleri, fazla kira artışlarını ve haklarını saniyeler içinde tespit etmesini sağlayan yapay zeka destekli bir hukuk asistanıdır. Kullanıcı kira sözleşmesinin fotoğrafını yüklüyor; sistem sözleşmeyi Türk Borçlar Kanunu'na göre analiz ediyor, yasal artış tavanını hesaplıyor ve gerektiğinde noter formatında ihtarname üretiyor.

## Ürün Özellikleri

- Kira sözleşmesi fotoğrafını okuyup madde madde yasal uygunluk analizi yapma
- İlgili Türk Borçlar Kanunu maddelerine atıf vererek yasa dışı hükümleri işaretleme
- Talep edilen kira artışını TÜFE bazlı yasal tavanla karşılaştırıp fazla talep edilen tutarı gösterme
- Tek tıkla noter formatında, imzaya hazır ihtarname oluşturma
- Kritik yasal süreleri (ör. 15 günlük cevap süresi) takip edip hatırlatma gönderme
- LangGraph ile çoklu ajan orkestrasyonu (sözleşme analizi → hak danışmanlığı → belge üretimi → tarih takibi)
- Kiracı geçmişini saklayan kullanıcı hafızası

## Hedef Kitle

- Türkiye'de kirada oturan bireyler
- Kira artışı veya sözleşme anlaşmazlığı yaşayan kiracılar
- Hukuki danışmanlığa erişimi kısıtlı olan kullanıcılar
- 18 - 65 yaş arası kiracılar

## Product Backlog URL

[https://miro.com/app/board/uXjVH-kKWLY=/]

---

# Sprint 1

- **Sprint içinde tamamlanması hedeflenen puan**: [Puan bilgisini buraya ekleyin]

- **Backlog düzeni ve Story seçimleri**: Backlog, sözleşme analiz motorunun ve temel altyapının (vektör veritabanı, chunking, embedding) öncelikli olarak tamamlanması hedeflenerek düzenlenmiştir. Board; **Rejected**, **Backlog**, **To Do**, **In Progress** ve **Done** olmak üzere beş sütuna ayrılmıştır. Kartlar ayrıca renk koduyla etiket türüne göre gruplanmıştır: Diğer, Görsel İşleme, Ses, Tasarım ve Kod.

- **Daily Scrum**: Daily Scrum toplantıları zamansal sebeplerden ötürü Slack üzerinden yürütülmüştür.

- **Sprint board update**: Sprint board screenshotu:

![Sprint 1 Board](ProjectManagement/Sprint1Documents/sprint1_board.png)

  Sprint 1 sonunda **Done** sütununda tamamlanan işler:
  - PDF metinlerini madde bazlı bölme (chunking) algoritması
  - Gereksiz boşluk ve satır sonu temizleme (regex) fonksiyonu
  - Chroma DB vektör veritabanı entegrasyonu
  - OpenAI text-embedding-3-small entegrasyonu
  - Similarity search (anlamsal arama) test sorgularının hazırlanması
  - Türk Borçlar Kanunu PDF'inin temin edilmesi ve yüklenmesi
  - Kira Hukuku mevzuatı PDF'inin temin edilmesi ve yüklenmesi

  **In Progress** durumundaki işler: LangChain similarity search ile hukuk türü filtreleme sistemi, proje sprint planı ve README dokümantasyonu, proje tanıtım slaytları ve arayüz taslakları (Figma mockup).

- **Ürün Durumu**: Ekran görüntüsü (giriş ekranı arayüz taslağı):

  [![Ürün Ekran Görüntüsü](./ProjectManagement/Sprint1Documents/productss1.png)](./ProjectManagement/Sprint1Documents/productss1.png)

- **Sprint Review**:
Sprint 1 kapsamında sözleşme analiz motorunun temel altyapısı (PDF işleme, chunking, embedding, vektör veritabanı) başarıyla kurulmuştur. Türk Borçlar Kanunu ve Kira Hukuku mevzuatı bilgi tabanına eklenmiştir. Arayüz tasarımının ilk taslakları hazırlanmış, LangGraph ile çoklu ajan orkestrasyonu planlaması netleştirilmiştir. Sprint Review katılımcıları: [Katılımcı isimlerini buraya ekleyin]

- **Sprint Retrospective**:

  * Backlog'daki story'lerin daha küçük task'lere bölünmesi kararlaştırılmıştır
  * Hukuki bilgi/sorumluluk reddi (disclaimer) arayüz tasarımının bir sonraki sprint'e öncelikli olarak alınması gerektiği görülmüştür
  * Model seçimlerinin (görsel anlama, hukuki muhakeme, sınıflandırma) gerekçelendirilmesi için ek dokümantasyon hazırlanmalı

---

# Sprint 2

- **Hedeflenen işler**: Haklar danışmanı ve ihtarname üreteci ajanlarının tamamlanması, kullanıcı hafıza (memory) sisteminin kurulması, LangGraph orkestrasyonunun uçtan uca çalışır hale getirilmesi.

[Sprint 2 detayları tamamlandıkça bu bölüm güncellenecektir.]

---

# Sprint 3

- **Hedeflenen işler**: Ürünün canlıya alınması, gerçek kiracılarla kullanıcı testleri, tarih takip sisteminin eklenmesi, demo senaryosunun hazırlanması.

[Sprint 3 detayları tamamlandıkça bu bölüm güncellenecektir.]
