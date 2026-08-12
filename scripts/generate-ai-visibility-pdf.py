from __future__ import annotations

from pathlib import Path
from shutil import copyfile

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


REPO = Path(__file__).resolve().parents[1]
OUTPUT = REPO / "output" / "pdf" / "ai-search-visibility-brief.pdf"
SITE_COPY = REPO / "site" / "assets" / "guides" / "ai-search-visibility-brief.pdf"

INK = colors.HexColor("#080807")
IVORY = colors.HexColor("#F4EEE3")
PAPER = colors.HexColor("#FBF8F2")
LIME = colors.HexColor("#C8FF37")
PURPLE = colors.HexColor("#502C52")
PURPLE_DARK = colors.HexColor("#321B34")
STONE = colors.HexColor("#6B655E")
LINE = colors.HexColor("#D8D0C5")


def draw_mark(canvas, x, y, size=9 * mm):
    canvas.saveState()
    canvas.setFillColor(IVORY)
    canvas.translate(x, y)
    canvas.rotate(45)
    canvas.rect(-size / 2, -size / 2, size, size, fill=1, stroke=0)
    canvas.rotate(-45)
    canvas.setFillColor(PURPLE)
    canvas.circle(0, 0, size * 0.31, fill=1, stroke=0)
    canvas.setFillColor(LIME)
    canvas.circle(0, 0, size * 0.13, fill=1, stroke=0)
    canvas.restoreState()


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, height - 17 * mm, width - 18 * mm, height - 17 * mm)
    canvas.line(18 * mm, 16 * mm, width - 18 * mm, 16 * mm)
    draw_mark(canvas, 23 * mm, height - 10.8 * mm, 6 * mm)
    canvas.setFillColor(PURPLE)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(30 * mm, height - 12.6 * mm, "AIXCEL / ANSWER INTELLIGENCE")
    canvas.setFillColor(STONE)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(width - 18 * mm, height - 12.6 * mm, "AIEO / AEO / GEO")
    canvas.drawString(18 * mm, 10 * mm, "aixcelsolutions.com/services/ai-search-visibility")
    canvas.drawRightString(width - 18 * mm, 10 * mm, f"{doc.page} / 5")
    canvas.restoreState()


def cover_page(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PURPLE_DARK)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(colors.Color(1, 1, 1, alpha=0.08))
    for x in range(0, int(width), 16):
        canvas.line(x * mm / 3, 0, x * mm / 3, height)
    for y in range(0, int(height), 16):
        canvas.line(0, y * mm / 3, width, y * mm / 3)
    draw_mark(canvas, 27 * mm, height - 28 * mm, 13 * mm)
    canvas.setFillColor(IVORY)
    canvas.setFont("Helvetica-Bold", 11)
    canvas.drawString(40 * mm, height - 30.5 * mm, "AIXCEL SOLUTIONS")
    canvas.setFillColor(LIME)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(22 * mm, height - 62 * mm, "THE FIVE-PAGE EXECUTIVE BRIEF")
    canvas.setFillColor(IVORY)
    canvas.setFont("Helvetica-Bold", 34)
    canvas.drawString(22 * mm, height - 84 * mm, "ANSWER")
    canvas.drawString(22 * mm, height - 101 * mm, "INTELLIGENCE")
    canvas.setFillColor(LIME)
    canvas.setFont("Times-Italic", 26)
    canvas.drawString(22 * mm, height - 119 * mm, "AIEO / AEO / GEO")
    canvas.setFillColor(colors.Color(0.96, 0.93, 0.89, alpha=0.82))
    canvas.setFont("Helvetica", 13)
    text = canvas.beginText(22 * mm, height - 144 * mm)
    text.setLeading(19)
    text.textLine("See how your brand appears in AI answers, uncover")
    text.textLine("the competitive gaps, and turn live evidence into")
    text.textLine("a clear plan your team can act on.")
    canvas.drawText(text)
    box_y = 40 * mm
    canvas.setFillColor(LIME)
    canvas.rect(22 * mm, box_y, width - 44 * mm, 32 * mm, fill=1, stroke=0)
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(29 * mm, box_y + 20 * mm, "THE SERVICE IN THREE PARTS")
    canvas.setFont("Helvetica-Bold", 15)
    canvas.drawString(29 * mm, box_y + 10 * mm, "VISIBILITY - OPPORTUNITIES - STRATEGY")
    canvas.setFillColor(colors.Color(0.96, 0.93, 0.89, alpha=0.66))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(22 * mm, 19 * mm, "Prepared by Ahmad Bukhari / Founder, AiXCEL Solutions / 11 August 2026")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=PURPLE, spaceAfter=6, letterSpacing=1.2))
