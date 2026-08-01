import json

from chains.contract_analysis_chain import contract_analysis_chain
from state_contract import ContractState



def contract_analysis_node(
    state: ContractState
) -> ContractState:


    documents = "\n\n".join(
        state["retrieved_documents"]
    )


    clauses = "\n".join(
        state["important_clauses"]
    )


    response = contract_analysis_chain.invoke(
        {
            "summary": state["summary"],

            "important_clauses": clauses,

            "retrieved_documents": documents
        }
    )


    content = response.content.strip()


    print("\n========== ANALYSIS RESPONSE ==========")
    print(content)
    print("=======================================\n")


    # Markdown temizleme

    if "```json" in content:

        content = content.replace(
            "```json",
            ""
        )


    if "```" in content:

        content = content.replace(
            "```",
            ""
        )


    content = content.strip()



    try:

        result = json.loads(
            content
        )


    except json.JSONDecodeError:


        print(
            "Analysis JSON parse edilemedi"
        )


        result = {

            "risk_score":0,

            "summary":content,

            "risks":[],

            "missing_clauses":[],

            "tenant_advantages":[],

            "landlord_advantages":[],

            "recommendations":[]

        }



    state["risk_score"] = result.get(
        "risk_score",
        0
    )


    state["analysis"] = result.get(
        "summary",
        ""
    )


    state["final_response"] = result



    return state