from langchain_openai import ChatOpenAI
from pydantic import BaseModel,Field
from dotenv import load_dotenv
load_dotenv()

class AnswerResponse(BaseModel):
    answer:str=Field(description="Kullanıcıya verilecek cevap")


llm=ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2
)


answer_llm=llm.with_structured_output(
    AnswerResponse
)


generate_answer_prompt="""
Sen HakkımVar isimli kira hukuku AI asistanısın.

Görevin kullanıcı sorularına hukuki bilgi vermektir.

Kurallar:

- Sadece verilen kaynaklara dayanarak cevap ver.
- Kanun maddesi varsa belirt.
- Hukuki tavsiye verme.
- Kesin karar ifadeleri kullanma.
- Kullanıcıya anlaşılır Türkçe ile cevap ver.
- Kaynakta bilgi yoksa bunu açıkça belirt.

Kaynak Bilgileri:
{context}


Kullanıcı Sorusu:
{question}


Cevap:
"""


def generate_answer_chain(question,context):

    prompt=generate_answer_prompt.format(
        question=question,
        context=context
    )


    response=answer_llm.invoke(
        prompt
    )


    return response.answer