"""
Génère public/demo/maison-f/comparatif.pdf
Charte : Bleu nuit #1B2A3B, Or #C9A84C, Blanc cassé #F9F6F0,
         Vert sauge #7A9E7E, Encre #1A1A1A
Polices : Vera (Bitstream Vera, intégrée dans reportlab)
"""

import os
import reportlab
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Flowable,
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# ── Enregistrement des polices Vera ───────────────────────────
RL_FONTS = os.path.join(os.path.dirname(reportlab.__file__), "fonts")
pdfmetrics.registerFont(TTFont("Vera",   os.path.join(RL_FONTS, "Vera.ttf")))
pdfmetrics.registerFont(TTFont("VeraBd", os.path.join(RL_FONTS, "VeraBd.ttf")))
pdfmetrics.registerFont(TTFont("VeraIt", os.path.join(RL_FONTS, "VeraIt.ttf")))
pdfmetrics.registerFont(TTFont("VeraBI", os.path.join(RL_FONTS, "VeraBI.ttf")))
pdfmetrics.registerFontFamily(
    "Vera",
    normal="Vera",
    bold="VeraBd",
    italic="VeraIt",
    boldItalic="VeraBI",
)

FN  = "Vera"
FNB = "VeraBd"
FNI = "VeraIt"

# ── Couleurs ──────────────────────────────────────────────────
BLEU_NUIT  = colors.HexColor("#1B2A3B")
BLEU_DARK  = colors.HexColor("#121E2B")
OR         = colors.HexColor("#C9A84C")
BLANC      = colors.HexColor("#F9F6F0")
BLANC_DEEP = colors.HexColor("#EDE8DE")
SAUGE      = colors.HexColor("#7A9E7E")
SAUGE_BG   = colors.HexColor("#EAF2EA")
ENCRE      = colors.HexColor("#1A1A1A")
GRIS       = colors.HexColor("#8A8A8A")
ROUGE      = colors.HexColor("#C0392B")

# ── Chemin de sortie ──────────────────────────────────────────
OUT_DIR = os.path.join(
    os.path.dirname(__file__), "..", "public", "demo", "maison-f"
)
os.makedirs(OUT_DIR, exist_ok=True)
OUT_PATH = os.path.join(OUT_DIR, "comparatif.pdf")

# ── Helpers styles ─────────────────────────────────────────────
def S(name, **kw):
    return ParagraphStyle(name, **kw)

# ── Définition des styles ─────────────────────────────────────
S_HEADER_TITLE = S("HeaderTitle",
    fontName=FNB, fontSize=17, textColor=BLANC,
    alignment=TA_CENTER, leading=22, spaceAfter=4)

S_HEADER_SUB = S("HeaderSub",
    fontName=FN, fontSize=10, textColor=OR,
    alignment=TA_CENTER, leading=14, spaceAfter=2)

S_INTRO = S("Intro",
    fontName=FN, fontSize=10, textColor=ENCRE,
    leading=15, alignment=TA_LEFT, spaceAfter=4)

S_SECTION = S("Section",
    fontName=FNB, fontSize=12, textColor=BLEU_NUIT,
    spaceBefore=12, spaceAfter=8, alignment=TA_LEFT)

S_TABLE_HEAD = S("THead",
    fontName=FNB, fontSize=9, textColor=BLANC,
    alignment=TA_CENTER, leading=12)

S_CELL = S("Cell",
    fontName=FN, fontSize=9, textColor=ENCRE,
    leading=13, alignment=TA_LEFT)

S_CELL_RED = S("CellRed",
    fontName=FN, fontSize=9, textColor=ROUGE,
    leading=13, alignment=TA_LEFT)

S_CELL_GREEN = S("CellGreen",
    fontName=FNB, fontSize=9, textColor=SAUGE,
    leading=13, alignment=TA_LEFT)

S_CELL_BOLD = S("CellBold",
    fontName=FNB, fontSize=9, textColor=ENCRE,
    leading=13, alignment=TA_LEFT)

