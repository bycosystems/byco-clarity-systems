"""
ByCo Systems — Générateur PDF comparatif pour Les Sens · Nice
Produit : public/demo/les-sens/comparatif.pdf
Usage   : python scripts/gen_pdf_les_sens.py
"""

import subprocess, sys, os

# ─── Dépendances ────────────────────────────────────────────────
def ensure(pkg):
    try:
        __import__(pkg)
    except ImportError:
        print(f"Installation de {pkg}…")
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "-q"])

ensure("reportlab")

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# ─── Palette ────────────────────────────────────────────────────
ARDOISE    = colors.HexColor("#2C3E50")
ARDOISE_DK = colors.HexColor("#1E2D3D")
OCRE       = colors.HexColor("#D4A853")
OCRE_LT    = colors.HexColor("#F0D898")
CREAM      = colors.HexColor("#F8F4EE")
TERRACOTTA = colors.HexColor("#C17F5A")
INK        = colors.HexColor("#1A1A1A")
INK_SOFT   = colors.HexColor("#6B6560")
WHITE      = colors.white
RED_ERR    = colors.HexColor("#C0392B")
GREEN_OK   = colors.HexColor("#27AE60")
LINE       = colors.HexColor("#DDD5C8")

W, H = A4  # 210 × 297 mm

# ─── Chemin de sortie ───────────────────────────────────────────
OUT_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public", "demo", "les-sens"
)
os.makedirs(OUT_DIR, exist_ok=True)
OUT_PATH = os.path.join(OUT_DIR, "comparatif.pdf")

# ─── Styles texte ───────────────────────────────────────────────
def style(name, **kw):
    defaults = dict(
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=INK,
        spaceBefore=0,
        spaceAfter=0,
    )
    defaults.update(kw)
    return ParagraphStyle(name, **defaults)

S_TITLE  = style("title",  fontName="Helvetica-Bold", fontSize=18, textColor=WHITE,
                  alignment=TA_CENTER, leading=24, spaceAfter=3)
S_SUB    = style("sub",    fontName="Helvetica-Oblique", fontSize=11, textColor=OCRE_LT,
                  alignment=TA_CENTER, leading=16)
S_H2     = style("h2",     fontName="Helvetica-Bold", fontSize=13, textColor=ARDOISE,
                  leading=18, spaceBefore=6)
S_BODY   = style("body",   fontSize=10, leading=15, textColor=INK_SOFT)
S_BOLD   = style("bold",   fontName="Helvetica-Bold", fontSize=10, textColor=INK)
S_SMALL  = style("small",  fontSize=8.5, textColor=INK_SOFT, leading=12)
S_OCRE   = style("ocre",   fontName="Helvetica-Bold", fontSize=10, textColor=OCRE)
S_WHITE  = style("white",  fontName="Helvetica-Bold", fontSize=11, textColor=WHITE,
                  alignment=TA_CENTER, leading=16)
S_WHITE_SM = style("white_sm", fontSize=9.5, textColor=WHITE, alignment=TA_CENTER, leading=14)
S_LOSS   = style("loss",   fontName="Helvetica-Bold", fontSize=10.5, textColor=INK, leading=16)
S_LOSS_V = style("loss_v", fontName="Helvetica-Bold", fontSize=10.5, textColor=RED_ERR,
                  alignment=TA_RIGHT, leading=16)
S_CHECK  = style("check",  fontSize=10, textColor=GREEN_OK, leading=15)
S_FOOTER = style("footer", fontSize=8, textColor=INK_SOFT, alignment=TA_CENTER, leading=12)

# ─── Helpers ────────────────────────────────────────────────────
def sp(n=6):
    return Spacer(1, n)

def hr(color=LINE, width=0.5):
    return HRFlowable(width="100%", thickness=width, color=color, spaceAfter=6, spaceBefore=6)

def header_band(title_text, sub_text):
    """Bandeau en-tête ardoise."""
    return Table(
        [[Paragraph(title_text, S_TITLE)],
         [Paragraph(sub_text,   S_SUB)]],
        colWidths=[W - 40*mm],
        style=TableStyle([
            ("BACKGROUND", (0,0), (-1,-1), ARDOISE),
            ("TOPPADDING",  (0,0), (-1,-1), 14),
            ("BOTTOMPADDING",(0,0),(-1,-1), 14),
            ("LEFTPADDING", (0,0), (-1,-1), 18),
            ("RIGHTPADDING",(0,0), (-1,-1), 18),
            ("ROUNDEDCORNERS", (0,0),(-1,-1), 6),
        ])
    )

