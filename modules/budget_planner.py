"""
Feature B — Budget-Friendly Career Planner Module
Compares student's budget in INR against educational pathway costs,
surfacing free government programs, scholarships, and low-cost alternatives.
"""

from typing import Dict, Any, List
from .data_loader import load_careers, load_resources

def evaluate_budget_affordability(career_id: str, budget_inr: float) -> Dict[str, Any]:
    careers = load_careers()
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        return {"error": "Career not found"}

    costs = career.get("estimated_education_cost_inr", {})
    govt_cost_str = costs.get("government_route", "₹15,000 / year")
    private_cost_str = costs.get("private_route", "₹80,000 / year")
    self_taught_str = costs.get("self_taught_open_route", "₹0")

    # Estimated annual baseline numeric approximation for guidance
    govt_baseline = 25000.0
    if "solar" in career_id: govt_baseline = 5000.0
    elif "agri" in career_id: govt_baseline = 18000.0
    elif "nurse" in career_id: govt_baseline = 22000.0
    elif "software" in career_id: govt_baseline = 35000.0

    fits_govt = budget_inr >= govt_baseline
    free_alternatives = career.get("free_learning_alternatives", [])
    scholarships = career.get("scholarship_opportunities", [])

    return {
        "career_name": career["name"],
        "student_budget_inr": budget_inr,
        "government_route_cost": govt_cost_str,
        "private_route_cost": private_cost_str,
        "open_learning_cost": self_taught_str,
        "is_within_govt_budget": fits_govt,
        "free_learning_alternatives": free_alternatives,
        "scholarships": scholarships,
        "advisory": (
            "Your budget is sufficient for recognized Government college / ITI pathways or low-cost learning."
            if fits_govt else
            "Your budget is lower than typical tuition; prioritize 100% free SWAYAM/Skill India courses and apply for Post-Matric / NSP scholarships."
        )
    }
