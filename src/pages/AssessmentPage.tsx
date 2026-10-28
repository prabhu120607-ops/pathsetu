import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardList,
  PieChart,
  Briefcase,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  User,
  Target,
  TrendingUp,
  Save,
  CheckCircle2,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { computeRecommendations } from '../services/recommendationService';
import { RecommendationMatch } from '../types';

interface Question {
  id: string;
  category: 'interests' | 'subjects' | 'skills' | 'education' | 'workstyle';
  statement: string;
  statement_te: string;
  associatedTrait: string;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "interests",
    statement: "I enjoy working with data and solving complex problems.",
    statement_te: "నేను డేటాతో పనిచేయడం మరియు సంక్లిష్ట సమస్యలను పరిష్కరించడం ఇష్టపడతాను.",
    associatedTrait: "problem-solving"
  },
  {
    id: "q2",
    category: "interests",
    statement: "I like building digital tools, coding, or working with computers and software.",
    statement_te: "నేను డిజిటల్ ఉత్పత్తులను నిర్మించడం లేదా కోడింగ్ చేయడం ఆనందిస్తాను.",
    associatedTrait: "technology"
  },
  {
    id: "q3",
    category: "interests",
    statement: "I enjoy visual design, drawing, creating clean user interfaces, or sketching.",
    statement_te: "నేను విజువల్ డిజైన్, డ్రాయింగ్ లేదా అందమైన వెబ్ పేజీలను డిజైన్ చేయడం ఇష్టపడతాను.",
    associatedTrait: "creativity"
  },
  {
    id: "q4",
    category: "interests",
    statement: "I am passionate about farming, crop health, soil, and rural community development.",
    statement_te: "నాకు వ్యవసాయం, పంటల ఆరోగ్యం మరియు గ్రామీణ వికాసంపై ఆసక్తి ఉంది.",
    associatedTrait: "agriculture"
  },
  {
    id: "q5",
    category: "interests",
    statement: "I like working with electrical tools, solar panels, and fixing physical machinery.",
    statement_te: "నేను ఎలక్ట్రికల్ పరికరాలు, సోలార్ ప్యానెల్స్ మరియు రిపేరింగ్ పనులను ఇష్టపడతాను.",
    associatedTrait: "renewable energy"
  },
  {
    id: "q6",
    category: "interests",
    statement: "I feel fulfilled when helping patients, caring for health, and assisting in clinics.",
    statement_te: "ఆరోగ్య సమస్యలు ఉన్న రోగులకు సహాయం చేయడం నాకు సంతృప్తినిస్తుంది.",
    associatedTrait: "healthcare"
  },
  {
    id: "q7",
    category: "subjects",
    statement: "I have strong foundational aptitude in Mathematics and quantitative calculations.",
    statement_te: "నాకు గణితం మరియు లెక్కలు చేయడంలో మంచి ప్రావీణ్యం ఉంది.",
    associatedTrait: "Mathematics"
  },
  {
    id: "q8",
    category: "subjects",
    statement: "I find Biology, living organisms, and medical/agricultural science fascinating.",
    statement_te: "బయాలజీ, వృక్ష మరియు జంతు శాస్త్రాలు నాకు ఆసక్తికరంగా అనిపిస్తాయి.",
    associatedTrait: "Biology"
  },
  {
    id: "q9",
    category: "skills",
    statement: "I already have basic familiarity with writing computer programs or HTML/CSS.",
    statement_te: "నాకు ప్రోగ్రామింగ్ లేదా వెబ్‌సైట్ కోడింగ్‌పై ప్రాథమిక అవగాహన ఉంది.",
    associatedTrait: "JavaScript or Python"
  },
  {
    id: "q10",
    category: "workstyle",
    statement: "I prefer deep, independent focus work rather than continuous large team meetings.",
    statement_te: "నిరంతర సమావేశాల కంటే ప్రశాంతంగా ఒంటరిగా కూర్చుని పనిచేయడానికి ఇష్టపడతాను.",
    associatedTrait: "Deep Focus (Solo analytical / coding focus)"
  }
];

const LIKERT_OPTIONS = [
  { label: "Strongly Disagree", label_te: "పూర్తిగా విభేదిస్తున్నాను", value: 1 },
  { label: "Disagree", label_te: "విభేదిస్తున్నాను", value: 2 },
  { label: "Neutral", label_te: "తటస్థం", value: 3 },
  { label: "Agree", label_te: "ఏకీభవిస్తున్నాను", value: 4 },
  { label: "Strongly Agree", label_te: "పూర్తిగా ఏకీభవిస్తున్నాను", value: 5 }
];

