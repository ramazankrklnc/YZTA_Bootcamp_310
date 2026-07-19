<div align="center">

# ⚖️ HakkımVar

### *Yapay Zekâ Destekli Kiracı Hak Asistanı*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![LangChain](https://img.shields.io/badge/LangChain-0.2.7-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.1.8-FF6B6B?style=for-the-badge)](https://langchain-ai.github.io/langgraph)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/Lisans-MIT-green?style=for-the-badge)](LICENSE)

**Türkiye'deki 40 milyonu aşkın kiracı için hukuki asistan**

[📋 Product Backlog](https://miro.com/app/board/uXjVH-kKWLY=/) • [🚀 Sprint 2](../Sprint2/) • [📄 Yol Haritası](../Road_Map1.pdf)

</div>

---

## 🎯 Proje Hakkında

**HakkımVar**, Türkiye'de kirada oturan milyonlarca kiracının kira sözleşmelerindeki **yasadışı maddeleri**, **fazla kira artışlarını** ve **haklarını** saniyeler içinde tespit etmesini sağlayan yapay zekâ destekli bir hukuk asistanıdır.

> 📸 Kullanıcı kira sözleşmesinin fotoğrafını yüklüyor → Sistem Türk Borçlar Kanunu'na göre analiz ediyor → Yasal artış tavanını hesaplıyor → Gerektiğinde noter formatında ihtarname üretiyor.

---

## 👥 Takım — HakkımVar Takımı

| İsim | Rol |
|---|---|
| **Ramazan Karakılınç** | 🎯 Product Owner |
| **Selin Zeydan** | 🔄 Scrum Master |
| **Arda Kocadoru** | 💻 Developer |
| **İzzet Mert Özyağlı** | 💻 Developer |
| **Mehmet Emin Akkaya** | 💻 Developer |

---

## 🚀 Ürün Özellikleri

| Özellik | Açıklama |
|---|---|
| 📸 **OCR Analizi** | Kira sözleşmesi fotoğrafını okuyup madde madde yasal uygunluk analizi |
| ⚖️ **TBK Karşılaştırma** | İlgili Türk Borçlar Kanunu maddelerine atıf vererek yasadışı hükümleri işaretleme |
| 💰 **TÜFE Hesaplama** | Talep edilen kira artışını yasal tavanla karşılaştırıp fazla tutarı gösterme |
| 📝 **İhtarname Üretimi** | Tek tıkla noter formatında, imzaya hazır ihtarname oluşturma |
| ⏰ **Tarih Takibi** | Kritik yasal süreleri (15 günlük cevap süresi vb.) takip edip hatırlatma |
| 🤖 **Çoklu Ajan** | LangGraph ile ajan orkestrasyonu (analiz → danışmanlık → belge → tarih) |
| 🧠 **Kullanıcı Hafızası** | Kiracı geçmişini saklayan memory sistemi |

---

## 🎯 Hedef Kitle

- 🏠 Türkiye'de kirada oturan bireyler
- ⚠️ Kira artışı veya sözleşme anlaşmazlığı yaşayan kiracılar
- 📚 Hukuki danışmanlığa erişimi kısıtlı olan kullanıcılar
- 👥 18–65 yaş arası kiracılar

---

## 🛠️ Teknoloji Yığını

```
Yapay Zekâ        │ GPT-4o, text-embedding-3-small
Oran Mimarisi     │ LangGraph, LangChain, RAG
Vektör Veritabanı │ Chroma DB
Hukuki Kaynaklar  │ Türk Borçlar Kanunu PDF, Kira Hukuku Mevzuatı PDF
```

---

# 🏃 Sprint 1 — Temel Altyapı

> **Sprint Dönemi:** 1–2. Haftalar | **Hedef:** Sözleşme analiz motorunun ve temel altyapının oluşturulması

---

## 📊 Sprint Board

![Sprint 1 Board](sprint1_board.png)

### ✅ Tamamlanan İşler (Done)

| # | Görev | Kategori |
|---|---|---|
| 1 | PDF metinlerini madde bazlı bölme (Chunking) algoritması | 🟢 Diğer |
| 2 | Gereksiz boşluk ve satır sonu temizleme (Regex) fonksiyonu | 🟢 Diğer |
| 3 | Chroma DB vektör veritabanı entegrasyonu | 🔴 Kod |
| 4 | OpenAI `text-embedding-3-small` entegrasyonu | 🔴 Kod |
| 5 | Similarity Search (anlamsal arama) test sorgularının hazırlanması | 🔴 Kod |
| 6 | Türk Borçlar Kanunu PDF'inin temin edilmesi ve yüklenmesi | 🟢 Diğer |
| 7 | Kira Hukuku Mevzuatı PDF'inin temin edilmesi ve yüklenmesi | 🟢 Diğer |

### 🔄 In Progress

- LangChain Similarity Search ile hukuk türü filtreleme sistemi
- Proje Sprint Planı ve README dokümantasyonu
- Proje tanıtım slaytları ve arayüz taslakları (Figma Mockup)

---

## 🖥️ Ürün Ekran Görüntüleri

### Arayüz Taslağı

[![Ürün Ekran Görüntüsü](productss1.png)](productss1.png)

---

## 📅 Daily Scrum

Sprint süresince Daily Scrum toplantıları **WhatsApp** yazışmaları ve **Google Meet** görüşmeleri aracılığıyla yürütülmüştür. Her toplantıda günlük ilerleme, tamamlanan görevler, karşılaşılan engeller ve bir sonraki adımlar değerlendirilmiştir.

<details>
<summary>📸 Daily Scrum Ekran Görüntüleri (tıkla)</summary>

![Daily Scrum 1](Sprint_1_daily_scrum_ss.jpg)
![Daily Scrum 2](Sprint_1_daily_scrum_ss_2.jpg)
![Daily Scrum 3](Sprint_1_daily_scrum_ss_3.jpg)
![Daily Scrum 4](Sprint_1_daily_scrum_ss_4.png)

</details>

---

## 🔍 Sprint Review

Sprint 1 kapsamında sözleşme analiz motorunun temel altyapısı başarıyla kurulmuştur:

- ✅ PDF işleme ve chunking pipeline'ı çalışır durumda
- ✅ Embedding ve Chroma DB entegrasyonu tamamlandı
- ✅ Türk Borçlar Kanunu + Kira Hukuku bilgi tabanı yüklendi
- ✅ Arayüz tasarımının ilk taslakları hazırlandı
- ✅ LangGraph çoklu ajan planlaması netleştirildi

---

## 🔁 Sprint Retrospective

| Karar | Açıklama |
|---|---|
| 📦 **Task Bölünmesi** | Backlog story'leri daha küçük task'lere bölünecek |
| ⚖️ **Disclaimer** | Hukuki sorumluluk reddi arayüzü Sprint 2'ye öncelikli alındı |
| 📄 **Dokümantasyon** | Model seçimleri için ek teknik dokümantasyon hazırlanacak |

---

## 📁 Sprint 1 Klasör Yapısı

```
Sprint1/
├── VectorDatabase/
│   └── embedding.py          ← PDF chunking + Chroma DB yükleme
├── README.md                 ← Bu dosya
├── requirements.txt          ← Sprint 1 bağımlılıkları
├── sprint1_board.png         ← Sprint board ekran görüntüsü
├── productss1.png            ← Arayüz taslağı
└── Sprint_1_daily_scrum_ss_*.jpg/png  ← Daily Scrum görselleri
```

---

## 🗺️ Sprint Planı

| Sprint | Dönem | Hedef |
|---|---|---|
| ✅ **Sprint 1** | 1–2. Hafta | Temel altyapı, PDF işleme, embedding |
| 🔄 **[Sprint 2](../Sprint2/)** | 3–4. Hafta | Ajan sistemi, RAG, FastAPI, UI |
| ⏳ **Sprint 3** | 5. Hafta | İhtarname üretimi, PDF export |
| ⏳ **Sprint 4** | 6. Hafta | Canlı ortam, testler, demo |

---

<div align="center">

**⚖️ HakkımVar** | YZTA Bootcamp 310 | Takım 310

*Bu uygulama hukuki tavsiye niteliği taşımaz. Profesyonel hukuki destek için bir avukata danışınız.*

</div>
