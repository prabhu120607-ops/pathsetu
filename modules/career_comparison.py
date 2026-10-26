"""
Feature A — Career Comparison Module
Compares up to 3 careers side by side with education requirements,
eligibility, skills, learning pathways, verified costs, and next actions.
"""

from typing import List, Dict, Any
from .data_loader import load_careers

def compare_careers(career_ids: List[str]) -> List[Dict[str, Any]]:
    all_careers = load_careers()
    selected = [c for c in all_careers if c["id"] in career_ids]
    return selected[:3]
