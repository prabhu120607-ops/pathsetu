"""
Stage 05 & Feature Three — Intelligent Career Skill-Gap Analysis Module
Compares student's reported skills against target career competency requirements.
Provides transparent readiness percentage, competency classification, impact analysis,
learning resources, time estimates, and practical deliverables.
"""

from typing import Dict, Any, List, Optional
from .data_loader import load_careers, load_skills

def analyze_skill_gap(
    career_id: str,
    student_skills: List[str],
    skill_confidence: Optional[Dict[str, str]] = None,
    student_strengths: Optional[List[str]] = None
) -> Dict[str, Any]:
    careers = load_careers()
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        return {"error": "Career pathway not found"}

    skills_catalog = {s["name"].lower(): s for s in load_skills()}
    user_skills_lower = [s.strip().lower() for s in student_skills]
    skill_conf = skill_confidence or {}
    strengths_list = [st.lower() for st in (student_strengths or [])]

    ready_competencies = []
    in_progress_competencies = []
    missing_competencies = []

    required_skills = career.get("required_skills", [])
    total_skills = len(required_skills)

    for req in required_skills:
        req_name = req.get("name", "")
        req_lower = req_name.lower()
        level = req.get("level", "Core")
        priority = req.get("priority", 1)

        # Lookup in skills catalog if available
        matched_catalog = None
        for cat_name, cat_obj in skills_catalog.items():
            if cat_name in req_lower or req_lower in cat_name:
                matched_catalog = cat_obj
                break

        # Check possession
        is_possessed = any(
            req_lower in us or us in req_lower or (matched_catalog and matched_catalog["name"].lower() in us)
            for us in user_skills_lower
        )

        user_conf = "Not Rated"
        for sk_k, sk_v in skill_conf.items():
            if sk_k.lower() in req_lower or req_lower in sk_k.lower():
                user_conf = sk_v
                break

        # Generate explanatory metadata
        free_resource = matched_catalog.get("free_resource", "SWAYAM / NPTEL Free Learning Course") if matched_catalog else "SWAYAM National Portal"
        resource_url = matched_catalog.get("source_url", "https://swayam.gov.in/") if matched_catalog else "https://swayam.gov.in/"
        prereq = matched_catalog.get("prerequisite", "Basic high school logic") if matched_catalog else "Foundational aptitude"

        # Time estimate based on level & priority
        if level == "Core" and priority == 1:
            est_weeks = "4 to 6 weeks"
            classification = "Foundational Core"
        elif level == "Core":
            est_weeks = "3 to 5 weeks"
            classification = "Core Competency"
        else:
            est_weeks = "2 to 4 weeks"
            classification = "Essential Industry Tool"

        why_it_matters = (
            f"Crucial for daily tasks in {career['name']}. Forms the building block for practical execution."
        )
        if "python" in req_lower or "javascript" in req_lower or "programming" in req_lower:
            why_it_matters = "The primary language to automate tasks, build features, and instruct computers."
        elif "sql" in req_lower or "database" in req_lower:
            why_it_matters = "Allows storing, retrieving, and manipulating structured operational records safely."
        elif "figma" in req_lower or "wireframe" in req_lower:
            why_it_matters = "The standard design canvas to translate user ideas into interactive clickable wireframes."
        elif "git" in req_lower:
            why_it_matters = "Essential to collaborate with teams, track code history, and showcase proof of work."
        elif "soil" in req_lower or "crop" in req_lower:
            why_it_matters = "Determines optimal planting calendars and nutrient mixtures for sustainable yields."
        elif "solar" in req_lower or "electrical" in req_lower or "circuit" in req_lower:
            why_it_matters = "Ensures safe high-voltage DC/AC conversion and long-term grid stability."
        elif "vital" in req_lower or "first aid" in req_lower or "nursing" in req_lower:
            why_it_matters = "Vital patient monitoring safeguards human life during acute medical transitions."

        gap_impact = (
            f"Without {req_name}, you may struggle during practical project assignments or technical interviews."
        )
        how_to_learn = (
            f"Complete 2 practical modules on {free_resource}, then build a mini exercise demonstrating {req_name}."
        )

        item = {
            "name": req_name,
            "classification": classification,
            "level": level,
            "priority": priority,
            "is_possessed": is_possessed,
            "confidence": user_conf,
            "why_matters": why_it_matters,
            "gap_impact": gap_impact,
            "how_to_learn": how_to_learn,
            "prerequisite": prereq,
            "estimated_time": est_weeks,
            "recommended_resource": {"title": free_resource, "url": resource_url},
            "starter_project": f"Build a practical exercise or mini-case demonstrating {req_name}."
        }

        if is_possessed:
            if user_conf in ["Advanced", "Proficient", "Intermediate"]:
                ready_competencies.append(item)
            elif user_conf == "Beginner":
                in_progress_competencies.append(item)
            else:
                ready_competencies.append(item)
        else:
            missing_competencies.append(item)

    # Calculate transparent readiness percentage
    # Ready = 1.0 weight, In-Progress = 0.5 weight, Missing = 0
    earned_pts = len(ready_competencies) * 1.0 + len(in_progress_competencies) * 0.5
    raw_readiness = (earned_pts / max(total_skills, 1)) * 100
    readiness_percentage = round(min(max(raw_readiness, 15 if student_skills else 5), 95))

    # Priority next 3
    priority_next = missing_competencies[:3] if missing_competencies else in_progress_competencies[:3]

    return {
        "career_id": career["id"],
        "career_name": career["name"],
        "career_emoji": career.get("emoji", "🎯"),
        "total_required_skills": total_skills,
        "readiness_percentage": readiness_percentage,
        "readiness_formula": (
            f"Calculated from {len(ready_competencies)} possessed core skill(s) (100% weight) "
            f"+ {len(in_progress_competencies)} in-progress skill(s) (50% weight) "
            f"out of {total_skills} target industry competencies."
        ),
        "skills_possessed": ready_competencies,
        "skills_in_progress": in_progress_competencies,
        "skills_missing": missing_competencies,
        "priority_next_3": priority_next,
        "starter_projects": career.get("starter_projects", []),
        "official_resources": career.get("official_reference_links", [])
    }
