from contract_graph import contract_graph


contract_text = """
KİRA SÖZLEŞMESİ

Kiracı: Ahmet Yılmaz

Ev sahibi: Mehmet Kaya


1. Kira Bedeli

Aylık kira bedeli 15000 TL'dir.


2. Kira Artışı

Ev sahibi her yıl istediği oranda kira artışı yapabilir.


3. Depozito

Kiracı 3 aylık kira bedeli kadar depozito vermiştir.


4. Bakım ve Onarım

Kiracı taşınmazdaki bütün bakım ve onarım masraflarından sorumludur.


5. Tahliye

Ev sahibi istediği zaman sözleşmeyi sona erdirebilir.
"""


initial_state = {

    "contract_text": contract_text,

    "summary": "",

    "important_clauses": [],

    "keywords": [],

    "retrieved_documents": [],

    "analysis": "",

    "risk_score": 0,

    "final_response": {}

}



print("\n🚀 Contract Agent çalışıyor...\n")


result = contract_graph.invoke(
    initial_state
)



print("\n========== ÖZET ==========")

print(
    result["summary"]
)



print("\n========== ÖNEMLİ MADDELER ==========")

for item in result["important_clauses"]:
    print("-", item)



print("\n========== RETRIEVED DOCUMENTS ==========")

for doc in result["retrieved_documents"]:
    print("------------------------")
    print(doc[:500])



print("\n========== ANALİZ ==========")

print(
    result["analysis"]
)



print("\n========== RİSK PUANI ==========")

print(
    result["risk_score"]
)



print("\n========== FINAL RESPONSE ==========")

print(
    result["final_response"]
)