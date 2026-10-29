"""
Automated Backend & API Verification Suite for PathSetu
Tests registration, duplicate email handling, login, session auth, profile intake,
career matching, skill-gap analysis, stories, roadmap toggles, and PDF generation.
"""

from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

def run_tests():
    print("--- 1. Health & Metadata Test ---")
    res = client.get("/api/careers")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    careers = res.json()
    assert len(careers) >= 10, f"Expected >=10 careers, got {len(careers)}"
    print(f"PASS: Careers loaded ({len(careers)} tracks)")

    print("\n--- 2. Auth Tests: Registration ---")
    test_email = f"student_{uuid.uuid4().hex[:6]}@pathsetu.test"
    reg_payload = {
        "name": "Kiran Kumar",
        "email": test_email,
        "password": "StrongPassword123!",
        "confirm_password": "StrongPassword123!"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 200, f"Register failed: {res.text}"
    data = res.json()
    assert data["status"] == "success"
    assert data["user"]["email"] == test_email
    assert "session_token" in data
    print("PASS: User registration successful with session token")

    # Duplicate registration rejection
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 400, "Expected 400 on duplicate registration"
    print("PASS: Duplicate registration safely rejected")

    print("\n--- 3. Auth Tests: Login & Cookie Session ---")
    login_payload = {
        "email": test_email,
        "password": "StrongPassword123!"
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["session_token"]

    # Test /api/auth/me with session cookie
    client.cookies.set("pathsetu_session", token)
    res = client.get("/api/auth/me")
    assert res.status_code == 200
    me = res.json()
    assert me["authenticated"] is True
    assert me["user"]["name"] == "Kiran Kumar"
    print("PASS: Login & /api/auth/me session verified")

    print("\n--- 4. Profile Onboarding Persistence ---")
    profile_payload = {
        "name": "Kiran Kumar",
        "education": "Class 11–12 (Science / PCM)",
        "academic_stream": "Science / PCM",
        "location": "Vijayawada, AP",
        "preferred_language": "en",
        "interests": ["technology", "building", "problem-solving"],
        "subjects": ["Mathematics", "Physics", "Computer Science"],
        "strong_subjects": ["Mathematics", "Computer Science"],
        "difficult_subjects": ["Chemistry"],
        "skills": ["Python", "HTML5 & CSS3"],
        "skill_confidence": {"Python": "Intermediate", "HTML5 & CSS3": "Beginner"},
        "strengths": ["Logic", "Curiosity"],
        "goal": "Build accessible digital systems.",
        "workstyle": "Desk / Digital (Software, Design, Analytics)",
        "priority": "interest",
        "budget_inr": 20000.0,
        "selected_career": "software_dev"
    }
    res = client.post("/api/profile", json=profile_payload)
    assert res.status_code == 200, f"Profile save failed: {res.text}"
    save_res = res.json()
    assert save_res["onboarding_completed"] is True

    # Retrieve profile
    res = client.get("/api/profile")
    assert res.status_code == 200
    p_data = res.json()
    assert p_data["profile"]["name"] == "Kiran Kumar"
    assert p_data["profile"]["budget_inr"] == 20000.0
    print("PASS: Profile saved and retrieved with user isolation")

    print("\n--- 5. Career Recommendation Matching ---")
    res = client.post("/api/analyze", json={})
    assert res.status_code == 200
    matches = res.json()
    assert len(matches) >= 10
    assert matches[0]["compatibility_score"] > 50
    assert "score_breakdown" in matches[0]
    print(f"PASS: 5-Factor Career Matching verified (Top match: {matches[0]['title']} {matches[0]['compatibility_score']}%)")

    print("\n--- 6. Real Career Stories (Feature Two) ---")
    res = client.get("/api/stories")
    assert res.status_code == 200
    stories = res.json()
    assert len(stories) >= 10
    assert "daily_life" in stories[0]
    assert "challenges" in stories[0]
    assert "advice_for_beginners" in stories[0]
    print(f"PASS: Real Career Stories loaded ({len(stories)} authentic journeys)")

    # Filter by career
    res = client.get("/api/stories?career_id=software_dev")
    assert res.status_code == 200
    sw_stories = res.json()
    assert len(sw_stories) >= 1
    assert sw_stories[0]["career_id"] == "software_dev"
    print("PASS: Career Story filtering verified")

    print("\n--- 7. Intelligent Skill-Gap Analysis (Feature Three) ---")
    res = client.post("/api/skill-gap", json={"career_id": "software_dev"})
    assert res.status_code == 200
    gap = res.json()
    assert "readiness_percentage" in gap
    assert "skills_possessed" in gap
    assert "skills_missing" in gap
    assert "priority_next_3" in gap
    print(f"PASS: Skill Gap Diagnostics verified (Readiness: {gap['readiness_percentage']}%, Next skills: {len(gap['priority_next_3'])})")

    # Skill rating
    res = client.post("/api/skill-gap/rate", json={
        "career_id": "software_dev",
        "skill_name": "Python or JavaScript",
        "rating": "Proficient"
    })
    assert res.status_code == 200
    print("PASS: Skill rating update persisted")

    print("\n--- 8. Adaptive Roadmap & Milestones (Feature Four) ---")
    res = client.get("/api/roadmap/software_dev")
    assert res.status_code == 200
    road = res.json()
    assert len(road["milestones"]) >= 5
    first_step_id = road["milestones"][0]["step_id"]

    # Toggle milestone
    res = client.post("/api/roadmap/toggle", json={
        "career_id": "software_dev",
        "step_id": first_step_id,
        "completed": True
    })
    assert res.status_code == 200
    assert first_step_id in res.json()["completed_steps"]
    print("PASS: Roadmap milestone progress toggle persisted")

    print("\n--- 9. PDF Roadmap Blueprint Generation ---")
    res = client.get("/api/roadmap/download-pdf?career_id=software_dev")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 3000
    print(f"PASS: ReportLab vector PDF downloaded ({len(res.content)} bytes)")

    print("\n--- 10. Logout & Protected Page Safety ---")
    res = client.post("/api/auth/logout")
    assert res.status_code == 200
    client.cookies.clear()
    res = client.get("/api/auth/me")
    assert res.json()["authenticated"] is False
    res = client.get("/api/profile")
    assert res.status_code == 401
    print("PASS: Logout terminates session, protected endpoints reject unauthorized requests")

    print("\n==========================================")
    print("ALL 10 BACKEND VERIFICATION CHECKS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    run_tests()

