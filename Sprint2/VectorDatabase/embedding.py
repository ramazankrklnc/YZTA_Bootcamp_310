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
