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
  GraduationCap,
  Users,
  Video,
  Play,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';
import { INITIAL_COMMUNITY_STORIES } from '../data/sampleStories';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, MotionCard } from '../components/common/Motion';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();

  const featuredStories = INITIAL_COMMUNITY_STORIES.slice(0, 3);

  const methodologyStages = [
    {
      num: "01",
      title: "Student Input",
      title_te: "01 · విద్యార్థి వివరాల సేకరణ",
      desc: "Structured intake for current stream, natural interests, work preferences, and realistic INR education budgets.",
      icon: GraduationCap
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
      desc: "Watch real student video journeys and peer reviews before committing years of study.",
      icon: Video
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

  return (
    <div className="space-y-16 py-6 sm:py-10 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-surface border border-brand-border rounded-brand-lg p-6 sm:p-12">
        <div className="max-w-3xl space-y-6">
          <FadeIn direction="down" duration={0.4}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-elevated text-brand-cyan text-xs font-bold tracking-wide uppercase border border-brand-border">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero_eyebrow')}</span>
            </div>
          </FadeIn>

          <TextReveal
            text={t('hero_title')}
            className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight leading-tight"
          />

          <FadeIn delay={0.2} duration={0.5}>
            <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
              {t('hero_desc')}
            </p>
          </FadeIn>

          <FadeIn delay={0.3} duration={0.5}>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-brand bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary-hover transition-colors"
              >
                <span>{t('btn_start_assessment')}</span>
              </Link>

              <Link
                to="/community"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-brand bg-brand-elevated text-brand-dark text-sm font-semibold border border-brand-border hover:border-brand-primary transition-colors"
              >
                <Users className="w-4 h-4 text-brand-cyan" />
                <span>Student Stories</span>
              </Link>

              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-brand bg-brand-surface text-brand-dark text-sm font-semibold border border-brand-border hover:bg-brand-elevated transition-colors"
              >
                <span>{t('btn_explore_careers')}</span>
                <ArrowRight className="w-4 h-4 text-brand-primary" />
              </Link>
            </div>
          </FadeIn>

          {/* Quick Stats Grid */}
          <FadeIn delay={0.4} duration={0.5}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-brand-border">
              <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
                <div className="text-2xl font-black text-brand-primary">10+</div>
                <div className="text-xs font-semibold text-brand-muted mt-0.5">Verified Indian Tracks</div>
              </div>
              <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
                <div className="text-2xl font-black text-brand-primary">5-Factor</div>
                <div className="text-xs font-semibold text-brand-muted mt-0.5">Explainable Scoring</div>
              </div>
              <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
                <div className="text-2xl font-black text-brand-primary">Video</div>
                <div className="text-xs font-semibold text-brand-muted mt-0.5">Student Peer Journeys</div>
              </div>
              <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border">
                <div className="text-2xl font-black text-brand-cyan">Live GPS</div>
                <div className="text-xs font-semibold text-brand-muted mt-0.5">Institution Navigation</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3-Step Student Guidance Journey Flow (User Flow) */}
      <section className="bg-brand-surface border border-brand-border rounded-brand-lg p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-primary border border-brand-border text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>How PathSetu Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            From Your Requirements to a Verified Career Future
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Sign up, take the quick 5-step assessment, and get a tailored student profile and career pathway roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-brand bg-brand-elevated border border-brand-border space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center font-black text-xs text-brand-dark">
                01
              </span>
              <span className="text-[11px] font-bold text-brand-muted uppercase">Start Here</span>
            </div>
            <h3 className="font-bold text-sm text-brand-dark">Sign Up or Log In</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Create your account with your education stage and preferred language (English or Telugu).
            </p>
          </div>

          <div className="p-5 rounded-brand bg-brand-elevated border-2 border-brand-primary space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-black text-xs">
                02
              </span>
              <span className="text-[11px] font-bold text-brand-cyan uppercase">Core Step</span>
            </div>
            <h3 className="font-bold text-sm text-brand-dark">Take Assessment</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Answer 5 focused questions about your current stream, interests, strengths, and realistic education budget.
            </p>
          </div>

          <div className="p-5 rounded-brand bg-brand-elevated border border-brand-border space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center font-black text-xs text-brand-dark">
                03
              </span>
              <span className="text-[11px] font-bold text-brand-muted uppercase">Results & Tracking</span>
            </div>
            <h3 className="font-bold text-sm text-brand-dark">Build Profile & Track Path</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Your profile is automatically populated with top-matched career tracks, explainable scores, and learning roadmaps.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-brand bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-hover shadow-sm transition-colors"
          >
            <span>Take Assessment Now →</span>
          </Link>
        </div>
      </section>

      {/* Student Community Video Section Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cyan uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Real Peer Experiences</span>
            </div>
            <h2 className="text-2xl font-black text-brand-dark tracking-tight mt-1">
              Student Success Stories & Video Journeys
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
              Hear directly from Indian students who navigated Class 10, Intermediate, and College transitions into tech, agriculture, design, and public services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/community/upload"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-brand text-xs font-bold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Share Your Story</span>
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-brand text-xs font-bold bg-brand-elevated text-brand-dark border border-brand-border hover:border-brand-primary transition-colors"
            >
              <span>View All Stories →</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStories.map(story => (
            <MotionCard key={story.id} className="h-full">
              <div className="bg-brand-surface border border-brand-border rounded-brand overflow-hidden flex flex-col justify-between h-full hover:border-brand-primary transition-colors">
                <div>
                  {/* Thumbnail with overlay */}
                  <div className="relative aspect-video bg-black">
                    <img
                      src={story.thumbnail_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/90 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </div>
                    </div>
                    {story.is_demo_seed ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-brand-muted border border-white/10">
                        Demo Reference
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-primary text-white">
                        Student Story
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white">
                      0:45
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-elevated text-brand-primary border border-brand-border">
                        {story.career_name}
                      </span>
                      <span className="text-[11px] text-brand-muted">
                        {story.author_education}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-brand-dark line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-brand-muted line-clamp-2">
                      {story.description}
                    </p>

                    {/* Author info */}
                    <div className="pt-2 flex items-center gap-2 border-t border-brand-border">
                      <img
                        src={story.author_avatar}
                        alt={story.author_name}
                        className="w-6 h-6 rounded-full object-cover border border-brand-border"
                      />
                      <span className="text-xs font-semibold text-brand-dark truncate">
                        {story.author_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to={`/community/story/${story.id}`}
                    className="w-full flex items-center justify-center py-2 px-3 rounded-brand text-xs font-bold bg-brand-elevated text-brand-dark border border-brand-border hover:border-brand-primary transition-colors"
                  >
                    Watch Story Breakdown →
                  </Link>
                </div>
              </div>
            </MotionCard>
          ))}
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
                Discover your academic strengths and recommended pathways with 5-factor scoring.
              </p>
            </div>
          </Link>

          <Link
            to="/community"
            className="p-5 rounded-brand bg-brand-surface border border-brand-border hover:border-brand-primary transition-colors flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-brand-sm bg-brand-elevated text-brand-cyan border border-brand-border flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-brand-dark text-base">Student Stories</h3>
                <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Watch peers explain their real preparation roadmaps, free courses, and college choices.
              </p>
            </div>
          </Link>

          <Link
            to="/navigation"
            className="p-5 rounded-brand bg-brand-surface border border-brand-border hover:border-brand-primary transition-colors flex items-start gap-4 group"
          >
            <div className="w-12 h-12 rounded-brand-sm bg-brand-elevated text-brand-violet border border-brand-border flex items-center justify-center flex-shrink-0">
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
