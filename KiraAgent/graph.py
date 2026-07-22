from langgraph.graph import StateGraph, START, END

from state import AgentState

from nodes.router_node import router_node
from nodes.retriever_node import retriever_node
from nodes.generate_answer_node import generate_answer_node
from nodes.answer_check_node import answer_check_node

from dotenv import load_dotenv

load_dotenv()


workflow = StateGraph(
    AgentState
)

# ----------------------------------------------------
# NODES (DÜĞÜMLER)
# ----------------------------------------------------

workflow.add_node(
    "router",
    router_node
)

workflow.add_node(
    "retriever",
    retriever_node
)

workflow.add_node(
    "generate_answer",
    generate_answer_node
)

workflow.add_node(
    "answer_check",
    answer_check_node
)


# Kapsam dışı sorular için yanıt üreten düğüm
def out_of_scope_node(state: AgentState):
    return {
        "answer": "Bu soru kira hukuku kapsamında değerlendirilememektedir. Lütfen kira hukuku ile ilgili bir soru sorunuz.",
        "answer_valid": False,
        "answer_score": 0
    }


workflow.add_node(
    "out_of_scope",
    out_of_scope_node
)

# ----------------------------------------------------
# EDGES & CONDITIONALS (KENARLAR VE KOŞULLAR)
# ----------------------------------------------------

workflow.add_edge(
    START,
    "router"
)


# Router Kontrolü: Soru kira hukuku ile ilgili mi?
def route_decision(state: AgentState):
    if state.get("route", False):
        return "retriever"
    return "out_of_scope"


workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "retriever": "retriever",
        "out_of_scope": "out_of_scope"
    }
)

workflow.add_edge(
    "retriever",
    "generate_answer"
)

workflow.add_edge(
    "generate_answer",
    "answer_check"
)

# Cevap kontrol edildikten sonra akışı doğrudan END noktasına yönlendiriyoruz
workflow.add_edge(
    "answer_check",
    END
)

workflow.add_edge(
    "out_of_scope",
    END
)

# ----------------------------------------------------
# GRAPH COMPILATION
# ----------------------------------------------------

app = workflow.compile()