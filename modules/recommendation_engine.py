"""
PathSetu Recommendation Engine
Computes explainable compatibility scores using configurable weights:
- Interest alignment: 35%
- Subject alignment: 25%
- Skill alignment: 20%
- Education pathway compatibility: 15%
- Work-style preference: 5%
"""

from typing import Dict, List, Any
from .data_loader import load_careers, load_scoring_config

def calculate_compatibility(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    careers = load_careers()
    cfg = load_scoring_config()
    weights = cfg.get("weights", {
        "interest_alignment": 0.35,
        "subject_alignment": 0.25,
        "skill_alignment": 0.20,
        "education_compatibility": 0.15,
        "workstyle_preference": 0.05
    })

    user_interests = set(profile.get("interests", []))
    user_subjects = set(profile.get("subjects", []))
    user_skills = [s.lower() for s in profile.get("skills", [])]
    user_edu = profile.get("education", "")
    user_workstyle = profile.get("workstyle", "")

    recommendations = []

    for c in careers:
        # 1. Interest Alignment (0 to 1)
        c_interests = set(c.get("target_interests", []))
        overlap_interests = user_interests.intersection(c_interests)
        interest_score = len(overlap_interests) / max(len(c_interests), 1) if c_interests else 0.5
        interest_score = min(interest_score, 1.0)

        # 2. Subject Alignment (0 to 1)
        c_subjects = set(c.get("target_subjects", []))
        overlap_subjects = user_subjects.intersection(c_subjects)
        subject_score = len(overlap_subjects) / max(len(c_subjects), 1) if c_subjects else 0.5
        subject_score = min(subject_score, 1.0)

        # 3. Skill Alignment (0 to 1)
        c_skills = c.get("required_skills", [])
        matched_skills = []
        skills_to_develop = []
        for req in c_skills:
            req_name = req.get("name", "")
            if any(req_name.lower() in us or us in req_name.lower() for us in user_skills):
                matched_skills.append(req_name)
            else:
                skills_to_develop.append(req_name)

        skill_score = len(matched_skills) / max(len(c_skills), 1) if c_skills else 0.4
        skill_score = min(skill_score, 1.0)

        # 4. Education Pathway Compatibility (0 to 1)
        c_edu_levels = c.get("target_education_levels", [])
        edu_score = 1.0 if user_edu in c_edu_levels else 0.6 if not user_edu else 0.4

        # 5. Work-style Preference (0 to 1)
        c_workstyle = c.get("typical_workstyle", "")
        workstyle_score = 1.0 if user_workstyle == c_workstyle else 0.5 if not user_workstyle else 0.3

        # Weighted calculation
        total_score = (
            (interest_score * weights["interest_alignment"]) +
            (subject_score * weights["subject_alignment"]) +
            (skill_score * weights["skill_alignment"]) +
            (edu_score * weights["education_compatibility"]) +
            (workstyle_score * weights["workstyle_preference"])
        ) * 100

        normalized_score = round(min(max(total_score, 32), 98))

        explanation_parts = []
        if overlap_interests:
            explanation_parts.append(f"Matched {len(overlap_interests)} interest(s): {', '.join(overlap_interests)}.")
        if overlap_subjects:
            explanation_parts.append(f"Strong subject synergy with: {', '.join(overlap_subjects)}.")
        if matched_skills:
            explanation_parts.append(f"You already have {len(matched_skills)} relevant baseline skill(s).")
        else:
            explanation_parts.append("Great beginner track where you can learn foundational skills from zero.")

        recommendations.append({
            "career_id": c["id"],
            "title": c["name"],
            "title_te": c.get("name_te", c["name"]),
            "category": c.get("category", "General"),
            "emoji": c.get("emoji", "🎯"),
            "badge": c.get("badge", ""),
            "compatibility_score": normalized_score,
            "score_breakdown": {
                "interest_pts": round(interest_score * weights["interest_alignment"] * 100, 1),
                "subject_pts": round(subject_score * weights["subject_alignment"] * 100, 1),
                "skill_pts": round(skill_score * weights["skill_alignment"] * 100, 1),
                "edu_pts": round(edu_score * weights["education_compatibility"] * 100, 1),
                "workstyle_pts": round(workstyle_score * weights["workstyle_preference"] * 100, 1)
            },
            "explanation": " ".join(explanation_parts),
            "existing_relevant_skills": matched_skills,
            "skills_to_develop": skills_to_develop,
            "education_pathways": c.get("verified_education_pathways", []),
            "official_links": c.get("official_reference_links", []),
            "next_actions": c.get("starter_projects", []),
            "salary_range": c.get("entry_salary_range_inr", ""),
            "study_duration": c.get("study_duration", "")
        })

    recommendations.sort(key=lambda x: x["compatibility_score"], reverse=True)
    return recommendations
