from langgraph.graph import StateGraph, END

from state_petition import PetitionState

from nodes.PetitionTypeNode import petition_type_node
from nodes.PetitionRetrieverNode import petition_retriever_node
from nodes.PetitionGeneratorNode import petition_generator_node



graph = StateGraph(PetitionState)


graph.add_node(
    "petition_type",
    petition_type_node
)


graph.add_node(
    "retriever",
    petition_retriever_node
)


graph.add_node(
    "generator",
    petition_generator_node
)



graph.set_entry_point(
    "petition_type"
)


graph.add_edge(
    "petition_type",
    "retriever"
)


graph.add_edge(
    "retriever",
    "generator"
)


graph.add_edge(
    "generator",
    END
)


petition_graph = graph.compile()