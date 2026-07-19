from typing import TypedDict, Optional, List
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):

    session_id:str
    # Kullanıcı mesajı
    user_question: str

    # Router sonucu
    intent: Optional[str]

    router_reason: Optional[str]

    # RAG
    retrieved_documents: List[Document]

    # Sözleşme analizi
    contract_text: Optional[str]

    contract_analysis: Optional[str]

    # Hukuki cevap
    legal_answer: Optional[str]

    # Final cevap
    final_answer: Optional[str]

    # Conversation memory
    messages: List[BaseMessage]