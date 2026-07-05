import re
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_chroma import Chroma
from dotenv import load_dotenv

# =====================================================
# EMBEDDINGS
# =====================================================
load_dotenv()

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

# =====================================================
# PDF SOURCES
# =====================================================

pdf_sources = {
    "Turk_Borclar_Kanunu": "Borçlar_kanunu.pdf",
    "Kira_Huku_Mevzuati": "kira_hukuku.pdf"
}

# =====================================================
# CLEAN + CHUNK (ROBUST)
# =====================================================

def clean_and_split_by_article(text: str):
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r' +', ' ', text)

    pattern = r'(?=(?:MADDE|Madde)\s+\d+\s*[-.:]?)'
    chunks = re.split(pattern, text)

    return [
        c.strip()
        for c in chunks
        if len(c.strip()) > 30
    ]

# =====================================================
# DOCUMENT BUILDING
# =====================================================

docs = []

for source_name, pdf_path in pdf_sources.items():

    print(f"📄 Loading: {source_name}")

    loader = PyMuPDFLoader(pdf_path)
    pages = loader.load()

    raw_text = "\n".join([p.page_content for p in pages])

    articles = clean_and_split_by_article(raw_text)

    print(f"   → {len(articles)} madde bulundu")

    for article in articles:

        match = re.search(r'(MADDE|Madde)\s+\d+', article)
        madde_no = match.group(0) if match else "Belirsiz"

        try:
            madde_id = int(madde_no.split()[-1])
        except:
            madde_id = -1

        hukuk_turu = (
            "Kira Hukuku"
            if source_name == "Kira_Huku_Mevzuati"
            else "Genel Borçlar"
        )

        metadata = {
            "source": source_name,
            "madde_no": madde_no,
            "madde_id": madde_id,
            "hukuk_turu": hukuk_turu
        }

        content = f"""
[KAYNAK] {source_name}
[MADDE] {madde_no}

{article}
"""

        docs.append(
            Document(
                page_content=content,
                metadata=metadata
            )
        )

print(f"\n✅ Total documents: {len(docs)}")

# =====================================================
# VECTOR DB (CHROMA SAFE VERSION)
# =====================================================

vector_db = Chroma(
    persist_directory="./hukuk_db",
    embedding_function=embeddings
)

existing = len(vector_db.get()["ids"])

# SAFE INSERT (NO DUPLICATES)
if existing == 0:

    print("🚀 First time indexing...")

    vector_db.add_documents(
        documents=docs,
        ids=[f"doc_{i}" for i in range(len(docs))]
    )

    print("✅ Indexing complete")

else:
    print(f"ℹ️ DB already exists with {existing} docs")

# =====================================================
# TEST RETRIEVAL (HYBRID READY)
# =====================================================

query = "kiracı tahliye süresi ne kadar"

results = vector_db.similarity_search(
    query,
    k=3,
    filter={"hukuk_turu": "Kira Hukuku"}
)

print("\n🔎 RESULTS:\n")

for i, r in enumerate(results, 1):
    print(f"--- Result {i} ---")
    print(r.metadata)
    print(r.page_content[:400])
    print()