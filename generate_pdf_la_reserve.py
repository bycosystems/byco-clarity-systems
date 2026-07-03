#!/usr/bin/env python3
"""
Génère le PDF comparatif "Avant / Après" pour La Réserve de Nice.
Sortie : public/demo/la-reserve/comparatif.pdf
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame

# ── Palette ────────────────────────────────────────────────────
MARINE      = colors.HexColor("#0D1B2A")
MARINE_MID  = colors.HexColor("#1B3A5C")
OR          = colors.HexColor("#B8962E")
OR_DARK     = colors.HexColor("#8A6E1E")
IVOIRE      = colors.HexColor("#F5F0E8")
BORDEAUX    = colors.HexColor("#6B2737")
GRIS_PERLE  = colors.HexColor("#C8C0B4")
VERT_MER    = colors.HexColor("#2C6E6A")
VERT_MER_BG = colors.HexColor("#E8F2F1")
ROUGE       = colors.HexColor("#C05050")
BLANC       = colors.white
NOIR        = colors.HexColor("#1A1412")

W, H = A4  # 210 × 297 mm

OUTPUT = os.path.join(
    os.path.dirname(__file__),
    "public", "demo", "la-reserve", "comparatif.pdf"
)
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)


# ── Canvas helpers ─────────────────────────────────────────────

def draw_header(c: canvas.Canvas, page_num: int):
    """Bandeau titre bleu marine en haut de chaque page."""
    c.saveState()
    # Fond bandeau
    c.setFillColor(MARINE)
    c.rect(0, H - 62*mm, W, 62*mm, fill=1, stroke=0)

    # Ligne or
    c.setStrokeColor(OR)
    c.setLineWidth(1.5)
    c.line(14*mm, H - 62*mm, W - 14*mm, H - 62*mm)

    # Titre principal
    c.setFillColor(IVOIRE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(14*mm, H - 22*mm, "BYCO SYSTEMS")
    c.setFont("Helvetica", 9)
    c.setFillColor(OR)
    c.drawString(14*mm, H - 31*mm, "Proposition personnalisée pour La Réserve de Nice")

    # Sous-titre
    c.setFillColor(GRIS_PERLE)
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(14*mm, H - 39*mm, "Depuis 1862  ·  comparatif d'expérience")

    # Numéro de page à droite
    c.setFillColor(OR)
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 14*mm, H - 22*mm, f"Page {page_num}")

    # Contact
    c.setFillColor(GRIS_PERLE)
    c.setFont("Helvetica", 7.5)
    c.drawRightString(W - 14*mm, H - 31*mm, "bycosystems.xyz")

    c.restoreState()


def draw_footer(c: canvas.Canvas):
    """Pied de page discret."""
    c.saveState()
    c.setStrokeColor(OR)
    c.setLineWidth(0.5)
    c.line(14*mm, 16*mm, W - 14*mm, 16*mm)
    c.setFillColor(GRIS_PERLE)
    c.setFont("Helvetica", 7)
    c.drawString(14*mm, 10*mm, "ByCo Systems  ·  bycosystems.xyz  ·  contact.byco@gmail.com")
    c.drawRightString(W - 14*mm, 10*mm, "Confidentiel — usage exclusif La Réserve de Nice")
    c.restoreState()


class ReservePDF(BaseDocTemplate):
    def __init__(self, filename):
        self.page_num = 0
        super().__init__(
            filename,
            pagesize=A4,
            rightMargin=14*mm,
            leftMargin=14*mm,
            topMargin=68*mm,
            bottomMargin=24*mm,
        )
        frame = Frame(
            self.leftMargin, self.bottomMargin,
            W - self.leftMargin - self.rightMargin,
            H - self.topMargin - self.bottomMargin,
            id="main"
        )
        self.addPageTemplates([PageTemplate(id="all", frames=frame, onPage=self.on_page)])

    def on_page(self, canv, doc):
        self.page_num += 1
        draw_header(canv, self.page_num)
        draw_footer(canv)


# ── Styles ─────────────────────────────────────────────────────

def make_styles():
    base = getSampleStyleSheet()

    def s(name, **kw):
        return ParagraphStyle(name, parent=base["Normal"], **kw)

    return {
        "intro": s("intro",
            fontName="Helvetica-Oblique",
            fontSize=9.5,
            leading=15,
            textColor=NOIR,
            spaceBefore=0,
            spaceAfter=6,
        ),
        "section": s("section",
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=MARINE,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "h2": s("h2",
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=MARINE,
            alignment=TA_CENTER,
            spaceBefore=0,
            spaceAfter=8,
        ),
        "body": s("body",
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=NOIR,
        ),
        "gold_label": s("gold_label",
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=OR_DARK,
        ),
        "check": s("check",
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=13,
            textColor=VERT_MER,
        ),
        "roi_title": s("roi_title",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=MARINE,
            alignment=TA_CENTER,
            spaceBefore=4,
            spaceAfter=8,
        ),
        "roi_sub": s("roi_sub",
            fontName="Helvetica-Oblique",
            fontSize=10,
            leading=14,
            textColor=GRIS_PERLE,
            alignment=TA_CENTER,
            spaceBefore=0,
            spaceAfter=14,
        ),
        "loss_item": s("loss_item",
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=NOIR,
        ),
        "loss_val": s("loss_val",
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=13,
            textColor=ROUGE,
            alignment=TA_RIGHT,
        ),
        "pack_item": s("pack_item",
            fontName="Helvetica",
            fontSize=9.5,
            leading=14,
            textColor=NOIR,
        ),
        "total_label": s("total_label",
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=MARINE,
        ),
        "total_val": s("total_val",
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=ROUGE,
            alignment=TA_RIGHT,
        ),
        "roi_banner": s("roi_banner",
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=15,
            textColor=MARINE,
            alignment=TA_CENTER,
        ),
        "footer_note": s("footer_note",
            fontName="Helvetica-Oblique",
            fontSize=8.5,
            leading=12,
            textColor=GRIS_PERLE,
            alignment=TA_CENTER,
        ),
    }


# ── Page 1 — Comparatif ────────────────────────────────────────

def page1_content(styles):
    story = []

    # Intro
    story.append(Paragraph(
        "La Réserve de Nice est une maison d'exception depuis 1862. Ce comparatif met en regard "
        "le dispositif actuel et l'expérience rendue possible par ByCo Systems — sans jamais "
        "toucher à l'identité d'une institution.",
        styles["intro"]
    ))
    story.append(Spacer(1, 8*mm))

    # Tableau comparatif
    col_w = [55*mm, 55*mm, 58*mm]

    header_data = [
        [
            Paragraph("<b>Point de contact</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=8.5, textColor=IVOIRE)),
            Paragraph("<b>Aujourd'hui</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=8.5, textColor=IVOIRE)),
            Paragraph("<b>Avec ByCo Systems</b>", ParagraphStyle("th", fontName="Helvetica-Bold", fontSize=8.5, textColor=IVOIRE)),
        ]
    ]

    rows = [
        ("Réservation en ligne",
         "Téléphone obligatoire",
         "✓  Intégrée avec confirmation WhatsApp auto"),
        ("Confirmation de réservation",
         "Aucune automatique",
         "✓  WhatsApp immédiat après confirmation"),
        ("Rappel J−1",
         "Inexistant",
         "✓  WhatsApp automatique à 17h"),
        ("Allergies & régimes",
         "Découverts à table",
         "✓  Collectés à la réservation"),
        ("Rooftop réservable en ligne",
         "Téléphone uniquement",
         "✓  Réservable directement (mai–oct)"),
        ("Événements Double Decker",
         "Formulaire complexe",
         "✓  Demande simplifiée, réponse 24h"),
        ("Accueil hors service",
         "Perdu (fermé dim–lun)",
         "✓  Réceptionniste IA vocale bilingue 24h/24"),
        ("Clientèle internationale",
         "Site principal en FR",
         "✓  Bilingue FR/EN natif"),
    ]

    def cell_rouge(txt):
        return Paragraph(txt, ParagraphStyle("red", fontName="Helvetica", fontSize=8.5, textColor=ROUGE, leading=12))

    def cell_vert(txt):
        return Paragraph(txt, ParagraphStyle("green", fontName="Helvetica-Bold", fontSize=8.5, textColor=VERT_MER, leading=12))

    def cell_noir(txt):
        return Paragraph(txt, ParagraphStyle("black", fontName="Helvetica", fontSize=8.5, textColor=NOIR, leading=12))

    table_data = header_data + [
        [cell_noir(r[0]), cell_rouge(r[1]), cell_vert(r[2])]
        for r in rows
    ]

    table = Table(table_data, colWidths=col_w, repeatRows=1)
    table.setStyle(TableStyle([
        # En-tête
        ("BACKGROUND", (0, 0), (-1, 0), MARINE),
        ("TOPPADDING",  (0, 0), (-1, 0), 8),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
        ("LEFTPADDING",  (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        # Lignes impaires
        ("BACKGROUND", (0, 1), (-1, 1), IVOIRE),
        ("BACKGROUND", (0, 2), (-1, 2), colors.white),
        ("BACKGROUND", (0, 3), (-1, 3), IVOIRE),
        ("BACKGROUND", (0, 4), (-1, 4), colors.white),
        ("BACKGROUND", (0, 5), (-1, 5), IVOIRE),
        ("BACKGROUND", (0, 6), (-1, 6), colors.white),
        ("BACKGROUND", (0, 7), (-1, 7), IVOIRE),
        ("BACKGROUND", (0, 8), (-1, 8), colors.white),
        # Séparateurs
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, GRIS_PERLE),
        # Bordure extérieure
        ("BOX", (0, 0), (-1, -1), 1, OR),
        # Colonne ByCo en vert
        ("LINEAFTER", (1, 0), (1, -1), 0.8, OR),
        # Padding vertical lignes data
        ("TOPPADDING",    (0, 1), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 7),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))

    story.append(table)
    return story


# ── Page 2 — ROI + Proposition ────────────────────────────────

def page2_content(styles):
    story = []

    # Titre
    story.append(Paragraph("1862. Honorez votre histoire.", styles["roi_title"]))
    story.append(Paragraph(
        "Estimation conservatrice des revenus récupérables",
        styles["roi_sub"]
    ))
    story.append(HRFlowable(width="100%", thickness=1, color=OR, spaceAfter=10))

    # Tableau pertes
    loss_rows = [
        ("No-shows non maîtrisés (8 % sur CA premium)", "− 262 000 €/an"),
        ("Appels perdus pendant service + dim–lun",      "− 164 000 €/an"),
        ("Rooftop non réservable en ligne (mai–oct)",    "−  65 600 €/an"),
        ("Événements Double Decker mal convertis",       "−  32 800 €/an"),
    ]

    def loss_label(t):
        return Paragraph(t, ParagraphStyle("ll", fontName="Helvetica", fontSize=9.5, textColor=NOIR, leading=13))

    def loss_val(t):
        return Paragraph(t, ParagraphStyle("lv", fontName="Helvetica-Bold", fontSize=9.5, textColor=ROUGE, leading=13, alignment=TA_RIGHT))

    loss_data = [[loss_label(r[0]), loss_val(r[1])] for r in loss_rows]
    loss_data.append([
        Paragraph("<b>Total estimé</b>", ParagraphStyle("tot", fontName="Helvetica-Bold", fontSize=10.5, textColor=MARINE, leading=14)),
        Paragraph("<b>~ 524 400 €/an</b>", ParagraphStyle("totv", fontName="Helvetica-Bold", fontSize=10.5, textColor=ROUGE, leading=14, alignment=TA_RIGHT)),
    ])

    loss_table = Table(loss_data, colWidths=[120*mm, 48*mm])
    loss_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -2), colors.white),
        ("BACKGROUND", (0, -1), (-1, -1), IVOIRE),
        ("LINEBELOW",  (0, 0), (-1, -2), 0.4, GRIS_PERLE),
        ("LINEABOVE",  (0, -1), (-1, -1), 1.5, OR),
        ("LINEBELOW",  (0, -1), (-1, -1), 1.5, OR),
        ("BOX",        (0, 0), (-1, -1), 0.8, OR),
        ("TOPPADDING",    (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(loss_table)
    story.append(Spacer(1, 8*mm))

    # Proposition pack
    story.append(HRFlowable(width="100%", thickness=1, color=OR, spaceAfter=8))
    story.append(Paragraph(
        "Notre proposition  —  Pack Business+  :  1 490 €",
        ParagraphStyle("pack_title",
            fontName="Helvetica-Bold",
            fontSize=13,
            textColor=MARINE,
            alignment=TA_CENTER,
            leading=17,
            spaceAfter=10,
        )
    ))

    pack_items = [
        "Réceptionniste vocal IA bilingue FR/EN  24h/24",
        "Confirmation + rappel WhatsApp automatiques",
        'Mini-application "Depuis 1862" sur-mesure',
        "Rooftop réservable en ligne (mai–octobre)",
        "Module événements Double Decker simplifié",
        "Tableau de bord ReadyFlow Manager",
        "Mise en place complète en 48h",
    ]

    pack_data = [
        [
            Paragraph("✓", ParagraphStyle("ck", fontName="Helvetica-Bold", fontSize=10, textColor=VERT_MER, leading=14)),
            Paragraph(item, ParagraphStyle("pi", fontName="Helvetica", fontSize=9.5, textColor=NOIR, leading=13)),
        ]
        for item in pack_items
    ]

    pack_table = Table(pack_data, colWidths=[10*mm, 158*mm])
    pack_table.setStyle(TableStyle([
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 6),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW",     (0, 0), (-1, -2), 0.3, GRIS_PERLE),
        ("BACKGROUND",    (0, 0), (-1, -1), VERT_MER_BG),
        ("BOX",           (0, 0), (-1, -1), 1, VERT_MER),
    ]))
    story.append(pack_table)
    story.append(Spacer(1, 8*mm))

    # Bandeau ROI
    roi_data = [[
        Paragraph(
            "1 490 € investis  face à  ~ 524 000 € récupérables par an\n"
            "Rentabilisé en moins d'1 jour d'exploitation",
            ParagraphStyle("roi_b",
                fontName="Helvetica-Bold",
                fontSize=10,
                textColor=MARINE,
                alignment=TA_CENTER,
                leading=16,
            )
        )
    ]]
    roi_table = Table(roi_data, colWidths=[168*mm])
    roi_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), OR),
        ("TOPPADDING",    (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
        ("BOX",           (0, 0), (-1, -1), 1.5, OR_DARK),
    ]))
    story.append(roi_table)
    story.append(Spacer(1, 8*mm))

    # Note de pied de page
    story.append(Paragraph(
        "bycosystems.xyz  ·  L'équipe ByCo Systems",
        styles["footer_note"]
    ))
    story.append(Paragraph(
        "Démonstration : bycosystems.xyz/demo/la-reserve",
        ParagraphStyle("link_note",
            fontName="Helvetica-Oblique",
            fontSize=8.5,
            leading=12,
            textColor=OR_DARK,
            alignment=TA_CENTER,
        )
    ))

    return story


# ── Main ───────────────────────────────────────────────────────

def main():
    doc = ReservePDF(OUTPUT)
    styles = make_styles()

    story = []

    # ── Page 1 ──
    story += page1_content(styles)

    # Saut de page explicite
    from reportlab.platypus import PageBreak
    story.append(PageBreak())

    # ── Page 2 ──
    story += page2_content(styles)

    doc.build(story)
    size_kb = os.path.getsize(OUTPUT) // 1024
    print(f"[OK] PDF généré : {OUTPUT}  ({size_kb} Ko)")


if __name__ == "__main__":
    main()
