"""
PathSetu (పథసేతు) — Streamlit Application
AI-Powered Career Guidance Platform for Students in Tier-2/3 & Rural India
Runs locally without paid APIs or external dependencies.
"""

import streamlit as st
import json
from pathlib import Path
from modules.data_loader import (
    load_careers, load_resources, load_scoring_config,
    load_translations, load_skills
)
from modules.recommendation_engine import calculate_compatibility
from modules.career_comparison import compare_careers
from modules.budget_planner import evaluate_budget_affordability
from modules.skill_gap import analyze_skill_gap
from modules.roadmap_generator import (
    generate_roadmap, load_user_progress, save_user_progress
)

# Page configuration
st.set_page_config(
    page_title="PathSetu — Career Guidance Platform",
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Professional Blue & White Educational Theme Styling
st.markdown("""
<style>
    :root {
        --color-primary: #1D4ED8;
        --color-navy: #0F172A;
        --color-light-blue: #DBEAFE;
        --color-white: #FFFFFF;
        --color-background: #F8FAFC;
        --color-border: #E2E8F0;
        --color-text-secondary: #64748B;
        --color-success: #15803D;
    }
    .stApp {
        background-color: #F8FAFC;
        color: #0F172A;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    h1, h2, h3, h4, .stMarkdown h1, .stMarkdown h2, .stMarkdown h3 {
        color: #0F172A !important;
        font-weight: 700 !important;
    }
    p, span, label, div {
        color: #0F172A;
    }
    .stButton>button {
        background-color: #1D4ED8 !important;
        color: #FFFFFF !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 600 !important;
        padding: 8px 18px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .stButton>button:hover {
        background-color: #1E40AF !important;
    }
    div[data-testid="stSidebar"] {
        background-color: #FFFFFF !important;
        border-right: 1px solid #E2E8F0 !important;
    }
    div[data-baseweb="tab-list"] {
        gap: 6px;
    }
    div[data-baseweb="tab"] {
        border-radius: 8px !important;
        color: #0F172A !important;
        font-weight: 600 !important;
    }
    div[data-baseweb="tab"][aria-selected="true"] {
        background-color: #DBEAFE !important;
        color: #1D4ED8 !important;
    }
    .stProgress > div > div > div > div {
        background-color: #1D4ED8 !important;
    }
    .stAlert {
        border-radius: 8px;
    }
</style>
""", unsafe_allow_html=True)

# Initialize Session State
translations = load_translations()
if "lang" not in st.session_state:
    st.session_state["lang"] = "en"

if "profile" not in st.session_state:
    st.session_state["profile"] = {
        "name": "Ananya",
        "education": "Class 11–12 (Science / PCM)",
        "subjects": ["Mathematics", "Physics", "Computer Science"],
        "interests": ["technology", "problem-solving", "building"],
        "skills": ["Python", "HTML5 & CSS3"],
        "workstyle": "Deep Focus (Solo analytical / coding focus)",
        "budget": 25000.0,
        "goal": "Build technology solutions and gain financial independence."
    }

# Language Selector in Sidebar
st.sidebar.image("assets/pathsetu-icon.png", width=64)
st.sidebar.title("PathSetu (పథసేతు)")
lang_choice = st.sidebar.selectbox(
    "🌐 Language / భాష:",
    options=["en", "te"],
    format_func=lambda x: "English" if x == "en" else "తెలుగు (Telugu)"
)
st.session_state["lang"] = lang_choice
t = translations.get(lang_choice, translations["en"])

st.sidebar.markdown(f"*{t.get('site_tagline', 'Your interest. Your path. Our support.')}*")
st.sidebar.divider()
st.sidebar.markdown("### 🧭 6-Stage Navigation")
st.sidebar.info("""
1. Student Intake & Profile  
2. AI Analysis & Compatibility  
3. Career Recommendations  
4. Real-World Guidance  
5. Skill-Gap Matrix  
6. Milestone Roadmap
""")

# Header Banner
st.title(f"🧭 {t.get('site_title', 'PathSetu')} — Career Guidance")
st.caption(t.get("hero_desc", "Guided career intelligence for aspiring students."))

# Main App Navigation Tabs
tab_profile, tab_recs, tab_compare, tab_budget, tab_skillgap, tab_roadmap, tab_resources = st.tabs([
    f"✍️ {t.get('stage_01', 'Profile Intake')}",
    f"🎯 {t.get('stage_03', 'Recommendations')}",
    f"⚖️ {t.get('nav_comparison', 'Career Comparison')}",
    f"💰 {t.get('nav_budget', 'Budget Planner')}",
    f"📊 {t.get('stage_05', 'Skill Gap')}",
    f"🗺️ {t.get('nav_roadmap', 'Roadmap & Progress')}",
    f"🌐 {t.get('nav_resources', 'Verified Resources')}"
])

# -----------------------------------------------------------------------------
# TAB 1: STUDENT PROFILE INTAKE (STAGE 1 & 2)
# -----------------------------------------------------------------------------
with tab_profile:
    st.subheader(f"Stage 01: {t.get('stage_01_desc', 'Collect student context')}")
    col1, col2 = st.columns(2)

    with col1:
        name = st.text_input("Student Name / విద్యార్థి పేరు:", value=st.session_state["profile"]["name"])
        edu = st.selectbox(
            "Current Education Stage / విద్యా స్థాయి:",
            options=[
                "Class 9–10",
                "Class 11–12 (Science / PCM)",
                "Class 11–12 (Science / PCB)",
                "Class 11–12 (Commerce / Arts)",
                "Diploma / ITI",
                "College Undergraduate (Tech/BCA/B.Tech)",
                "College Undergraduate (Non-tech)",
                "Graduate / Career Pivot"
            ],
            index=1
        )
        subjects = st.multiselect(
            "Favorite Academic Subjects / ఇష్టమైన సబ్జెక్టులు:",
            options=["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Economics", "Commerce", "Social Studies", "Agriculture", "Arts"],
            default=st.session_state["profile"]["subjects"]
        )
        budget = st.number_input(
            t.get("budget_input_label", "Enter education budget (in INR):"),
            min_value=0, max_value=2000000, value=int(st.session_state["profile"]["budget"]), step=5000
        )

    with col2:
        interests = st.multiselect(
            "Primary Career Interests / ఆసక్తులు:",
            options=["technology", "problem-solving", "creativity", "helping", "business", "science", "nature", "building", "communication", "data"],
            default=st.session_state["profile"]["interests"]
        )
        skills = st.multiselect(
            "Current Existing Skills / ప్రస్తుత నైపుణ్యాలు:",
            options=["Python", "HTML5 & CSS3", "JavaScript", "SQL", "Figma", "AutoCAD", "Excel / Spreadsheets", "Circuit Wiring", "Soil Science", "Basic First Aid"],
            default=st.session_state["profile"]["skills"]
        )
        workstyle = st.selectbox(
            "Preferred Work Style / పని శైలి:",
            options=[
                "Deep Focus (Solo analytical / coding focus)",
                "Balanced (Hybrid collaborative & solo deep work)",
                "Highly Social (Team discussions, presenting, client interaction)",
                "Hands-on Practical (Physical lab, clinical, or field work)"
            ],
            index=0
        )
        goal = st.text_area("One Career Ambition or Goal:", value=st.session_state["profile"]["goal"])

    if st.button("Save & Update Profile (ప్రొఫైల్ భద్రపరచండి)", type="primary"):
        st.session_state["profile"] = {
            "name": name,
            "education": edu,
            "subjects": subjects,
            "interests": interests,
            "skills": skills,
            "workstyle": workstyle,
            "budget": float(budget),
            "goal": goal
        }
        st.success("✅ Profile successfully saved! Recommendations and budget analysis updated.")

    st.markdown("---")
    st.subheader("Stage 02: Interpretable AI Profile Synthesis")
    st.info(f"""
    **Student:** {name} | **Stage:** {edu} | **Budget:** ₹{budget:,}  
    **Identified Interest Strengths:** {', '.join(interests)}  
    **Academic Foundations:** {', '.join(subjects)}  
    *Profiling Logic:* Your combination of technical interests and analytical subjects prioritizes careers in Software Engineering, Data Intelligence, and Clean Energy.
    """)

# -----------------------------------------------------------------------------
# TAB 2: CAREER RECOMMENDATIONS (STAGE 03 & 04)
# -----------------------------------------------------------------------------
with tab_recs:
    st.subheader(f"Stage 03: {t.get('stage_03_desc', 'Ranked recommendations')}")
    recs = calculate_compatibility(st.session_state["profile"])

    col_filter, _ = st.columns([1, 2])
    with col_filter:
        cat_filter = st.selectbox("Filter by Category:", ["All Categories"] + sorted(list(set(r["category"] for r in recs))))

    displayed_recs = [r for r in recs if cat_filter == "All Categories" or r["category"] == cat_filter]

    for r in displayed_recs:
        with st.expander(f"{r['emoji']} {r['title']} ({r.get('title_te', '')}) — {r['compatibility_score']}% Match", expanded=(r == displayed_recs[0])):
            st.progress(r["compatibility_score"] / 100.0)
            st.markdown(f"**Why this fits you:** {r['explanation']}")

            c1, c2, c3 = st.columns(3)
            c1.metric("Est. Entry Salary", r.get("salary_range", "₹3.5L - ₹8L"))
            c2.metric("Study Duration", r.get("study_duration", "3-4 Years"))
            c3.metric("Badge", r.get("badge", "Verified Pathway"))

            st.markdown("**🎓 Verified Educational Pathways:**")
            for ep in r["education_pathways"]:
                st.markdown(f"- {ep}")

            st.markdown("**🛠️ Suggested Hands-on Starter Projects:**")
            for pr in r["next_actions"]:
                st.markdown(f"- 📌 *{pr}*")

            st.markdown("**🔗 Official Regulatory & Educational Links:**")
            for lk in r["official_links"]:
                st.markdown(f"- [{lk['title']}]({lk['url']})")

# -----------------------------------------------------------------------------
# TAB 3: CAREER COMPARISON (FEATURE A)
# -----------------------------------------------------------------------------
with tab_compare:
    st.subheader("Feature A: Side-by-Side Career Comparison")
    st.caption("Select up to 3 careers to compare side-by-side across requirements, costs, and timelines.")

    careers_all = load_careers()
    career_options = {f"{c['emoji']} {c['name']}": c["id"] for c in careers_all}

    selected_labels = st.multiselect(
        "Select up to 3 careers to compare:",
        options=list(career_options.keys()),
        default=list(career_options.keys())[:2],
        max_selections=3
    )

    if selected_labels:
        selected_ids = [career_options[label] for label in selected_labels]
        compared = compare_careers(selected_ids)

        cols = st.columns(len(compared))
        for idx, c in enumerate(compared):
            with cols[idx]:
                st.markdown(f"### {c['emoji']} {c['name']}")
                st.caption(f"*{c.get('name_te', '')}*")
                st.markdown(f"**Category:** {c['category']}")
                st.markdown(f"**Salary Range:** {c.get('entry_salary_range_inr', 'N/A')}")
                st.markdown(f"**Study Duration:** {c.get('study_duration', 'N/A')}")
                st.markdown(f"**Eligibility:** {c.get('eligibility_conditions', 'N/A')}")
                
                st.markdown("**Accredited Pathways:**")
                for p in c.get("verified_education_pathways", [])[:2]:
                    st.caption(f"• {p}")

                st.markdown("**Costs (Govt vs Private):**")
                costs = c.get("estimated_education_cost_inr", {})
                st.caption(f"Govt: {costs.get('government_route', 'N/A')}")
                st.caption(f"Private: {costs.get('private_route', 'N/A')}")

                st.markdown("**Free Learning Alternatives:**")
                for fa in c.get("free_learning_alternatives", [])[:2]:
                    st.caption(f"✓ {fa}")

# -----------------------------------------------------------------------------
# TAB 4: BUDGET-FRIENDLY CAREER PLANNER (FEATURE B)
# -----------------------------------------------------------------------------
with tab_budget:
    st.subheader("Feature B: Budget-Friendly Career Planner")
    st.caption("Compare your educational budget against pathway costs, discovering free government courses and scholarships.")

    b_col1, b_col2 = st.columns([1, 2])
    with b_col1:
        user_b = st.number_input("Your Available Annual Budget (INR):", min_value=0, value=int(st.session_state["profile"]["budget"]), step=5000)
        selected_c_budget = st.selectbox("Select Target Career to Evaluate:", [c["name"] for c in careers_all])

    target_id = next(c["id"] for c in careers_all if c["name"] == selected_c_budget)
    evaluation = evaluate_budget_affordability(target_id, float(user_b))

    with b_col2:
        if evaluation["is_within_govt_budget"]:
            st.success(f"✅ {evaluation['advisory']}")
        else:
            st.warning(f"⚠️ {evaluation['advisory']}")

        st.markdown(f"**Government Institution Route:** `{evaluation['government_route_cost']}`")
        st.markdown(f"**Private Institution Route:** `{evaluation['private_route_cost']}`")
        st.markdown(f"**Open / Self-Taught Route:** `{evaluation['open_learning_cost']}`")

        st.markdown("#### 🎁 Verified Free Learning Alternatives & Government Programs:")
        for alt in evaluation["free_learning_alternatives"]:
            st.markdown(f"- 🎓 {alt}")

        st.markdown("#### 📜 Applicable Scholarships & Financial Aid Schemes:")
        for sch in evaluation["scholarships"]:
            st.markdown(f"- 🏛️ {sch}")

# -----------------------------------------------------------------------------
# TAB 5: SKILL-GAP ANALYSIS (STAGE 05)
# -----------------------------------------------------------------------------
with tab_skillgap:
    st.subheader(f"Stage 05: {t.get('stage_05', 'Skill-Gap Analysis')}")
    st.caption("Contrasts your current skills against career requirements and isolates the top 3 priorities.")

    sg_career = st.selectbox("Evaluate Skills for Career:", [c["name"] for c in careers_all], key="sg_select")
    sg_id = next(c["id"] for c in careers_all if c["name"] == sg_career)
    gap_result = analyze_skill_gap(sg_id, st.session_state["profile"]["skills"])

    st.metric("Foundational Readiness Score", f"{gap_result['readiness_percentage']}%")
    st.progress(gap_result["readiness_percentage"] / 100.0)

    st.markdown("### 🎯 Priority Next 3 Skills to Master (Avoid Cognitive Overload):")
    p_cols = st.columns(3)
    for idx, sk in enumerate(gap_result["priority_next_3"]):
        with p_cols[idx]:
            st.info(f"**0{idx+1}. {sk['name']}**\n\nTier: {sk.get('level', 'Core')} | Priority: {sk.get('priority', 1)}")

    col_have, col_need = st.columns(2)
    with col_have:
        st.markdown("#### ✓ Skills You Already Reported:")
        if gap_result["skills_possessed"]:
            for s in gap_result["skills_possessed"]:
                st.markdown(f"- **{s['name']}** ({s.get('level', 'Core')})")
        else:
            st.caption("No directly reported overlapping skills yet. Everyone starts from zero!")

    with col_need:
        st.markdown("#### ⚡ Skills to Develop:")
        for s in gap_result["skills_to_develop"]:
            st.markdown(f"- {s['name']} (Priority {s.get('priority', 1)})")

# -----------------------------------------------------------------------------
# TAB 6: PERSONALIZED ROADMAP & PROGRESS DASHBOARD (STAGE 06 & FEATURE C)
# -----------------------------------------------------------------------------
with tab_roadmap:
    st.subheader("Stage 06 & Feature C: Personalized Roadmap & Progress Dashboard")
    st.caption("Track your milestone progression. Progress is saved locally in data/user_progress.json.")

    user_prog = load_user_progress()
    active_c_name = st.selectbox("Active Career Pathway:", [c["name"] for c in careers_all], key="rm_c_name")
    active_c_id = next(c["id"] for c in careers_all if c["name"] == active_c_name)

    roadmap_steps = generate_roadmap(active_c_id, st.session_state["profile"]["education"])
    completed_ids = set(user_prog.get("completed_milestones", []))

    done_count = sum(1 for s in roadmap_steps if s["step_id"] in completed_ids)
    total_steps = len(roadmap_steps)
    pct_done = round((done_count / total_steps * 100)) if total_steps else 0

    col_m1, col_m2 = st.columns([1, 3])
    col_m1.metric("Overall Progress", f"{pct_done}%", f"{done_count}/{total_steps} Milestones")
    with col_m2:
        st.progress(pct_done / 100.0)
        # Next best action
        next_s = next((s for s in roadmap_steps if s["step_id"] not in completed_ids), None)
        if next_s:
            st.markdown(f"**⭐ {t.get('next_best_action', 'Next Action')}:** {next_s['title']} *({next_s['timeframe']})*")
        else:
            st.success("🎉 All foundational milestones completed! Start building portfolio projects.")

    st.markdown("---")
    st.markdown("#### 📋 Milestone Checklist:")
    for s in roadmap_steps:
        sid = s["step_id"]
        is_done = sid in completed_ids
        chk = st.checkbox(f"**Step {s['step_num']} ({s['timeframe']}):** {s['title']}", value=is_done, key=sid)
        if chk != is_done:
            if chk:
                completed_ids.add(sid)
            else:
                completed_ids.discard(sid)
            user_prog["completed_milestones"] = list(completed_ids)
            user_prog["selected_career"] = active_c_id
            save_user_progress(user_prog)
            st.rerun()

# -----------------------------------------------------------------------------
# TAB 7: VERIFIED RESOURCE EXPLORER (FEATURE D)
# -----------------------------------------------------------------------------
with tab_resources:
    st.subheader("Feature D: Verified Educational Resource Explorer")
    st.caption("Official, verified Indian government and institutional portals with verified URLs and last-checked dates.")

    resources = load_resources()
    search_q = st.text_input("🔍 Search official resources by title or keyword:", "")

    filtered_res = [
        r for r in resources
        if search_q.lower() in r["title"].lower() or search_q.lower() in r["description"].lower() or search_q.lower() in r["relevance"].lower()
    ]

    for r in filtered_res:
        with st.container(border=True):
            r_col1, r_col2 = st.columns([3, 1])
            with r_col1:
                st.markdown(f"### [{r['title']}]({r['official_url']})")
                st.caption(f"Authority: **{r.get('authority', 'Govt of India')}** | Category: {r['category']}")
                st.markdown(r["description"])
                st.markdown(f"**Relevant To:** {r['relevance']}")
            with r_col2:
                st.success(f"✓ {r['verification_status']}")
                st.caption(f"Checked: {r['last_checked']}")
                st.markdown(f"**Cost:** {r['cost_detail']}")
                st.markdown(f"**Languages:** {', '.join(r.get('languages', []))}")
                st.link_button("Open Official Portal ↗", r["official_url"])

# Footer
st.markdown("---")
st.caption(f"© PathSetu (పథసేతు) Prototype v2.0 | {t.get('disclaimer', '')}")
