from chains.petition_type_chain import petition_type_chain
from state_petition import PetitionState



def petition_type_node(
    state: PetitionState
) -> PetitionState:


    user_problem = state["user_problem"]


    response = petition_type_chain.invoke(
        {
            "user_problem": user_problem
        }
    )


    state["petition_type"] = (
        response.content.strip()
    )


    return state