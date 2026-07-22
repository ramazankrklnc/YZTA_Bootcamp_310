from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()


class RouterOutput(BaseModel):

    route: bool = Field(
        description="Kullanıcının sorusu kira hukuku ile ilgilimi değil mi ?"
    )


llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)





router_prompt = """
Sen HakkımVar kira hukuku AI sisteminin
soru yönlendirme ajanısın.

Kullanıcının sorusunu analiz et.

Kategori seçenekleri:

legal_question:
Kira hukuku, kiracı hakları,
ev sahibi hakları, kira artışı,
tahliye, depozito, sözleşme süresi
gibi hukuki sorular.

out_of_scope:
Kira hukuku ile ilgisi olmayan sorular.



"""

human_prompt="""
Kullanıcı Sorusu:
{question}
"""
router_llm = llm.with_structured_output(
    RouterOutput
)
prompt = ChatPromptTemplate.from_messages([
    ("system", router_prompt),
    ("human", human_prompt),
])

router_chain= prompt | router_llm