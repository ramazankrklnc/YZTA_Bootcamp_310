from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

# =====================================================
# EMBEDDING MODEL
# =====================================================

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"
)

# =====================================================
# VECTOR DATABASE
# =====================================================

vector_db = Chroma(
    persist_directory="./VectorDatabase/hukuk_db/",
    embedding_function=embeddings,
    collection_name="kira_hukuku_knowledge"
)

# =====================================================
# RETRIEVER
# =====================================================

retriever = vector_db.as_retriever(
    search_type="similarity",
    search_kwargs={
        "k": 5
    }
)

# =====================================================
# RETRIEVAL CHAIN
# =====================================================

def retrieval_chain(question: str):
    """
    Kullanıcı sorusuna göre hukuki kaynakları getirir ve metin formatına dönüştürür.
    """
    documents = retriever.invoke(question)

    retrieved_documents = []

    for doc in documents:
        content = f"""Kaynak: {doc.metadata.get("kaynak_dosya")}
Madde: {doc.metadata.get("madde_no")}
İçerik:
{doc.page_content}"""

        retrieved_documents.append(content)

    return {
        "retrieved_documents": retrieved_documents
    }