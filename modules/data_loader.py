"""
PathSetu Data Loader Module
Loads shared datasets (JSON and CSV) safely with error handling and caching.
"""

import json
import csv
from pathlib import Path
from typing import Dict, List, Any, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

def load_json(filename: str) -> Any:
    path = DATA_DIR / filename
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_careers() -> List[Dict[str, Any]]:
    return load_json("careers.json")

def load_resources() -> List[Dict[str, Any]]:
    return load_json("resources.json")

def load_scoring_config() -> Dict[str, Any]:
    cfg = load_json("scoring_config.json")
    if not cfg:
        return {
            "weights": {
                "interest_alignment": 0.35,
                "subject_alignment": 0.25,
                "skill_alignment": 0.20,
                "education_compatibility": 0.15,
                "workstyle_preference": 0.05
            }
        }
    return cfg

def load_translations() -> Dict[str, Dict[str, str]]:
    return load_json("translations.json")

def load_skills() -> List[Dict[str, str]]:
    path = DATA_DIR / "skills.csv"
    if not path.exists():
        return []
    skills = []
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            skills.append(dict(row))
    return skills

def load_colleges() -> List[Dict[str, Any]]:
    return load_json("colleges.json")
