"""
PathSetu (పథసేతు) — Backend API & Web Application Server
Full-Stack Career Decision Intelligence Platform with Real Authentication,
Guided Onboarding, 5-Factor Weighted Career Matching, Real-World Career Stories,
Intelligent Skill-Gap Analysis, and Phased Roadmap with ReportLab PDF Generation.
"""

import os
import json
import uuid
import secrets
import sqlite3
from typing import List, Optional, Dict, Any
from pathlib import Path
from datetime import datetime, timedelta

import bcrypt
from fastapi import FastAPI, HTTPException, Request, Response, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response as RawResponse, RedirectResponse
from pydantic import BaseModel, Field

# Internal modules
from modules.data_loader import (
    load_careers, load_resources, load_scoring_config,
    load_translations, load_skills
)
from modules.recommendation_engine import calculate_compatibility
from modules.skill_gap import analyze_skill_gap
from modules.roadmap_generator import generate_dynamic_roadmap
from modules.budget_planner import evaluate_budget_affordability
from modules.career_comparison import compare_careers
from modules.pdf_exporter import generate_roadmap_pdf

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "pathsetu.db"

app = FastAPI(
    title="PathSetu Career Decision Intelligence API",
    description="Full-stack API for student authentication, onboarding, career matching, real-world stories, skill-gap diagnostics, and milestone roadmaps.",
    version="3.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Database Connection & Initialization
# -----------------------------------------------------------------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            onboarding_completed INTEGER DEFAULT 0,
            selected_career TEXT DEFAULT 'software_dev'
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS auth_sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS profiles (
            user_id TEXT PRIMARY KEY,
            name TEXT,
            education TEXT,
            academic_stream TEXT,
            location TEXT,
            preferred_language TEXT DEFAULT 'en',
            interests TEXT,
            subjects TEXT,
            strong_subjects TEXT,
            difficult_subjects TEXT,
            skills TEXT,
            skill_confidence TEXT,
            strengths TEXT,
            goal TEXT,
            career_aspirations TEXT,
            workstyle TEXT,
            priority TEXT,
            budget_inr REAL DEFAULT 25000,
            constraints TEXT,
            learning_pace TEXT,
            further_education TEXT,
            selected_career TEXT DEFAULT 'software_dev',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmap_progress (
            user_id TEXT NOT NULL,
            career_id TEXT NOT NULL,
            completed_steps TEXT,
            custom_steps TEXT,
            target_dates TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, career_id),
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skill_assessments (
            user_id TEXT NOT NULL,
            career_id TEXT NOT NULL,
            ratings TEXT,
            readiness_score REAL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, career_id),
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS career_stories (
            id TEXT PRIMARY KEY,
            contributor_name TEXT NOT NULL,
            role TEXT NOT NULL,
            career_id TEXT NOT NULL,
            career_field TEXT NOT NULL,
            education_route TEXT NOT NULL,
            experience_level TEXT NOT NULL,
            language TEXT DEFAULT 'en',
            video_url TEXT,
            video_embed_url TEXT,
            is_sample INTEGER DEFAULT 0,
            headline TEXT NOT NULL,
            intro TEXT NOT NULL,
            journey TEXT NOT NULL,
            daily_life TEXT NOT NULL,
            challenges TEXT NOT NULL,
            skills_used TEXT NOT NULL,
            mistakes_to_avoid TEXT NOT NULL,
            advice_for_beginners TEXT NOT NULL,
            how_learned TEXT NOT NULL,
            resources TEXT NOT NULL,
            published INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

init_db()

# -----------------------------------------------------------------------------
# Security & Session Authentication
# -----------------------------------------------------------------------------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def create_session(user_id: str) -> str:
    token = secrets.token_urlsafe(36)
    expires = datetime.now() + timedelta(days=30)
    conn = get_db()
    conn.execute(
        "INSERT INTO auth_sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
        (token, user_id, expires.isoformat())
    )
    conn.commit()
    conn.close()
    return token

def get_current_user_optional(request: Request) -> Optional[Dict[str, Any]]:
    token = request.cookies.get("pathsetu_session")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
    if not token:
        return None

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.email, u.name, u.onboarding_completed, u.selected_career
        FROM auth_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None
    return dict(row)

def get_current_user(request: Request) -> Dict[str, Any]:
    user = get_current_user_optional(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in to access this feature."
        )
    return user

# -----------------------------------------------------------------------------
# Pydantic Schemas
# -----------------------------------------------------------------------------
class RegisterSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=8)
    confirm_password: Optional[str] = None

class LoginSchema(BaseModel):
    email: str = Field(..., min_length=5, max_length=120)
    password: str

class ProfileSchema(BaseModel):
    name: str = "Student"
    education: str = "Class 11–12 (Science / PCM)"
    academic_stream: Optional[str] = "Science"
    location: Optional[str] = None
    preferred_language: Optional[str] = "en"
    interests: List[str] = Field(default_factory=lambda: ["technology", "problem-solving"])
    subjects: List[str] = Field(default_factory=lambda: ["Mathematics", "Computer Science"])
    strong_subjects: List[str] = Field(default_factory=list)
    difficult_subjects: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=lambda: ["Python", "HTML5 & CSS3"])
    skill_confidence: Dict[str, str] = Field(default_factory=dict)
    strengths: List[str] = Field(default_factory=lambda: ["Logic", "Curiosity"])
    goal: Optional[str] = "Build practical domain competence."
    career_aspirations: Optional[str] = None
    workstyle: Optional[str] = "Desk / Digital (Software, Design, Analytics)"
    priority: Optional[str] = "interest"
    budget_inr: Optional[float] = 25000.0
    constraints: Optional[str] = None
    learning_pace: Optional[str] = "Moderate (10-15 hrs/week)"
    further_education: Optional[str] = "Planning for Degree / Technical College"
    selected_career: Optional[str] = "software_dev"

class MilestoneToggleSchema(BaseModel):
    career_id: str
    step_id: str
    completed: bool

class CustomMilestoneSchema(BaseModel):
    career_id: str
    title: str
    timeframe: str
    desc: str
    deliverable: Optional[str] = None

class SkillRatingSchema(BaseModel):
    career_id: str
    skill_name: str
    rating: str  # Beginner, Intermediate, Proficient

class CareerSelectSchema(BaseModel):
    career_id: str

# -----------------------------------------------------------------------------
# REST API: Authentication Endpoints
# -----------------------------------------------------------------------------
@app.post("/api/auth/register")
def register_user(payload: RegisterSchema, response: Response):
    """Registers a new student account, hashes password, and creates a secure session."""
    if payload.confirm_password and payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    email_clean = payload.email.lower().strip()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email_clean,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email address already exists. Please log in.")

    user_id = f"user_{uuid.uuid4().hex[:12]}"
    pwd_hash = hash_password(payload.password)

    cursor.execute("""
        INSERT INTO users (id, email, name, password_hash, onboarding_completed, selected_career)
        VALUES (?, ?, ?, ?, 0, 'software_dev')
    """, (user_id, email_clean, payload.name.strip(), pwd_hash))
    conn.commit()
    conn.close()

    session_token = create_session(user_id)
    response.set_cookie(
        key="pathsetu_session",
        value=session_token,
        httponly=True,
        samesite="lax",
        max_age=30 * 86400,
        path="/"
    )

    return {
        "status": "success",
        "message": "Account created successfully.",
        "session_token": session_token,
        "user": {
            "id": user_id,
            "email": email_clean,
            "name": payload.name.strip(),
            "onboarding_completed": False,
            "selected_career": "software_dev"
        }
    }

@app.post("/api/auth/login")
def login_user(payload: LoginSchema, response: Response):
    """Authenticates student credentials and returns a secure session."""
    email_clean = payload.email.lower().strip()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, email, name, password_hash, onboarding_completed, selected_career
        FROM users WHERE email = ?
    """, (email_clean,))
    row = cursor.fetchone()
    conn.close()

    if not row or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    user_id = row["id"]
    session_token = create_session(user_id)
    response.set_cookie(
        key="pathsetu_session",
        value=session_token,
        httponly=True,
        samesite="lax",
        max_age=30 * 86400,
        path="/"
    )

    return {
        "status": "success",
        "message": "Signed in successfully.",
        "session_token": session_token,
        "user": {
            "id": row["id"],
            "email": row["email"],
            "name": row["name"],
            "onboarding_completed": bool(row["onboarding_completed"]),
            "selected_career": row["selected_career"] or "software_dev"
        }
    }

@app.post("/api/auth/logout")
def logout_user(request: Request, response: Response):
    """Terminates authenticated session and clears session cookie."""
    token = request.cookies.get("pathsetu_session")
    if token:
        conn = get_db()
        conn.execute("DELETE FROM auth_sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()

    response.delete_cookie(key="pathsetu_session", path="/")
    return {"status": "success", "message": "Logged out successfully."}

@app.get("/api/auth/me")
def get_current_user_profile(user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    """Returns authenticated student session info or null if unauthenticated."""
    if not user:
        return {"authenticated": False, "user": None}
    return {
        "authenticated": True,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "onboarding_completed": bool(user["onboarding_completed"]),
            "selected_career": user.get("selected_career") or "software_dev"
        }
    }

# -----------------------------------------------------------------------------
# REST API: Student Profile & Onboarding Endpoints
# -----------------------------------------------------------------------------
@app.get("/api/profile")
def get_student_profile(user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves the authenticated student's saved profile from SQLite."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT name, education, academic_stream, location, preferred_language,
               interests, subjects, strong_subjects, difficult_subjects,
               skills, skill_confidence, strengths, goal, career_aspirations,
               workstyle, priority, budget_inr, constraints, learning_pace,
               further_education, selected_career, updated_at
        FROM profiles WHERE user_id = ?
    """, (user["id"],))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {
            "profile": None,
            "onboarding_completed": bool(user["onboarding_completed"]),
            "user_name": user["name"]
        }

    return {
        "profile": {
            "name": row["name"] or user["name"],
            "education": row["education"] or "Class 11–12 (Science / PCM)",
            "academic_stream": row["academic_stream"] or "",
            "location": row["location"] or "",
            "preferred_language": row["preferred_language"] or "en",
            "interests": json.loads(row["interests"]) if row["interests"] else [],
            "subjects": json.loads(row["subjects"]) if row["subjects"] else [],
            "strong_subjects": json.loads(row["strong_subjects"]) if row["strong_subjects"] else [],
            "difficult_subjects": json.loads(row["difficult_subjects"]) if row["difficult_subjects"] else [],
            "skills": json.loads(row["skills"]) if row["skills"] else [],
            "skill_confidence": json.loads(row["skill_confidence"]) if row["skill_confidence"] else {},
            "strengths": json.loads(row["strengths"]) if row["strengths"] else [],
            "goal": row["goal"] or "",
            "career_aspirations": row["career_aspirations"] or "",
            "workstyle": row["workstyle"] or "Desk / Digital (Software, Design, Analytics)",
            "priority": row["priority"] or "interest",
            "budget_inr": row["budget_inr"] if row["budget_inr"] is not None else 25000,
            "constraints": row["constraints"] or "",
            "learning_pace": row["learning_pace"] or "Moderate",
            "further_education": row["further_education"] or "",
            "selected_career": row["selected_career"] or user.get("selected_career") or "software_dev",
            "updated_at": row["updated_at"]
        },
        "onboarding_completed": bool(user["onboarding_completed"]),
        "user_name": user["name"]
    }

