from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)



contract_summary_prompt = ChatPromptTemplate.from_template(
"""
Sen bir kira sözleşmesi analiz uzmanısın.

Aşağıdaki kira sözleşmesini incele.

Görevlerin:

1- Sözleşmenin kısa bir özetini çıkar.
2- Hukuki açıdan önemli maddeleri listele.
3- Kanun karşılaştırması için önemli anahtar kelimeleri üret.

Cevabı kesinlikle aşağıdaki JSON formatında ver:

{{
    "summary": "",
    "important_clauses": [],
    "keywords": []
}}


SÖZLEŞME:

{contract_text}
"""
)



contract_summary_chain = (
    contract_summary_prompt
    |
    llm
)