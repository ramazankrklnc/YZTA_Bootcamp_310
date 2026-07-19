"""
Rights Advisor Agent
--------------------
Kullanıcıya sahip olduğu kiracı haklarını sade Türkçe ile açıklar.
Hukuki değerlendirme sonuçlarına göre somut adım önerileri sunar.
"""

import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()


def advise_rights(evaluation_results: list, user_situation: str = "") -> dict:
    """
    Hukuki değerlendirme sonuçlarına göre kiracıya haklarını açıklar
    ve ne yapması gerektiğini adım adım anlatır.

    evaluation_results: legal_reasoner'dan gelen değerlendirme listesi
    user_situation: kullanıcının ek açıklaması (opsiyonel)
    """
    # Yasadışı bulunan maddeleri filtrele
    illegal_clauses = [r for r in evaluation_results if r.get("yasal_mi") is False]

    context = json.dumps(evaluation_results, ensure_ascii=False, indent=2)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen kiracı hakları konusunda uzman, samimi ve anlaşılır bir hukuk danışmanısın. "
                    "Teknik hukuk jargonu kullanmaktan kaçın, sade ve net Türkçe konuş. "
                    "JSON formatında şu alanları doldur:\n"
                    "- ozet: genel durum özeti (1-2 cümle)\n"
                    "- riskli_maddeler: yasadışı maddelerin listesi [{madde_no, sorun, ne_yapilmali}]\n"
                    "- acil_adimlar: hemen yapılması gerekenler (list of string)\n"
                    "- haklarim: kiracının bu durumda sahip olduğu haklar (list of string)\n"
                    "- ihtarname_gerekli_mi: true/false\n"
                    "- genel_tavsiye: genel öneri metni"
                )
            },
            {
                "role": "user",
                "content": (
                    f"Kira sözleşmesi değerlendirme sonuçları:\n{context}\n\n"
                    + (f"Kullanıcının durumu: {user_situation}" if user_situation else "")
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.3
    )

    raw = response.choices[0].message.content
    try:
        result = json.loads(raw)
        result["toplam_sorunlu_madde"] = len(illegal_clauses)
        return result
    except Exception:
        return {
            "ozet": raw,
            "riskli_maddeler": [],
            "acil_adimlar": [],
            "haklarim": [],
            "ihtarname_gerekli_mi": False,
            "genel_tavsiye": "",
            "toplam_sorunlu_madde": len(illegal_clauses)
        }


def generate_ihtarname(
    tenant_name: str,
    landlord_name: str,
    address: str,
    issues: list,
    current_rent: float = None,
    illegal_increase: float = None
) -> str:
    """
    Yasal ihtarname taslağı üretir.

    issues: [{"madde_no": X, "sorun": "..."}] listesi
    """
    issues_text = "\n".join([
        f"- Madde {i.get('madde_no', '?')}: {i.get('sorun', '')}"
        for i in issues
    ])

    rent_info = ""
    if current_rent and illegal_increase:
        rent_info = (
            f"\nMevcut kira: {current_rent} TL\n"
            f"Yasal sınırı aşan fazla talep: {illegal_increase} TL"
        )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen bir hukuk asistanısın. "
                    "Türk hukukuna uygun, noter formatında ihtarname taslağı oluştur. "
                    "Resmi ve ciddi bir dil kullan. Tarih alanını [TARİH] olarak bırak."
                )
            },
            {
                "role": "user",
                "content": (
                    f"İHTARNAME TASLAĞI OLUŞTUR:\n\n"
                    f"Kiracı: {tenant_name}\n"
                    f"Ev Sahibi: {landlord_name}\n"
                    f"Adres: {address}\n"
                    f"Tespit Edilen Sorunlar:\n{issues_text}"
                    f"{rent_info}"
                )
            }
        ],
        temperature=0.2
    )
    return response.choices[0].message.content
