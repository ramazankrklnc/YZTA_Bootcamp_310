from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from uuid import uuid4
import uvicorn

from graph import app as graph


app=FastAPI(
    title="HakkımVar Kira Hukuku Agent API",
    description="RAG destekli kira hukuku soru cevap sistemi",
    version="1.0.0"
)


sessions={}


class SoruRequest(BaseModel):
    session_id:str | None=None
    kullanici_sorusu:str


class ResetRequest(BaseModel):
    session_id:str


@app.get("/")
def root():
    return {
        "status":"active",
        "message":"HakkımVar Kira Hukuku Agent çalışıyor"
    }


@app.post("/sor")
def soru_sor(data:SoruRequest):

    try:

        if data.session_id is None:
            session_id=str(uuid4())
            sessions[session_id]=[]

        else:
            session_id=data.session_id

            if session_id not in sessions:
                sessions[session_id]=[]


        mevcut_hafiza=sessions[session_id]


        initial_state={
            "question":data.kullanici_sorusu,
            "context":"",
            "answer":"",
            "answer_valid":False,
            "answer_score":0,
            "answer_check_reason":"",
            "should_regenerate":False,
            "session_id":session_id,
            "history":mevcut_hafiza
        }


        result=graph.invoke(
            initial_state
        )


        mevcut_hafiza.append(
            {
                "question":data.kullanici_sorusu,
                "answer":result.get("answer")
            }
        )


        sessions[session_id]=mevcut_hafiza


        return {
            "session_id":session_id,
            "cevap":result.get("answer",""),
            "puan":result.get("answer_score",0),
            "gecerli":result.get("answer_valid",False),
            "hafiza_boyutu":len(mevcut_hafiza)
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/temizle")
def hafiza_temizle(data:ResetRequest):

    if data.session_id in sessions:

        sessions[data.session_id]=[]

        return {
            "mesaj":"Oturum hafızası temizlendi",
            "durum":"yeni_sohbet"
        }


    return {
        "mesaj":"Session bulunamadı",
        "durum":"yeni_sohbet"
    }



if __name__=="__main__":

    print("🚀 HakkımVar Agent API Başlatılıyor...")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )