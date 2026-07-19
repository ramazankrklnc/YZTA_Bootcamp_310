"""
Legal Reasoning Agent
---------------------
Sözleşmedeki maddeleri Türk Borçlar Kanunu'na göre karşılaştırır.
RAG ile ilgili kanun maddelerini getirir ve hukuki değerlendirme yapar.
"""

import sys
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# VectorDatabase klasörüne yol ekle
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "VectorDatabase"))
from retriever import search_law, build_rag_chain  # noqa: E402

load_dotenv()
client = OpenAI()


def evaluate_clause(clause: dict) -> dict:
    """
    Tek bir sözleşme maddesini hukuki açıdan değerlendirir.
    RAG ile TBK'dan ilgili maddeleri getirir, GPT-4o ile karşılaştırır.
    """
    icerik = clause.get("icerik", "")
    madde_no = clause.get("madde_no", "?")

    # RAG: ilgili kanun maddelerini getir
    kanun_maddeleri = search_law(icerik)
    kanun_metni = "\n\n".join([
        f"[{m['source']}]: {m['content']}" for m in kanun_maddeleri
    ])

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen Türk kira hukuku konusunda uzman bir yapay zekâsın. "
                    "Verilen sözleşme maddesini, Türk Borçlar Kanunu ve kira hukuku mevzuatına göre değerlendir. "
                    "JSON formatında şu alanları doldur: "
                    "yasal_mi (true/false), "
                    "aciklama (neden yasal/yasadışı olduğu), "
                    "ilgili_tbk_maddeleri (list of string), "
                    "oneri (kiracıya ne yapması gerektiği). "
                    "Yalnızca JSON döndür."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Sözleşme Maddesi #{madde_no}:\n{icerik}\n\n"
                    f"İlgili Kanun Metinleri:\n{kanun_metni}"
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0
    )

    raw = response.choices[0].message.content
    try:
        result = json.loads(raw)
        result["madde_no"] = madde_no
        result["icerik"] = icerik
        return result
    except Exception:
        return {
            "madde_no": madde_no,
            "icerik": icerik,
            "yasal_mi": None,
            "aciklama": raw,
            "ilgili_tbk_maddeleri": [],
            "oneri": ""
        }


def evaluate_all_clauses(maddeler: list) -> list:
    """
    Tüm sözleşme maddelerini değerlendirir.
    """
    results = []
    for clause in maddeler:
        print(f"  ⚖️  Madde #{clause.get('madde_no', '?')} değerlendiriliyor...")
        result = evaluate_clause(clause)
        results.append(result)
    return results


def check_rent_increase(current_rent: float, proposed_rent: float, tufe_rate: float) -> dict:
    """
    Kira artışının yasal sınır içinde olup olmadığını kontrol eder.
    tufe_rate: son 12 aylık TÜFE ortalaması (örn. 0.65 = %65)
    """
    max_legal = current_rent * (1 + tufe_rate)
    fazla_miktar = max(0, proposed_rent - max_legal)
    yasal_mi = proposed_rent <= max_legal

    return {
        "mevcut_kira": current_rent,
        "talep_edilen_kira": proposed_rent,
        "tufe_orani": f"%{tufe_rate * 100:.1f}",
        "yasal_maksimum": round(max_legal, 2),
        "fazla_talep": round(fazla_miktar, 2),
        "yasal_mi": yasal_mi,
        "aciklama": (
            f"Yasal artış tavanı TÜFE oranı olan %{tufe_rate*100:.1f} ile "
            f"{round(max_legal, 2)} TL'dir. "
            + (
                f"Talep edilen {proposed_rent} TL yasal sınırı {round(fazla_miktar, 2)} TL aşmaktadır."
                if not yasal_mi
                else "Talep edilen kira yasal sınır içindedir."
            )
        )
    }