S_ROI_LABEL = S("RoiLabel",
    fontName=FN, fontSize=10, textColor=ENCRE,
    leading=14, alignment=TA_LEFT)

S_ROI_TOTAL_LABEL = S("RoiTotalLabel",
    fontName=FNB, fontSize=11, textColor=ENCRE,
    leading=14, alignment=TA_LEFT)

S_ROI_AMOUNT = S("RoiAmount",
    fontName=FNB, fontSize=10, textColor=ROUGE,
    leading=14, alignment=TA_RIGHT)

S_ROI_TOTAL = S("RoiTotal",
    fontName=FNB, fontSize=12, textColor=ROUGE,
    leading=16, alignment=TA_RIGHT)

S_PACK_ITEM = S("PackItem",
    fontName=FN, fontSize=10, textColor=ENCRE,
    leading=15, alignment=TA_LEFT)

S_PACK_CHECK = S("PackCheck",
    fontName=FNB, fontSize=10, textColor=SAUGE,
    leading=15, alignment=TA_LEFT)

S_PRIX_LABEL = S("PrixLabel",
    fontName=FNB, fontSize=12, textColor=ENCRE,
    leading=16, alignment=TA_LEFT)

S_PRIX = S("Prix",
    fontName=FNB, fontSize=18, textColor=BLEU_NUIT,
    leading=22, alignment=TA_RIGHT)

S_ROI_BANNER = S("RoiBanner",
    fontName=FNB, fontSize=11, textColor=BLEU_DARK,
    leading=16, alignment=TA_CENTER)

S_FOOTER = S("Footer",
    fontName=FN, fontSize=8, textColor=GRIS,
    alignment=TA_CENTER, leading=12)

S_FOOTER_LINK = S("FooterLink",
    fontName=FNB, fontSize=8, textColor=BLEU_NUIT,
    alignment=TA_CENTER, leading=12)

S_NOTE = S("Note",
    fontName=FNI, fontSize=8, textColor=GRIS,
    leading=11, alignment=TA_LEFT)

# ── Flowable ligne horizontale ────────────────────────────────
class HLine(Flowable):
    def __init__(self, width, color, thickness=0.5):
        super().__init__()
        self.width  = width
        self.height = thickness + 2
        self.color  = color
        self.thickness = thickness

    def draw(self):
        self.canv.setStrokeColor(self.color)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, self.thickness / 2, self.width, self.thickness / 2)

# ── Construction du document ──────────────────────────────────
W, H = A4
MARGIN    = 1.8 * cm
CONTENT_W = W - 2 * MARGIN

doc = SimpleDocTemplate(
    OUT_PATH,
    pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=1.5 * cm, bottomMargin=1.8 * cm,
    title="ByCo Systems — Proposition Maison F Nice",
    author="ByCo Systems",
)

story = []

# ── Fonction bandeau en-tête ──────────────────────────────────
def header_band(cw):
    data = [
        [Paragraph("BYCO SYSTEMS", S_HEADER_TITLE)],
        [Paragraph("Proposition personnalisee pour Maison F - Nice", S_HEADER_SUB)],
        [Paragraph("Par amour du frais - comparatif d'experience client", S_HEADER_SUB)],
    ]
    t = Table(data, colWidths=[cw])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), BLEU_NUIT),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
    ]))
    return t

# ════════════════════════════════════════════
# PAGE 1
# ════════════════════════════════════════════
story.append(header_band(CONTENT_W))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "Maison F offre l'une des plus belles terrasses de Nice face au port. "
    "Ce comparatif met en regard le dispositif actuel et l'experience rendue "
    "possible par ByCo Systems — sans toucher a votre identite.",
    S_INTRO,
))
story.append(Spacer(1, 10))

# ── Tableau comparatif ────────────────────────────────────────
story.append(Paragraph("Comparatif d'experience client", S_SECTION))

