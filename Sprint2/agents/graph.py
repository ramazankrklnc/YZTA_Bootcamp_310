"""
LangGraph Orchestration — HakkımVar
------------------------------------
Ajan akışı:
  1. contract_analyzer  → Sözleşmeyi madde madde parse et
  2. legal_reasoner     → Her maddeyi TBK'ya göre değerlendir
  3. rights_advisor     → Kullanıcıya haklarını açıkla
"""

from typing import TypedDict, Optional, List
from langgraph.graph import StateGraph, END
from agents.contract_analyzer import analyze_text, analyze_image
from agents.legal_reasoner import evaluate_all_clauses, check_rent_increase
from agents.rights_advisor import advise_rights, generate_ihtarname


# =====================================================
# STATE TANIMI
# =====================================================

class HakkimvarState(TypedDict):
    # Girdi
    contract_text: Optional[str]
    contract_image_path: Optional[str]
    user_situation: Optional[str]
    current_rent: Optional[float]
    proposed_rent: Optional[float]
    tufe_rate: Optional[float]
    tenant_name: Optional[str]
    landlord_name: Optional[str]
    address: Optional[str]

    # Ajan çıktıları
    parsed_clauses: Optional[List[dict]]
    legal_evaluations: Optional[List[dict]]
    rent_check: Optional[dict]
    rights_advice: Optional[dict]
    ihtarname: Optional[str]

    # Meta
    error: Optional[str]
    step: Optional[str]


# =====================================================
# NODE FONKSİYONLARI
# =====================================================

def node_analyze_contract(state: HakkimvarState) -> HakkimvarState:
    """1. Adım: Sözleşmeyi analiz et."""
    print("🔍 [1/3] Sözleşme analiz ediliyor...")
    try:
        if state.get("contract_image_path"):
            result = analyze_image(state["contract_image_path"])
        elif state.get("contract_text"):
            result = analyze_text(state["contract_text"])
        else:
            return {**state, "error": "Sözleşme metni veya görüntüsü gerekli.", "step": "error"}

        return {
            **state,
            "parsed_clauses": result.get("maddeler", []),
            "step": "analyze_done"
        }
    except Exception as e:
        return {**state, "error": str(e), "step": "error"}


def node_legal_reasoning(state: HakkimvarState) -> HakkimvarState:
    """2. Adım: Hukuki değerlendirme yap."""
    print("⚖️  [2/3] Hukuki değerlendirme yapılıyor...")
    try:
        clauses = state.get("parsed_clauses", [])
        evaluations = evaluate_all_clauses(clauses)

        rent_check = None
        if state.get("current_rent") and state.get("proposed_rent") and state.get("tufe_rate"):
            rent_check = check_rent_increase(
                state["current_rent"],
                state["proposed_rent"],
                state["tufe_rate"]
            )

        return {
            **state,
            "legal_evaluations": evaluations,
            "rent_check": rent_check,
            "step": "legal_done"
        }
    except Exception as e:
        return {**state, "error": str(e), "step": "error"}


def node_rights_advisor(state: HakkimvarState) -> HakkimvarState:
    """3. Adım: Kiracıya haklarını anlat ve ihtarname üret."""
    print("📋 [3/3] Hak danışmanlığı yapılıyor...")
    try:
        evaluations = state.get("legal_evaluations", [])
        advice = advise_rights(evaluations, state.get("user_situation", ""))

        ihtarname = None
        if advice.get("ihtarname_gerekli_mi") and state.get("tenant_name"):
            issues = [
                {"madde_no": r.get("madde_no"), "sorun": r.get("aciklama", "")}
                for r in evaluations
                if r.get("yasal_mi") is False
            ]
            rent_check = state.get("rent_check", {})
            ihtarname = generate_ihtarname(
                tenant_name=state.get("tenant_name", "Kiracı"),
                landlord_name=state.get("landlord_name", "Ev Sahibi"),
                address=state.get("address", ""),
                issues=issues,
                current_rent=rent_check.get("mevcut_kira"),
                illegal_increase=rent_check.get("fazla_talep")
            )

        return {
            **state,
            "rights_advice": advice,
            "ihtarname": ihtarname,
            "step": "done"
        }
    except Exception as e:
        return {**state, "error": str(e), "step": "error"}


# =====================================================
# GRAPH KURULUMU
# =====================================================

def build_graph():
    graph = StateGraph(HakkimvarState)

    graph.add_node("analyze_contract", node_analyze_contract)
    graph.add_node("legal_reasoning", node_legal_reasoning)
    graph.add_node("rights_advisor", node_rights_advisor)

    graph.set_entry_point("analyze_contract")
    graph.add_edge("analyze_contract", "legal_reasoning")
    graph.add_edge("legal_reasoning", "rights_advisor")
    graph.add_edge("rights_advisor", END)

    return graph.compile()


# =====================================================
# ANA FONKSİYON
# =====================================================

def run_analysis(
    contract_text: str = None,
    contract_image_path: str = None,
    user_situation: str = "",
    current_rent: float = None,
    proposed_rent: float = None,
    tufe_rate: float = None,
    tenant_name: str = None,
    landlord_name: str = None,
    address: str = None,
) -> HakkimvarState:
    """
    Tam analiz zincirini çalıştırır ve sonucu döndürür.
    """
    app = build_graph()

    initial_state: HakkimvarState = {
        "contract_text": contract_text,
        "contract_image_path": contract_image_path,
        "user_situation": user_situation,
        "current_rent": current_rent,
        "proposed_rent": proposed_rent,
        "tufe_rate": tufe_rate,
        "tenant_name": tenant_name,
        "landlord_name": landlord_name,
        "address": address,
        "parsed_clauses": None,
        "legal_evaluations": None,
        "rent_check": None,
        "rights_advice": None,
        "ihtarname": None,
        "error": None,
        "step": "start"
    }

    result = app.invoke(initial_state)
    return result
