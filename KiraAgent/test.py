from graph import app
from langchain_core.messages import HumanMessage, AIMessage

messages = []

print("=== HakkımVar Kira Hukuku Agent CLI Test Modu ===")
print("Çıkmak için 'q' yazabilirsiniz.\n")

while True:
    question = input("Sen : ").strip()

    if not question:
        continue

    if question.lower() == "q":
        print("\nTest sonlandırıldı.")
        break

    # Yeni AgentState yapısına tam uyumlu initial_state
    state = {
        "session_id": "cli_test_session",
        "user_question": question,
        "route": False,
        "router_reason": None,
        "retrieved_documents": [],
        "answer": "",
        "answer_valid": False,
        "answer_score": 0,
        "messages": messages
    }

    try:
        # Agent tetikleniyor
        result = app.invoke(state)

        agent_answer = result.get("answer", "Bir yanıt üretilemedi.")

        print("\nAgent :")
        print(agent_answer)
        print(f"\n[Kalite Puanı: {result.get('answer_score', 0)}/10 | Geçerli mi: {result.get('answer_valid', False)}]")
        print("-" * 50)

        # Mesaj geçmişini güncelleme
        messages.append(HumanMessage(content=question))
        messages.append(AIMessage(content=agent_answer))

    except Exception as e:
        print(f"\n[Hata]: Agent çalışırken bir sorun oluştu -> {e}\n")