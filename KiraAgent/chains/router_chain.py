from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv
load_dotenv()

class RouterOutput(BaseModel):

    intent: str = Field(
        description="""
        Kullanıcı isteğinin kategorisi.
        """
    )

    reason: str = Field(
        description="Karar verme sebebi"
    )

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)
router_llm = llm.with_structured_output(
    RouterOutput
)

router_prompt = """

Sen HakkımVar isimli kira hukuku
AI asistanının router agentısın.

Görevin kullanıcı isteğini analiz edip
doğru agent'a yönlendirmek.

Kategori seçenekleri:

contract_analysis:
Kira sözleşmesi incelenmesi,
madde kontrolü.

legal_question:
Kira hukuku hakkında genel soru.

rent_increase_check:
Kira artışı, zam oranı,
TÜFE kontrolü.

notice_generation:
İhtarname veya resmi belge oluşturma.

timeline_tracking:
Süre, tarih, hatırlatma.

general_chat:
Genel konuşma.

out_of_scope:
Kira hukuku dışındaki konular.


Kullanıcı mesajı:
{question}

"""


def router_chain(question:str):

    prompt = router_prompt.format(
        question=question
    )


    response = router_llm.invoke(prompt)


    return response