"""
Document Analysis Agent
-----------------------
Kira sözleşmesi metnini alır, madde madde parse eder.
Görüntüden OCR için GPT-4o Vision kullanır.
"""

import base64
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()


def analyze_text(contract_text: str) -> dict:
    """
    Düz metin olarak verilen sözleşmeyi analiz eder.
    Maddeleri listeler ve her madde için kısa bir özet çıkarır.
    """
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen bir kira sözleşmesi analiz uzmanısın. "
                    "Verilen sözleşme metnindeki maddeleri tespit et ve her birini JSON formatında listele. "
                    "Şu alanları doldur: madde_no, baslik, icerik, risk_seviyesi (dusuk/orta/yuksek). "
                    "Yalnızca JSON array döndür, başka açıklama yazma."
                )
            },
            {
                "role": "user",
                "content": f"Aşağıdaki kira sözleşmesini analiz et:\n\n{contract_text}"
            }
        ],
        response_format={"type": "json_object"},
        temperature=0
    )
    raw = response.choices[0].message.content
    try:
        result = json.loads(raw)
        # Dönen nesne "maddeler" anahtarı içerebilir
        if "maddeler" in result:
            return {"maddeler": result["maddeler"]}
        # Ya da direkt liste olabilir
        if isinstance(result, list):
            return {"maddeler": result}
        return result
    except Exception:
        return {"maddeler": [], "ham_cevap": raw}


def analyze_image(image_path: str) -> dict:
    """
    Sözleşme fotoğrafını OCR ile okur ve analiz eder.
    image_path: lokal dosya yolu
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")

    ext = image_path.split(".")[-1].lower()
    mime = "image/jpeg" if ext in ["jpg", "jpeg"] else f"image/{ext}"

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "Sen bir kira sözleşmesi analiz uzmanısın. "
                    "Görüntüdeki sözleşmeyi oku ve maddeleri JSON formatında listele. "
                    "Her madde için: madde_no, baslik, icerik, risk_seviyesi (dusuk/orta/yuksek). "
                    "Yalnızca JSON object döndür."
                )
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Bu kira sözleşmesi görüntüsünü analiz et:"},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:{mime};base64,{image_data}"}
                    }
                ]
            }
        ],
        response_format={"type": "json_object"},
        temperature=0
    )
    raw = response.choices[0].message.content
    try:
        result = json.loads(raw)
        if "maddeler" in result:
            return {"maddeler": result["maddeler"]}
        return result
    except Exception:
        return {"maddeler": [], "ham_cevap": raw}
