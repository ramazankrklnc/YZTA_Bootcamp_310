from chains.answer_check_chain import answer_check_chain


def answer_check_node(state):
    question=state["user_question"]
    documents=state["retrieved_documents"]
    answer=state["answer"]
    context_text = "\n\n".join(documents)


    llm_input={
        "question":question,
        "context":context_text,
        "answer":answer
    }
    result = answer_check_chain.invoke(llm_input)

    return {
        "answer_valid": result.is_valid,
        "answer_score": result.score,
    }