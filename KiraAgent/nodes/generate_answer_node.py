from chains.generate_answer_chain import generate_chain


def generate_answer_node(state):
    question = state["user_question"]
    documents = state["retrieved_documents"]
    messages = state.get("messages", [])

    context_text = "\n\n".join(documents)

    llm_input = {
        "question": question,
        "context": context_text,
        "messages": messages,
    }
    result = generate_chain.invoke(llm_input)

    return {"answer": result.answer}