rows_data = [
    ("Confirmation de reservation",
     "Aucune apres RestoPro",
     "WhatsApp automatique immediat"),
    ("Rappel J-1",
     "Inexistant",
     "WhatsApp automatique a 18h"),
    ("Allergies & regimes",
     "Decouverts a table",
     "Collectes a la reservation en amont"),
    ("Menu degustation 7 plats visible",
     "Invisible sur le site actuel",
     "Mis en avant, reservable en ligne"),
    ("Evenements & privatisations",
     "Formulaire complexe, peu converti",
     "Formulaire simplifie, reponse sous 24h"),
    ("Accueil telephonique (10h-23h)",
     "Perdu pendant le long service",
     "Receptionniste IA vocale bilingue 24h/24"),
    ("Clientele internationale",
     "Site FR uniquement",
     "Bilingue FR/EN natif"),
    ("Newsletter clients",
     "Formulaire present, pas de contenu",
     "\"Selection du marche\" automatisee chaque lundi"),
]

col_w = [CONTENT_W * 0.34, CONTENT_W * 0.32, CONTENT_W * 0.34]

table_rows = [[
    Paragraph("Critere",                  S_TABLE_HEAD),
    Paragraph("Aujourd'hui  X",           S_TABLE_HEAD),
    Paragraph("Avec ByCo Systems  OK",    S_TABLE_HEAD),
]]

for crit, auj, byco in rows_data:
    table_rows.append([
        Paragraph(crit, S_CELL_BOLD),
        Paragraph(auj,  S_CELL_RED),
        Paragraph(byco, S_CELL_GREEN),
    ])

comp_table = Table(table_rows, colWidths=col_w, repeatRows=1)
comp_table.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0),  BLEU_NUIT),
    ("TOPPADDING",    (0, 0), (-1, 0),  8),
    ("BOTTOMPADDING", (0, 0), (-1, 0),  8),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
    ("TOPPADDING",    (0, 1), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 1), (-1, -1), 7),
    ("ROWBACKGROUNDS",(0, 1), (-1, -1), [BLANC, BLANC_DEEP]),
    ("BACKGROUND",    (2, 1), (2, -1),  SAUGE_BG),
    ("GRID",          (0, 0), (-1, -1), 0.4, colors.HexColor("#D0CAC0")),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
]))
story.append(comp_table)
story.append(Spacer(1, 18))

# ════════════════════════════════════════════
# PAGE 2
# ════════════════════════════════════════════
story.append(PageBreak())

story.append(header_band(CONTENT_W))
story.append(Spacer(1, 14))

# ── ROI ───────────────────────────────────────────────────────
story.append(Paragraph("Valorisez votre terrasse face au port", S_SECTION))

pertes = [
    ("No-shows non maitrises (10 % de 840 k euros/an)", "- 84 000 EUR/an"),
    ("Appels perdus pendant le long service (6 %)",     "- 50 400 EUR/an"),
    ("Menu degustation invisible digitalement (3 %)",   "- 25 200 EUR/an"),
    ("Evenements mal convertis en ligne (3 %)",         "- 25 200 EUR/an"),
]

roi_rows = []
for label, amount in pertes:
    roi_rows.append([
        Paragraph(label,  S_ROI_LABEL),
        Paragraph(amount, S_ROI_AMOUNT),
    ])

roi_rows.append([
    Paragraph("Total estime perdu chaque annee", S_ROI_TOTAL_LABEL),
    Paragraph("~ 185 000 EUR/an", S_ROI_TOTAL),
])

