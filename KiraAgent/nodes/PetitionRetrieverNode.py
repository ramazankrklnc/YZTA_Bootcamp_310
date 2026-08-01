from state_petition import PetitionState
from chains.retrieval_chain import retrieval_chain



def petition_retriever_node(
    state: PetitionState
) -> PetitionState:


    query = f"""
    Dilekçe Türü:

    {state["petition_type"]}


    Kullanıcı Problemi:

    {state["user_problem"]}
    """


    result = retrieval_chain(
        query
    )


    state["retrieved_documents"] = (
        result["retrieved_documents"]
    )


    return state