styles.add(ParagraphStyle(name="H1x", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=27, leading=29, textColor=INK, alignment=TA_LEFT, spaceAfter=12))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Times-Roman", fontSize=19, leading=21, textColor=INK, spaceBefore=8, spaceAfter=8))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.5, leading=14, textColor=colors.HexColor("#393531"), spaceAfter=8))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.8, leading=11, textColor=STONE, spaceAfter=5))
styles.add(ParagraphStyle(name="CardTitle", parent=styles["Heading3"], fontName="Times-Roman", fontSize=15, leading=17, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="CardBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.3, leading=12, textColor=colors.HexColor("#393531")))
styles.add(ParagraphStyle(name="DarkTitle", parent=styles["Heading3"], fontName="Times-Roman", fontSize=14, leading=16, textColor=IVORY, spaceAfter=6))
styles.add(ParagraphStyle(name="DarkBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.2, leading=12, textColor=colors.HexColor("#E2D9CE")))
styles.add(ParagraphStyle(name="Linkx", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=9, leading=13, textColor=PURPLE))


def p(text, style="Bodyx"):
    return Paragraph(text, styles[style])


def card(title, body, label):
    return Table(
        [[p(label, "Eyebrow")], [p(title, "CardTitle")], [p(body, "CardBody")]],
        colWidths=[51 * mm],
        style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), PAPER),
            ("BOX", (0, 0), (-1, -1), 0.6, LINE),
            ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
            ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ]),
    )


