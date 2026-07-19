import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PERSIST_DIR = os.path.join(BASE_DIR, "chroma_db")

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")


def get_vectorstore():
    """Kaydedilmiş Chroma DB'yi yükler."""
    return Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)


def get_retriever(k: int = 5):
    """İlgili maddeleri bulan retriever döndürür."""
    vectorstore = get_vectorstore()
    return vectorstore.as_retriever(search_kwargs={"k": k})


def build_rag_chain():
    """RAG zinciri oluşturur: soru → ilgili maddeler → cevap."""
    retriever = get_retriever()
    llm = ChatOpenAI(model="gpt-4o", temperature=0)

    prompt = ChatPromptTemplate.from_template("""
Sen Türk kira hukuku konusunda uzman bir yapay zekâ asistanısın.
Aşağıdaki hukuki kaynaklardan yararlanarak soruyu Türkçe olarak yanıtla.
Yalnızca verilen kaynaklara dayan, tahmin yapma.

Hukuki Kaynaklar:
{context}

Soru: {question}

Cevap:""")

    def format_docs(docs):
        return "\n\n".join([
            f"[Kaynak: {d.metadata.get('source', 'Bilinmiyor')}]\n{d.page_content}"
            for d in docs
        ])

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain


def search_law(query: str):
    """Verilen sorguya göre ilgili kanun maddelerini getirir."""
    retriever = get_retriever(k=5)
    docs = retriever.invoke(query)
    return [
        {
            "source": d.metadata.get("source", "Bilinmiyor"),
            "content": d.page_content[:500]
        }
        for d in docs
    ]
