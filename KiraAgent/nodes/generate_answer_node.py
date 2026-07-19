from chains.generate_answer_chain import generate_answer_chain


def generate_answer_node(state):

    answer=generate_answer_chain(
        question=state["question"],
        context=state["context"]
    )

    return {
        "answer":answer
    }