import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Layers,
  Heart,
  Sliders,
  Wallet,
  Clock,
  Compass,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { computeRecommendations } from '../services/recommendationService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { FadeIn, TextReveal } from '../components/common/Motion';

export const AssessmentPage: React.FC = () => {
  const { profile, updateProfile, setActiveCareerId, user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isOnboarding = searchParams.get('onboarding') === 'true';

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Education State
  const [educationLevel, setEducationLevel] = useState(profile.educationLevel || 'Class 11–12 (Science / PCM)');
  const [courseOrClass, setCourseOrClass] = useState(profile.currentClass || 'Class 12');
  const [currentStream, setCurrentStream] = useState(profile.courseStream || 'MPC (Math, Physics, Chemistry)');

  // Step 2: Interests State
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    profile.interests && profile.interests.length > 0 ? profile.interests : ['technology', 'problem-solving']
  );
  const [selectedProblems, setSelectedProblems] = useState<string[]>(['building digital tools', 'rural development']);

  // Step 3: Strengths & Skills State
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(['Analytical Thinking', 'Problem Solving']);
  const [workPreferenceType, setWorkPreferenceType] = useState('coding');
  const [existingSkills, setExistingSkills] = useState<string[]>(
    profile.existingSkills && profile.existingSkills.length > 0 ? profile.existingSkills : ['JavaScript or Python', 'Web Fundamentals (HTML/CSS)']
  );
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>(['React & Modern UI', 'Cloud & Database Basics']);

  // Step 4: Preferred Work Style State
  const [workstyle, setWorkstyle] = useState(profile.workstyle || 'Deep Focus (Solo analytical / coding focus)');
  const [activityType, setActivityType] = useState('practical'); // practical, research, creative, problem-solving
  const [workEnvironment, setWorkEnvironment] = useState('mixed'); // office, remote, field, mixed

  // Step 5: Practical Constraints State
  const [budgetInr, setBudgetInr] = useState(profile.annualBudgetInr || 35000);
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [relocationWillingness, setRelocationWillingness] = useState('within_state'); // within_district, within_state, anywhere_india, remote_only
  const [learningLanguage, setLearningLanguage] = useState<'en' | 'te' | 'both'>('both');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(x => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishAssessment = async () => {
    setIsSubmitting(true);

    // 1. Synthesize student profile updates
    const updatedProfileUpdates = {
      educationLevel,
      currentClass: courseOrClass,
      courseStream: currentStream,
      interests: selectedInterests,
      existingSkills,
      learningSkills: skillsToLearn,
      workstyle,
      annualBudgetInr: budgetInr,
      preferredLanguage: learningLanguage === 'te' ? 'te' : 'en' as any
    };

    await updateProfile(updatedProfileUpdates);

    // 2. Compute 5-factor recommendations
    const matches = computeRecommendations({
      ...profile,
      ...updatedProfileUpdates
    });

    // 3. Save assessment session in localStorage for RecommendationsPage
    try {
      const assessmentRecord = {
        timestamp: new Date().toISOString(),
        step1: { educationLevel, courseOrClass, currentStream },
        step2: { interests: selectedInterests, problems: selectedProblems },
        step3: { strengths: selectedStrengths, workPreferenceType, existingSkills, skillsToLearn },
        step4: { workstyle, activityType, workEnvironment },
        step5: { budgetInr, weeklyHours, relocationWillingness, learningLanguage },
        matches
      };
      localStorage.setItem('pathsetu_last_assessment', JSON.stringify(assessmentRecord));

      // Also persist to Supabase if logged in and configured
      if (isSupabaseConfigured && supabase && user) {
        supabase.from('career_assessments').insert([{
          user_id: user.id,
          education_level: educationLevel,
          current_stream: currentStream,
          interest_tags: selectedInterests,
          problem_solving_interests: selectedProblems,
          strength_tags: selectedStrengths,
          existing_skills: existingSkills,
          skills_to_learn: skillsToLearn,
          workstyle_preference: workstyle,
          environment_preference: workEnvironment,
          annual_budget_inr: budgetInr,
          weekly_hours: weeklyHours,
          relocation_willingness: relocationWillingness,
          preferred_language: learningLanguage,
          top_matches: matches.slice(0, 3).map((m: any) => ({
            careerId: m.career.id,
            careerName: m.career.name,
            score: m.compatibilityScore
          }))
        }]).then();
      }
    } catch (e) {
      console.warn('Failed to save assessment to database:', e);
    }

    setIsSubmitting(false);
    navigate('/recommendations');
  };

  return (
    <div className="py-6 sm:py-10 space-y-8 max-w-3xl mx-auto">
      {/* Top Banner Progress Bar */}
      <FadeIn duration={0.3}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-brand-sm bg-brand-primary flex items-center justify-center text-white">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand-dark">Career Discovery Questionnaire</h2>
              <div className="text-xs text-brand-muted">
                Step {currentStep} of {totalSteps} · {
                  currentStep === 1 ? 'Education & Current Studies' :
                  currentStep === 2 ? 'Natural Interests & Passions' :
                  currentStep === 3 ? 'Strengths & Skills' :
                  currentStep === 4 ? 'Preferred Work Style' :
                  'Practical Constraints & Budget'
                }
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-1/3">
            <div className="flex-1 bg-brand-elevated rounded-full h-2.5 overflow-hidden border border-brand-border">
              <div
                className="bg-brand-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-brand-primary whitespace-nowrap">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Onboarding Welcome Callout (when student arrives from signup/login) */}
      {isOnboarding && (
        <FadeIn delay={0.05}>
          <div className="bg-brand-surface border border-brand-primary/60 rounded-brand p-5 flex items-start gap-3.5 shadow-xs">
            <div className="w-9 h-9 rounded-brand-sm bg-brand-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-brand-dark">
                {profile.full_name || profile.name ? `Welcome, ${profile.full_name || profile.name}!` : 'Welcome to PathSetu!'}
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Let's set up your student profile and map your career future. Share your education, natural interests, strengths, and budget across these 5 quick steps to get explainable pathway recommendations.
              </p>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Main Questionnaire Card */}
      <FadeIn delay={0.1}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          {/* STEP 1: EDUCATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-brand-cyan">
                  Step 01 · Academic Background
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark mt-1 tracking-tight">
                  Tell us about your current education
                </h1>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  PathSetu customizes entry prerequisites, statutory entrance exams (EAMCET, CUET, NEET, JEE), and polytechnic routes based on your current stage.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5">
                    What is your current education level?
                  </label>
                  <select
                    value={educationLevel}
                    onChange={e => setEducationLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  >
                    <option value="Class 10 (Secondary School)">Class 10 (Secondary School / SSC / CBSE)</option>
                    <option value="Class 11–12 (Science / PCM)">Class 11–12 (Intermediate Science / MPC / PCM)</option>
                    <option value="Class 11–12 (Science / PCB)">Class 11–12 (Intermediate Science / BiPC / PCB)</option>
                    <option value="Class 11–12 (Commerce)">Class 11–12 (Intermediate Commerce / CEC / MEC)</option>
                    <option value="Class 11–12 (Arts & Humanities)">Class 11–12 (Arts & Humanities / HEC)</option>
                    <option value="Polytechnic / ITI Diploma">Polytechnic / ITI Diploma</option>
                    <option value="Undergraduate Degree (B.Tech / B.E.)">Undergraduate Degree (B.Tech / B.E.)</option>
                    <option value="Undergraduate Degree (B.Sc / B.Com / B.A.)">Undergraduate Degree (B.Sc / B.Com / B.A.)</option>
                    <option value="Postgraduate Degree">Postgraduate Degree</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1.5">
                      Which class, course, or year are you studying?
                    </label>
                    <input
                      type="text"
                      value={courseOrClass}
                      onChange={e => setCourseOrClass(e.target.value)}
                      placeholder="e.g. Class 12 / 1st Year Degree"
                      className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-1.5">
                      Which subjects or stream do you currently study?
                    </label>
                    <input
                      type="text"
                      value={currentStream}
                      onChange={e => setCurrentStream(e.target.value)}
                      placeholder="e.g. MPC (Maths, Physics, Chemistry)"
                      className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INTERESTS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-brand-cyan">
                  Step 02 · Natural Curiosity & Passions
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark mt-1 tracking-tight">
                  What activities and topics excite you the most?
                </h1>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Select all that resonate with you. We weigh your natural curiosity at 35% of the overall recommendation score.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Activities you naturally enjoy (Select multiple):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "technology", label: "💻 Technology & Coding" },
                      { id: "problem-solving", label: "🧩 Problem-Solving & Math" },
                      { id: "creativity", label: "🎨 Visual Design & UI" },
                      { id: "agriculture", label: "🌾 Agriculture & Soil Health" },
                      { id: "renewable energy", label: "☀️ Clean Energy & Solar" },
                      { id: "healthcare", label: "🩺 Healthcare & Patient Care" },
                      { id: "business", label: "📈 Business & Finance" },
                      { id: "teaching", label: "📚 Education & Community" },
                      { id: "machinery", label: "🔧 Fixing Hardware & Tools" },
                    ].map(item => {
                      const isSelected = selectedInterests.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleItem(selectedInterests, item.id, setSelectedInterests)}
                          className={`p-3 text-left rounded-brand-sm border text-xs font-bold transition-colors ${
                            isSelected
                              ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                              : 'border-brand-border bg-brand-card text-brand-dark hover:border-brand-primary'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.label}</span>
                            {isSelected && <span className="text-brand-cyan text-xs">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Which real-world problems would you feel proud to solve?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      "Building digital tools for local businesses and schools",
                      "Increasing crop yields & lowering farm fertilizer costs",
                      "Deploying affordable solar microgrids for rural power",
                      "Simplifying complex health diagnoses and telemedicine",
                      "Designing intuitive, accessible mobile applications",
                      "Automating data reporting for community public health"
                    ].map(prob => {
                      const isSelected = selectedProblems.includes(prob);
                      return (
                        <button
                          key={prob}
                          type="button"
                          onClick={() => toggleItem(selectedProblems, prob, setSelectedProblems)}
                          className={`p-3 text-left rounded-brand-sm border text-xs font-medium transition-colors ${
                            isSelected
                              ? 'border-brand-primary bg-brand-elevated text-brand-dark font-bold'
                              : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-brand-cyan">{isSelected ? '☑' : '☐'}</span>
                            <span className="leading-snug">{prob}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STRENGTHS & SKILLS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-brand-cyan">
                  Step 03 · Strengths & Skill Inventory
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark mt-1 tracking-tight">
                  What are your strengths and current skills?
                </h1>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  You do not need to be an expert. Identifying where you are today allows us to compute actionable skill gaps and beginner-friendly milestones.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    When working on a project, which role suits you best?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "coding", label: "💻 Coding / Logic" },
                      { id: "designing", label: "🎨 Visual Layouts" },
                      { id: "analyzing", label: "📊 Data Analysis" },
                      { id: "communicating", label: "🗣️ Public Speaking & People" },
                      { id: "building", label: "🔨 Physical Hardware & Labs" },
                      { id: "outdoor", label: "🌱 Field & Outdoor Tasks" }
                    ].map(pref => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setWorkPreferenceType(pref.id)}
                        className={`p-3 text-left rounded-brand-sm border text-xs font-bold transition-colors ${
                          workPreferenceType === pref.id
                            ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                            : 'border-brand-border bg-brand-card text-brand-dark hover:border-brand-primary'
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Skills you already have basic familiarity with (Select all that apply):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "JavaScript or Python",
                      "Web Fundamentals (HTML/CSS)",
                      "SQL & Spreadsheets (Excel)",
                      "Figma or Canva UI Design",
                      "Soil Chemistry or Biology Lab",
                      "Circuit Wiring & Multimeters",
                      "Public Speaking & Presentation",
                      "Mathematical Problem Solving"
                    ].map(skill => {
                      const isSelected = existingSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleItem(existingSkills, skill, setExistingSkills)}
                          className={`px-3 py-1.5 rounded-brand-sm border text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                              : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                          }`}
                        >
                          {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    What would you most like to learn next?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React & Full-Stack Web Development",
                      "Data Analytics with Python & Pandas",
                      "UX Research & Accessibility Audits",
                      "Solar PV Array & Inverter Sizing",
                      "Precision Agriculture & Drone Diagnostics",
                      "Cloud Infrastructure & Linux Basics"
                    ].map(target => {
                      const isSelected = skillsToLearn.includes(target);
                      return (
                        <button
                          key={target}
                          type="button"
                          onClick={() => toggleItem(skillsToLearn, target, setSkillsToLearn)}
                          className={`px-3 py-1.5 rounded-brand-sm border text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'border-brand-cyan bg-brand-elevated text-brand-cyan'
                              : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                          }`}
                        >
                          {isSelected ? `★ ${target}` : `+ ${target}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERRED WORK STYLE */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-brand-cyan">
                  Step 04 · Work Style & Rhythm
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark mt-1 tracking-tight">
                  How do you prefer to spend your work days?
                </h1>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  Different careers demand different day-to-day work patterns. Finding a natural fit prevents early career burnout.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Do you thrive in solo focus or team environments?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        val: "Deep Focus (Solo analytical / coding focus)",
                        title: "Deep Independent Focus",
                        desc: "Long stretches of quiet uninterrupted work solving logic, debugging, or analyzing data."
                      },
                      {
                        val: "Collaborative & People-Focused",
                        title: "Collaborative & People-Oriented",
                        desc: "Frequent collaboration, stakeholder meetings, mentoring, and team problem-solving."
                      },
                      {
                        val: "Field & Practical (Hands-on outdoor)",
                        title: "Field & Practical Action",
                        desc: "Hands-on physical tools, site inspections, farms, laboratories, or testing setups."
                      },
                      {
                        val: "Creative & Visual (Design / media)",
                        title: "Creative & Visual Exploration",
                        desc: "Brainstorming sketches, visual prototyping, media production, and usability critique."
                      }
                    ].map(style => (
                      <button
                        key={style.val}
                        type="button"
                        onClick={() => setWorkstyle(style.val)}
                        className={`p-4 rounded-brand-sm border text-left transition-colors space-y-1 ${
                          workstyle === style.val
                            ? 'border-brand-primary bg-brand-elevated text-brand-dark'
                            : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between text-brand-dark">
                          <span>{style.title}</span>
                          {workstyle === style.val && <span className="text-brand-cyan">✓</span>}
                        </div>
                        <p className="text-[11px] text-brand-muted leading-relaxed">
                          {style.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Preferred Workplace Environment:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "office", label: "🏢 Office-Based" },
                      { id: "remote", label: "🏡 Remote / WFH" },
                      { id: "field", label: "🌾 Field & Outdoor" },
                      { id: "mixed", label: "🔄 Hybrid / Mixed" }
                    ].map(env => (
                      <button
                        key={env.id}
                        type="button"
                        onClick={() => setWorkEnvironment(env.id)}
                        className={`p-3 text-center rounded-brand-sm border text-xs font-bold transition-colors ${
                          workEnvironment === env.id
                            ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                            : 'border-brand-border bg-brand-card text-brand-dark hover:border-brand-primary'
                        }`}
                      >
                        {env.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PRACTICAL CONSTRAINTS */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-brand-cyan">
                  Step 05 · Budget, Time & Language (Optional)
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark mt-1 tracking-tight">
                  Practical constraints & learning preferences
                </h1>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  PathSetu matches you against affordable government colleges and statutory scholarships to ensure no dream is blocked by lack of funds.
                </p>
              </div>

              <div className="space-y-5">
                {/* Budget Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Approximate Annual Education Budget (INR):</span>
                    </label>
                    <span className="text-sm font-black text-brand-primary">
                      ₹{budgetInr.toLocaleString('en-IN')} / year
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="150000"
                    step="5000"
                    value={budgetInr}
                    onChange={e => setBudgetInr(Number(e.target.value))}
                    className="w-full accent-brand-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-brand-muted mt-1 font-semibold">
                    <span>₹5,000 (Govt/ITI)</span>
                    <span>₹35,000 (State Univ)</span>
                    <span>₹1,50,000+ (Private)</span>
                  </div>
                </div>

                {/* Weekly Learning Hours */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Hours you can commit each week to skill learning:</span>
                    </label>
                    <span className="text-sm font-black text-brand-cyan">
                      {weeklyHours} Hours / week
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="30"
                    step="2"
                    value={weeklyHours}
                    onChange={e => setWeeklyHours(Number(e.target.value))}
                    className="w-full accent-brand-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-brand-muted mt-1 font-semibold">
                    <span>4h (Casual Explorer)</span>
                    <span>12h (Recommended)</span>
                    <span>30h (Full-Time Focus)</span>
                  </div>
                </div>

                {/* Relocation */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5">
                    Are you willing to relocate for studies or internships?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: "within_district", label: "Nearby / Home District Only" },
                      { id: "within_state", label: "Anywhere in State (e.g. AP/TS)" },
                      { id: "anywhere_india", label: "Open across India" }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRelocationWillingness(opt.id)}
                        className={`p-2.5 text-xs font-bold rounded-brand-sm border text-center transition-colors ${
                          relocationWillingness === opt.id
                            ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                            : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Language */}
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-1.5">
                    Which learning medium do you feel most confident in?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "en", label: "English Only" },
                      { id: "te", label: "తెలుగు (Telugu Only)" },
                      { id: "both", label: "Bilingual (English + Telugu)" }
                    ].map(langOpt => (
                      <button
                        key={langOpt.id}
                        type="button"
                        onClick={() => setLearningLanguage(langOpt.id as any)}
                        className={`p-2.5 text-xs font-bold rounded-brand-sm border text-center transition-colors ${
                          learningLanguage === langOpt.id
                            ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                            : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                        }`}
                      >
                        {langOpt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-brand-border flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-sm"
            >
              <span>{isSubmitting ? 'Calculating Matches...' : currentStep === totalSteps ? 'View 5-Factor Recommendations →' : 'Next Step →'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