# ─── Construction du PDF ────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUT_PATH,
        pagesize=A4,
        leftMargin=20*mm,
        rightMargin=20*mm,
        topMargin=16*mm,
        bottomMargin=16*mm,
        title="ByCo Systems — Les Sens · Nice",
        author="ByCo Systems",
    )

    story = []

    # ════════════════════════════════════════
    # PAGE 1 — Comparatif
    # ════════════════════════════════════════

    story.append(header_band(
        "BYCO SYSTEMS — Proposition personnalisée pour Les Sens · Nice",
        "Éveil Digital · comparatif d'expérience"
    ))
    story.append(sp(10))

    story.append(Paragraph(
        "Les Sens propose une cuisine de marché exceptionnelle dans un cadre vintage unique. "
        "Ce comparatif met en regard le dispositif actuel et l'expérience rendue possible "
        "par ByCo Systems.",
        S_BODY
    ))
    story.append(sp(12))

    # ── Tableau comparatif ──────────────────
    col_crit  = 48*mm
    col_now   = 62*mm
    col_byco  = 62*mm

    rows = [
        # En-tête
        [
            Paragraph("Critère", style("th_c", fontName="Helvetica-Bold", fontSize=9,
                                       textColor=WHITE, alignment=TA_CENTER)),
            Paragraph("Aujourd'hui  ✕", style("th_n", fontName="Helvetica-Bold", fontSize=9,
                                              textColor=WHITE, alignment=TA_CENTER)),
            Paragraph("Avec ByCo Systems  ✓", style("th_b", fontName="Helvetica-Bold", fontSize=9,
                                                    textColor=ARDOISE, alignment=TA_CENTER)),
        ],
        # Lignes
        [
            Paragraph("Réservation en ligne", S_BOLD),
            Paragraph("Absente — appels obligatoires", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("Intégrée, confirmation WhatsApp auto", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Liens réseaux sociaux", S_BOLD),
            Paragraph("Non configurés (liens brisés)", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("Corrigés et actifs — inclus dans l'offre", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Menu sur le site", S_BOLD),
            Paragraph("Images non lisibles sur mobile", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("Carte interactive filtrée et actualisable", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Allergies & régimes", S_BOLD),
            Paragraph("Découverts à table", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("Collectés à la réservation en amont", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Confirmation de réservation", S_BOLD),
            Paragraph("Inexistante", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("WhatsApp automatique J-1 à 18h", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Newsletter clients", S_BOLD),
            Paragraph("Bouton présent mais inactif", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph('"Carte du Moment" chaque lundi', style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Accueil téléphonique", S_BOLD),
            Paragraph("Perdu pendant le service", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("Orlane IA bilingue 24h/24", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
        [
            Paragraph("Clientèle internationale", S_BOLD),
            Paragraph("Site FR uniquement", style("rd", fontSize=9, textColor=RED_ERR, leading=13)),
            Paragraph("Bilingue FR/EN natif", style("gd", fontSize=9, textColor=GREEN_OK, leading=13)),
        ],
    ]

    tbl = Table(rows, colWidths=[col_crit, col_now, col_byco], repeatRows=1)
    tbl.setStyle(TableStyle([
        # En-tête
        ("BACKGROUND",    (0, 0), (1, 0), ARDOISE),
        ("BACKGROUND",    (2, 0), (2, 0), OCRE),
        ("TEXTCOLOR",     (0, 0), (1, 0), WHITE),
        ("TEXTCOLOR",     (2, 0), (2, 0), ARDOISE),
        # Lignes alternées
        ("BACKGROUND",    (0, 1), (-1, 1),  CREAM),
        ("BACKGROUND",    (0, 2), (-1, 2),  WHITE),
        ("BACKGROUND",    (0, 3), (-1, 3),  CREAM),
        ("BACKGROUND",    (0, 4), (-1, 4),  WHITE),
        ("BACKGROUND",    (0, 5), (-1, 5),  CREAM),
        ("BACKGROUND",    (0, 6), (-1, 6),  WHITE),
        ("BACKGROUND",    (0, 7), (-1, 7),  CREAM),
        ("BACKGROUND",    (0, 8), (-1, 8),  WHITE),
        # Padding
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        # Grille
        ("GRID",          (0, 0), (-1, -1), 0.4, LINE),
        ("LINEBELOW",     (0, 0), (-1, 0),  1.2, ARDOISE),
        # Alignement vertical
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(tbl)

    # ════════════════════════════════════════
    # PAGE 2 — ROI + Proposition
    # ════════════════════════════════════════
    from reportlab.platypus import PageBreak
    story.append(PageBreak())

    story.append(header_band(
        "Ce que coûte le statu quo",
        "Estimation fondée sur 65 couverts · Lun–Ven · ~1 050 000 € de CA annuel potentiel"
    ))
    story.append(sp(12))

    # ── Lignes de pertes ────────────────────
    losses = [
        ("Appels manqués pendant le service (8 %)",   "− 84 000 € / an"),
        ("No-shows non maîtrisés (10 %)",             "− 105 000 € / an"),
        ("Clientèle weekend non captée (3 %)",        "− 31 500 € / an"),
        ("Newsletter inactive — fidélisation zéro (2 %)", "− 21 000 € / an"),
    ]

    loss_rows = [[
        Paragraph(label, S_LOSS),
        Paragraph(val, S_LOSS_V),
    ] for label, val in losses]

    loss_tbl = Table(loss_rows, colWidths=[110*mm, 50*mm])
    loss_tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), CREAM),
        ("BACKGROUND",    (0, 1), (-1, 1),  WHITE),
        ("BACKGROUND",    (0, 3), (-1, 3),  WHITE),
        ("TOPPADDING",    (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING",   (0, 0), (0, -1),  10),
        ("RIGHTPADDING",  (-1, 0), (-1, -1), 10),
        ("LINEBELOW",     (0, -1), (-1, -1), 0.4, LINE),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(loss_tbl)

    # Total
    total_row = Table(
        [[
            Paragraph("TOTAL DES OPPORTUNITÉS PERDUES", style("tot_l", fontName="Helvetica-Bold",
                                                               fontSize=11, textColor=ARDOISE)),
            Paragraph("~ 240 000 € / an", style("tot_r", fontName="Helvetica-Bold",
                                                  fontSize=13, textColor=RED_ERR, alignment=TA_RIGHT)),
        ]],
        colWidths=[110*mm, 50*mm]
    )
    total_row.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#F5EDED")),
        ("TOPPADDING",    (0,0),(-1,-1), 11),
        ("BOTTOMPADDING",(0,0),(-1,-1), 11),
        ("LEFTPADDING",  (0,0),(0,-1),  10),
        ("RIGHTPADDING", (-1,0),(-1,-1),10),
        ("LINEABOVE",    (0,0),(-1,0),  1.2, RED_ERR),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ]))
    story.append(total_row)

    story.append(Paragraph(
        "soit ~23 % du CA potentiel perdus chaque année en l'état actuel",
        style("italic_note", fontName="Helvetica-Oblique", fontSize=9, textColor=INK_SOFT,
              alignment=TA_CENTER, leading=13)
    ))
    story.append(sp(14))

    # ── Notre proposition ────────────────────
    story.append(Paragraph("Notre proposition · Pack Business+", S_H2))
    story.append(sp(4))

    price_banner = Table(
        [[Paragraph("1 490 €", style("price", fontName="Helvetica-Bold", fontSize=28,
                                      textColor=OCRE, alignment=TA_CENTER)),
          Paragraph("mise en place complète\nroi en moins de 3 jours",
                    style("price_sub", fontName="Helvetica-Oblique", fontSize=10,
                          textColor=CREAM, leading=15))]],
        colWidths=[55*mm, 105*mm]
    )
    price_banner.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), ARDOISE),
        ("TOPPADDING",    (0,0),(-1,-1), 12),
        ("BOTTOMPADDING",(0,0),(-1,-1), 12),
        ("LEFTPADDING",  (0,0),(0,-1),  14),
        ("RIGHTPADDING", (-1,0),(-1,-1),14),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ]))
    story.append(price_banner)
    story.append(sp(10))

    composants = [
        "Orlane, réceptionniste IA vocale bilingue 24h/24",
        "Automatisation WhatsApp (confirmation + rappel J-1)",
        "Mini-application « Éveil Digital » sur-mesure",
        "Correction des liens sociaux (inclus, offert)",
        "Tableau de bord ReadyFlow Manager",
        "Mise en place complète en 48h",
    ]
    comp_rows = [[Paragraph("✓", S_CHECK), Paragraph(c, S_BODY)] for c in composants]
    comp_tbl = Table(comp_rows, colWidths=[10*mm, 150*mm])
    comp_tbl.setStyle(TableStyle([
        ("TOPPADDING",    (0,0),(-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("LEFTPADDING",  (0,0),(0,-1),  4),
        ("VALIGN",       (0,0),(-1,-1), "TOP"),
    ]))
    story.append(comp_tbl)
    story.append(sp(14))

    # ── Bandeau ROI ocre ────────────────────
    roi_banner = Table(
        [[Paragraph(
            "1 490 € investis face à ~240 000 € récupérables par an\n"
            "— rentabilisé en moins de 3 jours d'exploitation",
            style("roi", fontName="Helvetica-Bold", fontSize=12, textColor=ARDOISE_DK,
                  alignment=TA_CENTER, leading=18)
        )]],
        colWidths=[W - 40*mm]
    )
    roi_banner.setStyle(TableStyle([
        ("BACKGROUND", (0,0),(-1,-1), OCRE),
        ("TOPPADDING",    (0,0),(-1,-1), 14),
        ("BOTTOMPADDING",(0,0),(-1,-1), 14),
        ("LEFTPADDING",  (0,0),(-1,-1), 16),
        ("RIGHTPADDING", (0,0),(-1,-1), 16),
    ]))
    story.append(roi_banner)
    story.append(sp(24))

    # ── Footer ──────────────────────────────
    story.append(hr(ARDOISE, 0.8))
    story.append(sp(4))
    story.append(Paragraph(
        "bycosystems.xyz  ·  L'équipe ByCo Systems  ·  contact.byco@gmail.com",
        S_FOOTER
    ))

    doc.build(story)
    print(f"✓ PDF généré : {OUT_PATH}")

if __name__ == "__main__":
    build_pdf()
