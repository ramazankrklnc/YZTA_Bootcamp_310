from langgraph.graph import StateGraph,START,END

from state import AgentState

from nodes.router_node import router_node
from nodes.retriever_node import retriever_node
from nodes.generate_answer_node import generate_answer_node
from nodes.answer_check_node import answer_check_node
from dotenv import load_dotenv
load_dotenv()


# =====================================================
# GRAPH OLUŞTUR
# =====================================================

workflow=StateGraph(
    AgentState
)


# =====================================================
# NODE EKLEME
# =====================================================

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


# =====================================================
# EDGE
# =====================================================


workflow.add_edge(
    START,
    "router"
)


workflow.add_edge(
    "router",
    "retriever"
)


workflow.add_edge(
    "retriever",
    "generate_answer"
)


workflow.add_edge(
    "generate_answer",
    "answer_check"
)



# =====================================================
# ANSWER CHECK ROUTER
# =====================================================

def check_answer(state):

    if state["should_regenerate"]:
        return "regenerate"

    return "end"



workflow.add_conditional_edges(
    "answer_check",

    check_answer,

    {
        "regenerate":"generate_answer",
        "end":END
    }
)



# =====================================================
# COMPILE
# =====================================================

app=workflow.compile()