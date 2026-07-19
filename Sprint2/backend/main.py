"""
FastAPI Backend — HakkımVar
---------------------------
Endpoints:
  POST /analyze/text    → Metin sözleşme analizi
  POST /analyze/image   → Fotoğraf sözleşme analizi (OCR)
  POST /rent-check      → Kira artışı kontrolü
  POST /law-search      → Kanun maddesi arama
  POST /ihtarname       → İhtarname üretimi
  GET  /health          → Sağlık kontrolü
"""

import sys
import os

# Proje kök dizinini path'e ekle
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid

from backend.models import (
    ContractTextRequest, RentCheckRequest,
    IhtarnameRequest, LawSearchRequest, AnalysisResponse
)
from agents.graph import run_analysis
from agents.legal_reasoner import check_rent_increase
from agents.rights_advisor import generate_ihtarname
from VectorDatabase.retriever import search_law

app = FastAPI(
    title="HakkımVar API",
    description="Kiracı hakları analiz sistemi — yapay zekâ destekli hukuk asistanı",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =====================================================
# ENDPOINTS
# =====================================================

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "2.0.0", "service": "HakkımVar API"}


@app.post("/analyze/text", response_model=AnalysisResponse)
def analyze_contract_text(req: ContractTextRequest):
    """
    Metin olarak verilen kira sözleşmesini analiz eder.
    Tüm ajan zincirini çalıştırır.
    """
    result = run_analysis(
        contract_text=req.contract_text,
        user_situation=req.user_situation,
        current_rent=req.current_rent,
        proposed_rent=req.proposed_rent,
        tufe_rate=req.tufe_rate,
        tenant_name=req.tenant_name,
        landlord_name=req.landlord_name,
        address=req.address,
    )

    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])

    advice = result.get("rights_advice", {}) or {}
    return AnalysisResponse(
        ozet=advice.get("ozet"),
        riskli_maddeler=advice.get("riskli_maddeler", []),
        acil_adimlar=advice.get("acil_adimlar", []),
        haklarim=advice.get("haklarim", []),
        ihtarname_gerekli_mi=advice.get("ihtarname_gerekli_mi", False),
        genel_tavsiye=advice.get("genel_tavsiye"),
        toplam_sorunlu_madde=advice.get("toplam_sorunlu_madde", 0),
        ihtarname=result.get("ihtarname"),
        rent_check=result.get("rent_check"),
    )


@app.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_contract_image(
    file: UploadFile = File(...),
    user_situation: str = "",
    tenant_name: str = None,
    landlord_name: str = None,
    address: str = None,
):
    """
    Fotoğraf/PDF olarak yüklenen kira sözleşmesini OCR ile analiz eder.
    """
    ext = file.filename.split(".")[-1].lower()
    temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.{ext}")

    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        result = run_analysis(
            contract_image_path=temp_path,
            user_situation=user_situation,
            tenant_name=tenant_name,
            landlord_name=landlord_name,
            address=address,
        )
    finally:
        os.remove(temp_path)

    if result.get("error"):
        raise HTTPException(status_code=500, detail=result["error"])

    advice = result.get("rights_advice", {}) or {}
    return AnalysisResponse(
        ozet=advice.get("ozet"),
        riskli_maddeler=advice.get("riskli_maddeler", []),
        acil_adimlar=advice.get("acil_adimlar", []),
        haklarim=advice.get("haklarim", []),
        ihtarname_gerekli_mi=advice.get("ihtarname_gerekli_mi", False),
        genel_tavsiye=advice.get("genel_tavsiye"),
        toplam_sorunlu_madde=advice.get("toplam_sorunlu_madde", 0),
        ihtarname=result.get("ihtarname"),
    )


@app.post("/rent-check")
def rent_check(req: RentCheckRequest):
    """Kira artışının yasal sınır içinde olup olmadığını kontrol eder."""
    return check_rent_increase(req.current_rent, req.proposed_rent, req.tufe_rate)


@app.post("/law-search")
def law_search(req: LawSearchRequest):
    """Verilen sorguya göre ilgili kanun maddelerini getirir."""
    results = search_law(req.query)
    return {"results": results}


@app.post("/ihtarname")
def create_ihtarname(req: IhtarnameRequest):
    """İhtarname taslağı üretir."""
    text = generate_ihtarname(
        tenant_name=req.tenant_name,
        landlord_name=req.landlord_name,
        address=req.address,
        issues=req.issues,
        current_rent=req.current_rent,
        illegal_increase=req.illegal_increase,
    )
    return {"ihtarname": text}


# =====================================================
# ÇALIŞTIIRMA: uvicorn backend.main:app --reload
# =====================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
