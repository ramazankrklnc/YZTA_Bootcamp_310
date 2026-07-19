# ⚖️ HakkımVar — Sprint 2 Kurulum & Çalıştırma

## 🚀 Hızlı Başlangıç

### 1. .env dosyası oluştur

Proje klasörüne `.env` dosyası oluştur ve API anahtarını ekle:
```
OPENAI_API_KEY=sk-...buraya_openai_api_keyin...
```

### 2. Gereksinimleri yükle

```bash
pip install -r requirements.txt
```

### 3. Vector Database'i oluştur (ilk seferinde bir kez çalıştır)

```bash
cd VectorDatabase
python embedding.py
cd ..
```

### 4. Uygulamayı başlat

```bash
streamlit run app.py
```

### 5. (Opsiyonel) FastAPI backend'i başlat

```bash
uvicorn backend.main:app --reload
```
API dokümantasyonu: http://localhost:8000/docs

---

## 📁 Proje Yapısı (Sprint 2)

```
YZTA_Bootcamp_310/
├── VectorDatabase/
│   ├── embedding.py       ← PDF'leri Chroma'ya yükler
│   ├── retriever.py       ← RAG zinciri
│   ├── chroma_db/         ← (otomatik oluşur)
│   ├── Borçlar_kanunu.pdf
│   └── kira_hukuku.pdf
├── agents/
│   ├── contract_analyzer.py  ← Sözleşme okuma (text + OCR)
│   ├── legal_reasoner.py     ← TBK karşılaştırma + TÜFE
│   ├── rights_advisor.py     ← Hak danışmanlığı + ihtarname
│   └── graph.py              ← LangGraph orkestrasyonu
├── backend/
│   ├── main.py               ← FastAPI endpoints
│   └── models.py             ← Pydantic modeller
├── app.py                    ← Streamlit UI
├── requirements.txt
└── .env                      ← API key (git'e ekleme!)
```