roi_table = Table(roi_rows, colWidths=[CONTENT_W * 0.68, CONTENT_W * 0.32])
roi_table.setStyle(TableStyle([
    ("TOPPADDING",    (0, 0), (-1, -2), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -2), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 6),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
    ("ROWBACKGROUNDS",(0, 0), (-1, -2), [BLANC, BLANC_DEEP]),
    ("LINEBELOW",     (0, -2), (-1, -2), 1.2, OR),
    ("TOPPADDING",    (0, -1), (-1, -1), 8),
    ("BOTTOMPADDING", (0, -1), (-1, -1), 8),
    ("BACKGROUND",    (0, -1), (-1, -1), BLANC_DEEP),
    ("GRID",          (0, 0),  (-1, -2), 0.3, colors.HexColor("#D8D0C4")),
    ("VALIGN",        (0, 0),  (-1, -1), "MIDDLE"),
]))
story.append(roi_table)
story.append(Spacer(1, 4))
story.append(Paragraph(
    "(conservateur — hors clientele internationale non francophone)",
    S_NOTE,
))
story.append(Spacer(1, 16))

# ── Proposition ───────────────────────────────────────────────
story.append(Paragraph("Notre proposition · Pack Business+", S_SECTION))

pack_items = [
    "Receptionniste vocal IA bilingue FR/EN — disponible 24h/24",
    "Confirmation + rappel WhatsApp automatiques",
    "Mini-application \"Par amour du frais\" sur-mesure",
    "Menu degustation mis en avant et reservable en ligne",
    "Module evenements / privatisation terrasse simplifie",
    "Tableau de bord ReadyFlow Manager",
    "Mise en place complete en 48h",
]

pack_rows = []
for item in pack_items:
    pack_rows.append([
        Paragraph("OK", S_PACK_CHECK),
        Paragraph(item, S_PACK_ITEM),
    ])

pack_table = Table(pack_rows, colWidths=[0.8 * cm, CONTENT_W - 0.8 * cm])
pack_table.setStyle(TableStyle([
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 6),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
    ("ROWBACKGROUNDS",(0, 0), (-1, -1), [BLANC, BLANC_DEEP]),
    ("GRID",          (0, 0), (-1, -1), 0.3, colors.HexColor("#D8D0C4")),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
]))
story.append(pack_table)
story.append(Spacer(1, 6))

# Prix
prix_data = [[
    Paragraph("Investissement total", S_PRIX_LABEL),
    Paragraph("1 490 EUR", S_PRIX),
]]
prix_table = Table(prix_data, colWidths=[CONTENT_W * 0.6, CONTENT_W * 0.4])
prix_table.setStyle(TableStyle([
    ("TOPPADDING",    (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ("LEFTPADDING",   (0, 0), (-1, -1), 10),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 10),
    ("BACKGROUND",    (0, 0), (-1, -1), BLANC_DEEP),
    ("LINEABOVE",     (0, 0), (-1, 0),  1.5, OR),
    ("LINEBELOW",     (0, 0), (-1, 0),  1.5, OR),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
]))
story.append(prix_table)
story.append(Spacer(1, 14))

# Bandeau ROI or
roi_banner_data = [[
    Paragraph(
        "1 490 EUR investis face a ~ 185 000 EUR recuperables par an\n"
        "— rentabilise en moins de 3 jours d'exploitation",
        S_ROI_BANNER,
    )
]]
roi_banner = Table(roi_banner_data, colWidths=[CONTENT_W])
roi_banner.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, -1), OR),
    ("TOPPADDING",    (0, 0), (-1, -1), 14),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
    ("LEFTPADDING",   (0, 0), (-1, -1), 14),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
]))
story.append(roi_banner)
story.append(Spacer(1, 20))

# ── Footer ────────────────────────────────────────────────────
story.append(HLine(CONTENT_W, GRIS, 0.4))
story.append(Spacer(1, 8))
story.append(Paragraph("bycosystems.xyz · L'equipe ByCo Systems", S_FOOTER))
story.append(Paragraph(
    "Demonstration disponible sur bycosystems.xyz/demo/maison-f",
    S_FOOTER_LINK,
))

# ── Build ─────────────────────────────────────────────────────
doc.build(story)
print(f"PDF genere : {os.path.abspath(OUT_PATH)}")