export const AssessmentPage: React.FC = () => {
  const { profile, updateProfile, setActiveCareerId } = useAuthProgress();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('pathsetu_assessment_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationMatch[]>([]);

  const currentQ = ASSESSMENT_QUESTIONS[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (value: number) => {
    const updated = { ...answers, [currentQ.id]: value };
    setAnswers(updated);
    try {
      localStorage.setItem('pathsetu_assessment_answers', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const handleNext = () => {
    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const finishAssessment = () => {
    // Derive student interests and subjects from answers
    const derivedInterests: string[] = [];
    const derivedSubjects: string[] = [];
    const derivedSkills: string[] = [];
    let derivedWorkstyle = profile.workstyle;

    ASSESSMENT_QUESTIONS.forEach(q => {
      const score = answers[q.id] || 3;
      if (score >= 4) {
        if (q.category === 'interests') derivedInterests.push(q.associatedTrait);
        if (q.category === 'subjects') derivedSubjects.push(q.associatedTrait);
        if (q.category === 'skills') derivedSkills.push(q.associatedTrait);
        if (q.category === 'workstyle') derivedWorkstyle = q.associatedTrait;
      }
    });

    const updatedProfile = {
      ...profile,
      interests: derivedInterests.length > 0 ? derivedInterests : profile.interests,
      subjects: derivedSubjects.length > 0 ? derivedSubjects : profile.subjects,
      existingSkills: derivedSkills.length > 0 ? derivedSkills : profile.existingSkills,
      workstyle: derivedWorkstyle
    };

    updateProfile(updatedProfile);
    const recs = computeRecommendations(updatedProfile);
    setRecommendations(recs);
    setIsCompleted(true);
  };

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Top Banner Progress Bar (Mirrors Reference 1) */}
      <div className="bg-white border border-brand-border rounded-brand p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4 text-brand-secondary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-brand-dark">Career Self-Assessment</h2>
            <div className="text-xs text-brand-muted">
              Question {currentIndex + 1} of {ASSESSMENT_QUESTIONS.length}
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="flex items-center gap-3 w-full sm:w-1/2">
          <div className="flex-1 bg-brand-bg rounded-full h-2.5 overflow-hidden border border-brand-border">
            <div
              className="bg-brand-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-brand-primary whitespace-nowrap">
            {progressPct}% Complete
          </span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark hover:bg-brand-bg transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save & Exit</span>
        </button>
      </div>

      {!isCompleted ? (
        /* Reference 1 Layout: 3-column Grid (Sidebar, Main Assessment Card, Right Context Card) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Mini Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-brand-border rounded-brand p-3 shadow-subtle space-y-1">
              <div className="flex items-center space-x-3 px-3 py-2.5 rounded-brand-sm bg-brand-primary-light text-brand-primary font-bold text-xs">
                <ClipboardList className="w-4 h-4" />
                <span>Assessment</span>
              </div>
              <button
                onClick={() => finishAssessment()}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-brand-sm text-brand-muted hover:text-brand-dark hover:bg-brand-bg font-semibold text-xs transition-colors"
              >
                <PieChart className="w-4 h-4" />
                <span>Results</span>
              </button>
              <Link
                to="/careers"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-brand-sm text-brand-muted hover:text-brand-dark hover:bg-brand-bg font-semibold text-xs transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Careers</span>
              </Link>
              <Link
                to="/resources"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-brand-sm text-brand-muted hover:text-brand-dark hover:bg-brand-bg font-semibold text-xs transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Resources</span>
              </Link>
            </div>

            {/* Motivational Quote Card (Mirrors Reference 1 bottom-left quote) */}
            <div className="bg-brand-bg border border-brand-border rounded-brand p-4 text-xs space-y-2">
              <span className="text-2xl text-brand-primary font-serif">“</span>
              <p className="text-brand-dark/80 italic leading-relaxed -mt-2">
                Your career is your journey. We're here to help you discover it with dignity and affordable opportunities.
              </p>
            </div>
          </aside>

          {/* Center Main Question Card */}
          <main className="lg:col-span-6 bg-white border border-brand-border rounded-brand p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Career Self-Assessment
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark mt-2 tracking-tight leading-snug">
                {language === 'te' ? currentQ.statement_te : currentQ.statement}
              </h1>
              <p className="text-xs text-brand-muted mt-2">
                Select the option that best describes you.
              </p>
            </div>

            {/* Likert Pill Options (Mirrors Reference 1 radio options) */}
            <div className="space-y-3 pt-2">
              {LIKERT_OPTIONS.map(opt => {
                const isSelected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full text-left p-4 rounded-brand border transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-brand-primary bg-brand-primary-light/40 shadow-sm'
                        : 'border-brand-border bg-white hover:border-brand-primary/50 hover:bg-brand-bg/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-brand-primary bg-brand-primary'
                            : 'border-brand-border group-hover:border-brand-muted'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-brand-primary' : 'text-brand-dark'}`}>
                        {language === 'te' ? opt.label_te : opt.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Navigation Buttons (Mirrors Reference 1 previous/next buttons) */}
            <div className="flex items-center justify-between pt-6 border-t border-brand-borderLight">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-brand-sm border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-dark hover:bg-brand-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-brand-sm bg-brand-primary text-white text-xs font-bold shadow-subtle hover:bg-brand-primary-hover transition-colors"
              >
                <span>{currentIndex === ASSESSMENT_QUESTIONS.length - 1 ? 'View Matches →' : 'Next →'}</span>
              </button>
            </div>
          </main>

          {/* Right Context Guidance Card (Mirrors Reference 1 right card with mountain illustration) */}
          <aside className="lg:col-span-3 bg-white border border-brand-border rounded-brand p-5 shadow-subtle space-y-6">
            {/* Mountain Graphic Badge */}
            <div className="h-40 rounded-brand-sm bg-gradient-to-b from-brand-primary-light to-brand-bg flex items-center justify-center p-4 border border-brand-borderLight">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-brand-primary">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-brand-primary tracking-wide">
                  5-Factor Guidance Engine
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-brand-dark text-base">
                {t('why_assessment_matters')}
              </h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                {t('why_assessment_desc')}
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-borderLight text-center">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-1">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-brand-dark">{t('self_awareness')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-brand-dark">{t('better_choices')}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-brand-dark">{t('stronger_future')}</span>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          <div className="bg-white border border-brand-border rounded-brand p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Assessment Completed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark mt-2 tracking-tight">
                Your Personalized Career Matches
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
                Scores are calculated using the 5-factor transparent heuristic (Interests: 35%, Subjects: 25%, Skills: 20%, Education: 15%, Workstyle: 5%).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCompleted(false)}
                className="px-4 py-2.5 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-dark hover:bg-brand-bg transition-colors"
              >
                Retake Assessment
              </button>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 text-xs font-bold rounded-brand-sm bg-brand-primary text-white shadow-subtle hover:bg-brand-primary-hover transition-colors"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>

          {/* Matched Careers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((match, idx) => {
              const { career, compatibilityScore, breakdown, rationale, missingSkills } = match;
              return (
                <div
                  key={career.id}
                  className="bg-white border border-brand-border rounded-brand p-6 shadow-subtle hover:shadow-card hover:border-brand-primary transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{career.emoji}</div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-brand-primary">
                          {compatibilityScore}%
                        </span>
                        <div className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                          Match Score
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-brand-dark">
                        {career.name}
                      </h3>
                      <div className="text-xs text-brand-muted font-medium">
                        {career.name_te}
                      </div>
                      <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                        {rationale}
                      </p>
                    </div>

                    {/* Breakdown Pill Row */}
                    <div className="bg-brand-bg rounded-brand-sm p-2.5 text-[11px] grid grid-cols-2 gap-2 border border-brand-borderLight">
                      <div>
                        <span className="text-brand-muted">Interests:</span>{' '}
                        <span className="font-semibold text-brand-dark">{breakdown.interestScore}/35</span>
                      </div>
                      <div>
                        <span className="text-brand-muted">Subjects:</span>{' '}
                        <span className="font-semibold text-brand-dark">{breakdown.subjectScore}/25</span>
                      </div>
                      <div>
                        <span className="text-brand-muted">Skills:</span>{' '}
                        <span className="font-semibold text-brand-dark">{breakdown.skillScore}/20</span>
                      </div>
                      <div>
                        <span className="text-brand-muted">Education:</span>{' '}
                        <span className="font-semibold text-brand-dark">{breakdown.educationScore}/15</span>
                      </div>
                    </div>

                    {missingSkills.length > 0 && (
                      <div className="text-xs">
                        <span className="font-semibold text-brand-muted">Recommended to learn:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {missingSkills.slice(0, 2).map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-brand-borderLight flex items-center gap-2">
                    <Link
                      to={`/careers/${career.id}`}
                      onClick={() => setActiveCareerId(career.id)}
                      className="flex-1 text-center py-2 px-3 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors"
                    >
                      View Career Details
                    </Link>
                    <Link
                      to="/roadmap"
                      onClick={() => setActiveCareerId(career.id)}
                      className="py-2 px-3 rounded-brand-sm border border-brand-border text-brand-dark text-xs font-semibold hover:bg-brand-bg transition-colors"
                    >
                      Roadmap
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
