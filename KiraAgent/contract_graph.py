from langgraph.graph import StateGraph, END

from state_contract import ContractState

from nodes.ContractSummaryNode import (
    contract_summary_node
)

from nodes.ContractRetrieverNode import (
    contract_retriever_node
)

from nodes.ContractAnalysisNode import (
    contract_analysis_node
)



# Graph oluştur

workflow = StateGraph(
    ContractState
)



# Node ekleme

workflow.add_node(
    "summary",
    contract_summary_node
)


workflow.add_node(
    "retriever",
    contract_retriever_node
)


workflow.add_node(
    "analysis",
    contract_analysis_node
)



# Akış

workflow.set_entry_point(
    "summary"
)



workflow.add_edge(
    "summary",
    "retriever"
)


workflow.add_edge(
    "retriever",
    "analysis"
)


workflow.add_edge(
    "analysis",
    END
)



# Compile

contract_graph = workflow.compile()