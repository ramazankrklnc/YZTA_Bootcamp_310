from chains.answer_check_chain import answer_check_chain


def answer_check_node(state):

    result=answer_check_chain(
        question=state["question"],
        context=state["context"],
        answer=state["answer"]
    )

    return {
        "answer_valid":result.is_valid,
        "answer_score":result.score,
        "answer_check_reason":result.reason,
        "should_regenerate":result.should_regenerate
    }