@app.post("/api/profile")
def save_student_profile(payload: ProfileSchema, user: Dict[str, Any] = Depends(get_current_user)):
    """Persists authenticated student profile, updates onboarding status, and syncs exploration path."""
    conn = get_db()
    cursor = conn.cursor()

    chosen_career = payload.selected_career or user.get("selected_career") or "software_dev"

    cursor.execute("""
        INSERT OR REPLACE INTO profiles (
            user_id, name, education, academic_stream, location, preferred_language,
            interests, subjects, strong_subjects, difficult_subjects,
            skills, skill_confidence, strengths, goal, career_aspirations,
            workstyle, priority, budget_inr, constraints, learning_pace,
            further_education, selected_career, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (
        user["id"],
        payload.name or user["name"],
        payload.education,
        payload.academic_stream,
        payload.location,
        payload.preferred_language,
        json.dumps(payload.interests),
        json.dumps(payload.subjects),
        json.dumps(payload.strong_subjects),
        json.dumps(payload.difficult_subjects),
        json.dumps(payload.skills),
        json.dumps(payload.skill_confidence),
        json.dumps(payload.strengths),
        payload.goal,
        payload.career_aspirations,
        payload.workstyle,
        payload.priority,
        payload.budget_inr,
        payload.constraints,
        payload.learning_pace,
        payload.further_education,
        chosen_career
    ))

    # Mark user onboarding completed and update selected career
    cursor.execute("""
        UPDATE users
        SET onboarding_completed = 1, selected_career = ?, name = ?
        WHERE id = ?
    """, (chosen_career, payload.name or user["name"], user["id"]))

    conn.commit()
    conn.close()

    return {
        "status": "saved",
        "message": "Profile successfully saved.",
        "onboarding_completed": True,
        "selected_career": chosen_career
    }

@app.post("/api/user/select-career")
def set_selected_career(payload: CareerSelectSchema, user: Dict[str, Any] = Depends(get_current_user)):
    """Updates the student's actively explored career pathway."""
    conn = get_db()
    conn.execute("UPDATE users SET selected_career = ? WHERE id = ?", (payload.career_id, user["id"]))
    conn.execute("UPDATE profiles SET selected_career = ? WHERE user_id = ?", (payload.career_id, user["id"]))
    conn.commit()
    conn.close()
    return {"status": "updated", "selected_career": payload.career_id}

# -----------------------------------------------------------------------------
# REST API: Feature One — Personalized Career Pathway Matching
# -----------------------------------------------------------------------------
@app.get("/api/careers")
def list_careers(search: Optional[str] = None, field: Optional[str] = None):
    """Returns curated career pathways with search and category filters."""
    careers = load_careers()
    if search:
        q = search.lower().strip()
        careers = [
            c for c in careers
            if q in c["name"].lower() or q in c.get("desc", "").lower() or q in c.get("category", "").lower()
        ]
    if field and field != "all":
        careers = [c for c in careers if field.lower() in c.get("category", "").lower()]
    return careers

@app.get("/api/careers/{career_id}")
def get_career_detail(career_id: str):
    """Retrieves full specifications for a single career pathway."""
    careers = load_careers()
    career = next((c for c in careers if c["id"] == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail="Career pathway not found.")
    return career

@app.post("/api/analyze")
def analyze_pathways(profile_data: Optional[Dict[str, Any]] = None, user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    """
    Transparent 5-factor weighted career compatibility analysis.
    Uses configurable weights from scoring_config.json.
    """
    active_profile = {}
    if profile_data:
        active_profile = profile_data
    elif user:
        # Load user's saved profile from DB
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],))
        row = cursor.fetchone()
        conn.close()
        if row:
            active_profile = {
                "name": row["name"],
                "education": row["education"],
                "interests": json.loads(row["interests"]) if row["interests"] else [],
                "subjects": json.loads(row["subjects"]) if row["subjects"] else [],
                "skills": json.loads(row["skills"]) if row["skills"] else [],
                "workstyle": row["workstyle"],
                "priority": row["priority"]
            }

    if not active_profile:
        active_profile = {
            "interests": ["technology", "problem-solving"],
            "subjects": ["Mathematics", "Computer Science"],
            "skills": ["Python"],
            "education": "Class 11–12 (Science / PCM)"
        }

    matches = calculate_compatibility(active_profile)
    return matches

