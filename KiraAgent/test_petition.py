from petition_graph import app


print("\n🚀 Petition Agent çalışıyor...\n")


state = {

    "user_problem":
    "Ev sahibim depozitomu geri vermiyor. "
    "Kira sözleşmem bitti ancak verdiğim depozito tarafıma ödenmedi.",


    "petition_type":
    "",


    "retrieved_documents":
    [],


    "legal_articles":
    [],


    "petition_text":
    ""

}



result = app.invoke(
    state
)



print("\n========== DİLEKÇE TÜRÜ ==========\n")

print(
    result["petition_type"]
)



print("\n========== RETRIEVED DOCUMENTS ==========\n")


for doc in result["retrieved_documents"]:

    print("----------------------------")

    print(
        doc[:500]
    )



print("\n========== OLUŞTURULAN DİLEKÇE ==========\n")


print(
    result["petition_text"]
)