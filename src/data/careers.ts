import { Career } from '../types';

export const CAREERS: Career[] = [
  {
    id: "software_dev",
    name: "Software Developer",
    name_te: "సాఫ్ట్‌వేర్ డెవలపర్",
    category: "Technology & Engineering",
    emoji: "💻",
    badge: "High Demand",
    desc: "Architects, builds, tests, and maintains applications, web services, and digital software solutions.",
    desc_te: "అప్లికేషన్లు, వెబ్‌సైట్లు మరియు సాఫ్ట్‌వేర్ ఉత్పత్తులను కోడింగ్ ద్వారా నిర్మించి నిర్వహించే సాంకేతిక నిపుణులు.",
    target_interests: ["technology", "problem-solving", "building", "logic", "coding"],
    target_subjects: ["Computer Science", "Mathematics", "Physics", "English"],
    target_education_levels: [
      "Class 11–12 (Science / PCM)",
      "Polytechnic Diploma",
      "Undergraduate (BCA / B.Tech / B.Sc CS)",
      "Career Switcher / Graduate"
    ],
    typical_workstyle: "Deep Focus (Solo analytical / coding focus)",
    verified_education_pathways: [
      "B.Tech / B.E. in Computer Science or Information Technology (4 years)",
      "BCA (Bachelor of Computer Applications, 3 years) followed by MCA or direct entry",
      "Polytechnic Diploma in Computer Engineering (3 years) + Lateral B.Tech entry",
      "Self-directed portfolio learning via FreeCodeCamp, Odin Project, and SWAYAM CS"
    ],
    eligibility_conditions: "10+2 with Mathematics/Physics for engineering degree; direct admission in BCA/B.Sc CS across state colleges.",
    relevant_entrance_exams: ["JEE Main", "State EAPCET / CET", "CUET UG"],
    estimated_education_cost_inr: {
      government_route: "₹15,000 - ₹55,000 / year (Govt Engineering / BCA)",
      private_route: "₹85,000 - ₹2,50,000 / year (Private Engineering)",
      self_taught_open_route: "₹0 - ₹5,000 (Internet + optional certification fees)",
      annual_min_govt: 15000,
      annual_max_govt: 55000,
      annual_min_pvt: 85000,
      annual_max_pvt: 250000
    },
    free_learning_alternatives: [
      "SWAYAM / NPTEL Computer Science courses by IIT Madras",
      "FreeCodeCamp Responsive Web & JavaScript Foundations",
      "CS50 Introduction to Computer Science (Harvard OpenCourseWare)"
    ],
    scholarship_opportunities: [
      "National Scholarship Portal (NSP) Post-Matric Schemes",
      "AICTE Pragati Scholarship for Girl Students (₹50,000/yr)",
      "State Government Fee Reimbursement schemes (e.g. JVD in AP/TS)"
    ],
    entry_salary_range_inr: "₹3.5L - ₹9L / year (Entry-level India)",
    study_duration: "3 to 4 years (degree) or 6–12 months (intensive portfolio)",
    required_skills: [
      { name: "JavaScript or Python", level: "Core", priority: 1 },
      { name: "Data Structures & Algorithms", level: "Core", priority: 2 },
      { name: "Git & Version Control", level: "Essential", priority: 1 },
      { name: "SQL & Relational Databases", level: "Essential", priority: 2 },
      { name: "Web Fundamentals (HTML/CSS)", level: "Core", priority: 1 }
    ],
    starter_projects: [
      "Student Task & Attendance Tracker with Local Storage",
      "Weather & Crop Commodity Price Web App with Free REST API"
    ],
    roadmap_milestones: [
      { id: "sw_1", title: "Terminal & Version Control Basics", time: "Week 1–2", desc: "Master Linux/Mac/PowerShell command line, Git init, commit, branching, and pushing to GitHub repositories." },
      { id: "sw_2", title: "Core Programming Foundations", time: "Month 1–2", desc: "Understand variables, conditionals, loops, functions, and data structures (arrays, dictionaries, maps)." },
      { id: "sw_3", title: "Interactive Web Development", time: "Month 3–4", desc: "Build responsive, accessible user interfaces using semantic HTML5, CSS Grid/Flexbox, and JavaScript DOM manipulation." },
      { id: "sw_4", title: "Backend & Database APIs", time: "Month 5", desc: "Create RESTful API endpoints with Node.js/Python, connect to PostgreSQL/SQLite, and implement user authentication." },
      { id: "sw_5", title: "Full-Stack Portfolio Project", time: "Month 6", desc: "Deploy a full-stack CRUD application to Netlify/Render with continuous integration and documentation." },
      { id: "sw_6", title: "Internship Prep & Open Source", time: "Month 7+", desc: "Contribute bugfixes to an open-source project, practice interview problems on free portals, and prepare your tech CV." }
    ],
    official_reference_links: [
      { title: "National Career Service — Software Developer Profile", url: "https://www.ncs.gov.in/" },
      { title: "SWAYAM Computer Science Catalogue", url: "https://swayam.gov.in/" }
    ],
    role_summary: "As a Software Developer, you build digital bridges that connect people to essential services, agriculture data, banking, and education. You write clean, testable code, design intuitive software features, and collaborate across teams.",
    key_responsibilities: [
      "Write clean, modular, and maintainable code in JavaScript, Python, or Java.",
      "Design and consume REST APIs and connect client applications to database storage.",
      "Troubleshoot bugs, write automated tests, and optimize performance.",
      "Collaborate with designers, project leads, and users in iterative sprint cycles."
    ],
    ideal_dna: {
      mindset: "Curious, Problem-Solving & Growth-Oriented",
      vibe: "Tenacious, Patient & Analytical",
      standard: "High Code Quality & Clean Architecture"
    },
    industry_growth: "22% Annually",
    open_roles_india: "180k+ Entry & Mid Roles"
  },
  {
    id: "ui_ux_designer",
    name: "UI/UX & Product Designer",
    name_te: "యూఐ/యూఎక్స్ మరియు ప్రోడక్ట్ డిజైనర్",
    category: "Design & Creative Media",
    emoji: "🎨",
    badge: "Creative Tech",
    desc: "Researches user needs, designs intuitive digital interfaces, and creates seamless experiences across web and mobile.",
    desc_te: "వినియోగదారుల అవసరాలను అర్థం చేసుకుని, సులభంగా వాడదగిన అందమైన మొబైల్ మరియు వెబ్ డిజైన్లను రూపొందిస్తారు.",
    target_interests: ["creativity", "visual arts", "empathy", "technology", "psychology"],
    target_subjects: ["English", "Arts / Humanities", "Computer Science", "Psychology"],
    target_education_levels: [
      "Class 11–12 (Any stream)",
      "Polytechnic Diploma",
      "Undergraduate (B.Des / B.Sc / BA / BCA)",
      "Self-taught Portfolio"
    ],
    typical_workstyle: "Creative & Visual (Design / media)",
    verified_education_pathways: [
      "B.Des (Bachelor of Design) from NID, IIT-IDC, or State Universities (4 years)",
      "B.Sc / BA in Multimedia, Visual Communication, or Animation (3 years)",
      "Self-directed portfolio learning via Figma, Google UX Certificate, and SWAYAM Design tracks"
    ],
    eligibility_conditions: "10+2 from any recognized board. Design degrees usually require aptitude tests (UCEED, NID DAT, CEED).",
    relevant_entrance_exams: ["UCEED (IITs)", "NID DAT", "CUET UG (Design tracks)"],
    estimated_education_cost_inr: {
      government_route: "₹25,000 - ₹75,000 / year (State Universities / Govt Arts)",
      private_route: "₹1,20,000 - ₹3,50,000 / year (Private Design Institutes)",
      self_taught_open_route: "₹0 - ₹4,000 (Free Figma tier + open-source design tools)",
      annual_min_govt: 25000,
      annual_max_govt: 75000,
      annual_min_pvt: 120000,
      annual_max_pvt: 350000
    },
    free_learning_alternatives: [
      "SWAYAM / NPTEL Design Fundamentals by IIT Bombay",
      "Figma Community Free Design Systems and Tutorials",
      "Coursera Financial Aid for Google UX Design Professional Certificate"
    ],
    scholarship_opportunities: [
      "National Overseas / National Scholarship Portal (NSP)",
      "State Merit-cum-Means Scholarships for Creative Disciplines"
    ],
    entry_salary_range_inr: "₹3.2L - ₹7.5L / year (Entry-level India)",
    study_duration: "3 to 4 years (degree) or 4–8 months (intensive portfolio)",
    required_skills: [
      { name: "Figma & Wireframing", level: "Core", priority: 1 },
      { name: "User Research & Empathy", level: "Core", priority: 1 },
      { name: "Information Architecture", level: "Essential", priority: 2 },
      { name: "Visual Hierarchy & Typography", level: "Essential", priority: 2 },
      { name: "Prototyping & Usability Testing", level: "Core", priority: 3 }
    ],
    starter_projects: [
      "Redesign of a Rural Banking or Ration Card Portal for Easy Mobile Use",
      "Community Bus Pass Booking Mobile App Prototype in Figma"
    ],
    roadmap_milestones: [
      { id: "ux_1", title: "Design Principles & Typography", time: "Week 1–3", desc: "Learn color theory, visual hierarchy, grid systems, readability standards, and spacing rules." },
      { id: "ux_2", title: "Mastering Figma Tools", time: "Month 1–2", desc: "Learn vector tools, auto-layout, design tokens, component variants, and interactive prototyping." },
      { id: "ux_3", title: "User Research & Empathy Mapping", time: "Month 3", desc: "Conduct qualitative student/user interviews, construct user personas, and map user journey flows." },
      { id: "ux_4", title: "Wireframing to High-Fidelity UI", time: "Month 4", desc: "Create low-fidelity wireframes, test information flow, and translate into polished high-fidelity mobile mockups." },
      { id: "ux_5", title: "Build First Case Study Portfolio", time: "Month 5", desc: "Write an in-depth case study detailing problem statement, user discovery, design iterations, and outcome." },
      { id: "ux_6", title: "Design Critiques & Portfolio Launch", time: "Month 6+", desc: "Publish case study to Behance/Notion, seek critique from experienced designers, and apply to junior roles." }
    ],
    official_reference_links: [
      { title: "National Career Service — Graphic & UI Designer Profile", url: "https://www.ncs.gov.in/" },
      { title: "National Institute of Design (NID)", url: "https://www.nid.edu/" }
    ],
    role_summary: "As a UI/UX Designer, you advocate for everyday users. You transform clunky, frustrating systems into clear, intuitive screens that anyone—regardless of digital literacy—can comfortably navigate.",
    key_responsibilities: [
      "Conduct user interviews and observe real behavioral obstacles.",
      "Design wireframes, journey maps, and high-fidelity interactive prototypes in Figma.",
      "Maintain design systems with reusable typography, color tokens, and components.",
      "Conduct usability tests and iterate designs based on feedback."
    ],
    ideal_dna: {
      mindset: "Empathetic, Observant & Iterative",
      vibe: "Creative, Human-Centered & Collaborative",
      standard: "Uncompromising Usability & Accessibility"
    },
    industry_growth: "18% Annually",
    open_roles_india: "65k+ Open Roles"
  },
  {
    id: "agri_scientist",
    name: "Agricultural Scientist & Agronomist",
    name_te: "వ్యవసాయ శాస్త్రవేత్త మరియు ఆగ్రోనమిస్ట్",
    category: "Agriculture & Rural Sciences",
    emoji: "🌾",
    badge: "Vital Impact",
    desc: "Researches crop genetics, soil health, sustainable farming practices, and climate resilience to boost farmer incomes.",
    desc_te: "నేల ఆరోగ్యం, నాణ్యమైన విత్తనాలు, మరియు స్థిరమైన వ్యవసాయ పద్ధతులపై పరిశోధన చేసి రైతుల దిగుబడులను పెంచుతారు.",
    target_interests: ["agriculture", "nature", "science", "rural development", "sustainability"],
    target_subjects: ["Biology", "Chemistry", "Agriculture Science", "Environmental Studies"],
    target_education_levels: [
      "Class 11–12 (Science / BiPC / PCB)",
      "Polytechnic Agriculture Diploma",
      "Undergraduate (B.Sc Agriculture)"
    ],
    typical_workstyle: "Field & Practical (Hands-on outdoor)",
    verified_education_pathways: [
      "B.Sc (Hons) Agriculture from ICAR-accredited State Agricultural University (4 years)",
      "Diploma in Agriculture (2 years) followed by lateral entry into B.Sc Agriculture",
      "M.Sc in Agronomy / Genetics / Soil Science for research positions"
    ],
    eligibility_conditions: "10+2 with Physics, Chemistry, and Biology (BiPC/PCB) or Agriculture subject with minimum 50% marks.",
    relevant_entrance_exams: ["ICAR AIEEA (CUET UG)", "State EAMCET / EAPCET (Agri Stream)"],
    estimated_education_cost_inr: {
      government_route: "₹8,000 - ₹35,000 / year (Govt Agricultural Universities)",
      private_route: "₹60,000 - ₹1,80,000 / year (Private Universities)",
      self_taught_open_route: "₹0 (ICAR / KVK farmer open field resources)",
      annual_min_govt: 8000,
      annual_max_govt: 35000,
      annual_min_pvt: 60000,
      annual_max_pvt: 180000
    },
    free_learning_alternatives: [
      "ICAR Krishi Vigyan Kendra (KVK) Field Training Programs",
      "SWAYAM Agronomy and Organic Farming courses by TNAU / PJTSAU",
      "e-Krishi Shiksha Public Learning Modules"
    ],
    scholarship_opportunities: [
      "ICAR National Talent Scholarship (NTS) (₹3,000/month)",
      "Post-Matric National Scholarship Schemes for Rural Youth",
      "State Agriculture Fee Reimbursement"
    ],
    entry_salary_range_inr: "₹3.0L - ₹6.5L / year (Govt Extension, Agri-Tech, Seed R&D)",
    study_duration: "4 years (B.Sc Agriculture degree)",
    required_skills: [
      { name: "Soil Health & Nutrient Diagnostics", level: "Core", priority: 1 },
      { name: "Crop Disease Identification", level: "Core", priority: 1 },
      { name: "Precision Irrigation & Water Management", level: "Essential", priority: 2 },
      { name: "Organic & Sustainable Crop Protocols", level: "Essential", priority: 2 },
      { name: "Agricultural Data Interpretation", level: "Advanced", priority: 3 }
    ],
    starter_projects: [
      "Local Village Soil Nitrogen-Phosphorus-Potassium (NPK) Testing Log",
      "Drip Irrigation Water Savings Calculation Model for Smallholder Farmers"
    ],
    roadmap_milestones: [
      { id: "ag_1", title: "Agri Botany & Soil Physics Foundations", time: "Year 1", desc: "Understand crop morphology, plant anatomy, soil physical properties, and meteorology." },
      { id: "ag_2", title: "Agronomy & Weed Management", time: "Year 2", desc: "Study field crop production, crop rotation economics, weed control biology, and fertilizer calculation." },
      { id: "ag_3", title: "Entomology & Plant Pathology", time: "Year 3", desc: "Diagnose viral, fungal, and insect pests, and learn Integrated Pest Management (IPM) protocols." },
      { id: "ag_4", title: "Rural Agricultural Work Experience (RAWE)", time: "Year 4 (Sem 1)", desc: "Live with rural farming families for 6 months, conduct field demonstrations, and solve real soil challenges." },
      { id: "ag_5", title: "Agro-Industrial Attachment", time: "Year 4 (Sem 2)", desc: "Work with seed processing mills, fertilizer testing labs, or agri-fintech cooperatives." },
      { id: "ag_6", title: "ICAR JRF or Agri-Banking Entry", time: "Graduation", desc: "Appear for Agricultural Field Officer (IBPS AFO) or ICAR JRF for higher research fellowships." }
    ],
    official_reference_links: [
      { title: "Indian Council of Agricultural Research (ICAR)", url: "https://icar.org.in/" },
      { title: "National Career Service — Agronomist Profile", url: "https://www.ncs.gov.in/" }
    ],
    role_summary: "As an Agricultural Scientist, you work at the intersection of biology, economics, and ground reality. You analyze soil chemistry, develop pest-resistant crops, and help farmers maximize yields while conserving water.",
    key_responsibilities: [
      "Analyze soil chemical composition and prescribe balanced N-P-K nutrient schedules.",
      "Advise farming communities on drought-tolerant and high-yield crop varieties.",
      "Conduct field trial experiments to validate organic and biological pest controls.",
      "Interpret agricultural sensor data to optimize drip irrigation schedules."
    ],
    ideal_dna: {
      mindset: "Nature-Rooted, Scientific & Pragmatic",
      vibe: "Grounded, Community-Centered & Patient",
      standard: "Rigorous Field Validation & Farmer Welfare"
    },
    industry_growth: "14% Annually",
    open_roles_india: "45k+ (Public Extension, Agri-Tech, Banking)"
  },
  {
    id: "solar_electrician",
    name: "Solar Energy & Electrical Technician",
    name_te: "సోలార్ ఎనర్జీ మరియు ఎలక్ట్రికల్ టెక్నీషియన్",
    category: "Clean Energy & Technical Trades",
    emoji: "☀️",
    badge: "Green Job",
    desc: "Installs, tests, commissions, and maintains photovoltaic (PV) solar panels, inverters, and battery storage systems.",
    desc_te: "సౌర విద్యుత్ పలకలు (సోలార్ ప్యానెల్స్), ఇన్వర్టర్లు మరియు బ్యాటరీ వ్యవస్థలను అమర్చి నిర్వహించే సాంకేతిక నిపుణులు.",
    target_interests: ["renewable energy", "electrical systems", "tools", "hands-on fixing", "sustainability"],
    target_subjects: ["Physics", "Mathematics", "Vocational Electricity"],
    target_education_levels: [
      "Class 10 Pass",
      "ITI (Electrician / Wireman / Solar Technician)",
      "Polytechnic Diploma in Electrical Engineering (EEE)"
    ],
    typical_workstyle: "Field & Practical (Hands-on outdoor)",
    verified_education_pathways: [
      "ITI Solar Technician (Electrical) (1 to 2 years, NCVT certified)",
      "Polytechnic Diploma in Electrical & Electronics Engineering (EEE) (3 years)",
      "Skill India Suryamitra Certification (3-month government subsidized training)"
    ],
    eligibility_conditions: "Class 10th pass for ITI and Suryamitra schemes; 10th with Science/Math for Polytechnic Diploma entrance.",
    relevant_entrance_exams: ["State ITI Merit Admission", "State Polytechnic Entrance (POLYCET)"],
    estimated_education_cost_inr: {
      government_route: "₹2,500 - ₹12,000 / year (Govt ITI / Polytechnic)",
      private_route: "₹25,000 - ₹65,000 / year (Private ITI)",
      self_taught_open_route: "₹0 (Skill India Suryamitra 100% free with stipend)",
      annual_min_govt: 2500,
      annual_max_govt: 12000,
      annual_min_pvt: 25000,
      annual_max_pvt: 65000
    },
    free_learning_alternatives: [
      "National Institute of Solar Energy (NISE) Suryamitra Program",
      "Skill India Digital Hub Solar Technician Course Modules",
      "NPTEL Non-Conventional Energy Resources by IIT Kharagpur"
    ],
    scholarship_opportunities: [
      "Ministry of New & Renewable Energy (MNRE) Suryamitra Stipends",
      "State Post-Matric ITI Scholarships for Backward Classes"
    ],
    entry_salary_range_inr: "₹2.4L - ₹4.8L / year (Technician / Site Supervisor)",
    study_duration: "3 months (Suryamitra) to 2 years (ITI) or 3 years (Diploma)",
    required_skills: [
      { name: "PV Panel Array Sizing & Wiring", level: "Core", priority: 1 },
      { name: "Multimeter & Electrical Diagnostics", level: "Core", priority: 1 },
      { name: "Inverter & Grid Synchronisation", level: "Essential", priority: 2 },
      { name: "Safety Protocols & Earthing Standards", level: "Core", priority: 1 },
      { name: "Battery Energy Storage Maintenance", level: "Essential", priority: 2 }
    ],
    starter_projects: [
      "Rooftop Solar Load Sizing Calculator for a 2-BHK Village Household",
      "12V DC Solar Mobile Charging Station with Charge Controller"
    ],
    roadmap_milestones: [
      { id: "se_1", title: "Electrical Safety & AC/DC Fundamentals", time: "Month 1", desc: "Learn Ohm's law, AC vs DC circuits, wire gauging, insulation resistance, and earthing safety." },
      { id: "se_2", title: "PV Panel Mechanics & Tilt Angles", time: "Month 2", desc: "Calculate solar irradiance, azimuth angle, optimal tilt angle based on latitude, and shadow losses." },
      { id: "se_3", title: "Inverters & Battery Chemistry", time: "Month 3", desc: "Study string inverters, microinverters, hybrid systems, and lithium-ion vs tubular lead-acid batteries." },
      { id: "se_4", title: "Hands-On Rooftop Installation", time: "Month 4–5", desc: "Participate in real rooftop mounting, structure anchoring, waterproofing, and cable routing." },
      { id: "se_5", title: "Net Metering & Discom Approvals", time: "Month 6", desc: "Understand bi-directional meters, DISCOM safety regulations, and government subsidy submission processes." },
      { id: "se_6", title: "Independent Contractor or O&M Role", time: "Month 7+", desc: "Join an authorized solar EPC firm or start independent residential solar installation services." }
    ],
    official_reference_links: [
      { title: "National Institute of Solar Energy (NISE) — Suryamitra", url: "https://nise.res.in/" },
      { title: "Skill India Digital Hub", url: "https://www.skillindiadigital.gov.in/" }
    ],
    role_summary: "As a Solar Energy Technician, you power India's green energy transition. You design rooftop systems, wire high-efficiency solar arrays, and ensure clean, uninterrupted power for homes, schools, and farm pumps.",
    key_responsibilities: [
      "Inspect installation sites to assess sunlight exposure and structural integrity.",
      "Mount solar panel racks, wire electrical strings, and connect inverters.",
      "Perform electrical testing using multimeters, insulation testers, and clamp meters.",
      "Troubleshoot faulty inverters, replace failed cells, and maintain battery banks."
    ],
    ideal_dna: {
      mindset: "Safety-Conscious, Practical & Eco-Friendly",
      vibe: "Resourceful, Hands-On & Active",
      standard: "Strict Electrical Code Compliance & Structural Rigor"
    },
    industry_growth: "28% Annually (PM Surya Ghar Scheme)",
    open_roles_india: "120k+ (Technicians & Installers)"
  },
  {
    id: "data_analyst",
    name: "Data Analyst & Business Intelligence",
    name_te: "డేటా అనలిస్ట్ మరియు బిజినెస్ ఇంటెలిజెన్స్",
    category: "Technology & Business",
    emoji: "📊",
    badge: "High Growth",
    desc: "Transforms complex raw datasets into actionable dashboards, statistical insights, and business growth decisions.",
    desc_te: "వివిధ రంగాల డేటాను విశ్లేషించి, స్పష్టమైన చార్టులు మరియు సమాచారం ద్వారా వ్యాపార నిర్ణయాలకు తోడ్పడతారు.",
    target_interests: ["data", "statistics", "research", "patterns", "logic", "business"],
    target_subjects: ["Mathematics", "Statistics", "Computer Science", "Economics"],
    target_education_levels: [
      "Class 11–12 (Math / Commerce / Science)",
      "Undergraduate (B.Sc Stats / B.Com / BCA / B.Tech / BA Economics)",
      "Graduate / Career Transition"
    ],
    typical_workstyle: "Analytical & Structured",
    verified_education_pathways: [
      "B.Sc in Statistics, Mathematics, or Data Science (3–4 years)",
      "B.Com / BBA with Business Analytics specialization (3 years)",
      "B.Tech in CS/IT or Mechanical/Civil transitioning through data skills",
      "Self-directed portfolio learning via SQL, Power BI, Python, and Kaggle"
    ],
    eligibility_conditions: "10+2 with Mathematics/Statistics/Commerce. Any graduate degree for entry-level analyst traineeships.",
    relevant_entrance_exams: ["CUET UG", "State CETs", "Direct College Admission"],
    estimated_education_cost_inr: {
      government_route: "₹10,000 - ₹35,000 / year (Govt B.Sc / B.Com)",
      private_route: "₹70,000 - ₹2,000,000 / year (Private Data Science Degrees)",
      self_taught_open_route: "₹0 - ₹3,000 (Free SQL/Python resources + open datasets)",
      annual_min_govt: 10000,
      annual_max_govt: 35000,
      annual_min_pvt: 70000,
      annual_max_pvt: 200000
    },
    free_learning_alternatives: [
      "SWAYAM Data Analytics with Python by IIT Roorkee",
      "Kaggle Free Micro-Courses in Python, Pandas, and Data Visualization",
      "Open Government Data (OGD) Platform India (data.gov.in) for real datasets"
    ],
    scholarship_opportunities: [
      "National Scholarship Portal Merit-cum-Means Scheme",
      "State Post-Matric Scholarships for Degree Students"
    ],
    entry_salary_range_inr: "₹3.8L - ₹8.5L / year (Entry-level India)",
    study_duration: "3 to 4 years (degree) or 4–6 months (focused skill track)",
    required_skills: [
      { name: "SQL & Relational Databases", level: "Core", priority: 1 },
      { name: "Excel & Advanced Spreadsheets", level: "Core", priority: 1 },
      { name: "Power BI or Tableau", level: "Essential", priority: 2 },
      { name: "Python (Pandas & Matplotlib)", level: "Essential", priority: 2 },
      { name: "Descriptive Statistics", level: "Core", priority: 3 }
    ],
    starter_projects: [
      "District Public Health Primary Health Center (PHC) Medicine Supply Dashboard",
      "Indian State Agriculture Crop Yield vs Rainfall Analysis using OGD Data"
    ],
    roadmap_milestones: [
      { id: "da_1", title: "Spreadsheets & Pivot Table Mastery", time: "Month 1", desc: "Master VLOOKUP/XLOOKUP, INDEX-MATCH, Pivot Tables, conditional formulas, and data cleanup." },
      { id: "da_2", title: "SQL for Data Extraction", time: "Month 2", desc: "Write SQL queries: SELECT, WHERE, GROUP BY, HAVING, complex multi-table JOINs, subqueries, and window functions." },
      { id: "da_3", title: "Business Intelligence Dashboards", time: "Month 3", desc: "Build interactive executive dashboards in Microsoft Power BI or Tableau with drill-down metrics." },
      { id: "da_4", title: "Python for Data Analysis (Pandas)", time: "Month 4", desc: "Use Jupyter notebooks, Pandas DataFrames for data wrangling, and Seaborn for statistical charts." },
      { id: "da_5", title: "Portfolio on Public Indian Datasets", time: "Month 5", desc: "Analyze a real dataset from data.gov.in, write a data-driven findings article, and share on LinkedIn/GitHub." },
      { id: "da_6", title: "Analyst Interviews & Technical Tests", time: "Month 6+", desc: "Practice SQL whiteboard tests, business case interviews, and apply for Junior Data Analyst openings." }
    ],
    official_reference_links: [
      { title: "Open Government Data (OGD) Platform India", url: "https://data.gov.in/" },
      { title: "National Career Service — Data Analyst Profile", url: "https://www.ncs.gov.in/" }
    ],
    role_summary: "As a Data Analyst, you are an organizational detective. You pull data from databases, clean noisy records, uncover trends, and turn numbers into compelling visual charts that guide critical decisions.",
    key_responsibilities: [
      "Extract and transform structured data from relational SQL databases.",
      "Clean incomplete records and handle outliers without skewing statistics.",
      "Design interactive reporting dashboards for business stakeholders.",
      "Communicate findings clearly through visual charts and executive summaries."
    ],
    ideal_dna: {
      mindset: "Curious, Skeptical & Data-Driven",
      vibe: "Organized, Systematic & Detail-Oriented",
      standard: "Statistical Rigor & Actionable Insights"
    },
    industry_growth: "25% Annually",
    open_roles_india: "110k+ Open Roles"
  },
  {
    id: "medical_nurse",
    name: "Clinical Nurse & Healthcare Specialist",
    name_te: "క్లినికల్ నర్స్ మరియు హెల్త్‌కేర్ స్పెషలిస్ట్",
    category: "Healthcare & Medicine",
    emoji: "🩺",
    badge: "Lifesaving",
    desc: "Provides compassionate patient care, administers medications, assists surgeries, and leads community public health.",
    desc_te: "ఆసుపత్రులలో రోగులకు శ్రద్ధగా చికిత్స అందిస్తూ, మందులు ఇవ్వడం మరియు ప్రజా ఆరోగ్య సేవలను నిర్వహించే ఆరోగ్య రక్షకులు.",
    target_interests: ["healthcare", "helping people", "biology", "compassion", "medicine"],
    target_subjects: ["Biology", "Chemistry", "Physics", "English"],
    target_education_levels: [
      "Class 11–12 (Science / BiPC / PCB)",
      "GNM Diploma Pass"
    ],
    typical_workstyle: "Collaborative & People-Focused",
    verified_education_pathways: [
      "B.Sc Nursing (4 years) from Indian Nursing Council (INC) recognized college",
      "GNM (General Nursing and Midwifery, 3 years diploma) + Post-Basic B.Sc Nursing",
      "M.Sc Nursing for specialized ICU, pediatric, or academic teaching careers"
    ],
    eligibility_conditions: "10+2 with Physics, Chemistry, Biology and English with minimum 45-50% marks from recognized board.",
    relevant_entrance_exams: ["NEET UG (used by premier nursing colleges)", "State Nursing Entrance Exams"],
    estimated_education_cost_inr: {
      government_route: "₹8,000 - ₹30,000 / year (Govt Medical / Nursing Colleges)",
      private_route: "₹75,000 - ₹2,00,000 / year (Private Nursing Institutes)",
      self_taught_open_route: "N/A (Clinical licensing requires clinical hours)",
      annual_min_govt: 8000,
      annual_max_govt: 30000,
      annual_min_pvt: 75000,
      annual_max_pvt: 200000
    },
    free_learning_alternatives: [
      "National Health Systems Resource Centre (NHSRC) Training Modules",
      "SWAYAM Basics of Nursing by AIIMS faculty",
      "WHO OpenLearning Free Health Emergencies Certifications"
    ],
    scholarship_opportunities: [
      "AICTE / Ministry of Health Post-Matric Scholarships",
      "State Government Free Education for Nursing in Govt Colleges"
    ],
    entry_salary_range_inr: "₹2.8L - ₹6.0L / year (India) + high global demand (UK, Gulf, Germany)",
    study_duration: "3 years (GNM) or 4 years (B.Sc Nursing)",
    required_skills: [
      { name: "Patient Assessment & Vital Signs", level: "Core", priority: 1 },
      { name: "Medication Administration & Dosage", level: "Core", priority: 1 },
      { name: "Infection Control & Sterilization", level: "Core", priority: 1 },
      { name: "Emergency First Aid & CPR", level: "Essential", priority: 2 },
      { name: "Compassionate Communication", level: "Essential", priority: 2 }
    ],
    starter_projects: [
      "Community Diabetes & Hypertension Screening Volunteer Camp",
      "First Aid & Emergency Triage Procedure Quick Reference Guide"
    ],
    roadmap_milestones: [
      { id: "nr_1", title: "Anatomy, Physiology & Nursing Foundations", time: "Year 1", desc: "Understand human organ systems, microbiological hygiene, basic nursing care, and vital monitoring." },
      { id: "nr_2", title: "Medical-Surgical Nursing & Pharmacology", time: "Year 2", desc: "Study pathology, disease processes, drug mechanisms, side effects, and adult medical ward rotations." },
      { id: "nr_3", title: "Child Health, Mental Health & Midwifery", time: "Year 3", desc: "Pediatric care, labor room clinical rotations, maternal care, and psychiatric nursing principles." },
      { id: "nr_4", title: "Community Health & Rural Clinicals", time: "Year 4 (Sem 1)", desc: "Lead health education in rural primary health centers (PHC), immunization drives, and epidemic control." },
      { id: "nr_5", title: "Full-Time Hospital Internship", time: "Year 4 (Sem 2)", desc: "Mandatory 6-month clinical rotation across emergency, intensive care unit (ICU), and operation theatre (OT)." },
      { id: "nr_6", title: "State Nursing Council Registration", time: "Graduation", desc: "Obtain Registered Nurse (RN) and Registered Midwife (RM) license from State Nursing Council." }
    ],
    official_reference_links: [
      { title: "Indian Nursing Council (INC)", url: "https://www.indiannursingcouncil.org/" },
      { title: "National Career Service — Nurse Profile", url: "https://www.ncs.gov.in/" }
    ],
    role_summary: "As a Clinical Nurse, you are the heartbeat of patient care. You monitor vital health signs, deliver timely medication, comfort distressed families, and safeguard patient safety around the clock.",
    key_responsibilities: [
      "Assess and continuously monitor patients' vital signs and physiological changes.",
      "Accurately calculate dosages and administer intravenous and oral medications.",
      "Collaborate with doctors, surgeons, and specialists in hospital clinical settings.",
      "Educate patients and their family members on post-discharge care and recovery."
    ],
    ideal_dna: {
      mindset: "Compassionate, Vigilant & Calm Under Pressure",
      vibe: "Warm, Reassuring & Highly Disciplined",
      standard: "Zero Medication Errors & Uncompromising Patient Safety"
    },
    industry_growth: "20% Annually (Global and Domestic Shortage)",
    open_roles_india: "150k+ Open Healthcare Roles"
  },
  {
    id: "school_teacher",
    name: "High School STEM Teacher",
    name_te: "హైస్కూల్ సైన్స్ మరియు మ్యాథ్స్ ఉపాధ్యాయులు",
    category: "Education & Teaching",
    emoji: "📚",
    badge: "Nation Builder",
    desc: "Ignites scientific curiosity, teaches math and science foundations, and mentors young students toward bright futures.",
    desc_te: "పాఠశాల విద్యార్థులకు గణితం మరియు సైన్స్ బోధిస్తూ, వారి భవిష్యత్తుకు బలమైన పునాది వేసే గురువులు.",
    target_interests: ["teaching", "mentoring", "math", "science", "community", "speaking"],
    target_subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    target_education_levels: [
      "Undergraduate (B.Sc / BA)",
      "B.Ed Aspirant / Enrolled"
    ],
    typical_workstyle: "Collaborative & People-Focused",
    verified_education_pathways: [
      "B.Sc in PCM/CBZ (3 years) + B.Ed (Bachelor of Education, 2 years)",
      "Integrated 4-year B.Sc B.Ed program (offered through ITEP / NCERT RIEs)",
      "Clearing Central Teacher Eligibility Test (CTET) or State TET"
    ],
    eligibility_conditions: "Graduation with at least 50% marks + B.Ed degree; qualifying TET/CTET for state and central schools.",
    relevant_entrance_exams: ["State EdCET / B.Ed Entrance", "CTET (Central)", "State TET", "KVS / NVS Recruitment"],
    estimated_education_cost_inr: {
      government_route: "₹8,000 - ₹25,000 / year (Govt B.Ed Colleges)",
      private_route: "₹35,000 - ₹95,000 / year (Private B.Ed Colleges)",
      self_taught_open_route: "₹0 (NCERT & DIKSHA Teacher Training modules)",
      annual_min_govt: 8000,
      annual_max_govt: 25000,
      annual_min_pvt: 35000,
      annual_max_pvt: 95000
    },
    free_learning_alternatives: [
      "DIKSHA National Digital Infrastructure for Teachers",
      "NCERT Open Educational Resources and Teacher Handbooks",
      "SWAYAM Swayam Prabha Educational Channels"
    ],
    scholarship_opportunities: [
      "National Scholarship Portal Merit Schemes for B.Ed Candidates",
      "State Government Fee Reimbursement for Pre-Service Teachers"
    ],
    entry_salary_range_inr: "₹3.0L - ₹6.5L / year (State Govt / KVS / Navodaya / Private Schools)",
    study_duration: "3 years (B.Sc) + 2 years (B.Ed) or 4 years (Integrated ITEP)",
    required_skills: [
      { name: "Pedagogy & Classroom Management", level: "Core", priority: 1 },
      { name: "Subject Mastery in Math or Science", level: "Core", priority: 1 },
      { name: "Interactive Experiment Demonstration", level: "Essential", priority: 2 },
      { name: "Bilingual Communication (Telugu & English)", level: "Essential", priority: 2 },
      { name: "Student Assessment & Formative Feedback", level: "Core", priority: 3 }
    ],
    starter_projects: [
      "Hands-On Low-Cost Science Toy Kit (e.g. Arvind Gupta Toys from Trash)",
      "Interactive 10th Class Math Concept Video or Lesson Plan in Telugu"
    ],
    roadmap_milestones: [
      { id: "tc_1", title: "Complete Science/Math Degree (B.Sc)", time: "Year 1–3", desc: "Build thorough mastery over foundational physics, chemistry, biology, or advanced mathematics." },
      { id: "tc_2", title: "Clear EdCET & Enroll in B.Ed", time: "Year 4", desc: "Study child development psychology, learning theories, inclusive education, and teaching methodologies." },
      { id: "tc_3", title: "School Internship & Practice Teaching", time: "Year 5", desc: "Complete 16 weeks of practical classroom teaching in a local government or aided high school." },
      { id: "tc_4", title: "Prepare and Clear CTET / State TET", time: "Final Year", desc: "Target Paper-II (Mathematics & Science for Upper Primary and High School) with thorough syllabus revision." },
      { id: "tc_5", title: "Apply for DSC / KVS / Navodaya Exams", time: "Post-Graduation", desc: "Participate in State District Selection Committee (DSC) or Central Vidyalaya recruitments." }
    ],
    official_reference_links: [
      { title: "National Council for Teacher Education (NCTE)", url: "https://ncte.gov.in/" },
      { title: "DIKSHA — National Education Portal", url: "https://diksha.gov.in/" }
    ],
    role_summary: "As a STEM Educator, you inspire the next generation of engineers, doctors, and innovators. You break down complex scientific principles into intuitive, memorable lessons that spark curiosity.",
    key_responsibilities: [
      "Prepare structured lesson plans aligned to state and CBSE curricular frameworks.",
      "Conduct engaging lab demonstrations and hands-on science experiments.",
      "Provide constructive, supportive feedback to diverse student learning paces.",
      "Organize science fairs, math quizzes, and career awareness sessions for youth."
    ],
    ideal_dna: {
      mindset: "Patient, Inspiring & Continuous Learner",
      vibe: "Encouraging, Articulate & Empathetic",
      standard: "Deep Conceptual Clarity & Fair Evaluation"
    },
    industry_growth: "12% Annually",
    open_roles_india: "90k+ Open School Roles"
  },
  {
    id: "chartered_accountant",
    name: "Chartered Accountant & Financial Auditor",
    name_te: "చార్టర్డ్ అకౌంటెంట్ మరియు ఫైనాన్షియల్ ఆడిటర్",
    category: "Commerce & Finance",
    emoji: "📈",
    badge: "Prestigious",
    desc: "Audits company accounts, advises on taxation compliance, performs financial valuation, and guides business investment.",
    desc_te: "కంపెనీల ఆర్థిక లావాదేవీలను ఆడిట్ చేసి, పన్నుల ప్రణాళిక మరియు పెట్టుబడి సలహాలను అందించే అత్యున్నత ఆర్థిక నిపుణులు.",
    target_interests: ["finance", "numbers", "taxation", "business", "law", "auditing"],
    target_subjects: ["Accountancy", "Mathematics", "Economics", "Commerce", "Business Studies"],
    target_education_levels: [
      "Class 11–12 (Commerce / Any stream)",
      "B.Com / BBA Students",
      "Graduates"
    ],
    typical_workstyle: "Analytical & Structured",
    verified_education_pathways: [
      "ICAI Foundation → Intermediate → Articleship (2 years) → Final Exam",
      "Direct entry to ICAI Intermediate after B.Com graduation (minimum 55% marks)",
      "Optional parallel degree: B.Com (General / Computers) alongside CA preparations"
    ],
    eligibility_conditions: "Registration with ICAI after Class 10/12; can appear for Foundation exam after clearing 10+2.",
    relevant_entrance_exams: ["ICAI CA Foundation Exam (Held twice a year)"],
    estimated_education_cost_inr: {
      government_route: "₹25,000 - ₹45,000 (Total ICAI Official Exam & Registration fees)",
      private_route: "₹60,000 - ₹1,80,000 (Private Coaching academies)",
      self_taught_open_route: "₹25,000 (ICAI Study Materials + Free YouTube channels)",
      annual_min_govt: 10000,
      annual_max_govt: 25000,
      annual_min_pvt: 60000,
      annual_max_pvt: 150000
    },
    free_learning_alternatives: [
      "ICAI BOS Knowledge Portal (100% free study materials, podcasts, and mock tests)",
      "SWAYAM Financial Accounting & Taxation by Central Universities",
      "NPTEL Corporate Finance lectures by IIT Madras"
    ],
    scholarship_opportunities: [
      "ICAI Merit and Need-Based Scholarships (covers tuition fees)",
      "Mandatory Articleship Stipend paid by CA firms during 2-year practical training (₹4,000–₹15,000/mo)"
    ],
    entry_salary_range_inr: "₹7.5L - ₹15.0L / year (Freshly Qualified CA in India)",
    study_duration: "4 to 5 years (including mandatory 2-year paid articleship)",
    required_skills: [
      { name: "Financial Accounting & Reporting", level: "Core", priority: 1 },
      { name: "GST & Indian Direct Tax Compliance", level: "Core", priority: 1 },
      { name: "Statutory Auditing & Internal Controls", level: "Core", priority: 2 },
      { name: "Tally Prime, SAP & Advanced Excel", level: "Essential", priority: 2 },
      { name: "Corporate Law & Ethics", level: "Essential", priority: 3 }
    ],
    starter_projects: [
      "Mock GST Return (GSTR-3B & GSTR-1) Filing Calculation for a Local Kirana Store",
      "Personal Income Tax Computation under Old vs New Tax Regimes in Excel"
    ],
    roadmap_milestones: [
      { id: "ca_1", title: "Clear CA Foundation", time: "Month 1–6", desc: "Pass 4 papers: Principles of Accounting, Business Laws, Quantitative Aptitude, and Business Economics." },
      { id: "ca_2", title: "Clear CA Intermediate (Both Groups)", time: "Year 2", desc: "Master Advanced Accounting, Corporate Laws, Taxation, Costing, Auditing, and Financial Management." },
      { id: "ca_3", title: "ICITSS Orientation & IT Training", time: "Post-Inter", desc: "Complete mandatory 4-week software and communication training before starting articleship." },
      { id: "ca_4", title: "2-Year Mandatory Articleship Training", time: "Year 3–4", desc: "Work under a practicing CA firm auditing balance sheets, filing tax returns, and conducting client audits." },
      { id: "ca_5", title: "Clear CA Final Examination", time: "Year 5", desc: "Pass Financial Reporting, Strategic Financial Management, Advanced Auditing, and Direct/Indirect Tax Laws." },
      { id: "ca_6", title: "ICAI Membership & Practice", time: "Post-Final", desc: "Receive your ICAI membership number and join a Big 4 firm, multinational company, or start independent practice." }
    ],
    official_reference_links: [
      { title: "Institute of Chartered Accountants of India (ICAI)", url: "https://www.icai.org/" },
      { title: "National Career Service — Chartered Accountant Profile", url: "https://www.ncs.gov.in/" }
    ],
    role_summary: "As a Chartered Accountant, you hold statutory authority to audit balance sheets and protect financial trust. You decode tax regulations, optimize corporate structures, and prevent financial fraud.",
    key_responsibilities: [
      "Examine financial statements to ensure statutory compliance with Indian Accounting Standards.",
      "Calculate corporate tax liabilities and file GST, TDS, and income tax returns.",
      "Identify operational financial risks and implement internal risk controls.",
      "Advise business executives on investment capital allocation and mergers."
    ],
    ideal_dna: {
      mindset: "Ethical, Methodical & Intellectually Rigorous",
      vibe: "Trustworthy, Disciplined & Analytical",
      standard: "Absolute Compliance & Unyielding Professional Ethics"
    },
    industry_growth: "16% Annually",
    open_roles_india: "70k+ Qualified CA Positions"
  },
  {
    id: "civil_engineer",
    name: "Civil & Infrastructure Engineer",
    name_te: "సివిల్ మరియు ఇన్ఫ్రాస్ట్రక్చర్ ఇంజనీర్",
    category: "Technology & Engineering",
    emoji: "🏗️",
    badge: "Nation Builder",
    desc: "Plans, designs, and oversees construction of roads, bridges, irrigation canals, water treatment plants, and housing.",
    desc_te: "రోడ్లు, వంతెనలు, కాలువలు, తాగునీటి వ్యవస్థలు మరియు భవనాల నిర్మాణాన్ని ప్లాన్ చేసి పర్యవేక్షించే ఇంజనీర్లు.",
    target_interests: ["construction", "infrastructure", "building", "mechanics", "planning", "design"],
    target_subjects: ["Mathematics", "Physics", "Engineering Drawing", "Chemistry"],
    target_education_levels: [
      "Class 11–12 (Science / PCM)",
      "Polytechnic Diploma in Civil Engineering",
      "Undergraduate (B.Tech / B.E. Civil)"
    ],
    typical_workstyle: "Field & Practical (Hands-on outdoor)",
    verified_education_pathways: [
      "B.Tech / B.E. in Civil Engineering (4 years)",
      "Polytechnic Diploma in Civil Engineering (3 years) + Lateral B.Tech entry",
      "M.Tech in Structural / Transportation / Water Resources for specialized design"
    ],
    eligibility_conditions: "10+2 with Physics, Chemistry, and Mathematics for B.Tech; 10th pass for Polytechnic Diploma.",
    relevant_entrance_exams: ["JEE Main", "State EAPCET / CET", "State POLYCET (Diploma)"],
    estimated_education_cost_inr: {
      government_route: "₹12,000 - ₹50,000 / year (Govt Engineering Colleges)",
      private_route: "₹70,000 - ₹2,00,000 / year (Private Engineering)",
      self_taught_open_route: "N/A (Structural certification requires recognized degree)",
      annual_min_govt: 12000,
      annual_max_govt: 50000,
      annual_min_pvt: 70000,
      annual_max_pvt: 200000
    },
    free_learning_alternatives: [
      "SWAYAM Structural Analysis & Concrete Technology by IIT Roorkee",
      "NPTEL Geotechnical Engineering and Surveying courses",
      "FreeCAD open-source CAD modeling tutorials"
    ],
    scholarship_opportunities: [
      "National Scholarship Portal Technical Scholarships",
      "State Engineering Fee Reimbursement schemes",
      "AICTE Swanath Scholarship Scheme"
    ],
    entry_salary_range_inr: "₹3.0L - ₹6.5L / year (Site Engineer, Design Consultant, Govt PWD)",
    study_duration: "3 years (Diploma) or 4 years (B.Tech degree)",
    required_skills: [
      { name: "AutoCAD & Building Planning", level: "Core", priority: 1 },
      { name: "Structural Analysis & RCC Design", level: "Core", priority: 1 },
      { name: "Quantity Estimation & Costing", level: "Essential", priority: 2 },
      { name: "Surveying & Total Station Operation", level: "Core", priority: 2 },
      { name: "Concrete Quality & Compaction Testing", level: "Essential", priority: 3 }
    ],
    starter_projects: [
      "AutoCAD Residential Building Plan with Rainwater Harvesting Sump",
      "Bill of Quantities (BOQ) and Cement/Steel Estimation for a Rural Community Center"
    ],
    roadmap_milestones: [
      { id: "cv_1", title: "Engineering Mechanics & Surveying", time: "Year 1", desc: "Master forces, moments, material stress-strain curves, leveling, and modern Total Station operation." },
      { id: "cv_2", title: "Fluid Mechanics & Soil Mechanics", time: "Year 2", desc: "Study soil bearing capacity, foundation design, pipe hydraulics, and open channel flow." },
      { id: "cv_3", title: "Structural Analysis & Reinforced Concrete (RCC)", time: "Year 3", desc: "Design reinforced concrete beams, slabs, columns, and retaining walls per Indian Standard codes (IS 456)." },
      { id: "cv_4", title: "Transportation, Water Supply & Estimations", time: "Year 4 (Sem 1)", desc: "Highway geometry, rural road design (PMGSY guidelines), sewage treatment, and detailed rate analysis." },
      { id: "cv_5", title: "On-Site Construction Internship", time: "Year 4 (Sem 2)", desc: "Supervise live concrete pouring, rebars placement inspection, and slump testing on a real construction project." },
      { id: "cv_6", title: "GATE or State Assistant Engineer (AEE) Prep", time: "Graduation", desc: "Prepare for GATE or state PSC engineering exams for stable government public works posts." }
    ],
    official_reference_links: [
      { title: "National Career Service — Civil Engineer Profile", url: "https://www.ncs.gov.in/" },
      { title: "Central Public Works Department (CPWD)", url: "https://cpwd.gov.in/" }
    ],
    role_summary: "As a Civil Engineer, you build physical civilization. You transform blueprints into bridges that unite separated communities, flood-control barrages that save crops, and sustainable houses that withstand earthquakes.",
    key_responsibilities: [
      "Prepare architectural and structural drawings adhering to national building codes.",
      "Calculate soil bearing capacities and supervise safe foundation excavation.",
      "Estimate quantities of cement, steel, sand, and aggregate to control budget overruns.",
      "Enforce strict workplace safety standards on active construction job sites."
    ],
    ideal_dna: {
      mindset: "Practical, Spatial & Safety-Minded",
      vibe: "Resilient, Grounded & Leadership-Oriented",
      standard: "Structural Integrity & Environmental Resilience"
    },
    industry_growth: "15% Annually (National Infrastructure Pipeline)",
    open_roles_india: "85k+ Infrastructure Openings"
  },
  {
    id: "microfinance_officer",
    name: "Rural Banking & Microfinance Officer",
    name_te: "రూరల్ బ్యాంకింగ్ మరియు మైక్రోఫైనాన్స్ అధికారి",
    category: "Banking & Social Development",
    emoji: "🤝",
    badge: "Grassroots Finance",
    desc: "Provides affordable credit, financial literacy, and enterprise loans to women Self-Help Groups (SHGs) and rural entrepreneurs.",
    desc_te: "గ్రామీణ ప్రాంతాలలో స్వయం సహాయక సంఘాలు (డ్వాక్రా/SHG), చిన్న వ్యాపారులకు రుణాలు అందిస్తూ ఆర్థిక భరోసా కల్పిస్తారు.",
    target_interests: ["rural development", "community", "banking", "finance", "helping people", "business"],
    target_subjects: ["Economics", "Commerce", "Social Sciences", "Mathematics", "English"],
    target_education_levels: [
      "Undergraduate (Any degree: BA / B.Com / B.Sc / BBA)",
      "Intermediate pass (for field executive trainees)"
    ],
    typical_workstyle: "Collaborative & People-Focused",
    verified_education_pathways: [
      "Any Bachelor's Degree (3 years) + IBPS Regional Rural Bank (RRB) Exam",
      "BBA / MBA in Rural Management from IRMA, XISS, or State Universities",
      "Diploma in Microfinance / Cooperative Management"
    ],
    eligibility_conditions: "Any recognized degree for Banking PO/Clerk and Microfinance institutions; local language fluency is mandatory.",
    relevant_entrance_exams: ["IBPS RRB Officer Scale I & Office Assistant", "NABARD Grade A", "State Cooperative Bank Exams"],
    estimated_education_cost_inr: {
      government_route: "₹6,000 - ₹25,000 / year (Govt Degree Colleges)",
      private_route: "₹45,000 - ₹1,20,000 / year (Private BBA / MBA)",
      self_taught_open_route: "₹0 (NABARD & RBI Financial Literacy booklets free online)",
      annual_min_govt: 6000,
      annual_max_govt: 25000,
      annual_min_pvt: 45000,
      annual_max_pvt: 120000
    },
    free_learning_alternatives: [
      "NABARD Rural Financial Inclusion Publications",
      "Reserve Bank of India (RBI) Financial Literacy Hub",
      "SWAYAM Rural Sociology and Microeconomics courses"
    ],
    scholarship_opportunities: [
      "State Post-Matric Scholarships for Degree Candidates",
      "National Scholarship Scheme for Students from Rural Districts"
    ],
    entry_salary_range_inr: "₹2.8L - ₹6.2L / year (Microfinance Field Officers to RRB Assistant Managers)",
    study_duration: "3 years (Undergraduate degree)",
    required_skills: [
      { name: "Rural Credit Assessment & Cash Flow Analysis", level: "Core", priority: 1 },
      { name: "Self-Help Group (SHG) Governance", level: "Core", priority: 1 },
      { name: "Financial Literacy & Loan Documentation", level: "Essential", priority: 2 },
      { name: "Bilingual Communication (Telugu & English)", level: "Core", priority: 1 },
      { name: "Digital Payment & Micro-ATM Systems", level: "Essential", priority: 3 }
    ],
    starter_projects: [
      "Village Household Monthly Cash Flow and Micro-Loan Repayment Feasibility Study",
      "Digital Payment & UPI Security Awareness Workshop for Rural SHG Women"
    ],
    roadmap_milestones: [
      { id: "mf_1", title: "Complete Bachelor's Degree", time: "Year 1–3", desc: "Build strong foundational understanding of Indian rural economy, microeconomics, and banking law." },
      { id: "mf_2", title: "Study Banking Systems & SHG Schemes", time: "Final Year", desc: "Understand NRLM (Day-NRLM), Stree Nidhi, NABARD refinance policies, and cooperative credit societies." },
      { id: "mf_3", title: "Prepare for IBPS RRB & Bank Exams", time: "6 Months", desc: "Prepare Quantitative Aptitude, Reasoning Ability, Financial Awareness, and Computer Knowledge." },
      { id: "mf_4", title: "Field Internship with MFI or NGO", time: "3 Months", desc: "Shadow loan recovery meetings, verify village asset purchases (cattle, tractor, sewing machines), and audit loan books." },
      { id: "mf_5", title: "Join as Field Officer or RRB Officer", time: "Post-Selection", desc: "Serve in rural branch networks, disburse Kisan Credit Cards (KCC), and empower smallholder enterprises." }
    ],
    official_reference_links: [
      { title: "National Bank for Agriculture and Rural Development (NABARD)", url: "https://www.nabard.org/" },
      { title: "National Career Service — Credit Officer Profile", url: "https://www.ncs.gov.in/" }
    ],
    role_summary: "As a Rural Banking & Microfinance Officer, you break cycles of predatory village usury. You connect grassroots women entrepreneurs and smallholder farmers with formal bank loans, low-interest credit, and digital banking.",
    key_responsibilities: [
      "Visit village communities to evaluate genuine household income and creditworthiness.",
      "Organize and train Self-Help Groups on transparent book-keeping and internal loaning.",
      "Disburse agricultural credit lines, micro-enterprise loans, and monitor repayments.",
      "Conduct financial literacy camps teaching families about savings and crop insurance."
    ],
    ideal_dna: {
      mindset: "Socially Minded, Honest & Financially Astute",
      vibe: "Approachable, Respectful & Culturally Sensitive",
      standard: "Ethical Lending & Transparent Community Trust"
    },
    industry_growth: "18% Annually",
    open_roles_india: "55k+ Grassroots Banking Roles"
  }
];
