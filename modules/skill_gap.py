"""
Stage 05 — Skill-Gap Analysis Module
Compares student's reported skills with requirements and prioritizes the next 3 skills.
"""

from typing import Dict, Any, List
from .data_loader import load_careers

def analyze_skill_gap(career_id: str, student_skills: List[str]) -> Dict[str, Any]:
    careers = load_careers()
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        return {"error": "Career not found"}

    user_skills_lower = [s.lower() for s in student_skills]
    ready = []
    missing = []

    for req in career.get("required_skills", []):
        r_name = req.get("name", "")
        if any(r_name.lower() in us or us in r_name.lower() for us in user_skills_lower):
            ready.append(req)
        else:
            missing.append(req)

    total = len(career.get("required_skills", []))
    readiness_pct = round((len(ready) / total * 100)) if total else 0

    return {
        "career_name": career["name"],
        "readiness_percentage": min(max(readiness_pct, 15), 95),
        "skills_possessed": ready,
        "skills_to_develop": missing,
        "priority_next_3": missing[:3]
    }
