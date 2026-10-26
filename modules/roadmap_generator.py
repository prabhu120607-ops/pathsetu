"""
Stage 06 & Feature C — Roadmap Generator & Progress Tracking Modules
Generates ordered milestones and persists progress to user_progress.json.
"""

import json
from pathlib import Path
from typing import Dict, Any, List
from .data_loader import load_careers

PROGRESS_FILE = Path(__file__).resolve().parent.parent / "data" / "user_progress.json"

def generate_roadmap(career_id: str, education_level: str = "") -> List[Dict[str, Any]]:
    careers = load_careers()
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        return []

    base_milestones = career.get("roadmap_milestones", [])
    structured_roadmap = []

    timeframes = ["Week 1-2", "Month 1", "Month 2-3", "Month 4-5", "Month 6", "Month 7+"]
    for idx, m in enumerate(base_milestones):
        t = timeframes[idx] if idx < len(timeframes) else "Ongoing"
        structured_roadmap.append({
            "step_id": f"{career_id}_{idx + 1}",
            "step_num": idx + 1,
            "title": m,
            "timeframe": t,
            "is_completed": False
        })

    return structured_roadmap

def load_user_progress() -> Dict[str, Any]:
    if not PROGRESS_FILE.exists():
        return {
            "selected_career": "software_dev",
            "completed_milestones": [],
            "skills_practicing": [],
            "projects_completed": []
        }
    try:
        with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"selected_career": "software_dev", "completed_milestones": []}

def save_user_progress(data: Dict[str, Any]) -> None:
    PROGRESS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
