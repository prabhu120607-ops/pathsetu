"""
PathSetu PDF Blueprint Exporter
Generates clean, professionally formatted, downloadable vector PDF roadmaps
using ReportLab with student profile data, readiness estimates, milestones, and disclaimers.
"""

import io
from datetime import datetime
from typing import Dict, Any, List

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_roadmap_pdf(
    student_name: str,
    career_name: str,
    career_category: str,
    salary_range: str,
    study_duration: str,
    profile_summary: Dict[str, Any],
    readiness_pct: int,
    milestones: List[Dict[str, Any]],
    skills_possessed: List[str],
    skills_to_develop: List[str],
    official_resources: List[Dict[str, str]]
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#1D4ED8")
    navy_color = colors.HexColor("#0F172A")
    slate_color = colors.HexColor("#475569")
    light_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#CBD5E1")
    accent_green = colors.HexColor("#15803D")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=slate_color,
        alignment=TA_LEFT
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=navy_color,
        spaceBefore=10,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=primary_color,
        spaceBefore=6,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=navy_color
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=navy_color
    )

    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=11,
        textColor=colors.HexColor("#64748B"),
        alignment=TA_JUSTIFY
    )

    story = []

    # 1. Header with branding
    header_data = [
        [
            Paragraph("<b>PathSetu (పథసేతు)</b>", title_style),
            Paragraph(f"Generated: {datetime.now().strftime('%d %B %Y')}<br/>Status: <b>Verified Blueprint</b>", ParagraphStyle('HDate', fontName='Helvetica', fontSize=8, leading=11, textColor=slate_color, alignment=TA_RIGHT))
        ],
        [
            Paragraph("Personalized Career Exploration & Decision Intelligence Platform", subtitle_style),
            Paragraph(f"Student: <b>{student_name}</b>", ParagraphStyle('HStudent', fontName='Helvetica', fontSize=9, leading=12, textColor=navy_color, alignment=TA_RIGHT))
        ]
    ]
    t_header = Table(header_data, colWidths=[330, 185])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=6, spaceAfter=10))

    # 2. Selected Career Banner
    career_banner_data = [
        [
            Paragraph(f"Target Career: <font color='#1D4ED8'><b>{career_name}</b></font>", h1_style),
            Paragraph(f"Field: <b>{career_category}</b>", body_style)
        ],
        [
            Paragraph(f"Typical Entry Salary: <b>{salary_range or '₹3.5L - ₹8L / year'}</b>", body_style),
            Paragraph(f"Est. Preparation Horizon: <b>{study_duration or '6 - 12 months'}</b>", body_style)
        ]
    ]
    t_career = Table(career_banner_data, colWidths=[270, 245])
    t_career.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 1, border_color),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE')
    ]))
    story.append(t_career)
    story.append(Spacer(1, 10))

    # 3. Student Profile & Goals Summary
    story.append(Paragraph("1. Student Profile & Aspirations", h1_style))
    edu = profile_summary.get("education", "Secondary / Higher Secondary")
    interests_str = ", ".join(profile_summary.get("interests", [])) or "Technology, Building"
    strengths_str = ", ".join(profile_summary.get("strengths", [])) or "Logic, Problem-Solving"
    goal_str = profile_summary.get("goal") or "Build practical domain competence."
    budget_val = profile_summary.get("budget_inr", 25000)

    profile_data = [
        [
            Paragraph("<b>Current Education:</b>", body_bold),
            Paragraph(str(edu), body_style),
            Paragraph("<b>Annual Education Budget:</b>", body_bold),
            Paragraph(f"₹{budget_val:,.0f} (INR)", body_style)
        ],
        [
            Paragraph("<b>Core Interests:</b>", body_bold),
            Paragraph(interests_str, body_style),
            Paragraph("<b>Identified Strengths:</b>", body_bold),
            Paragraph(strengths_str, body_style)
        ],
        [
            Paragraph("<b>Career Goal:</b>", body_bold),
            Paragraph(goal_str, body_style),
            Paragraph("<b>Exploration Mode:</b>", body_bold),
            Paragraph("Active Milestone Execution", body_style)
        ]
    ]
    t_profile = Table(profile_data, colWidths=[120, 145, 130, 120])
    t_profile.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP')
    ]))
    story.append(t_profile)
    story.append(Spacer(1, 10))

    # 4. Readiness & Competency Breakdown
    story.append(Paragraph(f"2. Career Competency Diagnosis (Calculated Readiness: <b>{readiness_pct}%</b>)", h1_style))
    
    poss_str = ", ".join(skills_possessed) if skills_possessed else "None reported yet (Starting from foundational basics)"
    dev_str = ", ".join(skills_to_develop[:6]) if skills_to_develop else "Core competencies identified in roadmap"

    diag_data = [
        [
            Paragraph("<b>Validated Baseline Skills:</b>", body_bold),
            Paragraph(poss_str, body_style)
        ],
        [
            Paragraph("<b>High-Leverage Gaps to Develop:</b>", body_bold),
            Paragraph(dev_str, body_style)
        ],
        [
            Paragraph("<b>Readiness Advisory:</b>", body_bold),
            Paragraph(
                "Readiness score is an exploratory self-assessment benchmark calculated by contrasting your submitted skills with industry standard entry criteria. Focus on the Phase 1 & 2 milestones below.",
                body_style
            )
        ]
    ]
    t_diag = Table(diag_data, colWidths=[150, 365])
    t_diag.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), light_bg),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP')
    ]))
    story.append(t_diag)
    story.append(Spacer(1, 10))

    # 5. Phased Milestone Execution Roadmap
    story.append(Paragraph("3. Step-by-Step Execution Blueprint", h1_style))

    roadmap_table_data = [
        [
            Paragraph("<b>#</b>", body_bold),
            Paragraph("<b>Phase & Milestone Title</b>", body_bold),
            Paragraph("<b>Estimated Time</b>", body_bold),
            Paragraph("<b>Tangible Deliverable / Goal</b>", body_bold),
            Paragraph("<b>Status</b>", body_bold)
        ]
    ]

    for idx, m in enumerate(milestones, start=1):
        status_text = "<b>COMPLETED ✓</b>" if m.get("is_completed") else "In Progress"
        status_color = accent_green if m.get("is_completed") else navy_color
        p_status = Paragraph(f"<font color='{status_color.hexval()}'>{status_text}</font>", body_style)

        roadmap_table_data.append([
            Paragraph(str(idx), body_style),
            Paragraph(f"<b>{m.get('title', 'Milestone')}</b><br/><font color='#64748B'>{m.get('desc', '')}</font>", body_style),
            Paragraph(m.get("time", m.get("timeframe", "Month 1")), body_style),
            Paragraph(m.get("deliverable", "Complete practice exercises and document learnings."), body_style),
            p_status
        ])

    t_roadmap = Table(roadmap_table_data, colWidths=[24, 215, 76, 125, 75])
    t_roadmap.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP')
    ]))
    story.append(t_roadmap)
    story.append(Spacer(1, 12))

    # 6. Official Resources & Portals
    if official_resources:
        story.append(Paragraph("4. Verified National Portals & Learning Links", h1_style))
        res_items = []
        for r in official_resources[:4]:
            t = r.get("title", "Government Portal")
            u = r.get("url", "https://swayam.gov.in/")
            res_items.append(Paragraph(f"• <b>{t}</b>: <font color='#1D4ED8'><u>{u}</u></font>", body_style))
        
        t_res = Table([[item] for item in res_items], colWidths=[515])
        t_res.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('BOX', (0, 0), (-1, -1), 0.5, border_color),
            ('PADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(t_res)
        story.append(Spacer(1, 12))

    # 7. Official Guidance Disclaimer
    disclaimer_text = (
        "<b>Important Educational Guidance Notice:</b> PathSetu is an AI-powered personalized career discovery and "
        "decision intelligence platform designed to empower students through self-reflection and transparent skill-gap analysis. "
        "Readiness scores and pathway compatibility are calculated estimates based on self-reported inputs and curated reference taxonomies. "
        "They do not constitute guaranteed admission, competitive exam qualification, or hiring assurances. "
        "Students are strongly advised to cross-verify specific entrance syllabi, eligibility dates, and fee structures on official "
        "university, state board, or central ministry portals (e.g., NCS, NTA, AICTE, UGC)."
    )
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceBefore=4, spaceAfter=6))
    story.append(Paragraph(disclaimer_text, disclaimer_style))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()