def build_story():
    story = [PageBreak()]
    story.extend([
        p("01 / WHAT IT DOES", "Eyebrow"),
        p("Know where your brand stands before the next buyer asks AI.", "H1x"),
        p("Buyers now ask answer engines to compare providers, explain trade-offs, surface trusted sources, and build a shortlist. AiXCEL Answer Intelligence shows what those systems currently say about you, where competitors are winning, and what to improve next."),
        Spacer(1, 4 * mm),
        Table([[card("Visibility", "A tracked prompt set is built from your website, competitors, priority buyer questions, and available Search Console data. The result is a dated view of inclusion, accuracy, citations, and share of answer.", "01"), card("Opportunities", "The system reads that evidence and identifies the gaps worth closing: missing pages, weak proof, source opportunities, unclear positioning, competitor advantages, and technical issues.", "02"), card("Strategy Agent", "Ask a question in plain English. The agent combines your live data with 40+ AEO, GEO, and marketing capabilities to explain why a gap exists and return a source-aware action plan.", "03")]], colWidths=[56 * mm] * 3, hAlign="LEFT", style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm)])),
        Spacer(1, 9 * mm),
        p("WHAT THE BASELINE ANSWERS", "Eyebrow"),
        Table([[p("ARE YOU VISIBLE?", "CardTitle"), p("WHY ARE THEY WINNING?", "CardTitle"), p("WHAT SHOULD CHANGE?", "CardTitle"), p("CAN WE PROVE IT?", "CardTitle")], [p("Where and how often the brand appears under the agreed prompt set.", "CardBody"), p("Which competitors, claims, and sources are shaping the answer.", "CardBody"), p("The highest-value content, proof, source, or technical action.", "CardBody"), p("Every observation retains its engine, prompt, date, answer, and citations.", "CardBody")]], colWidths=[42 * mm] * 4, style=TableStyle([("BACKGROUND", (0, 0), (-1, 0), LIME), ("BOX", (0, 0), (-1, -1), 0.5, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm), ("TOPPADDING", (0, 0), (-1, -1), 4 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm)])),
        Spacer(1, 5 * mm),
        p("AIEO is the operating umbrella. AEO focuses on direct answers; GEO focuses on how generative systems understand and support them. The commercial work is one connected visibility system, not three disconnected products.", "Smallx"),
        PageBreak(),
        p("02 / THE INTELLIGENCE LOOP", "Eyebrow"),
        p("From a live answer to a prioritized action plan.", "H1x"),
        p("The work begins with evidence, not a generic content calendar. We establish the buyer questions that matter, observe the current answers, explain the gaps, and turn the findings into a human-reviewed plan."),
        Spacer(1, 3 * mm),
    ])
    method_rows = []
    steps = [
        ("01", "Define the market", "Load the domain, competitors, priority services, target buyer questions, and available Search Console signals. Agree the exact observation window."),
        ("02", "Measure the answers", "Track the agreed prompt set across available answer engines. Record inclusion, wording, cited sources, accuracy, sentiment, and competitor presence."),
        ("03", "Explain the gaps", "Identify why a competitor is cited more often, where brand sentiment comes from, which proof is missing, and which sources shape the answer."),
        ("04", "Act and monitor", "Turn the evidence into a ranked plan, assign owners, improve the highest-value gaps, and repeat the same observation method to see what changed."),
    ]
    for number, title, body in steps:
        method_rows.append([p(number, "Eyebrow"), p(title, "CardTitle"), p(body, "CardBody")])
    story.extend([
        Table(method_rows, colWidths=[14 * mm, 42 * mm, 112 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), PAPER), ("BOX", (0, 0), (-1, -1), 0.6, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm), ("TOPPADDING", (0, 0), (-1, -1), 5 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm)])),
        Spacer(1, 8 * mm),
        p("THE AGENT IS THE DIFFERENTIATOR", "Eyebrow"),
        p('Ask: <b>"Why is this competitor cited more than us, and what would it take to appear beside them?"</b> The strategy agent reads the visibility data, inspects the supporting sources, explains the likely causes, and returns specific next steps instead of leaving your team with another dashboard to interpret.'),
        p('It can also investigate questions such as <b>"Where is negative brand sentiment coming from?"</b> or <b>"Which comparison or trust page should we publish next?"</b>', "Smallx"),
        PageBreak(),
        p("03 / HOW WE ENGAGE", "Eyebrow"),
        p("Start with the truth. Expand into managed execution.", "H1x"),
        Table([
            [p("1 / Free Visibility Snapshot", "DarkTitle"), p("2 / Priority Visibility Sprint", "DarkTitle"), p("3 / Managed Answer Intelligence", "DarkTitle")],
            [p("We load the prospect domain, observe it for the agreed short window, compare it with relevant competitors, and deliver a clear white-labelled snapshot of where the brand stands.", "DarkBody"), p("We fix the first evidence-backed priority across access, positioning, content, sources, structured data, reputation, or conversion handoff.", "DarkBody"), p("Ongoing prompt monitoring, source and sentiment analysis, agent-led recommendations, implementation support, and executive reporting tied to the buyer journey.", "DarkBody")],
        ], colWidths=[56 * mm] * 3, style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), PURPLE_DARK), ("BOX", (0, 0), (-1, -1), 0.8, LIME), ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#6B4A6E")), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm), ("TOPPADDING", (0, 0), (-1, -1), 6 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 6 * mm)])),
        Spacer(1, 9 * mm),
        p("WHAT WE MEASURE", "Eyebrow"),
        Table([
            [p("Layer", "CardTitle"), p("The evidence", "CardTitle"), p("The business question", "CardTitle")],
            [p("Visibility", "CardBody"), p("Prompt, engine, date, answer, brand inclusion, and competitor presence.", "CardBody"), p("Do the right buyers see us in the answer set?", "CardBody")],
            [p("Sources", "CardBody"), p("Citations, domains, repeated evidence patterns, and sentiment origins.", "CardBody"), p("What is teaching the engine to trust or doubt the brand?", "CardBody")],
            [p("Opportunity", "CardBody"), p("Named content, proof, source, reputation, technical, or conversion gap.", "CardBody"), p("Which move is most likely to improve the decision journey?", "CardBody")],
            [p("Commercial outcome", "CardBody"), p("Identifiable referral, consented lead, qualified booking, proposal, and recorded win.", "CardBody"), p("Did better visibility create measurable business movement?", "CardBody")],
        ], colWidths=[41 * mm, 64 * mm, 63 * mm], style=TableStyle([("BACKGROUND", (0, 0), (-1, 0), LIME), ("BOX", (0, 0), (-1, -1), 0.6, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm), ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm)])),
        Spacer(1, 4 * mm),
        p("AiXCEL is the managed strategy and execution layer. The client sees AiXCEL branding, a clear evidence trail, and a prioritized operating plan rather than an unfiltered software dashboard.", "Smallx"),
        PageBreak(),
        p("04 / NEXT STEP", "Eyebrow"),
        p("Get the free snapshot before you approve a larger engagement.", "H1x"),
        p("The first step is designed to reduce uncertainty. We inspect where the brand stands now, show the evidence, identify the most important gap, and explain what an improvement program would need to address."),
        Spacer(1, 2 * mm),
        Table([[p("STRONG FIT", "Eyebrow"), p("WHAT TO PREPARE", "Eyebrow")], [p("An established service business with a defined offer, credible expertise, meaningful deal value, known competitors, and the capacity to act on the findings.", "CardBody"), p("Your website, three to five competitors, priority services, target markets, important buyer questions, and access to Search Console if available.", "CardBody")]], colWidths=[84 * mm] * 2, style=TableStyle([("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EFFFC0")), ("BACKGROUND", (1, 0), (1, -1), colors.HexColor("#EFE5EF")), ("BOX", (0, 0), (-1, -1), 0.6, LINE), ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm), ("TOPPADDING", (0, 0), (-1, -1), 5 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm)])),
        Spacer(1, 8 * mm),
        p("REQUEST THE FREE AEO VISIBILITY SNAPSHOT", "H2x"),
        p('<link href="https://aixcelsolutions.com/services/ai-search-visibility#baseline" color="#502C52"><u>aixcelsolutions.com/services/ai-search-visibility</u></link>', "Linkx"),
        p('<link href="https://cal.com/ahmad-bukhari/revenue-handoff-map?utm_source=aixcel_brief&amp;utm_medium=pdf&amp;utm_campaign=ai_search_visibility" color="#502C52"><u>Book a 25-minute visibility mapping session</u></link>', "Linkx"),
        Spacer(1, 7 * mm),
        p("PRIMARY SOURCES", "Eyebrow"),
        p('<link href="https://developers.google.com/search/docs/appearance/ai-features" color="#502C52"><u>Google Search Central - AI features and your website</u></link>', "Smallx"),
        p('<link href="https://help.openai.com/en/articles/12627856-publishers-and-developers-faq" color="#502C52"><u>OpenAI - Publishers and developers FAQ</u></link>', "Smallx"),
        p('<link href="https://help.openai.com/en/articles/9237897-chatgpt-search" color="#502C52"><u>OpenAI - ChatGPT search</u></link>', "Smallx"),
        p('<link href="https://arxiv.org/abs/2311.09735" color="#502C52"><u>GEO: Generative Engine Optimization - original academic paper</u></link>', "Smallx"),
        Spacer(1, 3 * mm),
        p("One observation is not a permanent rank. Results vary by engine, prompt, date, location, and user context. AiXCEL preserves those conditions, separates observations from inference, and does not guarantee an external engine, citation, traffic, or revenue outcome.", "Smallx"),
    ])
    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    SITE_COPY.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=24 * mm,
        bottomMargin=20 * mm,
        title="AiXCEL Answer Intelligence - AEO, GEO, and AI Search Visibility",
        author="Ahmad Bukhari, AiXCEL Solutions",
        subject="Visibility, opportunities, and strategy for established service businesses",
        creator="AiXCEL Solutions",
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="content")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=frame, onPage=cover_page, autoNextPageTemplate="content"),
        PageTemplate(id="content", frames=frame, onPage=header_footer, autoNextPageTemplate="content"),
    ])
    story = build_story()
    doc.build(story)
    copyfile(OUTPUT, SITE_COPY)
    print(OUTPUT)
    print(SITE_COPY)


if __name__ == "__main__":
    main()
