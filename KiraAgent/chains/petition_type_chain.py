from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)


prompt = ChatPromptTemplate.from_template(
"""
Sen bir kira hukuku uzmanısın.

Kullanıcının problemini analiz et.

Aşağıdaki dilekçe türlerinden en uygun olanını seç:

- İhtarname
- Dava Dilekçesi
- İtiraz Dilekçesi
- Talep Dilekçesi
- Şikayet Dilekçesi


Kullanıcı Problemi:

{user_problem}


Sadece dilekçe türünün adını döndür.
"""
)


petition_type_chain = prompt | llm