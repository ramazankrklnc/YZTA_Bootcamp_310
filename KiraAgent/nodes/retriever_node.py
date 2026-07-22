from chains.retrieval_chain import retrieval_chain


def retriever_node(state):
    question = state["user_question"]

    result = retrieval_chain(question)

    return {
        "retrieved_documents": result["retrieved_documents"],
    }