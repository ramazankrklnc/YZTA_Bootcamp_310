from state_petition import PetitionState
from chains.petition_generator_chain import petition_generator_chain



def petition_generator_node(
    state: PetitionState
) -> PetitionState:


    documents = "\n\n".join(
        state["retrieved_documents"]
    )


    response = petition_generator_chain.invoke(
        {
            "petition_type":
            state["petition_type"],

            "user_problem":
            state["user_problem"],

            "legal_documents":
            documents
        }
    )


    state["petition_text"] = (
        response.content
    )


    return state