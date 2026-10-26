/**
 * PathSetu Master Data Store & Taxonomy
 * Includes 10+ Diverse Indian Career Pathways,
 * Official Verified Resource Directory (NCS, SWAYAM, AICTE, NTA, UGC, Skill India, NCERT),
 * Budget Evaluation Rules, and English/Telugu Bilingual Translations.
 */

const PATHSETU_DATA = {
  // Translations
  translations: {
    en: {
      site_title: "PathSetu",
      site_tagline: "Your interest. Your path. Our support.",
      hero_eyebrow: "6-Stage Guided Career Intelligence",
      hero_title: "Don't just choose a career. Experience the path first.",
      hero_desc: "PathSetu bridges student interests to industry-verified roadmaps, designed especially for students in Tier-2/3 cities and rural India. Transparent profiling, affordable pathways, and structured milestones.",
      btn_get_started: "Get Started →",
      btn_build_roadmap: "Build My Career Roadmap →",
      btn_explore_careers: "Explore Career Tracks",
      methodology_title: "The Six-Stage PathSetu Methodology",
      nav_methodology: "6-Stage Methodology",
      nav_careers: "Career Tracks",
      nav_comparison: "Career Comparison",
      nav_budget: "Budget Planner",
      nav_resources: "Verified Resources",
      nav_dashboard: "Dashboard",
      budget_input_label: "Enter your approximate education budget (in INR):",
      next_best_action: "Recommended Next Action",
      mark_done: "Mark Done ✓",
      download_plan: "Download Career Plan (.txt)"
    },
    te: {
      site_title: "పాత్‌సేతు (PathSetu)",
      site_tagline: "మీ ఆసక్తి. మీ మార్గం. మా మార్గదర్శకత్వం.",
      hero_eyebrow: "6-దశల కెరీర్ గైడెన్స్ వేదిక",
      hero_title: "కేవలం కెరీర్ ఎంచుకోవడమే కాదు. ముందుగా ఆ మార్గాన్ని అనుభవించండి.",
      hero_desc: "గ్రామీణ మరియు చిన్న నగరాల విద్యార్థుల కోసం ప్రత్యేకంగా రూపొందించబడిన పాత్‌సేతు. మీ నైపుణ్యాలను సరసమైన విద్య, ప్రాజెక్టులు మరియు స్పష్టమైన ప్రణాళికతో అనుసంధానించండి.",
      btn_get_started: "ప్రారంభించండి →",
      btn_build_roadmap: "నా కెరీర్ రోడ్‌మ్యాప్ రూపొందించండి →",
      btn_explore_careers: "కెరీర్ మార్గాలను చూడండి",
      methodology_title: "పాత్‌సేతు 6-దశల విద్యా ప్రణాళిక",
      nav_methodology: "6-దశల పద్ధతి",
      nav_careers: "కెరీర్ మార్గాలు",
      nav_comparison: "కెరీర్ పోలిక",
      nav_budget: "బడ్జెట్ ప్లానర్",
      nav_resources: "ధృవీకరించిన వనరులు",
      nav_dashboard: "డ్యాష్‌బోర్డ్",
      budget_input_label: "మీ సుమారు విద్యా బడ్జెట్ నమోదు చేయండి (రూపాయలలో):",
      next_best_action: "తదుపరి ఉత్తమ కార్యాచరణ",
      mark_done: "పూర్తయిందిగా గుర్తించండి ✓",
      download_plan: "కెరీర్ ప్రణాళిక డౌన్‌లోడ్ (.txt)"
    }
  },

  methodologyStages: [
    {
      num: "01",
      id: "student-input",
      title: "Student Input",
      title_te: "01 · విద్యార్థి వివరాల సేకరణ",
      shortDesc: "Collect interests, education, subjects, skills, budget, and goals.",
      shortDesc_te: "ఆసక్తులు, చదువు, ఇష్టమైన సబ్జెక్టులు, నైపుణ్యాలు మరియు బడ్జెట్ వివరాలు.",
      fullDesc: "Rather than forcing students into rigid multiple-choice tests, PathSetu gathers comprehensive context: current stage, favorite subjects, skills, preferred work style, time availability, budget in INR, and practical constraints.",
      icon: "✍️",
      deliverable: "Holistic Student Intake Profile",
      transparencyNote: "Input is student-directed. No psychological profiling or deceptive trick questions."
    },
    {
      num: "02",
      id: "ai-analysis",
      title: "AI Analysis",
      title_te: "02 · ప్రొఫైల్ విశ్లేషణ",
      shortDesc: "Build an interpretable student profile with strengths clustering.",
      shortDesc_te: "మీ సమాధానాల ఆధారంగా స్పష్టమైన బలాల విశ్లేషణ.",
      fullDesc: "Synthesizes intake signals into an explainable profile. Replaces black-box scores with strength clustering, workstyle alignment, and transparent reasoning.",
      icon: "🧠",
      deliverable: "Interpretable Strengths & Readiness Radar",
      transparencyNote: "Deterministic, explainable rule engine based on educational heuristics."
    },
    {
      num: "03",
      id: "career-recommendations",
      title: "Career Recommendation Engine",
      title_te: "03 · కెరీర్ సిఫార్సు ఇంజిన్",
      shortDesc: "Match the profile with vetted career pathways with clear rationale.",
      shortDesc_te: "5 ముఖ్య అంశాలతో సరిపోలే కెరీర్లను పారదర్శకంగా సూచించడం.",
      fullDesc: "Evaluates 5 configurable weights: Interests (35%), Subjects (25%), Skills (20%), Education Pathway (15%), Workstyle (5%). Returns explicit 'Why this fits' explanations.",
      icon: "🎯",
      deliverable: "Ranked Pathways with Match Breakdown & Trade-Offs",
      transparencyNote: "Match percentages are exploratory indicators, NOT definitive aptitude verdicts."
    },
    {
      num: "04",
      id: "real-world-guidance",
      title: "Real-World Guidance",
      title_te: "04 · వాస్తవ మార్గదర్శకత్వం",
      shortDesc: "Explore authentic experiences, practitioner stories, and verified resources.",
      shortDesc_te: "అనుభవజ్ఞుల కథనాలు, అర్హతలు, ప్రవేశ పరీక్షలు మరియు వాస్తవ పరిస్థితులు.",
      fullDesc: "Demystifies daily life in a career. Explores day-to-day realities, entry eligibility, state/central entrance examinations, and verified official government portals.",
      icon: "🌐",
      deliverable: "Authentic Story Journeys & Curated Starter Tasks",
      transparencyNote: "All educational guidelines cite verified statutory sources (NMC, AICTE, UGC, ICAR)."
    },
    {
      num: "05",
      id: "skill-gap-analysis",
      title: "Skill-Gap Analysis",
      title_te: "05 · నైపుణ్య లోపాల విశ్లేషణ",
      shortDesc: "Compare current skills with required skills for the selected pathway.",
      shortDesc_te: "మీ వద్ద ఉన్న నైపుణ్యాలు మరియు నేర్చుకోవలసిన ముఖ్యమైన 3 నైపుణ్యాలు.",
      fullDesc: "Contrasts declared student skills against foundational entry-level expectations. Categorizes into 'Ready', 'In-Progress', and isolates the 'Top 3 Priority Skills' to prevent cognitive overload.",
      icon: "⚖️",
      deliverable: "Visual Readiness Matrix & Prioritized Skill Targets",
      transparencyNote: "Reflects real junior entry demands from verified job descriptions."
    },
    {
      num: "06",
      id: "personalized-roadmap",
      title: "Personalized Roadmap",
      title_te: "06 · వ్యక్తిగత రోడ్‌మ్యాప్",
      shortDesc: "Create a step-by-step ordered plan and track hands-on progress.",
      shortDesc_te: "దశలవారీగా నేర్చుకునే ప్రణాళిక, మైలురాళ్లు మరియు పురోగతి నమోదు.",
      fullDesc: "Generates an ordered milestone plan (Foundations → Core Skills → Portfolio Project → Research Qualifications → Next Steps). Mark milestones complete, track percentage progress, and export plan.",
      icon: "🗺️",
      deliverable: "Dynamic Milestone Tracker with 'Next Best Action'",
      transparencyNote: "Roadmaps are flexible guides designed to be adapted by the student."
    }
  ],

  // 10 Diverse Indian Career Pathways
  careers: [
    {
      id: "software",
      name: "Software Developer",
      name_te: "సాఫ్ట్‌వేర్ డెవలపర్",
      field: "Technology & Engineering",
      emoji: "💻",
      badge: "High Demand",
      salaryRange: "₹3.5L - ₹9L / yr (Entry-level India)",
      timeToReady: "6 – 12 months",
      difficulty: "Moderate to Challenging",
      desc: "Architects, builds, and maintains web applications, services, and digital tools.",
      desc_te: "అప్లికేషన్లు, వెబ్‌సైట్లు మరియు సాఫ్ట్‌వేర్ ఉత్పత్తులను కోడింగ్ ద్వారా నిర్మించే సాంకేతిక నిపుణులు.",
      targetInterests: ["technology", "problem-solving", "building", "logic"],
      targetSubjects: ["Computer Science", "Mathematics", "Physics"],
      targetEducationLevels: ["Class 11–12 (Science / PCM)", "Diploma / ITI", "College Undergraduate (Tech/BCA/B.Tech)", "Graduate / Career Pivot"],
      typicalWorkstyle: "Deep Focus (Solo analytical / coding focus)",
      verifiedEducationPathways: [
        "B.Tech / B.E. in Computer Science or IT (4 years)",
        "BCA (Bachelor of Computer Applications, 3 years) + MCA",
        "Polytechnic Diploma in Computer Engineering (3 years) + Lateral B.Tech",
        "Self-directed portfolio learning via FreeCodeCamp, Odin Project, SWAYAM"
      ],
      eligibilityConditions: "10+2 with Mathematics/Physics for engineering degree; direct admission in BCA/B.Sc CS across state colleges.",
      relevantEntranceExams: ["JEE Main", "State EAPCET / CET", "CUET UG"],
      estimatedCostInr: {
        government: "₹15,000 - ₹60,000 / year (Govt engineering or BCA)",
        private: "₹80,000 - ₹2,50,000 / year",
        open: "₹0 - ₹5,000 (Internet + optional certification fees)"
      },
      freeAlternatives: [
        "SWAYAM / NPTEL Computer Science courses by IIT Madras",
        "FreeCodeCamp Responsive Web & JavaScript Foundations",
        "CS50 Introduction to Computer Science (Harvard OpenCourseWare)"
      ],
      scholarships: [
        "National Scholarship Portal (NSP) Post-Matric Schemes",
        "AICTE Pragati Scholarship for Girl Students (₹50,000/yr)",
        "State Government Fee Reimbursement schemes"
      ],
      requiredSkills: [
        { name: "Programming Foundations (JS / Python)", level: "Core", priority: 1 },
        { name: "Data Structures & Algorithms", level: "Core", priority: 2 },
        { name: "Git & Version Control", level: "Essential", priority: 1 },
        { name: "Web Fundamentals (HTML/CSS/DOM)", level: "Core", priority: 2 },
        { name: "Database Design & SQL", level: "Essential", priority: 3 }
      ],
      steps: [
        { id: "s1", title: "Explore Developer Workflows", time: "Week 1-2", desc: "Complete an introductory Python or JavaScript sandbox tutorial to feel the feedback loop of writing and running code." },
        { id: "s2", title: "Core Programming Foundations", time: "Month 1-2", desc: "Master variables, loops, conditionals, functions, data structures, and algorithmic thinking." },
        { id: "s3", title: "Git & Web Fundamentals", time: "Month 3-4", desc: "Learn version control with Git and GitHub. Build responsive semantic web interfaces with HTML, CSS, and interactive DOM manipulation." },
        { id: "s4", title: "Build First Portfolio Project", time: "Month 5", desc: "Construct a complete, deployable application with database persistence (e.g., student task tracker or markdown blog)." },
        { id: "s5", title: "Skill-Gap Review & Code Quality", time: "Month 6", desc: "Refactor your project, write automated tests, and have an experienced developer review your code." },
        { id: "s6", title: "Career Entry & Applications", time: "Month 7+", desc: "Document your GitHub repositories, write clear READMEs, network with dev communities, and apply for junior roles." }
      ],
      stories: [
        {
          contributor: "Aanya S.",
          stage: "2nd Year BCA Student",
          avatar: "👩‍💻",
          quote: "I thought coding was for geniuses until I built my first small budget tracker. Once I had something running on my phone, everything changed.",
          challenge: "Spent 3 weeks stuck on async promises; joining a peer group helped me debug faster.",
          advice: "Don't watch endless tutorials. Build tiny ugly projects every single week."
        }
      ]
    },
    {
      id: "design",
      name: "UI/UX & Product Designer",
      name_te: "యూఐ/యూఎక్స్ డిజైనర్",
      field: "Creative & Design",
      emoji: "🎨",
      badge: "High Impact",
      salaryRange: "₹3.5L - ₹8.5L / yr",
      timeToReady: "4 – 8 months",
      difficulty: "Moderate",
      desc: "Designs intuitive, accessible, and visually stunning digital experiences for mobile and web apps.",
      desc_te: "మొబైల్ మరియు వెబ్ యాప్‌లను సులభంగా, అందంగా ఉపయోగించేలా డిజైన్ చేసే నిపుణులు.",
      targetInterests: ["creativity", "technology", "helping", "communication"],
      targetSubjects: ["Arts", "Computer Science", "Social Studies"],
      targetEducationLevels: ["Class 11–12 (Commerce / Arts)", "Class 11–12 (Science / PCM)", "College Undergraduate (Non-tech)", "College Undergraduate (Tech/BCA/B.Tech)"],
      typicalWorkstyle: "Balanced (Hybrid collaborative & solo deep work)",
      verifiedEducationPathways: [
        "Bachelor of Design (B.Des in Interaction/Communication Design, 4 years)",
        "Degree in Visual Arts, Psychology, or Computer Science",
        "Self-directed portfolio learning with Figma Community and Google UX Design Certificate"
      ],
      eligibilityConditions: "10+2 from any recognized stream (Science, Commerce, Arts); design aptitude test for top institutes.",
      relevantEntranceExams: ["UCEED (IITs)", "NID DAT", "NIFT Entrance"],
      estimatedCostInr: {
        government: "₹40,000 - ₹1,20,000 / year (Govt universities/NID)",
        private: "₹1,50,000 - ₹3,50,000 / year",
        open: "₹0 - ₹8,000 (Figma free tier + open case studies)"
      },
      freeAlternatives: [
        "Interaction Design Foundation Open Guides",
        "Figma YouTube Tutorials & UI Design Sandbox",
        "Open Accessibility Audits with WCAG Guidelines"
      ],
      scholarships: [
        "National Scholarship Portal Merit-cum-Means",
        "State Post-Matric Welfare Scholarships"
      ],
      requiredSkills: [
        { name: "Figma & Component Systems", level: "Core", priority: 1 },
        { name: "Visual Hierarchy & Typography", level: "Core", priority: 1 },
        { name: "User Research & Usability Testing", level: "Core", priority: 2 },
        { name: "Design Accessibility Standards", level: "Essential", priority: 2 }
      ],
      steps: [
        { id: "d1", title: "UX Fundamentals & Observation", time: "Week 1-2", desc: "Audit 3 daily apps you use. Document what makes them enjoyable or confusing. Read 'The Design of Everyday Things'." },
        { id: "d2", title: "Master Figma & Visual Design", time: "Month 1-2", desc: "Learn Figma shortcuts, auto-layout, components, variants, responsive constraints, typography scales, and grids." },
        { id: "d3", title: "User Research & Wireframing", time: "Month 3", desc: "Formulate user interview questions. Map empathy diagrams and sketch low-fidelity wireframes." },
        { id: "d4", title: "Comprehensive Case Study", time: "Month 4-5", desc: "Redesign an inaccessible public utility or create an original product solving a student problem." },
        { id: "d5", title: "Portfolio Presentation", time: "Month 6+", desc: "Build a clean web portfolio explaining your design decisions, rationale, and measured user feedback." }
      ],
      stories: [
        {
          contributor: "Pooja V.",
          stage: "Product Designer @ FinTech",
          avatar: "👩‍🎨",
          quote: "Product design is solving user anxiety and making complex actions simple.",
          challenge: "Receiving harsh feedback during design critiques stung until I learned not to attach my ego to my first draft.",
          advice: "Show your messy process, sketches, and failed iterations in your case study."
        }
      ]
    },
    {
      id: "agri_scientist",
      name: "Agricultural Scientist & Agronomist",
      "name_te": "వ్యవసాయ శాస్త్రవేత్త / ఆగ్రోనమిస్ట్",
      field: "Agriculture & Rural",
      emoji: "🌱",
      badge: "High Purpose",
      salaryRange: "₹3.2L - ₹7L / yr",
      timeToReady: "4 years",
      difficulty: "Moderate to Challenging",
      desc: "Improves crop yield, soil health, and climate resilience through agricultural biotechnology and smart farming.",
      "desc_te": "పంట దిగుబడిని పెంచడం, నేల సారాన్ని రక్షించడం మరియు నూతన వ్యవసాయ పద్ధతులను పరిశోధించే నిపుణులు.",
      targetInterests: ["nature", "science", "helping", "problem-solving"],
      targetSubjects: ["Agriculture", "Biology", "Chemistry"],
      targetEducationLevels: ["Class 11–12 (Science / PCB)", "Diploma / ITI", "College Undergraduate (Non-tech)"],
      typicalWorkstyle: "Hands-on Practical (Physical lab, clinical, or field work)",
      verifiedEducationPathways: [
        "B.Sc (Hons) Agriculture / Horticulture (4 years accredited by ICAR)",
        "B.Tech in Agricultural Engineering (4 years)",
        "Diploma in Agriculture (2–3 years) + Lateral B.Sc entry"
      ],
      eligibilityConditions: "10+2 with Physics, Chemistry, Biology/Mathematics or Agriculture stream.",
      relevantEntranceExams: ["ICAR AIEEA (CUET UG)", "State EAPCET / Agriculture CET"],
      estimatedCostInr: {
        government: "₹10,000 - ₹35,000 / year (State Agri Universities)",
        private: "₹60,000 - ₹1,50,000 / year",
        open: "₹0 (ICAR e-Courseware & Krishi Vigyan Kendra workshops)"
      },
      freeAlternatives: [
        "ICAR Agricultural Education Portal (Free Courseware)",
        "SWAYAM Agronomy and Organic Farming Courses",
        "Kisan Call Centre & Krishi Vigyan Kendra Extension Bulletins"
      ],
      scholarships: [
        "ICAR National Talent Scholarship (₹3,000/month)",
        "Post-Matric Scholarships for Rural Farmers' Children"
      ],
      requiredSkills: [
        { name: "Soil Fertility & Chemistry", level: "Core", priority: 1 },
        { name: "Crop Protection & Pest Management", level: "Core", priority: 1 },
        { name: "Smart Drip Irrigation & Sensors", level: "Essential", priority: 2 }
      ],
      steps: [
        { id: "ag1", title: "Explore Agricultural Systems", time: "Month 1", desc: "Understand regional soil types, seasonal kharif/rabi cycles, and water conservation practices." },
        { id: "ag2", title: "Complete 10+2 PCB Prerequisites", time: "Year 1", desc: "Master biology, organic chemistry, and environmental science basics." },
        { id: "ag3", title: "Enroll in ICAR-Accredited College", time: "Year 2-3", desc: "Undertake laboratory analysis of soil chemistry, agronomy, and crop genetics." },
        { id: "ag4", title: "Rural Agricultural Work Experience (RAWE)", time: "Year 4", desc: "Live with farming communities for hands-on field trials and technology demonstration." }
      ],
      stories: [
        {
          contributor: "Ramesh K.",
          stage: "Agronomist @ Regional Research Station",
          avatar: "🧑‍🌾",
          quote: "Helping local farmers reduce fertilizer costs while doubling yield gave me purpose that no desk job could ever offer.",
          challenge: "Weather uncertainty and pest outbreaks require rapid diagnostic skills.",
          advice: "Spend time in real village fields before writing academic papers."
        }
      ]
    },
    {
      id: "solar_electrician",
      name: "Solar Energy & Electrical Technician",
      "name_te": "సోలార్ మరియు ఎలక్ట్రికల్ టెక్నీషియన్",
      field: "Vocational & Skilled Trades",
      emoji: "☀️",
      badge: "Immediate Job Readiness",
      salaryRange: "₹2.2L - ₹4.5L / yr",
      timeToReady: "3 – 24 months",
      difficulty: "Accessible & Hands-on",
      desc: "Installs, tests, and repairs rooftop solar panels, inverters, storage batteries, and domestic electrical wiring.",
      "desc_te": "సౌర విద్యుత్ ప్యానెల్స్, ఇన్వర్టర్లు మరియు గృహ విద్యుత్ వ్యవస్థలను అమర్చే నిపుణులు.",
      targetInterests: ["building", "problem-solving", "nature", "technology"],
      targetSubjects: ["Physics", "Mathematics"],
      targetEducationLevels: ["Class 9–10", "Diploma / ITI", "Class 11–12 (Science / PCM)"],
      typicalWorkstyle: "Hands-on Practical (Physical lab, clinical, or field work)",
      verifiedEducationPathways: [
        "ITI Certificate in Electrician / Wireman (2 years)",
        "Suryamitra Skill Development Program (Govt subsidized, 3 months)",
        "Polytechnic Diploma in Electrical Engineering (3 years)"
      ],
      eligibilityConditions: "Class 10 pass with Science and Mathematics.",
      relevantEntranceExams: ["State ITI Admissions", "Polytechnic POLYCET / CEET"],
      estimatedCostInr: {
        government: "₹2,000 - ₹10,000 total (Govt ITI)",
        private: "₹25,000 - ₹60,000 total",
        open: "₹0 (Skill India Digital Hub Suryamitra Free Modules)"
      },
      freeAlternatives: [
        "Skill India Digital Hub Solar PV Installer modules",
        "National Institute of Solar Energy (NISE) Free Guidelines",
        "Bharat Skills ITI Electrician Question Bank"
      ],
      scholarships: [
        "PMKVY Free Training and Stipend",
        "State Directorate of Training ITI Stipend"
      ],
      requiredSkills: [
        { name: "Circuit Wiring & Safety Standards", level: "Core", priority: 1 },
        { name: "Solar PV Panel Inverter Connection", level: "Core", priority: 1 },
        { name: "Multimeter & Diagnostic Testing", level: "Core", priority: 1 }
      ],
      steps: [
        { id: "se1", title: "Electrical Safety Foundations", time: "Month 1", desc: "Master earthing, voltage testing, wire gauges, and personal protective equipment standards." },
        { id: "se2", title: "Complete ITI / Suryamitra Course", time: "Month 2-6", desc: "Undergo certified classroom and laboratory practice in solar array mounting and inverter wiring." },
        { id: "se3", title: "Apprenticeship on Live Installations", time: "Month 7-12", desc: "Complete 300 hours of rooftop installation shadowing under a licensed electrical supervisor." }
      ],
      stories: [
        {
          contributor: "Venkat P.",
          stage: "Certified Solar Rooftop Installer",
          avatar: "⚡",
          quote: "Within 6 months of ITI and Suryamitra training, I started getting installation contracts for local farms and homes.",
          challenge: "Working on roofs under hot sun demands physical fitness and strict safety ropes.",
          advice: "Never compromise on earthing and electrical safety standards."
        }
      ]
    },
    {
      id: "medical_nurse",
      name: "Clinical Nurse & Healthcare Specialist",
      "name_te": "నర్సింగ్ మరియు ఆరోగ్య సంరక్షణ నిపుణులు",
      field: "Healthcare",
      emoji: "🩺",
      badge: "High Purpose",
      salaryRange: "₹2.8L - ₹6L / yr",
      timeToReady: "3 – 4 years",
      difficulty: "Challenging & Regulated",
      desc: "Delivers direct clinical care, monitors vitals, administers medications, and assists doctors in hospitals.",
      "desc_te": "రోగులకు చికిత్స, మందులు మరియు వైద్య సేవలను అందించే గౌరవప్రదమైన వృత్తి.",
      targetInterests: ["helping", "science", "problem-solving"],
      targetSubjects: ["Biology", "Chemistry", "Physics"],
      targetEducationLevels: ["Class 11–12 (Science / PCB)", "Diploma / ITI"],
      typicalWorkstyle: "Hands-on Practical (Physical lab, clinical, or field work)",
      verifiedEducationPathways: [
        "B.Sc Nursing (4 years course recognized by Indian Nursing Council)",
        "GNM (General Nursing and Midwifery, 3 years diploma)",
        "ANM (Auxiliary Nurse Midwife, 2 years for rural health posts)"
      ],
      eligibilityConditions: "10+2 with Physics, Chemistry, Biology and English with minimum 45% aggregate.",
      relevantEntranceExams: ["State Nursing Entrance Tests", "Select State NEET Criteria"],
      estimatedCostInr: {
        government: "₹12,000 - ₹40,000 / year (Govt nursing colleges)",
        private: "₹70,000 - ₹1,80,000 / year",
        open: "Not applicable (Regulated mandatory hospital training)"
      },
      freeAlternatives: [
        "WHO Open Clinical Safety Modules",
        "SWAYAM Basics of Health Sciences",
        "St John Ambulance First Aid Digital Certification"
      ],
      scholarships: [
        "Post-Matric Scholarship for Girls in Nursing",
        "Central Sector Scheme of Scholarships for College Students"
      ],
      requiredSkills: [
        { name: "Patient Assessment & Vital Signs", level: "Core", priority: 1 },
        { name: "Medication Dosage & Hygiene Protocols", level: "Core", priority: 1 },
        { name: "Emergency Triage & Patient Empathy", level: "Core", priority: 1 }
      ],
      steps: [
        { id: "mn1", title: "10+2 PCB Biology Mastery", time: "Year 1", desc: "Build thorough knowledge of human anatomy, physiology, and pathology foundations." },
        { id: "mn2", title: "Join Accredited Nursing College", time: "Year 2", desc: "Enroll in an Indian Nursing Council approved institution." },
        { id: "mn3", title: "Hospital Clinical Rotations", time: "Year 3-4", desc: "Complete supervised bedside training in surgery, pediatrics, and emergency care." }
      ],
      stories: [
        {
          contributor: "Sister Mary K.",
          stage: "Staff Nurse @ District Hospital",
          avatar: "🩺",
          quote: "Nursing is a calling of pure empathy. Seeing patients recover because of your attentiveness is deeply rewarding.",
          challenge: "Long night shifts require mental stamina and self-care.",
          advice: "Shadow a hospital ward for a week before deciding."
        }
      ]
    },
    {
      id: "data_analyst",
      name: "Data Analyst & Business Intelligence",
      "name_te": "డేటా అనలిస్ట్ మరియు బిజినెస్ ఇంటెలిజెన్స్",
      field: "Technology & Data",
      emoji: "📊",
      badge: "High Demand",
      salaryRange: "₹3.8L - ₹8L / yr",
      timeToReady: "5 – 9 months",
      difficulty: "Moderate",
      desc: "Analyzes raw numbers and company metrics using SQL, Python, and dashboards to guide strategic decisions.",
      "desc_te": "గణాంకాలు మరియు సమాచారాన్ని విశ్లేషించి వ్యాపార నిర్ణయాలకు తోడ్పడే నిపుణులు.",
      targetInterests: ["problem-solving", "data", "business", "technology"],
      targetSubjects: ["Mathematics", "Computer Science", "Economics"],
      targetEducationLevels: ["Class 11–12 (Commerce / Arts)", "Class 11–12 (Science / PCM)", "College Undergraduate (Non-tech)", "College Undergraduate (Tech/BCA/B.Tech)"],
      typicalWorkstyle: "Deep Focus (Solo analytical / coding focus)",
      verifiedEducationPathways: [
        "B.Sc in Statistics, Mathematics, or Data Science (3 years)",
        "B.Com with Computer Applications or BBA Analytics (3 years)",
        "B.Tech in Computer Science / IT (4 years)",
        "Google Data Analytics Certificate + Portfolio on Kaggle"
      ],
      eligibilityConditions: "10+2 with Mathematics/Statistics preferred.",
      relevantEntranceExams: ["CUET UG", "State University Admissions"],
      estimatedCostInr: {
        government: "₹10,000 - ₹30,000 / year (Govt degree colleges)",
        private: "₹60,000 - ₹1,80,000 / year",
        open: "₹0 - ₹4,000 (Open datasets + free SQL sandboxes)"
      },
      freeAlternatives: [
        "SWAYAM Data Analytics with Python (IIT Roorkee)",
        "Kaggle Free Micro-Courses in Python, Pandas, and SQL",
        "Microsoft Power BI Official Community Training"
      ],
      scholarships: [
        "National Scholarship Portal Merit Schemes",
        "AICTE Scholarships for Technical Degrees"
      ],
      requiredSkills: [
        { name: "Advanced SQL & Database Queries", level: "Core", priority: 1 },
        { name: "Excel Pivot Tables & VLOOKUP", level: "Core", priority: 1 },
        { name: "Power BI or Tableau Dashboards", level: "Core", priority: 2 }
      ],
      steps: [
        { id: "da1", title: "Spreadsheets & Analytics Basics", time: "Month 1", desc: "Master formulas, pivot tables, and charting." },
        { id: "da2", title: "SQL Database Mastery", time: "Month 2-3", desc: "Write complex multi-table queries, subqueries, and window functions." },
        { id: "da3", title: "BI Dashboard Construction", time: "Month 4-5", desc: "Build interactive KPI dashboards in Power BI or Tableau." }
      ],
      stories: [
        {
          contributor: "Karthik R.",
          stage: "Data Analyst @ Logistics Startup",
          avatar: "🧑‍💼",
          quote: "SQL clicked because it's just structured questions asked in plain logical English.",
          challenge: "80% of data work is dealing with messy, misspelled records.",
          advice: "Always answer: 'So what? What action should the company take because of this chart?'"
        }
      ]
    },
    {
      id: "school_teacher",
      name: "High School STEM Teacher",
      "name_te": "పాఠశాల ఉపాధ్యాయులు (STEM)",
      field: "Education",
      emoji: "📚",
      badge: "High Fulfillment",
      salaryRange: "₹3L - ₹6.5L / yr",
      timeToReady: "3 – 5 years",
      difficulty: "Moderate",
      desc: "Educates high school students in Mathematics, Science, and Social Studies, preparing them for higher studies.",
      "desc_te": "పాఠశాల విద్యార్థులకు గణితం మరియు సైన్స్ బోధించే నిపుణులు.",
      targetInterests: ["helping", "communication", "science", "creativity"],
      targetSubjects: ["Mathematics", "Physics", "Chemistry", "Biology"],
      targetEducationLevels: ["College Undergraduate (Non-tech)", "College Undergraduate (Tech/BCA/B.Tech)", "Graduate / Career Pivot"],
      typicalWorkstyle: "Highly Social (Team discussions, presenting, client interaction)",
      verifiedEducationPathways: [
        "B.Sc followed by Bachelor of Education (B.Ed, 2 years)",
        "4-year Integrated B.Sc-B.Ed (ITEP under NEP 2020)",
        "Mandatory Central/State Teacher Eligibility Test (CTET / TET) qualification"
      ],
      eligibilityConditions: "Bachelor's degree with minimum 50% marks + B.Ed from an NCTE-recognized institution.",
      relevantEntranceExams: ["CTET (Central Teacher Eligibility Test)", "State TET / DSC"],
      estimatedCostInr: {
        government: "₹8,000 - ₹25,000 / year (Govt teacher training colleges)",
        private: "₹40,000 - ₹90,000 / year",
        open: "₹0 (NCERT Free Pedagogical Material + DIKSHA platform)"
      },
      freeAlternatives: [
        "DIKSHA National Portal for School Education",
        "NCERT Exemplar and Curriculum Training Modules",
        "SWAYAM Pedagogical Courses for Secondary Teachers"
      ],
      scholarships: [
        "UGC Post-Graduate Merit Scholarships",
        "State Teacher Education Welfare Aid"
      ],
      requiredSkills: [
        { name: "Subject Mastery (Maths/Physics)", level: "Core", priority: 1 },
        { name: "Lesson Planning & Pedagogy", level: "Core", priority: 1 },
        { name: "Classroom Management & Empathy", level: "Core", priority: 1 }
      ],
      steps: [
        { id: "st1", title: "Subject Degree Foundations", time: "Year 1-3", desc: "Complete Bachelor's degree in your chosen subject stream." },
        { id: "st2", title: "Complete B.Ed Program", time: "Year 4-5", desc: "Enroll in an NCTE-approved B.Ed program focusing on child development." },
        { id: "st3", title: "Clear CTET Examination", time: "Final Year", desc: "Prepare for and clear national/state teacher eligibility tests." }
      ],
      stories: [
        {
          contributor: "Sunil V.",
          stage: "High School STEM Teacher",
          avatar: "🧑‍🏫",
          quote: "The joy of watching a student's eyes light up when a tough concept finally makes sense is unmatched.",
          challenge: "Administrative paperwork can be tiring; staying focused on students keeps me energized.",
          advice: "Try teaching one topic to a 10-year-old. If they understand it, you're ready."
        }
      ]
    },
    {
      id: "chartered_accountant",
      name: "Chartered Accountant & Auditor",
      "name_te": "చార్టర్డ్ అకౌంటెంట్ (CA)",
      field: "Business & Finance",
      emoji: "📈",
      badge: "High Prestige",
      salaryRange: "₹7L - ₹15L / yr",
      timeToReady: "4.5 – 5 years",
      difficulty: "Challenging & Rigorous",
      desc: "Audits corporate accounts, manages direct/indirect tax compliance, and advises on corporate financial governance.",
      "desc_te": "పన్నులు, ఆడిటింగ్ మరియు కంపెనీల ఆర్థిక లావాదేవీలను నిర్వహించే ప్రొఫెషనల్.",
      targetInterests: ["data", "business", "problem-solving", "logic"],
      targetSubjects: ["Commerce", "Economics", "Mathematics"],
      targetEducationLevels: ["Class 11–12 (Commerce / Arts)", "Class 11–12 (Science / PCM)", "College Undergraduate (Non-tech)"],
      typicalWorkstyle: "Deep Focus (Solo analytical / coding focus)",
      verifiedEducationPathways: [
        "ICAI Foundation Course (after 10+2) → Intermediate → 2-year Articleship → CA Final",
        "Direct Entry Scheme for Commerce Graduates with 55%+ marks",
        "Concurrent B.Com degree alongside professional ICAI examinations"
      ],
      eligibilityConditions: "10+2 in any stream; registration with Institute of Chartered Accountants of India (ICAI).",
      relevantEntranceExams: ["ICAI CA Foundation Examination"],
      estimatedCostInr: {
        government: "₹35,000 - ₹60,000 total ICAI registration fees over 4 years",
        private: "₹1,00,000 - ₹2,50,000 (Private coaching fees)",
        open: "₹35,000 (ICAI official study material is provided upon registration)"
      },
      freeAlternatives: [
        "ICAI BoS Knowledge Portal (Free Live Lectures & Modules)",
        "SWAYAM Accountancy & Tax Basics",
        "Income Tax Department e-Filing Tutorials"
      ],
      scholarships: [
        "ICAI Need-Based and Merit Scholarships (₹1,500 - ₹2,500/month)",
        "National Overseas and Post-Matric Scholarships"
      ],
      requiredSkills: [
        { name: "Financial Accounting & GST Compliance", level: "Core", priority: 1 },
        { name: "Income Tax Laws & Corporate Auditing", level: "Core", priority: 1 },
        { name: "Analytical Auditing & Excel Modeling", level: "Core", priority: 2 }
      ],
      steps: [
        { id: "ca1", title: "Register for CA Foundation", time: "Month 1-6", desc: "Register with ICAI after 10+2 and prepare accounting, law, and quantitative aptitude." },
        { id: "ca2", title: "Clear CA Intermediate", time: "Year 2", desc: "Clear both groups covering taxation, cost accounting, and corporate laws." },
        { id: "ca3", title: "Complete Practical Articleship", time: "Year 3-4", desc: "Work for 2 years under a practicing CA firm on live client audits." },
        { id: "ca4", title: "Pass CA Final", time: "Year 5", desc: "Clear advanced financial reporting and obtain ICAI chartered membership." }
      ],
      stories: [
        {
          contributor: "Deepak G.",
          stage: "Practicing Chartered Accountant",
          avatar: "💼",
          quote: "The rigor of CA exams taught me mental discipline that serves me in every business crisis.",
          challenge: "Balancing articleship client visits with late-night studies required extreme focus.",
          advice: "Master the ICAI study modules thoroughly before touching external guidebooks."
        }
      ]
    },
    {
      id: "civil_engineer",
      name: "Civil & Infrastructure Engineer",
      "name_te": "సివిల్ మరియు ఇన్‌ఫ్రాస్ట్రక్చర్ ఇంజనీర్",
      field: "Engineering",
      emoji: "🏗️",
      badge: "Core Engineering",
      salaryRange: "₹3.2L - ₹7L / yr",
      timeToReady: "3 – 4 years",
      difficulty: "Moderate",
      desc: "Plans, designs, and oversees construction of roads, bridges, irrigation canals, and sustainable buildings.",
      "desc_te": "వంతెనలు, రోడ్లు, భవనాలు మరియు నీటిపారుదల ప్రాజెక్టులను నిర్మించే ఇంజనీర్లు.",
      targetInterests: ["building", "problem-solving", "nature", "science"],
      targetSubjects: ["Physics", "Mathematics", "Chemistry"],
      targetEducationLevels: ["Class 11–12 (Science / PCM)", "Diploma / ITI"],
      typicalWorkstyle: "Hands-on Practical (Physical lab, clinical, or field work)",
      verifiedEducationPathways: [
        "B.Tech / B.E. in Civil Engineering (4 years)",
        "Polytechnic Diploma in Civil Engineering (3 years) + Lateral Entry B.Tech"
      ],
      eligibilityConditions: "10+2 with Physics, Chemistry, and Mathematics (PCM).",
      relevantEntranceExams: ["JEE Main", "State EAPCET / CET", "GATE (for PSU / Masters)"],
      estimatedCostInr: {
        government: "₹20,000 - ₹50,000 / year (Govt engineering colleges)",
        private: "₹70,000 - ₹2,00,000 / year",
        open: "₹0 (NPTEL Civil Engineering courses by IIT Bombay/Madras)"
      },
      freeAlternatives: [
        "NPTEL Structural Analysis & Surveying by IIT Roorkee",
        "AutoCAD Student Community Free License",
        "BIS (Bureau of Indian Standards) Construction Code Summaries"
      ],
      scholarships: [
        "AICTE Tuition Fee Waiver (TFW) Scheme",
        "State Post-Matric Engineering Fee Reimbursement"
      ],
      requiredSkills: [
        { name: "Structural Analysis & RCC Design", level: "Core", priority: 1 },
        { name: "AutoCAD & 2D/3D Drafting", level: "Core", priority: 1 },
        { name: "Site Safety & Construction Management", level: "Essential", priority: 2 }
      ],
      steps: [
        { id: "ce1", title: "10+2 PCM Engineering Foundations", time: "Year 1", desc: "Master mechanics, calculus, and engineering drawing basics." },
        { id: "ce2", title: "Join Accredited Engineering College", time: "Year 2-3", desc: "Perform soil mechanics, fluid dynamics, and surveying lab experiments." },
        { id: "ce3", title: "On-Site Construction Internship", time: "Year 4", desc: "Gain hands-on supervision experience on an active infrastructure site." }
      ],
      stories: [
        {
          contributor: "K. Mohan",
          stage: "Assistant Executive Engineer",
          avatar: "👷",
          quote: "Constructing a drinking water pipeline for 15 villages is an achievement that stands for decades.",
          challenge: "Weather delays and contract quality management require firm on-site leadership.",
          advice: "Learn how to read site blueprints and estimate material quantities accurately."
        }
      ]
    },
    {
      id: "microfinance_officer",
      name: "Rural Banking & Microfinance Officer",
      "name_te": "గ్రామీణ బ్యాంకింగ్ మరియు మైక్రోఫైనాన్స్ ఆఫీసర్",
      field: "Business & Banking",
      emoji: "🏦",
      badge: "High Social Impact",
      salaryRange: "₹3.5L - ₹6.5L / yr",
      timeToReady: "3 years",
      difficulty: "Accessible to Moderate",
      desc: "Facilitates agricultural credit, Self-Help Group (SHG) micro-loans, and financial literacy in rural communities.",
      "desc_te": "గ్రామీణ స్వయం సహాయక సంఘాలు మరియు రైతులకు బ్యాంకింగ్ రుణాలు మరియు ఆర్థిక సేవలను అందించే వృత్తి.",
      targetInterests: ["helping", "business", "data", "communication"],
      targetSubjects: ["Commerce", "Economics", "Social Studies"],
      targetEducationLevels: ["Class 11–12 (Commerce / Arts)", "College Undergraduate (Non-tech)", "College Undergraduate (Tech/BCA/B.Tech)"],
      typicalWorkstyle: "Highly Social (Team discussions, presenting, client interaction)",
      verifiedEducationPathways: [
        "Bachelor's degree in any discipline (B.Com, B.A., BBA, B.Sc)",
        "Institute of Banking Personnel Selection (IBPS) RRB Exam qualification",
        "Diploma in Rural Development / Microfinance"
      ],
      eligibilityConditions: "Bachelor's degree from any recognized university; proficiency in local state language (e.g. Telugu).",
      relevantEntranceExams: ["IBPS RRB (Regional Rural Banks) Scale I & Office Assistant"],
      estimatedCostInr: {
        government: "₹6,000 - ₹20,000 / year (Govt degree colleges)",
        private: "₹30,000 - ₹80,000 / year",
        open: "₹0 (RBI Financial Literacy material + IBPS syllabus online)"
      },
      freeAlternatives: [
        "Reserve Bank of India (RBI) Financial Education Guides",
        "NABARD Microfinance and SHG Bank Linkage Publications",
        "SWAYAM Rural Development Courses"
      ],
      scholarships: [
        "State Post-Matric Scholarships",
        "National Scholarship Portal Merit-cum-Means"
      ],
      requiredSkills: [
        { name: "Local Language Communication (Telugu/Hindi)", level: "Core", priority: 1 },
        { name: "Basic Accounting & Credit Appraisal", level: "Core", priority: 1 },
        { name: "SHG & Microfinance Principles", level: "Essential", priority: 2 }
      ],
      steps: [
        { id: "rb1", title: "Complete Bachelor's Degree", time: "Year 1-3", desc: "Build strong communication and numerical aptitude." },
        { id: "rb2", title: "Prepare for IBPS RRB Examination", time: "6 Months", desc: "Practice quantitative aptitude, reasoning, and banking awareness." },
        { id: "rb3", title: "Join Regional Rural Bank", time: "Year 4+", desc: "Work closely with village panchayats and farmer producer organizations." }
      ],
      stories: [
        {
          contributor: "Lakshmi T.",
          stage: "Branch Manager @ Andhra Pragathi Grameena Bank",
          avatar: "👩‍💼",
          quote: "Sanctioning a ₹50,000 micro-loan to a women's dairy group transforms entire families permanently.",
          challenge: "Educating rural borrowers against predatory local moneylenders takes patience.",
          advice: "Fluency in your regional language and genuine respect for rural culture are your greatest strengths."
        }
      ]
    }
  ],

  // Hands-on projects library
  projects: [
    {
      id: "p1",
      careerId: "software",
      title: "Markdown Student Notes & Task Manager",
      level: "Beginner",
      effortHours: "8 - 12 hours",
      type: "Portfolio Project",
      objective: "Build a responsive web application that lets students write formatted notes in Markdown and track daily tasks with local storage persistence.",
      skills: ["HTML5", "CSS3 Flex/Grid", "JavaScript DOM", "LocalStorage API"],
      deliverable: "Live web application with clean mobile responsiveness and zero console errors.",
      definitionOfDone: [
        "User can create, edit, and delete notes with live markdown preview",
        "Tasks can be checked complete and filter by 'All', 'Active', 'Completed'",
        "All data persists across page refreshes in browser localStorage"
      ]
    },
    {
      id: "p2",
      careerId: "design",
      title: "Local Bus Transit App Redesign for Rural Commuters",
      level: "Beginner",
      effortHours: "10 - 14 hours",
      type: "Case Study",
      objective: "Identify usability and color contrast issues in a complex local transit app, interview 3 commuters, and produce an accessible Figma mobile redesign.",
      skills: ["Figma Components", "WCAG Contrast Checking", "User Interviews", "Usability Heuristics"],
      deliverable: "Interactive Figma prototype link and a 4-slide case study documenting improvements.",
      definitionOfDone: [
        "Audit table listing 5 specific usability heuristic violations with screenshots",
        "Color palette tested to meet minimum 4.5:1 AA contrast ratio for all text",
        "Clickable prototype allowing a user to search routes and view bus timings"
      ]
    },
    {
      id: "p3",
      careerId: "agri_scientist",
      title: "Village Soil Quality & Water pH Testing Logbook",
      level: "Beginner",
      effortHours: "6 - 10 hours",
      type: "Field Experiment",
      objective: "Collect 5 soil and water samples across local farming plots, test pH and electrical conductivity, and document crop recommendations.",
      skills: ["Soil Chemistry", "Field Data Collection", "Crop Nutrition"],
      deliverable: "A 2-page soil quality advisory report with crop recommendations for local farmers.",
      definitionOfDone: [
        "Recorded pH readings for 5 distinct agricultural sample plots",
        "Documented primary crop types grown and nutrient deficiencies observed",
        "Recommended appropriate organic soil conditioners (gypsum, lime, compost)"
      ]
    },
    {
      id: "p4",
      careerId: "solar_electrician",
      title: "1kW Off-Grid Rooftop Solar Load Calculation Plan",
      level: "Beginner",
      effortHours: "8 - 12 hours",
      type: "Practical Schematic",
      objective: "Calculate the daily electrical load for a typical 2-room rural home, size the solar PV array, battery capacity, and inverter wattage.",
      skills: ["Circuit Wiring", "Solar PV Sizing", "Load Calculation"],
      deliverable: "A complete single-line wiring schematic and equipment bill-of-materials.",
      definitionOfDone: [
        "Accurate daily watt-hour total for 3 LED bulbs, 2 fans, and mobile charging",
        "Calculated solar panel wattage with 20% system loss buffer",
        "Battery bank amp-hour sizing for 1 full day of cloudy autonomy"
      ]
    },
    {
      id: "p5",
      careerId: "data_analyst",
      title: "Public School Education Metrics Analysis",
      level: "Beginner",
      effortHours: "8 - 12 hours",
      type: "Data Report",
      objective: "Clean and analyze a public education or literacy dataset in Excel/SQL to identify regional disparities and create 3 executive charts.",
      skills: ["SQL Aggregations", "Data Cleaning", "Pivot Tables", "Chart Design"],
      deliverable: "Interactive dashboard file (Excel/Sheets/Power BI) and a 1-page summary.",
      definitionOfDone: [
        "Dataset cleaned of null entries, duplicate records, and inconsistent headers",
        "Calculated metrics: regional median and gender literacy ratios",
        "3 charts with clear titles, highlighted key takeaways, and labeled axes"
      ]
    }
  ],

  // Verified Official Educational Resources
  resources: [
    {
      id: "res_ncs",
      title: "National Career Service (NCS) Portal",
      category: "Career Information & Counseling",
      relevance: "All Careers, Vocational Guidance, Apprenticeships",
      description: "Government of India initiative providing career counseling, job matching, vocational guidance, and skill training center directories across all Indian districts.",
      official_url: "https://www.ncs.gov.in/",
      is_free: true,
      cost_detail: "100% Free Government Service",
      languages: ["English", "Hindi", "Telugu", "Regional Languages"],
      verification_status: "Verified Official Government Portal",
      last_checked: "October 2026",
      authority: "Ministry of Labour and Employment, Govt of India"
    },
    {
      id: "res_swayam",
      title: "SWAYAM — Free Online Courses by IITs & Central Universities",
      category: "Higher Education & Certification",
      relevance: "Technology, Engineering, Sciences, Humanities, Management",
      description: "National platform providing university-level courses designed by IITs, IIMs, IISc, and central universities. Video lectures, reading material, self-assessment tests, and optional proctored exams for academic credits.",
      official_url: "https://swayam.gov.in/",
      is_free: true,
      cost_detail: "Free learning; nominal ₹1,000 fee only if optional certificate exam is taken",
      languages: ["English", "Hindi", "Select Regional Subtitles"],
      verification_status: "Verified Official Central Platform",
      last_checked: "October 2026",
      authority: "Ministry of Education (MoE), Govt of India"
    },
    {
      id: "res_skill_india",
      title: "Skill India Digital Hub (SIDH)",
      category: "Vocational Training & Skill Development",
      relevance: "Vocational, ITI, Solar/Electrician, Healthcare Assistant, Agriculture",
      description: "Unified platform for skill development, NSQF-aligned modular courses, apprenticeships, PMKVY certifications, and digital skill badging for Indian youth.",
      official_url: "https://www.skillindiadigital.gov.in/",
      is_free: true,
      cost_detail: "Free courses and subsidized government certification",
      languages: ["English", "Telugu", "Hindi", "Multiple Indian Languages"],
      verification_status: "Verified Official National Portal",
      last_checked: "October 2026",
      authority: "Ministry of Skill Development & Entrepreneurship (MSDE)"
    },
    {
      id: "res_ncert",
      title: "NCERT Digital Textbooks & Exemplars",
      category: "School & Foundational Learning",
      relevance: "Classes 9 to 12, Science, Mathematics, Commerce, Humanities",
      description: "Official curriculum textbooks, laboratory manuals, and problem exemplars for school and competitive exam foundations (JEE, NEET, CUET).",
      official_url: "https://ncert.nic.in/",
      is_free: true,
      cost_detail: "100% Free PDF Downloads",
      languages: ["English", "Hindi", "Urdu"],
      verification_status: "Verified Official Curriculum Body",
      last_checked: "October 2026",
      authority: "National Council of Educational Research and Training"
    },
    {
      id: "res_nsp",
      title: "National Scholarship Portal (NSP)",
      category: "Financial Aid & Scholarships",
      relevance: "School, Intermediate, College, Post-Matric, Pre-Matric, Merit Schemes",
      description: "One-stop digital platform for central and state government scholarships for SC, ST, OBC, minority, and economically weaker section students across India.",
      official_url: "https://scholarships.gov.in/",
      is_free: true,
      cost_detail: "100% Free Application Portal for Direct Benefit Transfer (DBT)",
      languages: ["English", "Hindi"],
      verification_status: "Verified Central Government Portal",
      last_checked: "October 2026",
      authority: "National Informatics Centre (NIC) & Govt of India"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PATHSETU_DATA;
}
