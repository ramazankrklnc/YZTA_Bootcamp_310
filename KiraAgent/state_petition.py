from typing import TypedDict, List, Dict


class PetitionState(TypedDict):

    user_problem: str

    petition_type: str

    retrieved_documents: List[str]

    legal_articles: List[str]

    petition_text: str