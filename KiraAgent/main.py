from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import uuid4
import uvicorn

from langchain_core.messages import HumanMessage, AIMessage
from graph import app as graph

from contract_graph import contract_graph
from petition_graph import petition_graph

app = FastAPI(
    title="HakkımVar Kira Hukuku Agent API",
    description="RAG destekli kira hukuku soru cevap sistemi",
    version="1.0.0"
)

# Oturum bazlı sohbet geçmişini saklayan bellek
sessions: Dict[str, List[Any]] = {}


class SoruRequest(BaseModel):
    session_id: Optional[str] = None
    user_question: str


class ResetRequest(BaseModel):
    session_id: str

class ContractRequest(BaseModel):
    contract_text: str


class PetitionRequest(BaseModel):
    user_problem: str

@app.get("/")
async def root():
    return {
        "status": "active",
        "message": "HakkımVar Kira Hukuku Agent çalışıyor"
    }


@app.post("/sor")
async def soru_sor(data: SoruRequest):
    try:
        # Oturum ID yönetimi
        if not data.session_id:
            session_id = str(uuid4())
            sessions[session_id] = []
        else:
            session_id = data.session_id
            if session_id not in sessions:
                sessions[session_id] = []

        mevcut_hafiza = sessions[session_id]

        # Yeni AgentState yapısı ile %100 uyumlu initial_state
        initial_state = {
            "session_id": session_id,
            "user_question": data.user_question,
            "route": False,
            "router_reason": None,
            "retrieved_documents": [],
            "answer": "",
            "answer_valid": False,
            "answer_score": 0,
            "messages": mevcut_hafiza
        }

        # LangGraph asenkron olarak tetikleniyor
        result = await graph.ainvoke(initial_state)

        cevap = result.get("answer", "")

        # LangChain mesaj geçmişine ekleme
        mevcut_hafiza.append(HumanMessage(content=data.user_question))
        mevcut_hafiza.append(AIMessage(content=cevap))

        sessions[session_id] = mevcut_hafiza

        return {
    "session_id": session_id,
    "answer": cevap,
    "score": result.get("answer_score", 0),
    "is_succes": result.get("answer_valid", False),
    "memory_cache": len(mevcut_hafiza) // 2
}

    except Exception as e:
        import traceback

        traceback.print_exc()

        raise HTTPException(
        status_code=500,
        detail=str(e)
    )


@app.post("/temizle")
async def hafiza_temizle(data: ResetRequest):
    if data.session_id in sessions:
        sessions[data.session_id] = []
        return {
            "mesaj": "Oturum hafızası temizlendi",
            "durum": "yeni_sohbet"
        }

    return {
        "mesaj": "Session bulunamadı",
        "durum": "yeni_sohbet"
    }

@app.post("/contract/analyze")
async def analyze_contract(data: ContractRequest):

    try:

        initial_state = {

            "contract_text": data.contract_text,

            "summary": "",

            "important_clauses": [],

            "keywords": [],

            "retrieved_documents": [],

            "analysis": "",

            "risk_score": 0,

            "final_response": {}

        }


        result = await contract_graph.ainvoke(
            initial_state
        )


        return {

            "success": True,

            "risk_score": result.get(
                "risk_score",
                0
            ),

            "analysis": result.get(
                "final_response",
                {}
            )

        }

    except Exception as e:

        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/petition")
async def create_petition(
    data: PetitionRequest
):

    try:

        initial_state = {
    "user_problem": data.user_problem,
    "petition_type": "",
    "retrieved_documents": [],
    "legal_articles": [],
    "petition_text": ""
}


        result = await petition_graph.ainvoke(
            initial_state
        )


        return {
    "petition": result.get("petition_text", ""),
    "legal_articles": result.get("legal_articles", [])
}

    except Exception as e:

        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


if __name__ == "__main__":
    print("🚀 HakkımVar Agent API Başlatılıyor...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )