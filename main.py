"""
PathSetu Backend API Server
Built with FastAPI & SQLite for transparent career analysis,
profile persistence, skill-gap calculations, and milestone tracking.
"""

import os
import json
import sqlite3
from typing import List, Optional, Dict, Any
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

# Base Directory
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "pathsetu.db"

# Initialize FastAPI app
app = FastAPI(
    title="PathSetu Career Guidance API",
    description="Transparent 6-stage career analysis, skill-gap diagnosis, and milestone roadmap management.",
    version="2.0.0"
)

# Enable CORS for local development and client flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite Database Schema
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            name TEXT,
            education TEXT,
            interests TEXT,
            skills TEXT,
            strengths TEXT,
            goal TEXT,
            workstyle TEXT,
            priority TEXT,
            constraints TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmap_progress (
            career_id TEXT PRIMARY KEY,
            completed_steps TEXT,
            custom_steps TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# -----------------------------------------------------------------------------
# Pydantic Request / Response Models
# -----------------------------------------------------------------------------
class StudentProfile(BaseModel):
    name: str = "Student"
    education: str = "Class 11–12 (Science / PCM)"
    interests: List[str] = Field(default_factory=lambda: ["technology", "problem-solving"])
    skills: List[str] = Field(default_factory=lambda: ["Python", "HTML5 & CSS3"])
    strengths: List[str] = Field(default_factory=lambda: ["Logic", "Curiosity"])
    goal: Optional[str] = "Build useful technology."
    workstyle: Optional[str] = "Balanced (Hybrid)"
    priority: Optional[str] = "interest"
    constraints: Optional[str] = None

class MilestoneToggle(BaseModel):
    career_id: str
    step_id: str
    completed: bool

class CustomMilestone(BaseModel):
    career_id: str
    title: str
    time: str
    desc: str

# -----------------------------------------------------------------------------
# Curated Career & Project Knowledge (Server-Side Source of Truth)
# -----------------------------------------------------------------------------
CAREERS_DATA = [
    {
        "id": "software",
        "name": "Software Developer",
        "field": "Technology & Engineering",
        "emoji": "💻",
        "badge": "High Demand",
        "salary_range": "₹4.5L - ₹12L / yr (Entry-level India)",
        "time_to_ready": "6 – 12 months",
        "difficulty": "Moderate to Challenging",
        "desc": "Architects, builds, and maintains web applications, services, and digital tools.",
        "target_interests": ["technology", "problem-solving", "logic", "building"],
        "required_skills": [
            {"name": "Programming Foundations (JS / Python)", "level": "Core", "priority": 1},
            {"name": "Data Structures & Algorithms", "level": "Core", "priority": 2},
            {"name": "Git & Version Control", "level": "Essential", "priority": 1},
            {"name": "Web Fundamentals (HTML/CSS/DOM)", "level": "Core", "priority": 2},
            {"name": "Database Design & SQL", "level": "Essential", "priority": 3},
            {"name": "API Integration & REST", "level": "Core", "priority": 2}
        ],
        "steps": [
            {"id": "s1", "title": "Explore the Craft", "time": "Week 1-2", "desc": "Try an introductory coding lesson to feel the feedback loop of writing and running code."},
            {"id": "s2", "title": "Programming Foundations", "time": "Month 1-2", "desc": "Master data structures, functions, conditionals, and algorithmic thinking."},
            {"id": "s3", "title": "Git & Web Fundamentals", "time": "Month 3-4", "desc": "Learn version control with GitHub and build responsive semantic web interfaces."},
            {"id": "s4", "title": "Build First Portfolio Project", "time": "Month 5", "desc": "Construct a full-stack CRUD application with database persistence."},
            {"id": "s5", "title": "Skill-Gap Review & Code Quality", "time": "Month 6", "desc": "Refactor code, write automated tests, and gather peer feedback."},
            {"id": "s6", "title": "Career Entry & Applications", "time": "Month 7+", "desc": "Polish GitHub repositories, document READMEs, and apply for junior roles."}
        ]
    },
    {
        "id": "design",
        "name": "UI/UX & Product Designer",
        "field": "Design & Creative Tech",
        "emoji": "🎨",
        "badge": "High Impact",
        "salary_range": "₹4L - ₹10L / yr (Entry-level India)",
        "time_to_ready": "4 – 8 months",
        "difficulty": "Moderate",
        "desc": "Designs intuitive, accessible, and visually stunning digital products.",
        "target_interests": ["creativity", "technology", "helping", "communication"],
        "required_skills": [
            {"name": "Figma & Component Systems", "level": "Core", "priority": 1},
            {"name": "Visual Hierarchy & Typography", "level": "Core", "priority": 1},
            {"name": "User Research & Usability Testing", "level": "Essential", "priority": 2},
            {"name": "Design Accessibility (WCAG standards)", "level": "Essential", "priority": 3}
        ],
        "steps": [
            {"id": "d1", "title": "UX Audit & Observation", "time": "Week 1-2", "desc": "Audit 3 daily apps you use and document what makes them enjoyable or confusing."},
            {"id": "d2", "title": "Master Figma & Layout Systems", "time": "Month 1-2", "desc": "Learn Figma auto-layout, variants, design tokens, and typography scales."},
            {"id": "d3", "title": "User Research & Wireframing", "time": "Month 3", "desc": "Formulate user interview questions and sketch low-fidelity wireframes."},
            {"id": "d4", "title": "Execute a Case Study", "time": "Month 4-5", "desc": "Redesign an inaccessible public utility or create an original product solution."},
            {"id": "d5", "title": "Portfolio Presentation", "time": "Month 6+", "desc": "Publish an interactive portfolio explaining your rationale and user test results."}
        ]
    },
    {
        "id": "data",
        "name": "Data Analyst & Business Intelligence",
        "field": "Data & Analytics",
        "emoji": "📊",
        "badge": "Fast Growing",
        "salary_range": "₹4L - ₹9.5L / yr (Entry-level India)",
        "time_to_ready": "5 – 9 months",
        "difficulty": "Moderate",
        "desc": "Extracts, cleans, and translates raw datasets into interactive business dashboards.",
        "target_interests": ["problem-solving", "data", "business", "technology"],
        "required_skills": [
            {"name": "Advanced SQL (Joins, Window Functions)", "level": "Core", "priority": 1},
            {"name": "Spreadsheet Mastery (Excel/Sheets)", "level": "Core", "priority": 1},
            {"name": "Data Visualization (Power BI / Tableau)", "level": "Core", "priority": 2},
            {"name": "Python for Data (Pandas, Matplotlib)", "level": "Essential", "priority": 2}
        ],
        "steps": [
            {"id": "da1", "title": "Spreadsheets & Analytics Basics", "time": "Week 1-3", "desc": "Master pivot tables, lookup formulas, and charting."},
            {"id": "da2", "title": "SQL Database Mastery", "time": "Month 1-2", "desc": "Write complex multi-table queries, subqueries, and window functions."},
            {"id": "da3", "title": "BI Dashboard Construction", "time": "Month 3-4", "desc": "Build interactive KPI dashboards in Power BI or Tableau."},
            {"id": "da4", "title": "Python for Data Cleaning", "time": "Month 5", "desc": "Clean and format messy real-world datasets with Pandas."},
            {"id": "da5", "title": "Portfolio Case Study", "time": "Month 6+", "desc": "Analyze a public dataset and write an actionable decision brief."}
        ]
    },
    {
        "id": "ai-engineer",
        "name": "AI & Machine Learning Specialist",
        "field": "Artificial Intelligence",
        "emoji": "🤖",
        "badge": "Emerging Frontier",
        "salary_range": "₹6L - ₹15L / yr (Entry-level India)",
        "time_to_ready": "9 – 16 months",
        "difficulty": "Challenging",
        "desc": "Develops, tunes, and evaluates machine learning models and RAG applications.",
        "target_interests": ["technology", "science", "problem-solving", "logic"],
        "required_skills": [
            {"name": "Python & Scientific Stack", "level": "Core", "priority": 1},
            {"name": "Linear Algebra & Probability", "level": "Core", "priority": 1},
            {"name": "Machine Learning Foundations (Scikit-Learn)", "level": "Core", "priority": 2},
            {"name": "Deep Learning (PyTorch)", "level": "Essential", "priority": 3}
        ],
        "steps": [
            {"id": "ai1", "title": "Math Foundations & Python", "time": "Month 1-2", "desc": "Review linear algebra, vectors, and probability alongside Python programming."},
            {"id": "ai2", "title": "Classical Machine Learning", "time": "Month 3-4", "desc": "Implement supervised and unsupervised models with Scikit-Learn."},
            {"id": "ai3", "title": "Neural Networks & PyTorch", "time": "Month 5-6", "desc": "Understand backpropagation, loss functions, and CNNs."},
            {"id": "ai4", "title": "Modern LLMs & RAG", "time": "Month 7+", "desc": "Build a retrieval-augmented assistant with vector embeddings."}
        ]
    }
]

PROJECTS_DATA = [
    {
        "id": "p1",
        "career_id": "software",
        "title": "Markdown Student Notes & Task Manager",
        "level": "Beginner",
        "effort_hours": "8 - 12 hours",
        "type": "Portfolio Project",
        "objective": "Build a responsive web application that lets students write formatted notes in Markdown and track daily tasks with local storage persistence.",
        "skills": ["HTML5", "CSS3 Flex/Grid", "JavaScript DOM", "LocalStorage API"]
    },
    {
        "id": "p2",
        "career_id": "design",
        "title": "Transit App Accessibility Audit & Redesign",
        "level": "Beginner",
        "effort_hours": "10 - 14 hours",
        "type": "Case Study",
        "objective": "Identify usability and color contrast issues in a complex local transit app, interview 3 commuters, and produce an accessible Figma mobile redesign.",
        "skills": ["Figma Components", "WCAG Contrast Checking", "User Interviews"]
    },
    {
        "id": "p3",
        "career_id": "data",
        "title": "Public School Education Metrics Analysis",
        "level": "Beginner",
        "effort_hours": "8 - 12 hours",
        "type": "Data Report",
        "objective": "Clean and analyze a public education dataset in Excel/SQL to identify regional disparities and create 3 executive charts.",
        "skills": ["SQL Aggregations", "Data Cleaning", "Pivot Tables", "Chart Design"]
    }
]

# -----------------------------------------------------------------------------
# REST API Endpoints
# -----------------------------------------------------------------------------

@app.get("/api/health")
def health_check():
    """Verify API connectivity and backend storage status."""
    return {
        "status": "ok",
        "service": "PathSetu Career Guidance API",
        "version": "2.0.0",
        "database": "sqlite3",
        "database_file": str(DB_PATH)
    }

@app.get("/api/careers")
def get_careers(search: Optional[str] = None, field: Optional[str] = None):
    """Retrieve curated career pathways with optional search and category filters."""
    results = CAREERS_DATA
    if search:
        q = search.lower()
        results = [
            c for c in results
            if q in c["name"].lower() or q in c["desc"].lower() or q in c["field"].lower()
        ]
    if field and field != "all":
        results = [c for c in results if field.lower() in c["field"].lower()]
    return results

@app.get("/api/careers/{career_id}")
def get_career_detail(career_id: str):
    """Retrieve in-depth specifications for a single career pathway."""
    for c in CAREERS_DATA:
        if c["id"] == career_id:
            return c
    raise HTTPException(status_code=404, detail="Career pathway not found")

@app.post("/api/analyze")
def analyze_student_profile(profile: StudentProfile):
    """
    Transparent rule-based recommendation analysis (Stage 02 & 03).
    Computes explainable match scores without black-box hallucination.
    """
    matches = []
    for career in CAREERS_DATA:
        # 1. Interest Overlap (up to 40 pts)
        interest_pts = sum(10 for i in profile.interests if i in career["target_interests"])
        interest_pts = min(interest_pts, 40)

        # 2. Skill Baseline (up to 35 pts)
        skill_pts = 0
        matched_skills = []
        for req in career["required_skills"]:
            if any(req["name"].lower() in s.lower() or s.lower() in req["name"].lower() for s in profile.skills):
                skill_pts += 10
                matched_skills.append(req["name"])
        skill_pts = min(skill_pts, 35)

        # 3. Workstyle & Priority Synergy (up to 25 pts)
        synergy_pts = 15
        if profile.priority == "interest" and interest_pts >= 20:
            synergy_pts += 10
        elif profile.priority == "stability" and career["id"] in ["software", "data"]:
            synergy_pts += 10
        elif profile.priority == "creativity" and career["id"] == "design":
            synergy_pts += 10

        total_match = min(round(interest_pts + skill_pts + synergy_pts), 98)

        matches.append({
            "career_id": career["id"],
            "career_name": career["name"],
            "match_percentage": max(total_match, 45),
            "breakdown": {
                "interest_points": interest_pts,
                "skill_points": skill_pts,
                "synergy_points": synergy_pts
            },
            "matched_skills": matched_skills,
            "rationale": f"Matched {len(profile.interests)} declared interest(s) and {len(matched_skills)} initial skill(s). Matches your priority for '{profile.priority}'."
        })

    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    return matches

@app.post("/api/skill-gap")
def compute_skill_gap(payload: Dict[str, Any]):
    """
    Stage 05 Skill-Gap Analysis.
    Contrasts student's current skills against requirements.
    """
    career_id = payload.get("career_id", "software")
    profile_data = payload.get("profile", {})
    user_skills = profile_data.get("skills", [])

    career = next((c for c in CAREERS_DATA if c["id"] == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")

    ready, in_prog, missing = [], [], []
    for req in career["required_skills"]:
        if any(req["name"].lower() in s.lower() or s.lower() in req["name"].lower() for s in user_skills):
            ready.append(req)
        elif req["priority"] >= 3:
            in_prog.append(req)
        else:
            missing.append(req)

    total = len(career["required_skills"])
    readiness = round(((len(ready) + len(in_prog) * 0.4) / total) * 100) if total else 0

    return {
        "career_id": career["id"],
        "career_name": career["name"],
        "readiness_percentage": min(max(readiness, 20), 95),
        "ready": ready,
        "in_progress": in_prog,
        "missing": missing,
        "priority_next": missing[:3]
    }

@app.get("/api/projects")
def get_projects(career_id: Optional[str] = None):
    """Retrieve curated starter portfolio projects."""
    if career_id and career_id != "all":
        return [p for p in PROJECTS_DATA if p["career_id"] == career_id]
    return PROJECTS_DATA

@app.get("/api/profile")
def get_profile():
    """Load persisted student profile from SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name, education, interests, skills, strengths, goal, workstyle, priority, constraints FROM profiles WHERE id = 'default'")
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"profile": None}

    return {
        "profile": {
            "name": row[0],
            "education": row[1],
            "interests": json.loads(row[2]) if row[2] else [],
            "skills": json.loads(row[3]) if row[3] else [],
            "strengths": json.loads(row[4]) if row[4] else [],
            "goal": row[5],
            "workstyle": row[6],
            "priority": row[7],
            "constraints": row[8]
        }
    }

@app.post("/api/profile")
def save_profile(profile: StudentProfile):
    """Persist student profile to SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO profiles (id, name, education, interests, skills, strengths, goal, workstyle, priority, constraints, updated_at)
        VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (
        profile.name,
        profile.education,
        json.dumps(profile.interests),
        json.dumps(profile.skills),
        json.dumps(profile.strengths),
        profile.goal,
        profile.workstyle,
        profile.priority,
        profile.constraints
    ))
    conn.commit()
    conn.close()
    return {"status": "saved", "profile": profile.dict()}

@app.get("/api/roadmap/{career_id}")
def get_roadmap(career_id: str):
    """Retrieve saved roadmap progress for a career."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT completed_steps, custom_steps FROM roadmap_progress WHERE career_id = ?", (career_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"completed_steps": [], "custom_steps": []}

    return {
        "completed_steps": json.loads(row[0]) if row[0] else [],
        "custom_steps": json.loads(row[1]) if row[1] else []
    }

@app.post("/api/roadmap/toggle")
def toggle_roadmap_step(payload: MilestoneToggle):
    """Mark a milestone complete or incomplete in SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT completed_steps, custom_steps FROM roadmap_progress WHERE career_id = ?", (payload.career_id,))
    row = cursor.fetchone()

    completed = json.loads(row[0]) if row and row[0] else []
    custom = json.loads(row[1]) if row and row[1] else []

    if payload.completed:
        if payload.step_id not in completed:
            completed.append(payload.step_id)
    else:
        completed = [s for s in completed if s != payload.step_id]

    cursor.execute("""
        INSERT OR REPLACE INTO roadmap_progress (career_id, completed_steps, custom_steps, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    """, (payload.career_id, json.dumps(completed), json.dumps(custom)))

    conn.commit()
    conn.close()

    return {"status": "updated", "completed_steps": completed}

# -----------------------------------------------------------------------------
# Static Files & SPA Mounting
# -----------------------------------------------------------------------------

# Mount directories
if (BASE_DIR / "css").exists():
    app.mount("/css", StaticFiles(directory=str(BASE_DIR / "css")), name="css")
if (BASE_DIR / "js").exists():
    app.mount("/js", StaticFiles(directory=str(BASE_DIR / "js")), name="js")
if (BASE_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")

@app.get("/")
@app.get("/index")
@app.get("/index.html")
def serve_index():
    """Serve the PathSetu cinematic 3D landing page."""
    index_file = BASE_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    raise HTTPException(status_code=404, detail="index.html not found")

@app.get("/favicon.ico")
def serve_favicon():
    """Serve the PathSetu favicon."""
    icon_file = BASE_DIR / "assets" / "pathsetu-icon.png"
    if icon_file.exists():
        return FileResponse(icon_file, media_type="image/png")
    raise HTTPException(status_code=404, detail="favicon not found")

@app.get("/careers")
@app.get("/careers.html")
def serve_careers():
    """Serve the dedicated Career Pathways Explorer page."""
    f = BASE_DIR / "careers.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="careers.html not found")

@app.get("/compare")
@app.get("/compare.html")
def serve_compare():
    """Serve the dedicated 3-Way Side-by-Side Career Comparison page."""
    f = BASE_DIR / "compare.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="compare.html not found")

@app.get("/budget")
@app.get("/budget.html")
def serve_budget():
    """Serve the dedicated Budget-Friendly Career Planner page."""
    f = BASE_DIR / "budget.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="budget.html not found")

@app.get("/skill-gap")
@app.get("/skill-gap.html")
def serve_skill_gap():
    """Serve the dedicated Skill-Gap Matrix and Readiness page."""
    f = BASE_DIR / "skill-gap.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="skill-gap.html not found")

@app.get("/roadmap")
@app.get("/roadmap.html")
def serve_roadmap():
    """Serve the dedicated Milestone Roadmap and Progress Dashboard page."""
    f = BASE_DIR / "roadmap.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="roadmap.html not found")

@app.get("/resources")
@app.get("/resources.html")
def serve_resources():
    """Serve the dedicated Verified Educational Resource Explorer page."""
    f = BASE_DIR / "resources.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="resources.html not found")

@app.get("/profile")
@app.get("/profile.html")
def serve_profile():
    """Serve the dedicated Student Intake & Profile Analysis page."""
    f = BASE_DIR / "profile.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="profile.html not found")

@app.get("/projects")
@app.get("/projects.html")
def serve_projects():
    """Serve the dedicated Hands-On Proof-of-Work Projects page."""
    f = BASE_DIR / "projects.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="projects.html not found")

# Direct script run helper
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
