"""
Pydantic modeller — HakkımVar Backend
"""
from pydantic import BaseModel
from typing import Optional, List


class ContractTextRequest(BaseModel):
    contract_text: str
    user_situation: Optional[str] = ""
    current_rent: Optional[float] = None
    proposed_rent: Optional[float] = None
    tufe_rate: Optional[float] = None
    tenant_name: Optional[str] = None
    landlord_name: Optional[str] = None
    address: Optional[str] = None


class RentCheckRequest(BaseModel):
    current_rent: float
    proposed_rent: float
    tufe_rate: float


class IhtarnameRequest(BaseModel):
    tenant_name: str
    landlord_name: str
    address: str
    issues: List[dict]
    current_rent: Optional[float] = None
    illegal_increase: Optional[float] = None


class LawSearchRequest(BaseModel):
    query: str


class RiskItem(BaseModel):
    madde_no: str
    sorun: str
    ne_yapilmali: str


class AnalysisResponse(BaseModel):
    ozet: Optional[str] = None
    riskli_maddeler: Optional[List[dict]] = []
    acil_adimlar: Optional[List[str]] = []
    haklarim: Optional[List[str]] = []
    ihtarname_gerekli_mi: Optional[bool] = False
    genel_tavsiye: Optional[str] = None
    toplam_sorunlu_madde: Optional[int] = 0
    ihtarname: Optional[str] = None
    rent_check: Optional[dict] = None
    error: Optional[str] = None
