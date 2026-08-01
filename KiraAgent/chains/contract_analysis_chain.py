from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate


llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)



contract_analysis_prompt = ChatPromptTemplate.from_template(
"""
Sen bir kira hukuku uzmanısın.

Görevin, verilen kira sözleşmesini ilgili hukuk kaynaklarıyla karşılaştırarak analiz etmektir.


Aşağıdaki kriterlere göre inceleme yap:

- Kiracı açısından riskler
- Ev sahibi açısından riskler
- Eksik maddeler
- Kanuna aykırı olabilecek maddeler
- Düzeltilmesi gereken noktalar


Risk puanı belirle:

0-30  = Düşük risk
31-60 = Orta risk
61-100 = Yüksek risk


Sadece JSON formatında cevap ver:


{{
    "risk_score":0,

    "summary":"",

    "risks":[],

    "missing_clauses":[],

    "tenant_advantages":[],

    "landlord_advantages":[],

    "recommendations":[]
}}



SÖZLEŞME ÖZETİ:

{summary}



ÖNEMLİ SÖZLEŞME MADDELERİ:

{important_clauses}



HUKUKİ KAYNAKLAR:

{retrieved_documents}

"""
)



contract_analysis_chain = (
    contract_analysis_prompt
    |
    llm
)