import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Share2,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileDown,
  Award,
  Layers,
  GraduationCap,
  ExternalLink,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { CAREERS } from '../data/careers';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { CircularGauge } from '../components/common/CircularGauge';

export const CareerDetailPage: React.FC = () => {
  const { careerId } = useParams<{ careerId: string }>();
  const { profile, updateProfile, setActiveCareerId, toggleComparisonCareer, selectedComparisonIds } = useAuthProgress();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const career = CAREERS.find(c => c.id === careerId) || CAREERS[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'skill_gap' | 'roadmap'>('overview');
  const [userCheckedSkills, setUserCheckedSkills] = useState<string[]>(() => {
    return profile.existingSkills || [];
  });
  const [copyNotice, setCopyNotice] = useState(false);

  // Compute live interactive readiness based on checked skills
  const totalSkills = career.required_skills.length;
  const matchedSkillsCount = career.required_skills.filter(req =>
    userCheckedSkills.some(us => us.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us.toLowerCase()))
  ).length;
  const matchPct = totalSkills > 0 ? Math.min(Math.max(Math.round((matchedSkillsCount / totalSkills) * 100), 20), 98) : 50;

  const toggleSkill = (skillName: string) => {
    const isPresent = userCheckedSkills.some(s => s.toLowerCase() === skillName.toLowerCase());
    let next: string[];
    if (isPresent) {
      next = userCheckedSkills.filter(s => s.toLowerCase() !== skillName.toLowerCase());
    } else {
      next = [...userCheckedSkills, skillName];
    }
    setUserCheckedSkills(next);
    updateProfile({ existingSkills: next });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyNotice(true);
      setTimeout(() => setCopyNotice(false), 2000);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-brand-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-primary">Home</Link>
        <span>/</span>
        <Link to="/careers" className="hover:text-brand-primary">Career Tracks</Link>
        <span>/</span>
        <span className="font-semibold text-brand-dark">{career.name}</span>
      </nav>

      {/* Main Career Header (Mirrors Reference 5 Header) */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8  flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{career.emoji}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                  {career.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-elevated text-brand-primary border border-brand-border text-xs font-bold">
                  {career.badge}
                </span>
              </div>
              <div className="text-xs font-medium text-brand-muted mt-0.5">
                {career.name_te} • {career.category}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-brand-muted">
            <span>Average Entry Salary: <strong className="text-brand-dark">{career.entry_salary_range_inr}</strong></span>
            <span>•</span>
            <span>Duration: <strong className="text-brand-dark">{career.study_duration}</strong></span>
            <span>•</span>
            <span className="text-brand-cyan font-semibold">{career.typical_workstyle}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={handleShare}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-brand-sm border border-brand-border text-xs font-semibold text-brand-dark hover:bg-brand-elevated transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copyNotice ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => {
              setActiveCareerId(career.id);
              navigate('/roadmap');
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-brand-sm bg-brand-primary text-white text-xs font-bold  hover:bg-brand-primary-hover transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Set as My Pathway</span>
          </button>
        </div>
      </div>

      {/* Tabs Row (Mirrors Reference 5 tabs) */}
      <div className="flex items-center border-b border-brand-border space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'overview'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-muted hover:text-brand-dark'
          }`}
        >
          Job Overview
        </button>
        <button
          onClick={() => setActiveTab('skill_gap')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'skill_gap'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-muted hover:text-brand-dark'
          }`}
        >
          Skill Gap Analysis
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 transition-colors relative ${
            activeTab === 'roadmap'
              ? 'text-brand-primary border-b-2 border-brand-primary'
              : 'text-brand-muted hover:text-brand-dark'
          }`}
        >
          Growth Roadmap
        </button>
      </div>

      {/* Content Layout: 2 Columns matching Reference 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Main Details / Skill Gap) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab 1: Job Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Role Summary Card */}
              <div className="bg-brand-surface border border-brand-border rounded-brand p-6  space-y-4">
                <h2 className="text-base font-bold text-brand-dark">
                  Role Summary
                </h2>
                <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed">
                  {career.role_summary}
                </p>

                <div className="pt-4 border-t border-brand-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                    Key Responsibilities
                  </h3>
                  <div className="space-y-2.5">
                    {career.key_responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-brand-dark">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education & Costs Card */}
              <div className="bg-brand-surface border border-brand-border rounded-brand p-6  space-y-4">
                <h2 className="text-base font-bold text-brand-dark">
                  Verified Education Pathways & Costs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-brand-elevated/60 rounded-brand-sm border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">Government Pathway</span>
                    <span className="text-emerald-950 font-black text-base mt-1 block">
                      {career.estimated_education_cost_inr.government_route}
                    </span>
                    <p className="text-brand-dark text-[11px] mt-1">
                      Through State CET / EAPCET entrance exam merit quotas.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-brand-sm border border-amber-200">
                    <span className="font-bold text-amber-900 block">Private Institution Pathway</span>
                    <span className="text-amber-950 font-black text-base mt-1 block">
                      {career.estimated_education_cost_inr.private_route}
                    </span>
                    <p className="text-amber-800 text-[11px] mt-1">
                      Direct admissions or management quotas without fee reimbursement.
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-xs space-y-2">
                  <span className="font-bold text-brand-dark block">Recognized Degree / Certification Routes:</span>
                  <ul className="list-disc pl-5 space-y-1 text-brand-muted">
                    {career.verified_education_pathways.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Skill Gap Analysis (Mirrors Reference 5 Skill Gap Analysis Card) */}
          {activeTab === 'skill_gap' && (
            <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8  space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-brand-dark">Skill Gap Analysis</h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Click each skill below to toggle what you currently have and see your readiness update instantly.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand-elevated text-brand-primary border border-brand-border font-bold text-xs uppercase tracking-wider">
                  YOUR PROGRESS: {matchPct}% MATCH
                </span>
              </div>

              {/* Radar Gauge / Progress Row */}
              <div className="p-6 bg-brand-elevated rounded-brand border border-brand-border flex flex-col sm:flex-row items-center justify-around gap-6">
                <CircularGauge
                  value={matchPct}
                  size={150}
                  strokeWidth={14}
                  variant="semi"
                  label={`${matchPct}%`}
                  sublabel="Role Match"
                  color="#2563EB"
                  trackColor="var(--border-color)"
                />

                <div className="space-y-3 w-full sm:w-60 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-brand-dark mb-1">
                      <span>Soft Skills & Empathy</span>
                      <span className="text-brand-cyan">82% Match</span>
                    </div>
                    <div className="w-full bg-brand-elevated rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-primary h-2 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-brand-dark mb-1">
                      <span>Technical Knowledge</span>
                      <span className="text-amber-700">{matchPct}% Match</span>
                    </div>
                    <div className="w-full bg-brand-elevated rounded-full h-2 overflow-hidden">
                      <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${matchPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Skill Badges (Mirrors Reference 5 bottom badges) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
                  Required Competencies (Click to mark completed)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {career.required_skills.map(req => {
                    const isChecked = userCheckedSkills.some(
                      s => s.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(s.toLowerCase())
                    );
                    return (
                      <button
                        key={req.name}
                        type="button"
                        onClick={() => toggleSkill(req.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                          isChecked
                            ? 'bg-brand-elevated text-brand-dark border-emerald-300 shadow-xs'
                            : 'bg-brand-bg text-brand-dark/70 border-brand-border hover:border-brand-primary'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-600' : 'text-brand-muted'}`} />
                        <span>{req.name}</span>
                        <span className="text-[10px] text-brand-muted font-normal">({req.level})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Roadmap Milestones */}
          {activeTab === 'roadmap' && (
            <div className="bg-brand-surface border border-brand-border rounded-brand p-6  space-y-4">
              <h2 className="text-base font-bold text-brand-dark">
                Learning & Career Entry Milestones
              </h2>
              <div className="space-y-4">
                {career.roadmap_milestones.map((ms, idx) => (
                  <div key={ms.id} className="p-4 rounded-brand-sm border border-brand-border bg-brand-bg/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-primary">Step {idx + 1} • {ms.time}</span>
                    </div>
                    <h3 className="text-sm font-bold text-brand-dark">{ms.title}</h3>
                    <p className="text-xs text-brand-muted leading-relaxed">{ms.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Ideal Candidate DNA + Actionable Nudges (Mirrors Reference 5 right column) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Ideal Candidate DNA Card (Mirrors Reference 5 blue Ideal Candidate DNA card) */}
          <div className="bg-blue-600 text-white rounded-brand p-6  space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-base">Ideal Candidate DNA</h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              We look for individuals who connect conceptual theory with genuine ground empathy and structured problem-solving.
            </p>

            <div className="space-y-2 pt-2 border-t border-blue-500/60 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-700/60">
                <span className="text-[10px] uppercase font-bold text-blue-200 block tracking-wider">MINDSET</span>
                <span className="font-bold">{career.ideal_dna.mindset}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-700/60">
                <span className="text-[10px] uppercase font-bold text-blue-200 block tracking-wider">VIBE</span>
                <span className="font-bold">{career.ideal_dna.vibe}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-700/60">
                <span className="text-[10px] uppercase font-bold text-blue-200 block tracking-wider">STANDARD</span>
                <span className="font-bold">{career.ideal_dna.standard}</span>
              </div>
            </div>
          </div>

          {/* Actionable Nudges Card (Mirrors Reference 5 Actionable Nudges) */}
          <div className="bg-brand-surface border border-brand-border rounded-brand p-6  space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-sm text-brand-dark">Actionable Nudges</h3>
            </div>

            {/* Nudge 1: Free Course Opportunity */}
            <div className="p-3.5 rounded-brand-sm border border-brand-border bg-brand-bg/50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider">
                GROWTH OPPORTUNITY
              </span>
              <h4 className="text-xs font-bold text-brand-dark">
                Free Statutory Course Modules
              </h4>
              <p className="text-xs text-brand-muted">
                Audit accredited lectures on SWAYAM & NPTEL without paying tuition.
              </p>
              <Link
                to="/resources"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline pt-1"
              >
                <span>Find Free Courses →</span>
              </Link>
            </div>

            {/* Nudge 2: Hands-on Demo */}
            <div className="p-3.5 rounded-brand-sm border border-brand-border bg-brand-bg/50 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-brand-cyan tracking-wider">
                INTERACTIVE SIMULATION
              </span>
              <h4 className="text-xs font-bold text-brand-dark">
                Try Career Starter Task
              </h4>
              <p className="text-xs text-brand-muted">
                Experience a simulated practical challenge and submit your review.
              </p>
              <Link
                to="/reviews"
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline pt-1"
              >
                <span>Try Pathway Demo →</span>
              </Link>
            </div>

            {/* Industry Growth & Open Roles (Mirrors Reference 5 bottom metrics) */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-brand-border text-center">
              <div className="p-2 bg-brand-bg rounded-lg">
                <div className="text-lg font-black text-brand-dark">{career.industry_growth}</div>
                <div className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Growth</div>
              </div>
              <div className="p-2 bg-brand-bg rounded-lg">
                <div className="text-lg font-black text-brand-dark">{career.open_roles_india}</div>
                <div className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">Open Roles</div>
              </div>
            </div>
          </div>

          {/* Export PDF Button (Mirrors Reference 5 Export PDF) */}
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-brand-sm border border-brand-border bg-white text-brand-dark font-bold text-xs hover:bg-brand-elevated  transition-colors"
          >
            <FileDown className="w-4 h-4 text-brand-muted" />
            <span>Export Career Profile (PDF)</span>
          </button>
        </aside>
      </div>
    </div>
  );
};