# -----------------------------------------------------------------------------
# REST API: Feature Two — Real People, Real Career Experiences (Signature Feature)
# -----------------------------------------------------------------------------
@app.get("/api/stories")
def get_career_stories(
    career_id: Optional[str] = None,
    field: Optional[str] = None,
    language: Optional[str] = None,
    search: Optional[str] = None
):
    """Discovers real career stories and video interviews with multi-attribute filtering."""
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM career_stories WHERE published = 1"
    params = []

    if career_id and career_id != "all":
        query += " AND career_id = ?"
        params.append(career_id)
    if field and field != "all":
        query += " AND LOWER(career_field) LIKE ?"
        params.append(f"%{field.lower()}%")
    if language and language != "all":
        query += " AND language = ?"
        params.append(language)
    if search:
        query += " AND (LOWER(contributor_name) LIKE ? OR LOWER(headline) LIKE ? OR LOWER(role) LIKE ? OR LOWER(journey) LIKE ?)"
        q = f"%{search.lower().strip()}%"
        params.extend([q, q, q, q])

    query += " ORDER BY created_at ASC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    stories = []
    for r in rows:
        stories.append({
            "id": r["id"],
            "contributor_name": r["contributor_name"],
            "role": r["role"],
            "career_id": r["career_id"],
            "career_field": r["career_field"],
            "education_route": r["education_route"],
            "experience_level": r["experience_level"],
            "language": r["language"],
            "video_url": r["video_url"],
            "video_embed_url": r["video_embed_url"],
            "is_sample": bool(r["is_sample"]),
            "headline": r["headline"],
            "intro": r["intro"],
            "journey": r["journey"],
            "daily_life": r["daily_life"],
            "challenges": r["challenges"],
            "skills_used": json.loads(r["skills_used"]) if r["skills_used"] else [],
            "mistakes_to_avoid": r["mistakes_to_avoid"],
            "advice_for_beginners": r["advice_for_beginners"],
            "how_learned": r["how_learned"],
            "resources": json.loads(r["resources"]) if r["resources"] else [],
            "created_at": r["created_at"]
        })
    return stories

