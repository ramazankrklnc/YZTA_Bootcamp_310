from state_contract import ContractState
from chains.retrieval_chain import retrieval_chain



def contract_retriever_node(
    state: ContractState
) -> ContractState:


    summary = state["summary"]

    important_clauses = (
        state["important_clauses"]
    )

    keywords = (
        state["keywords"]
    )


    query = f"""
    Sözleşme Özeti:

    {summary}


    Önemli Maddeler:

    {important_clauses}


    Anahtar Kelimeler:

    {keywords}
    """



    result = retrieval_chain(
        query
    )


    state["retrieved_documents"] = (
        result["retrieved_documents"]
    )


    return state