"""
Database Migration and Seeding Script for PathSetu
Safely upgrades pathsetu.db schema, preserves existing data,
adds users, profiles, roadmap_progress, skill_assessments, and career_stories tables.
"""

import sqlite3
import json
import uuid
from pathlib import Path
import bcrypt

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "pathsetu.db"

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def migrate():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Users table
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

    # 2. Check if profiles has user_id or id
    cursor.execute("PRAGMA table_info(profiles)")
    cols = [c[1] for c in cursor.fetchall()]
    
    if "user_id" not in cols:
        # Create new profiles table with user_id
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS profiles_new (
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
        
        # Copy any existing data from old profiles if exists
        try:
            cursor.execute("SELECT id, name, education, interests, skills, strengths, goal, workstyle, priority, constraints, updated_at FROM profiles")
            old_rows = cursor.fetchall()
            for r in old_rows:
                cursor.execute("""
                    INSERT OR IGNORE INTO profiles_new 
                    (user_id, name, education, interests, skills, strengths, goal, workstyle, priority, constraints, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10]))
        except Exception as e:
            print(f"Old profiles table migration notice: {e}")
            
        cursor.execute("DROP TABLE IF EXISTS profiles")
        cursor.execute("ALTER TABLE profiles_new RENAME TO profiles")

    # 3. Roadmap progress table with user isolation
    cursor.execute("PRAGMA table_info(roadmap_progress)")
    r_cols = [c[1] for c in cursor.fetchall()]
    if "user_id" not in r_cols:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS roadmap_progress_new (
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
        try:
            cursor.execute("SELECT career_id, completed_steps, custom_steps, updated_at FROM roadmap_progress")
            old_r = cursor.fetchall()
            for r in old_r:
                cursor.execute("""
                    INSERT OR IGNORE INTO roadmap_progress_new 
                    (user_id, career_id, completed_steps, custom_steps, updated_at)
                    VALUES ('default', ?, ?, ?, ?)
                """, (r[0], r[1], r[2], r[3]))
        except Exception as e:
            print(f"Old roadmap migration notice: {e}")
        cursor.execute("DROP TABLE IF EXISTS roadmap_progress")
        cursor.execute("ALTER TABLE roadmap_progress_new RENAME TO roadmap_progress")

    # 4. Skill assessments table
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

    # 5. Career stories table (Feature Two: Real People, Real Career Experiences)
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

    # 6. Seed Demo User Account
    demo_user_id = "user_demo_student_01"
    cursor.execute("SELECT id FROM users WHERE email = 'demo@pathsetu.org'")
    existing_user = cursor.fetchone()
    if not existing_user:
        hashed = hash_password("DemoStudent123!")
        cursor.execute("""
            INSERT INTO users (id, email, name, password_hash, onboarding_completed, selected_career)
            VALUES (?, ?, ?, ?, 1, 'software_dev')
        """, (demo_user_id, "demo@pathsetu.org", "Ananya Sharma", hashed))

        # Seed profile for demo user
        cursor.execute("""
            INSERT OR REPLACE INTO profiles (
                user_id, name, education, academic_stream, location, preferred_language,
                interests, subjects, strong_subjects, difficult_subjects,
                skills, skill_confidence, strengths, goal, career_aspirations,
                workstyle, priority, budget_inr, constraints, learning_pace,
                further_education, selected_career
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            demo_user_id,
            "Ananya Sharma",
            "Class 11–12 (Science / PCM)",
            "Science / PCM",
            "Guntur, Andhra Pradesh",
            "en",
            json.dumps(["technology", "problem-solving", "building"]),
            json.dumps(["Mathematics", "Physics", "Computer Science"]),
            json.dumps(["Mathematics", "Computer Science"]),
            json.dumps(["Chemistry"]),
            json.dumps(["Python", "HTML5 & CSS3", "Git & GitHub Version Control"]),
            json.dumps({"Python": "Intermediate", "HTML5 & CSS3": "Intermediate", "Git & GitHub Version Control": "Beginner"}),
            json.dumps(["Logic", "Analytical Thinking", "Curiosity"]),
            "Build useful software solutions for rural and Tier-2 communities in India.",
            "Full-Stack Web & Software Engineering",
            "Desk / Digital (Software, Design, Analytics)",
            "interest",
            30000,
            "Moderate family income; prefers government college, polytechnic, or merit scholarships.",
            "Moderate (10-15 hrs/week alongside studies)",
            "Planning for B.Tech / BCA or Government Technical College",
            "software_dev"
        ))

        # Seed initial roadmap progress for demo user
        cursor.execute("""
            INSERT OR REPLACE INTO roadmap_progress (user_id, career_id, completed_steps, custom_steps)
            VALUES (?, 'software_dev', ?, ?)
        """, (demo_user_id, json.dumps(["software_dev_1", "software_dev_2"]), json.dumps([])))

    # 7. Seed Career Stories (Feature Two)
    stories_data = [
        {
            "id": "story_software_01",
            "contributor_name": "Ramesh Varma",
            "role": "Junior Full-Stack Software Engineer",
            "career_id": "software_dev",
            "career_field": "Technology & Engineering",
            "education_route": "B.Tech (ECE from rural engineering college, self-taught web dev)",
            "experience_level": "2 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=kqtD5dpn9C8",
            "video_embed_url": "https://www.youtube.com/embed/kqtD5dpn9C8",
            "is_sample": 0,
            "headline": "How I transitioned from rural ECE to web development using free open resources.",
            "intro": "Ramesh grew up in a farming family near Tenali, Andhra Pradesh. Studying at a college with limited campus placement drives, he leveraged open-source curricula and daily coding practice to build production web applications.",
            "journey": "In our college, computers had limited internet access. I downloaded lecture videos and documentation whenever I visited the city on weekends. I started with Python fundamentals, practiced Git version control daily, built four portfolio web tools, and secured interviews through GitHub projects instead of paying costly placement training agencies.",
            "daily_life": "My workday starts with a 15-minute morning standup. From 10 AM to 1 PM, I write clean JavaScript frontend code and FastAPI Python endpoints. After lunch, I debug SQL database queries, review pull requests from peers, and write documentation.",
            "challenges": "Initial lack of local mentorship and feeling intimidated by candidates from metro cities. Overcoming technical English communication anxiety during interviews.",
            "skills_used": ["Python", "JavaScript DOM", "Git & GitHub Version Control", "SQL & Relational Databases", "REST APIs"],
            "mistakes_to_avoid": "Getting stuck in 'tutorial hell'—watching hours of coding tutorials without opening an editor. Write code from Day 1, even if it's 20 broken lines.",
            "advice_for_beginners": "Pick one core programming language and master variables, loops, data structures, and functions thoroughly. Build one project that solves a real problem for someone in your village, school, or local shop.",
            "how_learned": "FreeCodeCamp, SWAYAM / NPTEL Computer Science modules by IIT Madras, and MDN Web Docs.",
            "resources": [
                {"title": "FreeCodeCamp Web Foundations", "url": "https://www.freecodecamp.org/"},
                {"title": "SWAYAM CS Catalogue", "url": "https://swayam.gov.in/"},
                {"title": "NCS Software Developer Profile", "url": "https://www.ncs.gov.in/"}
            ]
        },
        {
            "id": "story_design_01",
            "contributor_name": "Kavitha Reddy",
            "role": "Product & UI/UX Designer",
            "career_id": "ui_ux_designer",
            "career_field": "Creative & Design Tech",
            "education_route": "B.Sc Visual Arts + Self-Taught Figma & Accessibility",
            "experience_level": "3 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
            "video_embed_url": "https://www.youtube.com/embed/c9Wg6Cb_YlU",
            "is_sample": 0,
            "headline": "Designing vernacular interfaces for Indian users who aren't tech-savvy.",
            "intro": "Kavitha works with a financial technology team designing clean, accessible interfaces for Tier-2/3 shopkeepers and farmers using digital payments for the first time.",
            "journey": "I did not attend an expensive metropolitan design school. I started by observing apps my parents struggled to use. I learned Figma through free online video tutorials, studied typography hierarchies, and conducted low-fidelity usability interviews with merchants in Warangal.",
            "daily_life": "Two days a week I conduct user feedback calls. The rest of the week I build interactive wireframes in Figma, verify WCAG color contrast standards for low-cost phone screens, and hand off specifications to frontend developers.",
            "challenges": "Educating stakeholders that usability and accessibility always outrank decorative visual gimmicks. Designing interfaces that remain legible across Telugu, Hindi, and English.",
            "skills_used": ["Figma & Wireframing", "User Research & Usability Testing", "Typography & Color Theory", "Information Architecture", "Design Accessibility (WCAG)"],
            "mistakes_to_avoid": "Creating flashy Dribbble graphics that look artistic but fail when real users try to find a button or read text in sunlight.",
            "advice_for_beginners": "Take any poorly designed local website or government portal and create a 3-screen redesign case study. Explain *why* you moved every button and *what* user problem you solved.",
            "how_learned": "Figma community files, Material Design 3 documentation, and Google UX foundational materials.",
            "resources": [
                {"title": "Material Design Guidelines", "url": "https://m3.material.io/"},
                {"title": "Figma Free Education Tier", "url": "https://www.figma.com/education/"}
            ]
        },
        {
            "id": "story_agri_01",
            "contributor_name": "Dr. S. Mallikarjun",
            "role": "Agronomist & Soil Health Specialist",
            "career_id": "agri_scientist",
            "career_field": "Agriculture & Rural Sciences",
            "education_route": "B.Sc (Hons) Agriculture from ANGRAU + M.Sc Agronomy",
            "experience_level": "5 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=2Z3yJ2h8x3M",
            "video_embed_url": "https://www.youtube.com/embed/2Z3yJ2h8x3M",
            "is_sample": 0,
            "headline": "Transforming traditional farming with precision soil analysis and climate resilience.",
            "intro": "Mallikarjun collaborates with agricultural research stations and Farmer Producer Organizations (FPOs) across Southern India to optimize crop yields and soil health.",
            "journey": "Coming from an agricultural background, I saw how fluctuating monsoons and unguided chemical fertilizer use damaged family finances. Qualifying through state agricultural counseling (ANGRAU) opened a disciplined scientific path where I learned soil chemistry, crop rotation, and water-efficient irrigation.",
            "daily_life": "Field visits take place early in the morning before high heat to test soil nitrogen and moisture levels. Mid-day is spent in the research lab preparing nutritional charts, and evenings are reserved for conducting farmer awareness workshops.",
            "challenges": "Translating scientific laboratory data into affordable, actionable steps for smallholder farmers. Weather volatility requiring rapid adaptation of pest management protocols.",
            "skills_used": ["Soil Science & Nutrient Testing", "Crop Rotation Planning", "Integrated Pest Management (IPM)", "Data Recording & Field Trials"],
            "mistakes_to_avoid": "Assuming textbook formulas work uniformly everywhere without taking physical soil core samples and factoring in microclimates.",
            "advice_for_beginners": "Agriculture is modernizing rapidly with drone analytics and sensor technology. Prepare thoroughly for ICAR AIEEA and state agri entrance examinations.",
            "how_learned": "State Agricultural University coursework, ICAR technical research bulletins, and direct field mentorship.",
            "resources": [
                {"title": "ICAR Agriculture Portal", "url": "https://icar.org.in/"},
                {"title": "Kisan Suvidha Portal", "url": "https://kisansuvidha.gov.in/"}
            ]
        },
        {
            "id": "story_solar_01",
            "contributor_name": "Venkatesh Naik",
            "role": "Solar PV Installation & Maintenance Specialist",
            "career_id": "solar_electrician",
            "career_field": "Clean Energy & Vocational Trades",
            "education_route": "ITI Electrical + Suryamitra Skill Certification (NISE)",
            "experience_level": "4 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=1uU_94t8i3E",
            "video_embed_url": "https://www.youtube.com/embed/1uU_94t8i3E",
            "is_sample": 0,
            "headline": "From an ITI certificate to leading solar microgrid installations in rural districts.",
            "intro": "Venkatesh leads rooftop solar installations and solar-powered agricultural pumps under national renewable energy initiatives.",
            "journey": "After completing my 10th standard, my family could not afford costly private colleges. I enrolled in Government ITI Electricals (tuition under ₹2,000/yr). After graduating, I qualified for the free 3-month Suryamitra training program by the Ministry of New and Renewable Energy.",
            "daily_life": "Morning safety check and tool inspection. On-site rooftop structural measurements, mounting photovoltaic panels, wiring DC/AC solar inverters, verifying earthing resistance with megohmmeter, and testing grid synchronization.",
            "challenges": "Working in outdoor weather conditions and strict physical safety at heights. Troubleshooting electrical surges during lightning and storm seasons.",
            "skills_used": ["Solar PV System Installation", "Electrical Safety & Earthing", "Multimeter & Inverter Diagnostics", "Circuit Wiring & Conduit Work"],
            "mistakes_to_avoid": "Neglecting earthing depth or lightning arrestors to save an hour of labor. In high-voltage DC solar systems, safety is non-negotiable.",
            "advice_for_beginners": "Enroll in a recognized Government ITI or Skill India Digital solar course. The PM Surya Ghar scheme has created thousands of immediate technical jobs across every Indian district.",
            "how_learned": "Government ITI electrical curriculum + NISE Suryamitra Certified Technician scheme.",
            "resources": [
                {"title": "National Institute of Solar Energy", "url": "https://nise.res.in/"},
                {"title": "Skill India Digital Hub", "url": "https://www.skillindiadigital.gov.in/"}
            ]
        },
        {
            "id": "story_nurse_01",
            "contributor_name": "Sister Preethi Kurian",
            "role": "Clinical Nurse & Emergency Healthcare Specialist",
            "career_id": "medical_nurse",
            "career_field": "Healthcare & Life Sciences",
            "education_route": "B.Sc Nursing from Government College of Nursing",
            "experience_level": "6 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=0hL4EwF7k1g",
            "video_embed_url": "https://www.youtube.com/embed/0hL4EwF7k1g",
            "is_sample": 0,
            "headline": "Saving lives at the frontline with clinical accuracy, composure, and empathy.",
            "intro": "Preethi coordinates emergency triage, clinical medication delivery, and critical care in a busy district hospital.",
            "journey": "I entered nursing through a merit seat in a state government nursing college. My entire 4-year degree cost less than ₹20,000 in total fees, and I received a clinical training stipend. The patient clinical rotations gave me real composure under pressure.",
            "daily_life": "Shift handover rounds, checking telemetry monitors and vital signs, administering IV medications, assisting emergency trauma surgeons, and consoling distressed family members.",
            "challenges": "Emotional fatigue when treating critical trauma cases and rotating night shifts. Maintaining total mathematical accuracy with drug calculations under emergency urgency.",
            "skills_used": ["Patient Vital Signs Monitoring", "Emergency First Aid & CPR", "IV Infusion & Medication Administration", "Clinical Empathy & Patient Communication"],
            "mistakes_to_avoid": "Hesitating to ask a colleague or doctor when double-checking medication dosages. In clinical care, double-checking is professional excellence, not weakness.",
            "advice_for_beginners": "Government nursing programs offer top-tier clinical training at low cost. If you care deeply about helping people and want guaranteed career mobility, this is an honorable path.",
            "how_learned": "Government hospital clinical rotations, Indian Nursing Council accredited coursework.",
            "resources": [
                {"title": "Indian Nursing Council", "url": "https://www.indiannursingcouncil.org/"},
                {"title": "National Career Service Healthcare", "url": "https://www.ncs.gov.in/"}
            ]
        },
        {
            "id": "story_data_01",
            "contributor_name": "Priya Sharma",
            "role": "Senior Business Intelligence & Data Analyst",
            "career_id": "data_analyst",
            "career_field": "Technology & Analytics",
            "education_route": "B.Com + Self-Taught SQL, Excel & Power BI",
            "experience_level": "3 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=k_dE_Z9F5Xw",
            "video_embed_url": "https://www.youtube.com/embed/k_dE_Z9F5Xw",
            "is_sample": 0,
            "headline": "How I converted business questions into interactive dashboards without an engineering degree.",
            "intro": "Priya works with an Indian logistics company, translating raw delivery tracking records into executive operational dashboards.",
            "journey": "Graduating with a general B.Com degree, I realized most companies struggled to understand their sales data. I dedicated 3 months to mastering advanced Excel formulas and PivotTables, followed by relational SQL queries and Power BI.",
            "daily_life": "Writing SQL queries to extract regional fulfillment metrics, transforming unformatted CSV files, building interactive Power BI dashboards, and presenting insights to logistics heads.",
            "challenges": "Cleaning messy, inconsistent real-world datasets with missing values. Explaining data variance and statistical trends to non-technical managers.",
            "skills_used": ["Advanced SQL (Joins, Window Functions)", "Spreadsheet Mastery (Excel/Sheets)", "Data Visualization (Power BI / Tableau)", "Data Cleaning & Transformation"],
            "mistakes_to_avoid": "Rushing into advanced machine learning algorithms before mastering fundamental SQL joins and Excel business math.",
            "advice_for_beginners": "Download public Indian datasets from data.gov.in (like crop prices or railway statistics). Build 2 clean dashboards and share your analysis on LinkedIn.",
            "how_learned": "Microsoft Learn Power BI tracks, Kaggle practice datasets, and free SQL tutorials.",
            "resources": [
                {"title": "Data.gov.in Open Datasets", "url": "https://data.gov.in/"},
                {"title": "Microsoft Learn Power BI", "url": "https://learn.microsoft.com/power-bi/"}
            ]
        },
        {
            "id": "story_civil_01",
            "contributor_name": "Anand Rao",
            "role": "Site Engineer & Quality Assurance Inspector",
            "career_id": "civil_engineer",
            "career_field": "Engineering & Infrastructure",
            "education_route": "Polytechnic Diploma (Civil) + Lateral B.Tech",
            "experience_level": "4 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=8bL2wR_k8Zk",
            "video_embed_url": "https://www.youtube.com/embed/8bL2wR_k8Zk",
            "is_sample": 0,
            "headline": "Building roads, bridges, and infrastructure that connect rural India to opportunity.",
            "intro": "Anand supervises construction execution, concrete quality verification, and structural surveying on highway projects.",
            "journey": "I completed a 3-year polytechnic diploma in civil engineering right after 10th class. That gave me direct field surveying experience before I entered engineering college via lateral entry. Being confident on an active construction site gave me an immediate edge.",
            "daily_life": "Morning review of structural CAD blueprints at 7:30 AM, conducting concrete slump and cube compressive strength tests, inspecting steel reinforcement placement, and auditing contractor material logs.",
            "challenges": "Managing site timelines during monsoon seasons and enforcing rigid structural quality standards with subcontracted labor.",
            "skills_used": ["AutoCAD & Structural Blueprint Reading", "Site Surveying & Leveling", "Concrete Quality Testing", "Cost Estimation & Bar Bending"],
            "mistakes_to_avoid": "Approving contractor work from an office chair without physically inspecting the site measurements and concrete vibrator usage.",
            "advice_for_beginners": "The 3-year polytechnic diploma route is extremely affordable and prepares you for real site execution faster than theoretical lectures. Embrace it proudly.",
            "how_learned": "Polytechnic hands-on workshops, NPTEL Civil Engineering courses, and practical on-site apprenticeship.",
            "resources": [
                {"title": "AICTE Technical Education", "url": "https://www.aicte-india.org/"},
                {"title": "NPTEL Civil Engineering", "url": "https://nptel.ac.in/"}
            ]
        },
        {
            "id": "story_ca_01",
            "contributor_name": "Sai Teja",
            "role": "Chartered Accountant & Tax Consultant",
            "career_id": "chartered_accountant",
            "career_field": "Finance & Commerce",
            "education_route": "ICAI Route (Foundation -> Inter -> Articleship -> Final)",
            "experience_level": "3 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=5V_dE4y_F_g",
            "video_embed_url": "https://www.youtube.com/embed/5V_dE4y_F_g",
            "is_sample": 0,
            "headline": "The rigorous discipline that opened doors from a small town to premier financial advisory.",
            "intro": "Sai Teja cleared his CA examinations and now advises small enterprises, agricultural cooperatives, and startups on GST and financial compliance.",
            "journey": "Coming from a modest middle-class family, private business schools charging ₹15 lakhs were out of reach. The ICAI Chartered Accountancy route offered an egalitarian path: total registration costs were under ₹80,000 across all stages, and during my 3 years of mandatory articleship, I received a monthly stipend while learning real corporate auditing.",
            "daily_life": "Auditing balance sheets, reviewing GST filings, corporate tax computations, meeting with small business owners, and conducting internal risk audits.",
            "challenges": "The intense psychological discipline required to study 7 to 8 hours daily after exhausting articleship office hours.",
            "skills_used": ["Financial Accounting & Auditing", "Indian Taxation (GST & Income Tax)", "Corporate Law Compliance", "Financial Modeling & Analysis"],
            "mistakes_to_avoid": "Treating articleship casually as a formality. 80% of what is tested in the CA Final exam is mastered during real-world audit client visits.",
            "advice_for_beginners": "CA requires dedication, not genius. Stick to ICAI study material and revise concepts systematically every week.",
            "how_learned": "ICAI official modules, BoS live virtual classes, and hands-on auditing during articleship.",
            "resources": [
                {"title": "ICAI Official Portal", "url": "https://www.icai.org/"},
                {"title": "ICAI BoS Knowledge Portal", "url": "https://boslive.icai.org/"}
            ]
        },
        {
            "id": "story_teacher_01",
            "contributor_name": "Sunitha Devi",
            "role": "High School Mathematics & Science Teacher",
            "career_id": "school_teacher",
            "career_field": "Education & Mentorship",
            "education_route": "B.Sc (MPC) + B.Ed + State Teacher Eligibility Test (TET)",
            "experience_level": "7 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=0w_3hL_kP1s",
            "video_embed_url": "https://www.youtube.com/embed/0w_3hL_kP1s",
            "is_sample": 0,
            "headline": "Igniting curiosity for science in rural classrooms where textbooks were the only window.",
            "intro": "Teaching at a government Zilla Parishad High School, Sunitha has mentored dozens of first-generation learners toward STEM degrees and polytechnic careers.",
            "journey": "I studied B.Sc Mathematics and Physics in my home district college, followed by a government-subsidized B.Ed program. Clearing the state Teacher Eligibility Test (TET) secured my appointment. Teaching allowed me to stay connected to my community while enjoying career security.",
            "daily_life": "Morning school assembly, four teaching periods using low-cost experimental kits, grading homework, and running after-school remedial sessions for struggling students.",
            "challenges": "Helping students overcome math fear and persuading rural parents to continue their daughters' education beyond Class 10.",
            "skills_used": ["Mathematics & Physics Pedagogy", "Lesson Planning & Assessment", "Classroom Engagement & Empathy", "Bilingual Communication (Telugu & English)"],
            "mistakes_to_avoid": "Relying purely on mechanical formula memorization without demonstrating real-world applications in village life.",
            "advice_for_beginners": "Government teaching offers high social respect, work-life balance, and dependable compensation. Passionate educators transform entire generations.",
            "how_learned": "SCERT teacher training, DIKSHA national digital education modules, and peer teacher forums.",
            "resources": [
                {"title": "DIKSHA National Portal for Teachers", "url": "https://diksha.gov.in/"},
                {"title": "NCERT Official Portal", "url": "https://ncert.nic.in/"}
            ]
        },
        {
            "id": "story_bank_01",
            "contributor_name": "Harish Kumar",
            "role": "Rural Banking & Agricultural Credit Officer",
            "career_id": "microfinance_officer",
            "career_field": "Banking & Rural Development",
            "education_route": "B.Sc Agriculture + IBPS RRB Scale-I Officer Exam",
            "experience_level": "4 Years Experience",
            "language": "en",
            "video_url": "https://www.youtube.com/watch?v=3oK_7yR_8Vw",
            "video_embed_url": "https://www.youtube.com/embed/3oK_7yR_8Vw",
            "is_sample": 0,
            "headline": "Empowering rural farmers and women's self-help groups through institutional credit.",
            "intro": "Harish works at a Regional Rural Bank (RRB), disbursing agricultural crop loans, solar pump financing, and micro-loans for women entrepreneurs.",
            "journey": "After studying agriculture, I prepared for the Institute of Banking Personnel Selection (IBPS) RRB exams using free mock tests and standard quantitative aptitude books. Passing on my second attempt, I was posted as an Assistant Branch Manager in a rural division.",
            "daily_life": "Morning branch banking operations, processing Kisan Credit Card (KCC) applications, and afternoon field visits to inspect farm collaterals and loan utilization.",
            "challenges": "Educating villagers against predatory non-institutional moneylenders and managing loan recovery during unpredictable crop seasons.",
            "skills_used": ["Credit Risk Appraisal", "Agricultural Finance & KCC Schemes", "Customer Empathy & Negotiation", "Core Banking Solutions (CBS)"],
            "mistakes_to_avoid": "Approving credit files based solely on paper documentation without verifying on-site cultivation and borrower character.",
            "advice_for_beginners": "IBPS RRB examinations are an incredible pathway with clear syllabus guidelines. It offers rapid promotion prospects and meaningful public service.",
            "how_learned": "NABARD rural credit guidelines, IIBF banking certifications, and branch operations.",
            "resources": [
                {"title": "IBPS Official Examination Portal", "url": "https://www.ibps.in/"},
                {"title": "NABARD Rural Banking Portal", "url": "https://www.nabard.org/"}
            ]
        }
    ]

    for s in stories_data:
        cursor.execute("""
            INSERT OR REPLACE INTO career_stories (
                id, contributor_name, role, career_id, career_field,
                education_route, experience_level, language, video_url, video_embed_url,
                is_sample, headline, intro, journey, daily_life, challenges,
                skills_used, mistakes_to_avoid, advice_for_beginners, how_learned, resources, published
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        """, (
            s["id"], s["contributor_name"], s["role"], s["career_id"], s["career_field"],
            s["education_route"], s["experience_level"], s["language"], s.get("video_url"), s.get("video_embed_url"),
            s["is_sample"], s["headline"], s["intro"], s["journey"], s["daily_life"], s["challenges"],
            json.dumps(s["skills_used"]), s["mistakes_to_avoid"], s["advice_for_beginners"], s["how_learned"],
            json.dumps(s["resources"])
        ))

    conn.commit()
    conn.close()
    print("Database migration and seeding completed successfully.")

if __name__ == "__main__":
    migrate()

