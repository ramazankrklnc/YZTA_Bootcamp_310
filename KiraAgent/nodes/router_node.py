from chains.router_chain import router_chain


def router_node(state):

    question = state.get("user_question", "")

    result = router_chain.invoke({"question":question})

    return {
        "route":result.route
    }