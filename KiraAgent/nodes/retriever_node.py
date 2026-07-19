from chains.retrieval_chain import retrieval_chain


def retriever_node(state):

    result = retrieval_chain(
        state["question"]
    )


    return {

        "context":
            result["context"]

    }