@app.get("/api/stories/{story_id}")
def get_single_story(story_id: str):
    """Retrieves complete details for a single career story."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM career_stories WHERE id = ?", (story_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        raise HTTPException(status_code=404, detail="Career story not found.")

    return {
        "id": r["id"],
        "contributor_name": r["contributor_name"],
        "role": r["role"],
        "career_id": r["career_id"],
        "career_field": r["career_field"],
        "education_route": r["education_route"],
        "experience_level": r["experience_level"],
        "language": r["language"],
        "video_url": r["video_url"],
        "video_embed_url": r["video_embed_url"],
        "is_sample": bool(r["is_sample"]),
        "headline": r["headline"],
        "intro": r["intro"],
        "journey": r["journey"],
        "daily_life": r["daily_life"],
        "challenges": r["challenges"],
        "skills_used": json.loads(r["skills_used"]) if r["skills_used"] else [],
        "mistakes_to_avoid": r["mistakes_to_avoid"],
        "advice_for_beginners": r["advice_for_beginners"],
        "how_learned": r["how_learned"],
        "resources": json.loads(r["resources"]) if r["resources"] else []
    }

# -----------------------------------------------------------------------------
# REST API: Feature Three — Intelligent Career Skill-Gap Analysis
# -----------------------------------------------------------------------------
@app.post("/api/skill-gap")
def compute_skill_gap(payload: Dict[str, Any], user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    """
    Stage 05 & Feature Three Competency Gap Diagnostics.
    Compares student's reported skills against target career competency requirements.
    """
    career_id = payload.get("career_id", "software_dev")
    profile_data = payload.get("profile")

    student_skills = []
    skill_confidence = {}
    strengths = []

    if profile_data:
        student_skills = profile_data.get("skills", [])
        skill_confidence = profile_data.get("skill_confidence", {})
        strengths = profile_data.get("strengths", [])
    elif user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT skills, skill_confidence, strengths FROM profiles WHERE user_id = ?", (user["id"],))
        row = cursor.fetchone()
        conn.close()
        if row:
            student_skills = json.loads(row["skills"]) if row["skills"] else []
            skill_confidence = json.loads(row["skill_confidence"]) if row["skill_confidence"] else {}
            strengths = json.loads(row["strengths"]) if row["strengths"] else []

    # Check if user has explicit saved skill assessments
    if user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT ratings FROM skill_assessments WHERE user_id = ? AND career_id = ?", (user["id"], career_id))
        assess_row = cursor.fetchone()
        conn.close()
        if assess_row and assess_row["ratings"]:
            saved_ratings = json.loads(assess_row["ratings"])
            skill_confidence.update(saved_ratings)
            # Add rated skills to student_skills list
            for sk_name in saved_ratings.keys():
                if sk_name not in student_skills:
                    student_skills.append(sk_name)

    return analyze_skill_gap(
        career_id=career_id,
        student_skills=student_skills,
        skill_confidence=skill_confidence,
        student_strengths=strengths
    )

@app.post("/api/skill-gap/rate")
def save_skill_rating(payload: SkillRatingSchema, user: Dict[str, Any] = Depends(get_current_user)):
    """Saves student self-assessment rating for a specific competency."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT ratings FROM skill_assessments WHERE user_id = ? AND career_id = ?", (user["id"], payload.career_id))
    row = cursor.fetchone()

    ratings = json.loads(row["ratings"]) if row and row["ratings"] else {}
    ratings[payload.skill_name] = payload.rating

    cursor.execute("""
        INSERT OR REPLACE INTO skill_assessments (user_id, career_id, ratings, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    """, (user["id"], payload.career_id, json.dumps(ratings)))
    conn.commit()
    conn.close()

    return {"status": "saved", "career_id": payload.career_id, "ratings": ratings}

