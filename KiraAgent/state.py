from typing import TypedDict, Optional, List
from langchain_core.documents import Document
from langchain_core.messages import BaseMessage


class AgentState(TypedDict):

    session_id: str

    user_question: str

    route:bool

    router_reason: Optional[str]

    retrieved_documents: List[str]

    answer: str

    answer_valid: bool

    answer_score: int

    messages: List[BaseMessage]