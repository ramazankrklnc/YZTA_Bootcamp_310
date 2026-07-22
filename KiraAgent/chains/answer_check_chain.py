from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()


class AnswerCheckResult(BaseModel):

    is_valid: bool = Field(
        description="Cevap geçerli mi"
    )

    score: int = Field(
        description="Cevap kalite puanı 1-10"
    )


llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)


checker_llm = llm.with_structured_output(
    AnswerCheckResult
)


answer_check_prompt = """
Sen HakkımVar hukuk AI sisteminde cevap kontrol ajanısın.

Görevin oluşturulan hukuki cevabı kontrol etmektir.

Kontrol kriterleri:

1- Cevap kullanıcının sorusuna uygun mu?
2- Cevap verilen hukuki kaynaklarla destekleniyor mu?
3- Uydurma madde veya yanlış bilgi içeriyor mu?
4- Hukuki tavsiye yerine hukuki bilgi formatında mı?
5- Açıklama yeterli ve anlaşılır mı?

Eğer cevap hatalı veya yetersiz ise tekrar oluşturulması gerekir.

"""

human_prompt="""
Kullanıcı Sorusu:
{question}


Hukuki Kaynaklar:
{context}


Oluşturulan Cevap:
{answer}
"""

prompts=ChatPromptTemplate.from_messages([
    ("system",answer_check_prompt),
    ("human", human_prompt)
])

answer_check_chain= prompts | checker_llm