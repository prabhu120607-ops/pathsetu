"""
Stage 06 & Feature Four — Adaptive 6-Phase Roadmap Generator
Generates a structured, phased execution plan adapted to the chosen career,
student educational background, identified skill gaps, and practical deliverables.
"""

from typing import Dict, Any, List, Optional
from .data_loader import load_careers

PHASE_TEMPLATES = {
    "software_dev": [
        {
            "phase_num": 1,
            "phase_name": "Explore & Validate",
            "timeframe": "Weeks 1–2",
            "title": "Interactive Exploration & Dev Environment Setup",
            "desc": "Install VS Code, Git, and Python. Complete a 10-lesson interactive coding challenge to experience the developer feedback loop.",
            "deliverable": "Configured local environment and first functional command-line script pushed to GitHub.",
            "skill": "Git & Programming Foundations",
            "prerequisite": "Basic computer literacy"
        },
        {
            "phase_num": 2,
            "phase_name": "Foundational Knowledge",
            "timeframe": "Month 1–2",
            "title": "Core Programming & Algorithmic Problem Solving",
            "desc": "Master data types, loops, conditionals, functions, and elementary data structures (lists, dictionaries, sets).",
            "deliverable": "Solve 20 beginner-to-intermediate algorithmic problems on an open platform.",
            "skill": "Python / JavaScript Logic",
            "prerequisite": "Phase 1 completion"
        },
        {
            "phase_num": 3,
            "phase_name": "Develop Core Skills",
            "timeframe": "Month 3–4",
            "title": "Web Architecture, Databases & REST APIs",
            "desc": "Build responsive interfaces using semantic HTML5 and CSS Flexbox/Grid. Learn SQL relational queries and RESTful API principles.",
            "deliverable": "A database-backed CRUD application that handles user input and persists records.",
            "skill": "SQL & Web Architecture",
            "prerequisite": "Core programming foundations"
        },
        {
            "phase_num": 4,
            "phase_name": "Practical Deliverables",
            "timeframe": "Month 5",
            "title": "Capstone Portfolio Application",
            "desc": "Design and construct an end-to-end full-stack project solving an authentic local or educational problem.",
            "deliverable": "Deployed web application with live demo URL and thorough documentation README on GitHub.",
            "skill": "Full-Stack Project Integration",
            "prerequisite": "CRUD & database mastery"
        },
        {
            "phase_num": 5,
            "phase_name": "Demonstrable Experience",
            "timeframe": "Month 6",
            "title": "Peer Review, Open Source & Code Quality",
            "desc": "Refactor code structure, write automated test cases, and make a first pull request to a community or open-source repo.",
            "deliverable": "Merged or documented open-source contribution and verified test coverage.",
            "skill": "Code Quality & Collaboration",
            "prerequisite": "Portfolio project deployed"
        },
        {
            "phase_num": 6,
            "phase_name": "Review & Transition",
            "timeframe": "Month 7+",
            "title": "Technical Resume, Portfolios & Internship Applications",
            "desc": "Draft a single-page technical resume highlighting verified deliverables. Apply to junior roles, internships, or college tech clubs.",
            "deliverable": "Published portfolio site, polished LinkedIn/GitHub profiles, and 10 targeted applications.",
            "skill": "Professional Career Transition",
            "prerequisite": "Completed portfolio"
        }
    ],
    "ui_ux_designer": [
        {
            "phase_num": 1,
            "phase_name": "Explore & Validate",
            "timeframe": "Weeks 1–2",
            "title": "UI Teardown & Daily App Usability Audit",
            "desc": "Audit 3 daily mobile applications (e.g., UPI payment, bus booking). Document pain points and visual hierarchy breakdowns.",
            "deliverable": "A 5-slide visual teardown document outlining usability bottlenecks.",
            "skill": "Observation & Heuristic Evaluation",
            "prerequisite": "Curiosity and attention to detail"
        },
        {
            "phase_num": 2,
            "phase_name": "Foundational Knowledge",
            "timeframe": "Month 1–2",
            "title": "Visual Design Principles & Typography Scales",
            "desc": "Study contrast ratios, spacing systems (8pt grid), color harmonies, and responsive font pairings for mobile screens.",
            "deliverable": "A UI component kit with styled buttons, inputs, cards, and modal dialogs.",
            "skill": "Visual Hierarchy & Typography",
            "prerequisite": "Design basics"
        },
        {
            "phase_num": 3,
            "phase_name": "Develop Core Skills",
            "timeframe": "Month 3",
            "title": "Figma Mastery & Auto-Layout Component Systems",
            "desc": "Learn nested auto-layout, interactive variants, design tokens, and clickable micro-prototyping.",
            "deliverable": "An interactive clickable 5-screen prototype in Figma.",
            "skill": "Figma Components & Prototyping",
            "prerequisite": "Component kit"
        },
        {
            "phase_num": 4,
            "phase_name": "Practical Deliverables",
            "timeframe": "Month 4–5",
            "title": "Conducting User Research & End-to-End Case Study",
            "desc": "Interview 3 target users from Tier-2/3 backgrounds. Map user journey maps, low-fidelity wireframes, and high-fidelity redesigns.",
            "deliverable": "Complete case study detailing user quotes, iterations, before/after comparisons, and rationale.",
            "skill": "User Research & Case Studies",
            "prerequisite": "Figma proficiency"
        },
        {
            "phase_num": 5,
            "phase_name": "Demonstrable Experience",
            "timeframe": "Month 6",
            "title": "Accessibility Verification (WCAG) & Developer Handoff",
            "desc": "Run color contrast checks for low-cost Android displays. Annotate developer design specs and export assets cleanly.",
            "deliverable": "Verified WCAG-compliant design token documentation and export specs.",
            "skill": "Design Accessibility & Handoff",
            "prerequisite": "Complete case study"
        },
        {
            "phase_num": 6,
            "phase_name": "Review & Transition",
            "timeframe": "Month 7+",
            "title": "Online Portfolio Presentation & Mentorship Feedback",
            "desc": "Publish case studies on Notion, Behance, or a custom web portfolio. Request design critiques from working professionals.",
            "deliverable": "Live portfolio link with 2 detailed case studies ready for internship outreach.",
            "skill": "Design Portfolio Presentation",
            "prerequisite": "Finished case studies"
        }
    ],
    "agri_scientist": [
        {
            "phase_num": 1,
            "phase_name": "Explore & Validate",
            "timeframe": "Weeks 1–2",
            "title": "Regional Agro-Climatic Survey & Crop Observation",
            "desc": "Observe primary crop cycles, soil conditions, and pest patterns in your local mandal or district.",
            "deliverable": "Local crop calendar log sheet mapping sowing to harvesting periods.",
            "skill": "Field Observation & Crop Cycles",
            "prerequisite": "High school science"
        },
        {
            "phase_num": 2,
            "phase_name": "Foundational Knowledge",
            "timeframe": "Month 1–2",
            "title": "Soil Chemistry, pH & Nutrient Testing Basics",
            "desc": "Understand macro (NPK) and micronutrient dynamics, soil pH testing methods, and organic matter enrichment.",
            "deliverable": "Soil testing report for 3 localized field samples with corrective nutrient recommendations.",
            "skill": "Soil Science & Nutrient Management",
            "prerequisite": "Basic chemistry"
        },
        {
            "phase_num": 3,
            "phase_name": "Develop Core Skills",
            "timeframe": "Month 3–4",
            "title": "Integrated Pest Management (IPM) & Crop Protection",
            "desc": "Study biological controls, pheromone traps, and judicious pesticide applications to reduce input costs.",
            "deliverable": "IPM strategy sheet for a major regional commercial or grain crop.",
            "skill": "Pest & Disease Diagnosis",
            "prerequisite": "Crop botany basics"
        },
        {
            "phase_num": 4,
            "phase_name": "Practical Deliverables",
            "timeframe": "Month 5",
            "title": "Water-Smart Irrigation & Precision Techniques",
            "desc": "Model drip irrigation scheduling, fertigation calculations, and rainwater harvesting parameters.",
            "deliverable": "Micro-irrigation budget and layout plan for a 2-acre model plot.",
            "skill": "Precision Irrigation",
            "prerequisite": "Soil moisture fundamentals"
        },
        {
            "phase_num": 5,
            "phase_name": "Demonstrable Experience",
            "timeframe": "Month 6",
            "title": "FPO & Krishi Vigyan Kendra (KVK) Field Interaction",
            "desc": "Engage with local Krishi Vigyan Kendra extension scientists or Farmer Producer Organizations (FPOs).",
            "deliverable": "Documented field log of agricultural advisory discussions and farmer challenges.",
            "skill": "Agricultural Extension & Farmer Communication",
            "prerequisite": "Field experience"
        },
        {
            "phase_num": 6,
            "phase_name": "Review & Transition",
            "timeframe": "Month 7+",
            "title": "Entrance Exam Preparation (ICAR / State Agri CET)",
            "desc": "Formulate a systematic revision schedule for ICAR AIEEA or State Agricultural Common Entrance Tests.",
            "deliverable": "Complete 5 years of previous entrance test papers and track scoring improvements.",
            "skill": "Academic Competitive Readiness",
            "prerequisite": "Class 12 PCB/PCMB"
        }
    ],
    "solar_electrician": [
        {
            "phase_num": 1,
            "phase_name": "Explore & Validate",
            "timeframe": "Weeks 1–2",
            "title": "Electrical Safety Standards & Tool Familiarization",
            "desc": "Learn PPE protocols, lock-out/tag-out rules, digital multimeters, wire strippers, and crimping tools.",
            "deliverable": "Safety compliance checklist and multimeter calibration verification.",
            "skill": "Electrical Safety Protocols",
            "prerequisite": "Class 10 science"
        },
        {
            "phase_num": 2,
            "phase_name": "Foundational Knowledge",
            "timeframe": "Month 1–2",
            "title": "DC/AC Circuitry & Photovoltaic Physics",
            "desc": "Master Ohm's Law, series and parallel PV string calculations, open-circuit voltage, and short-circuit current.",
            "deliverable": "Circuit diagram and voltage drop calculations for a 3kW residential solar array.",
            "skill": "Circuit Analysis & String Sizing",
            "prerequisite": "Basic math & physics"
        },
        {
            "phase_num": 3,
            "phase_name": "Develop Core Skills",
            "timeframe": "Month 3",
            "title": "Mechanical Rooftop Mounting & Structure Alignment",
            "desc": "Understand roof load bearing, azimuth and tilt angle optimization for Indian latitudes, and waterproof anchoring.",
            "deliverable": "Structural mounting layout and tilt calculation for a model tin-shed and concrete terrace.",
            "skill": "Rooftop Mechanical Installation",
            "prerequisite": "Circuitry foundations"
        },
        {
            "phase_num": 4,
            "phase_name": "Practical Deliverables",
            "timeframe": "Month 4–5",
            "title": "Inverter Wiring, Earthing & Lightning Protection",
            "desc": "Install DC distribution boxes (DCDB), AC distribution boxes (ACDB), surge protection devices (SPD), and earth pits.",
            "deliverable": "Complete single-line electrical diagram (SLD) and tested earth resistance measurement.",
            "skill": "Earthing & Inverter Integration",
            "prerequisite": "Mounting skills"
        },
        {
            "phase_num": 5,
            "phase_name": "Demonstrable Experience",
            "timeframe": "Month 6",
            "title": "Suryamitra Certification & Grid Sync Testing",
            "desc": "Enroll in the Ministry of New and Renewable Energy (NISE) Suryamitra training program or Skill India assessment.",
            "deliverable": "Suryamitra government skill certificate and verified apprenticeship hours.",
            "skill": "Government Certification & Compliance",
            "prerequisite": "Practical wiring experience"
        },
        {
            "phase_num": 6,
            "phase_name": "Review & Transition",
            "timeframe": "Month 7+",
            "title": "Commercial EPC Installation or Independent Contracting",
            "desc": "Register with local solar channel partners or apply for rooftop solar installer roles under PM Surya Ghar.",
            "deliverable": "Certified technician profile listed on National Career Service and local contractor directory.",
            "skill": "Professional Trade Practice",
            "prerequisite": "Suryamitra certification"
        }
    ]
}

