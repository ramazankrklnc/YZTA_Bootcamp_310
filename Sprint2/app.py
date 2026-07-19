"""
HakkımVar — Streamlit Kullanıcı Arayüzü
-----------------------------------------
Çalıştır: streamlit run app.py
"""

import sys
import os
import streamlit as st

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.graph import run_analysis
from agents.legal_reasoner import check_rent_increase

# =====================================================
# SAYFA AYARLARI
# =====================================================
st.set_page_config(
    page_title="HakkımVar — Kiracı Hak Asistanı",
    page_icon="⚖️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# =====================================================
# CSS STİL
# =====================================================
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    .main { background: #0f1117; }

    .hero-title {
        font-size: 3rem;
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 0.5rem;
    }
    .hero-sub {
        text-align: center;
        color: #9ca3af;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }
    .risk-card-high {
        background: linear-gradient(135deg, #450a0a, #7f1d1d);
        border: 1px solid #dc2626;
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    .risk-card-medium {
        background: linear-gradient(135deg, #451a03, #92400e);
        border: 1px solid #d97706;
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    .risk-card-low {
        background: linear-gradient(135deg, #052e16, #14532d);
        border: 1px solid #16a34a;
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
    }
    .stat-box {
        background: #1e2230;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        border: 1px solid #374151;
    }
    .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #a855f7;
    }
    .stat-label {
        color: #9ca3af;
        font-size: 0.9rem;
    }
    .ihtarname-box {
        background: #1e2230;
        border: 1px solid #4f46e5;
        border-radius: 12px;
        padding: 1.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        white-space: pre-wrap;
        color: #e5e7eb;
    }
    .success-banner {
        background: linear-gradient(135deg, #052e16, #14532d);
        border: 1px solid #22c55e;
        border-radius: 12px;
        padding: 1rem 1.5rem;
        color: #bbf7d0;
    }
    .warning-banner {
        background: linear-gradient(135deg, #450a0a, #7f1d1d);
        border: 1px solid #ef4444;
        border-radius: 12px;
        padding: 1rem 1.5rem;
        color: #fca5a5;
    }
    .step-badge {
        background: #6366f1;
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.85rem;
        margin-right: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)


# =====================================================
# SESSION STATE
# =====================================================
if "analysis_result" not in st.session_state:
    st.session_state.analysis_result = None
if "history" not in st.session_state:
    st.session_state.history = []


# =====================================================
# SIDEBAR — KULLANICI BİLGİLERİ
# =====================================================
with st.sidebar:
    st.image("https://img.icons8.com/color/96/scales--v1.png", width=80)
    st.title("⚖️ HakkımVar")
    st.caption("Kiracı Hak Asistanı — Sprint 2")

    st.divider()
    st.subheader("👤 Bilgileriniz (opsiyonel)")
    tenant_name = st.text_input("Adınız Soyadınız", placeholder="Ahmet Yılmaz")
    landlord_name = st.text_input("Ev Sahibi Adı", placeholder="Mehmet Kaya")
    address = st.text_area("Kiralık Adres", placeholder="İstanbul, Kadıköy...", height=80)

    st.divider()
    st.subheader("💰 Kira Artışı Kontrolü")
    current_rent = st.number_input("Mevcut Kira (TL)", min_value=0.0, value=0.0, step=100.0)
    proposed_rent = st.number_input("Talep Edilen Kira (TL)", min_value=0.0, value=0.0, step=100.0)
    tufe_rate = st.slider("TÜFE Oranı (%)", min_value=0.0, max_value=150.0, value=65.0, step=0.5) / 100

    if st.button("💡 Kira Kontrolü Yap", use_container_width=True):
        if current_rent > 0 and proposed_rent > 0:
            result = check_rent_increase(current_rent, proposed_rent, tufe_rate)
            if result["yasal_mi"]:
                st.success(f"✅ Yasal! Max: {result['yasal_maksimum']} TL")
            else:
                st.error(f"❌ Yasadışı! {result['fazla_talep']} TL fazla talep ediliyor.")
            st.json(result)

    st.divider()
    if st.session_state.history:
        st.subheader("📜 Geçmiş Analizler")
        for i, h in enumerate(reversed(st.session_state.history[-5:])):
            st.caption(f"Analiz #{len(st.session_state.history) - i}: {h.get('ozet', '')[:60]}...")


# =====================================================
# ANA SAYFA
# =====================================================
st.markdown('<div class="hero-title">⚖️ HakkımVar</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="hero-sub">Kira sözleşmendeki yasal sorunları saniyeler içinde tespit et</div>',
    unsafe_allow_html=True
)

# =====================================================
# TABS
# =====================================================
tab1, tab2, tab3 = st.tabs(["📄 Sözleşme Analizi", "📊 Sonuçlar", "📜 İhtarname"])

with tab1:
    st.subheader("Sözleşmenizi Yükleyin")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("**<span class='step-badge'>1</span> Yükleme Yöntemi Seçin**", unsafe_allow_html=True)
        input_method = st.radio(
            "",
            ["📝 Metin Yapıştır", "🖼️ Fotoğraf/PDF Yükle"],
            label_visibility="collapsed"
        )

    with col2:
        st.markdown("**<span class='step-badge'>2</span> Ek Bilgi (Opsiyonel)**", unsafe_allow_html=True)
        user_situation = st.text_area(
            "Durumunuzu açıklayın",
            placeholder="Örn: Ev sahibim kira sözleşmesinde olmayan masrafları benden istiyor...",
            height=120,
            label_visibility="collapsed"
        )

    st.divider()

    contract_text = None
    image_path = None

    if input_method == "📝 Metin Yapıştır":
        contract_text = st.text_area(
            "Kira Sözleşmesi Metni",
            placeholder="Kira sözleşmenizin metnini buraya yapıştırın...",
            height=300
        )
    else:
        uploaded_file = st.file_uploader(
            "Sözleşme fotoğrafı veya PDF yükleyin",
            type=["jpg", "jpeg", "png", "pdf"]
        )
        if uploaded_file:
            ext = uploaded_file.name.split(".")[-1].lower()
            temp_path = f"temp_upload.{ext}"
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())
            image_path = temp_path
            if ext in ["jpg", "jpeg", "png"]:
                st.image(uploaded_file, caption="Yüklenen sözleşme", use_column_width=True)
            else:
                st.success(f"✅ PDF yüklendi: {uploaded_file.name}")

    st.divider()

    col_btn1, col_btn2, col_btn3 = st.columns([1, 2, 1])
    with col_btn2:
        analyze_btn = st.button(
            "🚀 Analiz Başlat",
            use_container_width=True,
            type="primary",
            disabled=(not contract_text and not image_path)
        )

    if analyze_btn:
        with st.spinner("🤖 Yapay zekâ sözleşmenizi analiz ediyor..."):
            progress = st.progress(0, text="Sözleşme okunuyor...")

            progress.progress(30, text="⚖️ Hukuki değerlendirme yapılıyor...")

            result = run_analysis(
                contract_text=contract_text,
                contract_image_path=image_path,
                user_situation=user_situation,
                current_rent=current_rent if current_rent > 0 else None,
                proposed_rent=proposed_rent if proposed_rent > 0 else None,
                tufe_rate=tufe_rate if tufe_rate > 0 else None,
                tenant_name=tenant_name or None,
                landlord_name=landlord_name or None,
                address=address or None,
            )

            progress.progress(100, text="✅ Analiz tamamlandı!")

            if result.get("error"):
                st.error(f"❌ Hata: {result['error']}")
            else:
                st.session_state.analysis_result = result
                advice = result.get("rights_advice", {}) or {}
                st.session_state.history.append(advice)
                st.success("✅ Analiz tamamlandı! 'Sonuçlar' sekmesine geçin.")
                st.balloons()


# =====================================================
# SONUÇLAR TAB
# =====================================================
with tab2:
    result = st.session_state.analysis_result

    if not result:
        st.info("💡 Önce 'Sözleşme Analizi' sekmesinde analiz başlatın.")
    else:
        advice = result.get("rights_advice", {}) or {}
        rent_check = result.get("rent_check")

        # Özet banner
        sorunlu = advice.get("toplam_sorunlu_madde", 0)
        if sorunlu == 0:
            st.markdown(
                '<div class="success-banner">✅ <strong>Sözleşmeniz temiz görünüyor!</strong> '
                'Yasal açıdan sorunlu madde tespit edilmedi.</div>',
                unsafe_allow_html=True
            )
        else:
            st.markdown(
                f'<div class="warning-banner">⚠️ <strong>{sorunlu} sorunlu madde tespit edildi!</strong> '
                f'Aşağıda detayları ve öneriler yer almaktadır.</div>',
                unsafe_allow_html=True
            )

        st.divider()

        # İstatistikler
        evaluations = result.get("legal_evaluations", []) or []
        total = len(evaluations)
        illegal = sum(1 for e in evaluations if e.get("yasal_mi") is False)
        legal = sum(1 for e in evaluations if e.get("yasal_mi") is True)

        col1, col2, col3 = st.columns(3)
        with col1:
            st.markdown(f'<div class="stat-box"><div class="stat-number">{total}</div><div class="stat-label">Toplam Madde</div></div>', unsafe_allow_html=True)
        with col2:
            st.markdown(f'<div class="stat-box"><div class="stat-number" style="color:#ef4444">{illegal}</div><div class="stat-label">Sorunlu Madde</div></div>', unsafe_allow_html=True)
        with col3:
            st.markdown(f'<div class="stat-box"><div class="stat-number" style="color:#22c55e">{legal}</div><div class="stat-label">Yasal Madde</div></div>', unsafe_allow_html=True)

        st.divider()

        # Kira kontrolü
        if rent_check:
            st.subheader("💰 Kira Artışı Değerlendirmesi")
            cols = st.columns(4)
            cols[0].metric("Mevcut Kira", f"{rent_check.get('mevcut_kira', 0)} TL")
            cols[1].metric("Talep Edilen", f"{rent_check.get('talep_edilen_kira', 0)} TL")
            cols[2].metric("Yasal Maksimum", f"{rent_check.get('yasal_maksimum', 0)} TL")
            delta = rent_check.get("fazla_talep", 0)
            cols[3].metric("Fazla Talep", f"{delta} TL", delta_color="inverse")
            st.divider()

        # Riskli maddeler
        riskli = advice.get("riskli_maddeler", [])
        if riskli:
            st.subheader("🚨 Riskli Maddeler")
            for madde in riskli:
                with st.expander(f"📌 Madde #{madde.get('madde_no', '?')} — {madde.get('sorun', '')[:60]}"):
                    st.write(f"**Sorun:** {madde.get('sorun', '')}")
                    st.write(f"**Ne yapmalısınız:** {madde.get('ne_yapilmali', '')}")

        # Haklarınız
        st.subheader("📋 Haklarınız")
        haklarim = advice.get("haklarim", [])
        for hak in haklarim:
            st.success(f"✅ {hak}")

        # Acil adımlar
        st.subheader("⚡ Acil Adımlar")
        adimlar = advice.get("acil_adimlar", [])
        for i, adim in enumerate(adimlar, 1):
            st.info(f"**{i}.** {adim}")

        # Genel tavsiye
        if advice.get("genel_tavsiye"):
            st.subheader("💡 Genel Tavsiye")
            st.write(advice["genel_tavsiye"])


# =====================================================
# İHTARNAME TAB
# =====================================================
with tab3:
    result = st.session_state.analysis_result

    if not result:
        st.info("💡 Önce analiz yapın, ardından ihtarname oluşturabilirsiniz.")
    else:
        advice = result.get("rights_advice", {}) or {}
        ihtarname_text = result.get("ihtarname")

        if advice.get("ihtarname_gerekli_mi"):
            st.warning("⚠️ **İhtarname gönderilmesi önerilmektedir!**")

        if ihtarname_text:
            st.subheader("📜 İhtarname Taslağı")
            st.markdown(
                f'<div class="ihtarname-box">{ihtarname_text}</div>',
                unsafe_allow_html=True
            )
            st.download_button(
                label="⬇️ İhtarnameyi İndir (.txt)",
                data=ihtarname_text,
                file_name="ihtarname_taslaği.txt",
                mime="text/plain"
            )
        else:
            st.info(
                "İhtarname için lütfen soldaki panelden **Ad Soyad**, "
                "**Ev Sahibi** ve **Adres** bilgilerini doldurun, "
                "ardından analizi tekrar başlatın."
            )

# =====================================================
# FOOTER
# =====================================================
st.divider()
st.markdown(
    '<div style="text-align:center; color:#4b5563; font-size:0.8rem;">'
    '⚖️ HakkımVar | YZTA Bootcamp 310 | Sprint 2 | '
    'Bu uygulama hukuki tavsiye yerine geçmez.</div>',
    unsafe_allow_html=True
)
