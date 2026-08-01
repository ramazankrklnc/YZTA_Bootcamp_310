from typing import TypedDict, List


class ContractState(TypedDict):
    # Flutter'dan gelen sözleşme metni
    contract_text: str

    # İlk chain'in oluşturduğu özet
    summary: str

    # Önemli maddeler
    important_clauses: List[str]

    # Retriever için anahtar kelimeler
    keywords: List[str]

    # Retriever'ın döndürdüğü dokümanlar
    retrieved_documents: List[str]

    # Nihai analiz
    analysis: str

    # Risk puanı
    risk_score: int

    # Son cevap
    final_response: dict