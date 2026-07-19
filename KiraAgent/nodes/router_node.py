from chains.router_chain import router_chain


def router_node(state):

    question = state["user_question"]


    result = router_chain(
        question
    )


    return {

        "intent": result.intent,

        "router_reason": result.reason

    }