def generate_dynamic_roadmap(career_id: str, student_profile: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    careers = load_careers()
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        return []

    # If predefined structured template exists, use it
    if career_id in PHASE_TEMPLATES:
        template = PHASE_TEMPLATES[career_id]
        roadmap = []
        for idx, item in enumerate(template):
            roadmap.append({
                "step_id": f"{career_id}_{idx + 1}",
                "phase_num": item["phase_num"],
                "phase_name": item["phase_name"],
                "timeframe": item["timeframe"],
                "title": item["title"],
                "desc": item["desc"],
                "deliverable": item["deliverable"],
                "skill": item["skill"],
                "prerequisite": item["prerequisite"],
                "is_completed": False
            })
        return roadmap

    # Fallback generic domain adaptation using career's raw milestones
    base_milestones = career.get("roadmap_milestones", [])
    phases = [
        ("Phase 1: Explore & Validate", "Weeks 1–2", "Explore foundational concepts and industry workflows."),
        ("Phase 2: Foundational Knowledge", "Month 1–2", "Build subject-matter baseline and conceptual fluency."),
        ("Phase 3: Develop Core Skills", "Month 3–4", "Practice essential tools and standardized methodologies."),
        ("Phase 4: Practical Deliverables", "Month 5", "Complete hands-on proofs of work and portfolio assets."),
        ("Phase 5: Demonstrable Experience", "Month 6", "Undertake field reviews, quality checks, and real-world trials."),
        ("Phase 6: Career Transition", "Month 7+", "Prepare credentials, certifications, and application outreach.")
    ]

    roadmap = []
    for idx, (p_name, t_frame, p_desc) in enumerate(phases):
        m_title = base_milestones[idx] if idx < len(base_milestones) else f"Advance mastery in {career['name']} competencies"
        roadmap.append({
            "step_id": f"{career_id}_{idx + 1}",
            "phase_num": idx + 1,
            "phase_name": p_name.split(":")[1].strip(),
            "timeframe": t_frame,
            "title": m_title,
            "desc": f"{p_desc} Aligned with {career['name']} requirements.",
            "deliverable": f"Documented proof of completion for {m_title}.",
            "skill": f"Core {career.get('category', 'Professional')} Competencies",
            "prerequisite": f"Phase {idx} foundations" if idx > 0 else "Curiosity and discipline",
            "is_completed": False
        })

    return roadmap