# -----------------------------------------------------------------------------
# REST API: Feature Four — Personalized Roadmap & PDF Blueprint
# -----------------------------------------------------------------------------
@app.get("/api/roadmap/download-pdf")
def download_roadmap_pdf(career_id: Optional[str] = None, user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    """
    Generates and downloads a clean, beautifully formatted vector PDF blueprint
    using ReportLab based on the student's actual saved profile and roadmap progress.
    """
    target_career_id = career_id
    if not target_career_id and user:
        target_career_id = user.get("selected_career") or "software_dev"
    if not target_career_id:
        target_career_id = "software_dev"

    careers = load_careers()
    career = next((c for c in careers if c["id"] == target_career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail="Career pathway not found")

    student_name = "Student"
    profile_summary = {
        "education": "Class 11–12 (Science / PCM)",
        "interests": ["technology", "building"],
        "strengths": ["Logic", "Curiosity"],
        "goal": "Build practical domain competence.",
        "budget_inr": 25000.0
    }
    completed_steps = []

    if user:
        student_name = user["name"]
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user["id"],))
        p_row = cursor.fetchone()
        if p_row:
            profile_summary = {
                "education": p_row["education"] or "Class 11–12",
                "interests": json.loads(p_row["interests"]) if p_row["interests"] else [],
                "strengths": json.loads(p_row["strengths"]) if p_row["strengths"] else [],
                "goal": p_row["goal"] or "Build useful practical skills.",
                "budget_inr": p_row["budget_inr"] or 25000.0
            }
        cursor.execute("SELECT completed_steps FROM roadmap_progress WHERE user_id = ? AND career_id = ?", (user["id"], target_career_id))
        r_row = cursor.fetchone()
        if r_row and r_row["completed_steps"]:
            completed_steps = json.loads(r_row["completed_steps"])
        conn.close()

    # Generate roadmap steps
    milestones = generate_dynamic_roadmap(target_career_id, profile_summary)
    for m in milestones:
        m["is_completed"] = m["step_id"] in completed_steps

    # Competency diagnostics
    user_skills = profile_summary.get("skills", ["Python"])
    diag = analyze_skill_gap(target_career_id, user_skills)
    readiness_pct = diag.get("readiness_percentage", 60)
    skills_poss = [s["name"] for s in diag.get("skills_possessed", [])]
    skills_dev = [s["name"] for s in diag.get("skills_missing", [])]

    pdf_bytes = generate_roadmap_pdf(
        student_name=student_name,
        career_name=career["name"],
        career_category=career.get("category", "Professional Track"),
        salary_range=career.get("entry_salary_range_inr", "₹3.5L - ₹8L / year"),
        study_duration=career.get("study_duration", "6 - 12 months"),
        profile_summary=profile_summary,
        readiness_pct=readiness_pct,
        milestones=milestones,
        skills_possessed=skills_poss,
        skills_to_develop=skills_dev,
        official_resources=career.get("official_reference_links", [])
    )

    clean_filename = f"PathSetu_Roadmap_{target_career_id}_{datetime.now().strftime('%Y%m%d')}.pdf"
    return RawResponse(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=\"{clean_filename}\""
        }
    )

