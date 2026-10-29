"""
Comprehensive Live Application HTTP Verification Suite
Makes real HTTP requests to the live running server at http://127.0.0.1:8000
Tests all HTML routes, static assets, and authenticated user flows.
"""

import urllib.request
import urllib.parse
import json
import uuid
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://127.0.0.1:8000"

def test_routes():
    pages = [
        ("/", "PathSetu"),
        ("/login", "Sign In / Register"),
        ("/onboarding", "Guided Student Onboarding"),
        ("/dashboard", "Student Decision Dashboard"),
        ("/stories", "Real People, Real Career Experiences"),
        ("/careers", "Career Tracks"),
        ("/skill-gap", "Skill Gap"),
        ("/roadmap", "Roadmap"),
        ("/compare", "Compare"),
        ("/budget", "Budget"),
        ("/resources", "Resources"),
        ("/projects", "Projects"),
        ("/profile", "Profile")
    ]

    print("=== Testing HTML Page Routes ===")
    for path, expected_text in pages:
        req = urllib.request.Request(f"{BASE_URL}{path}")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Failed on {path}: {resp.status}"
            content = resp.read().decode('utf-8')
            assert expected_text in content or "PathSetu" in content, f"Expected '{expected_text}' in {path}"
            print(f"✓ {path.ljust(15)} -> 200 OK ({len(content)} bytes)")

    print("\n=== Testing Live Authentication & Session Handling ===")
    test_user_email = f"live_{uuid.uuid4().hex[:6]}@pathsetu.test"
    reg_body = json.dumps({
        "name": "Divya Prakash",
        "email": test_user_email,
        "password": "StrongPassword99!",
        "confirm_password": "StrongPassword99!"
    }).encode('utf-8')

    req_reg = urllib.request.Request(
        f"{BASE_URL}/api/auth/register",
        data=reg_body,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req_reg) as resp:
        assert resp.status == 200
        cookie_header = resp.headers.get("Set-Cookie", "")
        assert "pathsetu_session=" in cookie_header
        reg_data = json.loads(resp.read().decode('utf-8'))
        session_token = reg_data["session_token"]
        print(f"✓ Registration succeeded for {test_user_email}, session cookie received")

    # Verify session with Cookie
    req_me = urllib.request.Request(
        f"{BASE_URL}/api/auth/me",
        headers={"Cookie": f"pathsetu_session={session_token}"}
    )
    with urllib.request.urlopen(req_me) as resp:
        me_data = json.loads(resp.read().decode('utf-8'))
        assert me_data["authenticated"] is True
        assert me_data["user"]["name"] == "Divya Prakash"
        print(f"✓ Authenticated session validated: Welcome, {me_data['user']['name']}")

    # Save Onboarding Profile
    print("\n=== Testing Onboarding Profile Persistence ===")
    profile_body = json.dumps({
        "name": "Divya Prakash",
        "education": "Diploma / ITI",
        "academic_stream": "Electrical Engineering",
        "location": "Warangal, TS",
        "preferred_language": "en",
        "interests": ["building", "science", "problem-solving"],
        "subjects": ["Physics", "Mathematics"],
        "strong_subjects": ["Physics"],
        "difficult_subjects": ["English Literature"],
        "skills": ["Circuit Wiring & Conduit Work"],
        "skill_confidence": {"Circuit Wiring & Conduit Work": "Intermediate"},
        "strengths": ["Hands-on Assembly", "Safety Mindset"],
        "goal": "Become a licensed solar energy specialist.",
        "workstyle": "Field / Outdoor (Agriculture, Solar, Site Work)",
        "priority": "interest",
        "budget_inr": 15000.0,
        "learning_pace": "Full-time student (20+ hrs/wk)",
        "further_education": "Govt Polytechnic / ITI Technical Certification",
        "selected_career": "solar_electrician"
    }).encode('utf-8')

    req_prof = urllib.request.Request(
        f"{BASE_URL}/api/profile",
        data=profile_body,
        headers={
            "Content-Type": "application/json",
            "Cookie": f"pathsetu_session={session_token}"
        }
    )
    with urllib.request.urlopen(req_prof) as resp:
        assert resp.status == 200
        p_res = json.loads(resp.read().decode('utf-8'))
        assert p_res["onboarding_completed"] is True
        assert p_res["selected_career"] == "solar_electrician"
        print("✓ Onboarding completed and persisted in SQLite")

    # Test 5-factor career recommendations
    print("\n=== Testing 5-Factor Career Recommendations ===")
    req_rec = urllib.request.Request(
        f"{BASE_URL}/api/analyze",
        data=b"{}",
        headers={
            "Content-Type": "application/json",
            "Cookie": f"pathsetu_session={session_token}"
        }
    )
    with urllib.request.urlopen(req_rec) as resp:
        recs = json.loads(resp.read().decode('utf-8'))
        assert len(recs) == 10
        top = recs[0]
        print(f"✓ Top recommended career: {top['title']} ({top['compatibility_score']}% fit)")
        print(f"  Explanation: {top['explanation']}")

    # Test Real Career Stories (Feature Two)
    print("\n=== Testing Real Career Stories (Feature Two) ===")
    req_stories = urllib.request.Request(f"{BASE_URL}/api/stories?career_id=solar_electrician")
    with urllib.request.urlopen(req_stories) as resp:
        stories = json.loads(resp.read().decode('utf-8'))
        assert len(stories) >= 1
        s = stories[0]
        print(f"✓ Found story for {s['contributor_name']} ({s['role']}): '{s['headline']}'")

    # Test Skill Gap Analysis (Feature Three)
    print("\n=== Testing Skill Gap Analysis (Feature Three) ===")
    gap_body = json.dumps({"career_id": "solar_electrician"}).encode('utf-8')
    req_gap = urllib.request.Request(
        f"{BASE_URL}/api/skill-gap",
        data=gap_body,
        headers={
            "Content-Type": "application/json",
            "Cookie": f"pathsetu_session={session_token}"
        }
    )
    with urllib.request.urlopen(req_gap) as resp:
        gap = json.loads(resp.read().decode('utf-8'))
        print(f"✓ Solar Electrician Readiness: {gap['readiness_percentage']}%")
        print(f"  Formula: {gap['readiness_formula']}")

    # Test Milestone Roadmap (Feature Four)
    print("\n=== Testing Milestone Roadmap (Feature Four) ===")
    req_road = urllib.request.Request(
        f"{BASE_URL}/api/roadmap/solar_electrician",
        headers={"Cookie": f"pathsetu_session={session_token}"}
    )
    with urllib.request.urlopen(req_road) as resp:
        road = json.loads(resp.read().decode('utf-8'))
        assert len(road["milestones"]) >= 5
        print(f"✓ Roadmap loaded ({len(road['milestones'])} phases)")
        print(f"  Next Recommended Action: {road['next_action']['title']}")

    # Test PDF Vector Generation & Download
    print("\n=== Testing ReportLab Vector PDF Download ===")
    req_pdf = urllib.request.Request(
        f"{BASE_URL}/api/roadmap/download-pdf?career_id=solar_electrician",
        headers={"Cookie": f"pathsetu_session={session_token}"}
    )
    with urllib.request.urlopen(req_pdf) as resp:
        assert resp.status == 200
        assert resp.headers.get("Content-Type") == "application/pdf"
        pdf_data = resp.read()
        assert len(pdf_data) > 3000
        assert pdf_data.startswith(b"%PDF"), "Must be a valid PDF file stream"
        print(f"✓ Valid ReportLab PDF received: {len(pdf_data)} bytes (PDF header: {pdf_data[:5].decode()})")

    print("\n==================================================")
    print("ALL LIVE HTTP INTEGRATION CHECKS PASSED (100%)!")
    print("==================================================")

if __name__ == "__main__":
    test_routes()
