from langchain_openai import ChatOpenAI
from pydantic import BaseModel,Field
from dotenv import load_dotenv
load_dotenv()

class AnswerCheckResult(BaseModel):
    is_valid:bool=Field(description="Cevap geçerli mi")
    score:int=Field(description="Cevap kalite puanı 1-10")
    reason:str=Field(description="Kontrol sonucu açıklaması")
    should_regenerate:bool=Field(description="Cevap tekrar oluşturulmalı mı")


llm=ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)


checker_llm=llm.with_structured_output(
    AnswerCheckResult
)


answer_check_prompt="""
Sen HakkımVar hukuk AI sisteminde cevap kontrol ajanısın.

Görevin oluşturulan cevabı kontrol etmektir.

Kontrol kriterleri:

1- Cevap kullanıcının sorusuna cevap veriyor mu?
2- Hukuki kaynaklara dayanıyor mu?
3- Yanlış veya uydurma bilgi içeriyor mu?
4- Kesin hukuki tavsiye veriyor mu?
5- Açıklama yeterli mi?

Eğer cevap yetersizse tekrar oluşturulmalıdır.

Kullanıcı Sorusu:
{question}

Kullanılan Kaynak:
{context}

Oluşturulan Cevap:
{answer}
"""


def answer_check_chain(question,context,answer):

    prompt=answer_check_prompt.format(
        question=question,
        context=context,
        answer=answer
    )

    result=checker_llm.invoke(prompt)

    return result