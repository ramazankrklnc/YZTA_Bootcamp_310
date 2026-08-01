import json

from chains.contract_summary_chain import contract_summary_chain
from state_contract import ContractState



def contract_summary_node(
    state: ContractState
) -> ContractState:


    contract_text = state["contract_text"]


    response = contract_summary_chain.invoke(
        {
            "contract_text": contract_text
        }
    )


    content = response.content.strip()


    print("\n========== SUMMARY CHAIN RESPONSE ==========")
    print(content)
    print("============================================\n")


    # Markdown JSON temizleme
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
            "JSON parse edilemedi. Ham cevap:"
        )

        print(content)


        result = {
            "summary": content,
            "important_clauses": [],
            "keywords": []
        }



    state["summary"] = result.get(
        "summary",
        ""
    )


    state["important_clauses"] = result.get(
        "important_clauses",
        []
    )


    state["keywords"] = result.get(
        "keywords",
        []
    )


    return state