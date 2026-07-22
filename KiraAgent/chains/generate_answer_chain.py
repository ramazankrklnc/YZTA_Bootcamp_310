from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class AnswerResponse(BaseModel):
    answer: str = Field(description="Kullanıcıya verilecek hukuki cevap")


llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

answer_llm = llm.with_structured_output(AnswerResponse)

generate_answer_prompt = """
Sen HakkımVar isimli kira hukuku AI asistanısın.

Görevin kullanıcı sorularına hukuki bilgi vermektir.

Kurallar:
- Sadece verilen hukuki kaynaklara dayanarak cevap ver.
- İlgili kanun maddelerini belirt.
- Hukuki tavsiye verme.
- Kesin karar ifadeleri kullanma.
- Anlaşılır Türkçe kullan.
- Kaynaklarda bilgi yoksa bunu açıkça belirt.
"""

human_prompt = """
Hukuki Kaynaklar:
{context}

Kullanıcı Sorusu:
{question}
"""

prompt = ChatPromptTemplate.from_messages([
    ("system", generate_answer_prompt),
    MessagesPlaceholder(variable_name="messages"),  # Geçmiş mesajlar buraya girer
    ("human", human_prompt),
])

generate_chain = prompt | answer_llm