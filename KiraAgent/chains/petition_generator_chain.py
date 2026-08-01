from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate


llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2
)


prompt = ChatPromptTemplate.from_template(
"""
Sen Türkiye kira hukuku konusunda uzman bir asistansın.

Kullanıcı için resmi bir dilekçe hazırla.

Dilekçe türü:
{petition_type}


Kullanıcı problemi:
{user_problem}


Hukuki dayanaklar:
{legal_documents}


Aşağıdaki formatı kullan:


T.C.
.............. MAHKEMESİNE


DAVACI:
[Bilgi yok]


DAVALI:
[Bilgi yok]


KONU:
...


AÇIKLAMALAR:
1-
2-
3-


HUKUKİ SEBEPLER:
...


DELİLLER:
...


SONUÇ VE TALEP:
...


Dilekçeyi resmi hukuk diliyle hazırla.
Eksik kişisel bilgileri [Doldurulacak Alan] şeklinde bırak ve bu alanları dilekçenin altına şu alanlar tamamlanmalı olarak ekle.
"""
)


petition_generator_chain = (
    prompt | llm
)