@app.get("/api/roadmap/{career_id}")
def get_user_roadmap(career_id: str, user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    """Retrieves 6-phase adaptive roadmap combined with the authenticated student's completion records."""
    base_roadmap = generate_dynamic_roadmap(career_id)

    completed_steps = []
    custom_steps = []

    if user:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT completed_steps, custom_steps FROM roadmap_progress WHERE user_id = ? AND career_id = ?", (user["id"], career_id))
        row = cursor.fetchone()
        conn.close()
        if row:
            completed_steps = json.loads(row["completed_steps"]) if row["completed_steps"] else []
            custom_steps = json.loads(row["custom_steps"]) if row["custom_steps"] else []

    # Merge completion state
    for step in base_roadmap:
        step["is_completed"] = step["step_id"] in completed_steps

    total_milestones = len(base_roadmap) + len(custom_steps)
    completed_count = len([s for s in base_roadmap if s["is_completed"]]) + len([c for c in custom_steps if c.get("is_completed")])
    progress_pct = round((completed_count / total_milestones) * 100) if total_milestones else 0

    # Next Recommended Action
    next_action = None
    for step in base_roadmap:
        if not step["is_completed"]:
            next_action = step
            break

    return {
        "career_id": career_id,
        "milestones": base_roadmap,
        "custom_milestones": custom_steps,
        "completed_steps": completed_steps,
        "total_milestones": total_milestones,
        "completed_count": completed_count,
        "progress_percentage": progress_pct,
        "next_action": next_action
    }

@app.post("/api/roadmap/toggle")
def toggle_roadmap_milestone(payload: MilestoneToggleSchema, user: Dict[str, Any] = Depends(get_current_user)):
    """Marks a milestone complete or incomplete for the authenticated student."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT completed_steps, custom_steps FROM roadmap_progress WHERE user_id = ? AND career_id = ?", (user["id"], payload.career_id))
    row = cursor.fetchone()

    completed = json.loads(row["completed_steps"]) if row and row["completed_steps"] else []
    custom = json.loads(row["custom_steps"]) if row and row["custom_steps"] else []

    if payload.completed:
        if payload.step_id not in completed:
            completed.append(payload.step_id)
    else:
        completed = [s for s in completed if s != payload.step_id]

    cursor.execute("""
        INSERT OR REPLACE INTO roadmap_progress (user_id, career_id, completed_steps, custom_steps, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (user["id"], payload.career_id, json.dumps(completed), json.dumps(custom)))
    conn.commit()
    conn.close()

    return {"status": "updated", "completed_steps": completed}

@app.post("/api/roadmap/custom")
def add_custom_roadmap_milestone(payload: CustomMilestoneSchema, user: Dict[str, Any] = Depends(get_current_user)):
    """Appends a personal goal/milestone to the student's roadmap."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT completed_steps, custom_steps FROM roadmap_progress WHERE user_id = ? AND career_id = ?", (user["id"], payload.career_id))
    row = cursor.fetchone()

    completed = json.loads(row["completed_steps"]) if row and row["completed_steps"] else []
    custom = json.loads(row["custom_steps"]) if row and row["custom_steps"] else []

    new_id = f"custom_{uuid.uuid4().hex[:6]}"
    custom.append({
        "step_id": new_id,
        "title": payload.title,
        "timeframe": payload.timeframe,
        "desc": payload.desc,
        "deliverable": payload.deliverable or "Personal milestone verification",
        "is_completed": False
    })

    cursor.execute("""
        INSERT OR REPLACE INTO roadmap_progress (user_id, career_id, completed_steps, custom_steps, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (user["id"], payload.career_id, json.dumps(completed), json.dumps(custom)))
    conn.commit()
    conn.close()

    return {"status": "created", "custom_milestones": custom}

@app.post("/api/roadmap/add-skill-milestones")
def add_skill_gap_to_roadmap(payload: Dict[str, Any], user: Dict[str, Any] = Depends(get_current_user)):
    """Converts identified high-leverage skill gaps into roadmap milestones."""
    career_id = payload.get("career_id", "software_dev")
    skill_names = payload.get("skills", [])

    if not skill_names:
        return {"status": "no_op", "message": "No skills specified."}

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT completed_steps, custom_steps FROM roadmap_progress WHERE user_id = ? AND career_id = ?", (user["id"], career_id))
    row = cursor.fetchone()

    completed = json.loads(row["completed_steps"]) if row and row["completed_steps"] else []
    custom = json.loads(row["custom_steps"]) if row and row["custom_steps"] else []

    added = 0
    for sk in skill_names:
        title = f"Skill Mastery: {sk}"
        if not any(c.get("title") == title for c in custom):
            custom.append({
                "step_id": f"sk_gap_{uuid.uuid4().hex[:6]}",
                "title": title,
                "timeframe": "Next 3-4 Weeks",
                "desc": f"Dedicated practice and project work to bridge competency gap in {sk}.",
                "deliverable": f"Completed starter exercise or repository for {sk}",
                "is_completed": False
            })
            added += 1

    cursor.execute("""
        INSERT OR REPLACE INTO roadmap_progress (user_id, career_id, completed_steps, custom_steps, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (user["id"], career_id, json.dumps(completed), json.dumps(custom)))
    conn.commit()
    conn.close()

    return {"status": "added", "added_count": added, "custom_milestones": custom}

# -----------------------------------------------------------------------------
# REST API: Supporting Modules (Budget, Compare, Resources, Projects)
# -----------------------------------------------------------------------------
@app.get("/api/budget/evaluate")
def evaluate_budget(career_id: str = "software_dev", budget: float = 25000.0):
    """Evaluates student education budget against subsidized Indian pathways."""
    return evaluate_budget_affordability(career_id, budget)

@app.get("/api/compare")
def compare_selected_careers(ids: str = Query("software_dev,ui_ux_designer,data_analyst")):
    """Compares up to 3 careers side by side."""
    career_ids = [i.strip() for i in ids.split(",") if i.strip()]
    return compare_careers(career_ids)

@app.get("/api/resources")
def get_verified_resources(category: Optional[str] = None):
    """Retrieves verified central government and open education portals."""
    res = load_resources()
    if category and category != "all":
        res = [r for r in res if category.lower() in r.get("category", "").lower()]
    return res

@app.get("/api/projects")
def get_curated_projects(career_id: Optional[str] = None):
    """Retrieves curated starter proof-of-work projects."""
    careers = load_careers()
    projects = []
    for c in careers:
        if career_id and career_id != "all" and c["id"] != career_id:
            continue
        for p in c.get("starter_projects", []):
            projects.append({
                "career_id": c["id"],
                "career_name": c["name"],
                "title": p,
                "level": "Beginner to Intermediate",
                "effort": "8 - 14 Hours",
                "type": "Portfolio Proof-of-Work"
            })
    return projects

@app.get("/api/translations")
def get_app_translations():
    """Returns bilingual English and Telugu translation dictionary."""
    return load_translations()

# -----------------------------------------------------------------------------
# Static Asset Mounting & Dedicated Page Routes
# -----------------------------------------------------------------------------
if (BASE_DIR / "css").exists():
    app.mount("/css", StaticFiles(directory=str(BASE_DIR / "css")), name="css")
if (BASE_DIR / "js").exists():
    app.mount("/js", StaticFiles(directory=str(BASE_DIR / "js")), name="js")
if (BASE_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")

@app.get("/favicon.ico")
def serve_favicon():
    icon_file = BASE_DIR / "assets" / "pathsetu-icon.png"
    if icon_file.exists():
        return FileResponse(icon_file, media_type="image/png")
    raise HTTPException(status_code=404, detail="favicon not found")

@app.get("/")
@app.get("/index")
@app.get("/index.html")
def serve_index_page():
    f = BASE_DIR / "index.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="index.html not found")

@app.get("/login")
@app.get("/login.html")
def serve_login_page():
    f = BASE_DIR / "login.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="login.html not found")

@app.get("/onboarding")
@app.get("/onboarding.html")
def serve_onboarding_page():
    f = BASE_DIR / "onboarding.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="onboarding.html not found")

@app.get("/dashboard")
@app.get("/dashboard.html")
def serve_dashboard_page():
    f = BASE_DIR / "dashboard.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="dashboard.html not found")

@app.get("/stories")
@app.get("/stories.html")
def serve_stories_page():
    f = BASE_DIR / "stories.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="stories.html not found")

@app.get("/careers")
@app.get("/careers.html")
def serve_careers_page():
    f = BASE_DIR / "careers.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="careers.html not found")

@app.get("/skill-gap")
@app.get("/skill-gap.html")
def serve_skill_gap_page():
    f = BASE_DIR / "skill-gap.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="skill-gap.html not found")

@app.get("/roadmap")
@app.get("/roadmap.html")
def serve_roadmap_page():
    f = BASE_DIR / "roadmap.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="roadmap.html not found")

@app.get("/compare")
@app.get("/compare.html")
def serve_compare_page():
    f = BASE_DIR / "compare.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="compare.html not found")

@app.get("/budget")
@app.get("/budget.html")
def serve_budget_page():
    f = BASE_DIR / "budget.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="budget.html not found")

@app.get("/resources")
@app.get("/resources.html")
def serve_resources_page():
    f = BASE_DIR / "resources.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="resources.html not found")

@app.get("/projects")
@app.get("/projects.html")
def serve_projects_page():
    f = BASE_DIR / "projects.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="projects.html not found")

@app.get("/profile")
@app.get("/profile.html")
def serve_profile_page():
    f = BASE_DIR / "profile.html"
    if f.exists():
        return FileResponse(f)
    raise HTTPException(status_code=404, detail="profile.html not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
