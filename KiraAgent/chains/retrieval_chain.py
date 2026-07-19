from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
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
    Kullanıcı sorusuna göre hukuki kaynakları getirir.
    """

    documents = retriever.invoke(
        question
    )


    context = []

    for doc in documents:

        content = f"""
Kaynak:
{doc.metadata.get("kaynak_dosya")}

Madde:
{doc.metadata.get("madde_no")}

İçerik:
{doc.page_content}
"""

        context.append(content)


    return {
        "documents": documents,
        "context": "\n\n".join(context)
    }