import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ClipboardList,
  GitCompare,
  Wallet,
  Sparkles,
  MapPin,
  MessageSquareCode,
  ShieldCheck,
  Award,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();

  const methodologyStages = [
    {
      num: "01",
      title: "Student Input",
      title_te: "01 · విద్యార్థి వివరాల సేకరణ",
      desc: "Structured intake for current stream, natural interests, work preferences, and realistic INR education budgets.",
      icon: ClipboardListIcon
    },
    {
      num: "02",
      title: "Profile Synthesis",
      title_te: "02 · ప్రొఫైల్ విశ్లేషణ",
      desc: "Transparent rule-based scoring translating your inputs into weighted aptitude and interest vector matches.",
      icon: Layers
    },
    {
      num: "03",
      title: "Recommendation Engine",
      title_te: "03 · సిఫార్సు విధానం",
      desc: "Explainable 5-factor scoring (Interest 35%, Subject 25%, Skill 20%, Pathway 15%, Work-style 5%).",
      icon: Sparkles
    },
    {
      num: "04",
      title: "Real-World Guidance",
      title_te: "04 · ప్రత్యక్ష అనుభవాలు",
      desc: "Try hands-on career demos and read authentic peer reviews before committing years of study.",
      icon: MessageSquareCode
    },
    {
      num: "05",
      title: "Skill-Gap Diagnostics",
      title_te: "05 · నైపుణ్య లోపాల పరిశీలన",
      desc: "Compare your current skills with industry expectations and prioritize the top 3 skills to learn next.",
      icon: GitCompare
    },
    {
      num: "06",
      title: "Milestone Roadmap",
      title_te: "06 · వ్యక్తిగత ప్రణాళిక",
      desc: "Ordered learning milestones, hands-on portfolio projects, and persistent progress tracking.",
      icon: Compass
    }
  ];

  function ClipboardListIcon(props: any) {
    return <GraduationCap {...props} />;
  }

  return (
    <div className="space-y-16 py-6 sm:py-10 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-surface border border-brand-border rounded-brand-lg p-6 sm:p-12">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-elevated text-brand-cyan text-xs font-bold tracking-wide uppercase border border-brand-border">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('hero_eyebrow')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight leading-tight">
            {t('hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-brand bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary-hover transition-colors"
            >
              <span>{t('btn_start_assessment')}</span>
            </Link>

            <Link
              to="/careers"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-brand bg-brand-elevated text-brand-dark text-sm font-semibold border border-brand-border hover:border-brand-primary transition-colors"
            >
              <span>{t('btn_explore_careers')}</span>
              <ArrowRight className="w-4 h-4 text-brand-primary" />
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-brand bg-brand-surface text-brand-primary text-sm font-semibold border border-brand-border hover:bg-brand-elevated transition-colors"
            >
              <span>{t('btn_view_dashboard')}</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-brand-border">
            <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
              <div className="text-2xl font-black text-brand-primary">10+</div>
              <div className="text-xs font-semibold text-brand-muted mt-0.5">Verified Indian Tracks</div>
            </div>
            <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
              <div className="text-2xl font-black text-brand-primary">5-Factor</div>
              <div className="text-xs font-semibold text-brand-muted mt-0.5">Transparent Scoring</div>
            </div>
            <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
              <div className="text-2xl font-black text-brand-primary">₹0</div>
              <div className="text-xs font-semibold text-brand-muted mt-0.5">SWAYAM / Free Tracks</div>
            </div>
            <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
              <div className="text-2xl font-black text-brand-cyan">Live GPS</div>
              <div className="text-xs font-semibold text-brand-muted mt-0.5">Institution Navigation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-dark tracking-tight">
            Quick Actions
          </h2>
          <span className="text-xs font-semibold text-brand-muted">Direct Shortcuts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/assessment"
            className="p-5 rounded-brand bg-brand-surface border border-brand-border hover:border-brand-primary transition-colors flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-brand-sm bg-brand-elevated text-brand-primary border border-brand-border flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-dark text-base">Take Assessment</h3>
                <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Discover your academic strengths and recommended pathways in 5 minutes.
              </p>
            </div>
          </Link>

          <Link
            to="/navigation"
            className="p-5 rounded-brand bg-brand-surface border border-brand-border hover:border-brand-primary transition-colors flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-brand-sm bg-brand-elevated text-brand-cyan border border-brand-border flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-dark text-base">Find Institution & Navigate</h3>
                <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Discover nearby verified colleges, ITIs, and polytechnics with live turn-by-turn routing.
              </p>
            </div>
          </Link>

          <Link
            to="/reviews"
            className="p-5 rounded-brand bg-brand-surface border border-brand-border hover:border-brand-primary transition-colors flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-brand-sm bg-brand-elevated text-brand-violet border border-brand-border flex items-center justify-center flex-shrink-0">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-dark text-base">Try Career Demos</h3>
                <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Experience starter coding, soil analysis, and solar sizing tasks with real student reviews.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 6-Stage PathSetu Methodology */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-wider">
            <span>Transparent Methodology</span>
          </div>
          <h2 className="text-2xl font-black text-brand-dark tracking-tight mt-1">
            The Six-Stage PathSetu Guidance Framework
          </h2>
          <p className="text-sm text-brand-muted mt-1 max-w-2xl">
            No mysterious algorithms or expensive tests. Every recommendation and readiness calculation follows a documented, open-access methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {methodologyStages.map(stage => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.num}
                className="bg-brand-surface border border-brand-border rounded-brand p-5 hover:border-brand-primary transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-brand-primary bg-brand-elevated border border-brand-border px-2.5 py-1 rounded-md">
                      STAGE {stage.num}
                    </span>
                    <Icon className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark">
                    {language === 'te' ? stage.title_te : stage.title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Career Tracks */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-brand-dark tracking-tight">
              Explore 10+ Diverse Indian Career Pathways
            </h2>
            <p className="text-xs text-brand-muted mt-1">
              Verified pathways with government vs private costs, eligibility, and scholarships.
            </p>
          </div>
          <Link
            to="/careers"
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAREERS.slice(0, 6).map(career => (
            <div
              key={career.id}
              className="bg-brand-surface border border-brand-border rounded-brand p-5 hover:border-brand-primary transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{career.emoji}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-elevated text-brand-cyan border border-brand-border">
                    {career.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-brand-dark mt-3">
                  {career.name}
                </h3>
                <div className="text-xs font-medium text-brand-muted -mt-0.5">
                  {career.name_te}
                </div>
                <p className="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed">
                  {career.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-brand-border text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-brand-dark">
                    <span className="text-brand-muted">Govt Fees:</span>
                    <span className="font-semibold text-brand-cyan">
                      ₹{career.estimated_education_cost_inr.annual_min_govt.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-brand-dark">
                    <span className="text-brand-muted">Entry Salary:</span>
                    <span className="font-semibold">{career.entry_salary_range_inr}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 flex items-center gap-2">
                <Link
                  to={`/careers/${career.id}`}
                  className="flex-1 text-center py-2 px-3 rounded-brand-sm bg-brand-elevated text-brand-dark text-xs font-bold hover:bg-brand-primary hover:text-white transition-colors border border-brand-border hover:border-brand-primary"
                >
                  View Details & Skills
                </Link>
                <Link
                  to="/compare"
                  className="p-2 rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-colors"
                  title="Compare"
                >
                  <GitCompare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
