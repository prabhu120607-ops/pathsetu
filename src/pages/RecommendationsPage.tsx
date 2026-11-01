import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  GitCompare,
  ArrowRight,
  BookOpen,
  Wallet,
  GraduationCap,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RecommendationMatch } from '../types';
import { computeRecommendations } from '../services/recommendationService';
import { FadeIn, TextReveal } from '../components/common/Motion';

export const RecommendationsPage: React.FC = () => {
  const { profile, updateProfile, activeCareerId, setActiveCareerId, toggleComparisonCareer } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [matches, setMatches] = useState<RecommendationMatch[]>([]);
  const [selectedSuccessCareer, setSelectedSuccessCareer] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try to read last assessment matches from localStorage
    try {
      const stored = localStorage.getItem('pathsetu_last_assessment');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.matches && parsed.matches.length > 0) {
          setMatches(parsed.matches.slice(0, 3));
          return;
        }
      }
    } catch (e) {
      console.warn(e);
    }

    // 2. Fallback: compute recommendations directly from profile
    const recs = computeRecommendations(profile);
    setMatches(recs.slice(0, 3));
  }, [profile]);

  const handleSelectCareer = (careerId: string) => {
    setActiveCareerId(careerId);
    updateProfile({ selectedCareerId: careerId });
    setSelectedSuccessCareer(careerId);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  const handleCompare = (careerId: string) => {
    toggleComparisonCareer(careerId);
    navigate('/compare');
  };

  return (
    <div className="py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <FadeIn duration={0.35}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-cyan border border-brand-border text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explainable 5-Factor Career Recommendations</span>
              </div>
              <TextReveal
                text={language === 'te' ? 'మీకు అత్యంత అనువైన టాప్ 3 కెరీర్ మార్గాలు' : 'Your Top 3 Career Pathways'}
                as="h1"
                className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight"
              />
              <p className="text-xs sm:text-sm text-brand-muted max-w-2xl leading-relaxed">
                Matches are calculated transparently using your natural interests (35%), current academic stream (25%), strengths & skills (20%), education compatibility (15%), and work style (5%).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark bg-brand-elevated transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Questionnaire</span>
              </Link>
            </div>
          </div>

          <div className="p-3 rounded-brand-sm bg-brand-elevated border border-brand-border text-[11px] text-brand-muted flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-cyan flex-shrink-0" />
            <span>
              <strong>Note on Guidance Scores:</strong> These compatibility percentages represent alignment indicators based on your current inputs, not deterministic guarantees of future success.
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Selected Career Success Modal Banner */}
      {selectedSuccessCareer && (
        <FadeIn duration={0.3}>
          <div className="p-5 rounded-brand bg-brand-surface border-2 border-brand-primary flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark">
                  Career Pathway Selected & Saved to Profile!
                </h4>
                <p className="text-xs text-brand-muted">
                  You are now actively tracking this pathway. Your milestone progress, skill checklist, and statutory resources are available on your dashboard.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-bold rounded-brand bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
              >
                Go to Dashboard →
              </Link>
              <Link
                to="/profile"
                className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-bold rounded-brand border border-brand-border text-brand-dark hover:bg-brand-elevated transition-colors"
              >
                View Student Profile
              </Link>
              <Link
                to="/roadmap"
                className="flex-1 sm:flex-initial text-center px-4 py-2 text-xs font-bold rounded-brand border border-brand-border text-brand-dark hover:bg-brand-elevated transition-colors"
              >
                View Roadmap
              </Link>
            </div>
          </div>
        </FadeIn>
      )}

      {/* 3 Matched Career Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {matches.map((match, idx) => {
          const { career, compatibilityScore, breakdown, rationale, matchedInterests, matchedSubjects, matchedSkills, missingSkills } = match;
          const isCurrentActive = activeCareerId === career.id;

          return (
            <FadeIn key={career.id} delay={idx * 0.1} className="h-full">
              <div
                className={`h-full bg-brand-surface border rounded-brand p-6 flex flex-col justify-between space-y-6 transition-all ${isCurrentActive
                    ? 'border-brand-primary ring-1 ring-brand-primary shadow-sm'
                    : 'border-brand-border hover:border-brand-primary/60'
                  }`}
              >
                <div className="space-y-5">
                  {/* Top Rank Badge & Compatibility */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl">{career.emoji}</span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-elevated text-brand-primary border border-brand-border">
                          Recommendation #{idx + 1}
                        </span>
                        <div className="text-xs text-brand-muted font-medium mt-0.5">{career.category}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-brand-primary tracking-tight">
                        {compatibilityScore}%
                      </div>
                      <div className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                        Match Score
                      </div>
                    </div>
                  </div>

                  {/* Title & Taglines */}
                  <div>
                    <h3 className="text-lg font-bold text-brand-dark leading-snug">
                      {career.name}
                    </h3>
                    <div className="text-xs font-semibold text-brand-muted">
                      {career.name_te}
                    </div>
                    <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                      {career.desc}
                    </p>
                  </div>

                  {/* Why this matches you */}
                  <div className="p-3.5 rounded-brand-sm bg-brand-elevated border border-brand-border space-y-2">
                    <div className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Why this pathway matches you:</span>
                    </div>
                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      {rationale}
                    </p>

                    {/* Breakdown Progress Bars */}
                    <div className="space-y-1.5 pt-2 border-t border-brand-border text-[10px]">
                      <div className="flex justify-between font-semibold">
                        <span className="text-brand-muted">Interests (35%):</span>
                        <span className="text-brand-dark">{breakdown.interestScore}/35 pts</span>
                      </div>
                      <div className="w-full bg-brand-card rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${(breakdown.interestScore / 35) * 100}%` }} />
                      </div>

                      <div className="flex justify-between font-semibold pt-1">
                        <span className="text-brand-muted">Subjects (25%):</span>
                        <span className="text-brand-dark">{breakdown.subjectScore}/25 pts</span>
                      </div>
                      <div className="w-full bg-brand-card rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-cyan h-1.5 rounded-full" style={{ width: `${(breakdown.subjectScore / 25) * 100}%` }} />
                      </div>

                      <div className="flex justify-between font-semibold pt-1">
                        <span className="text-brand-muted">Skills (20%):</span>
                        <span className="text-brand-dark">{breakdown.skillScore}/20 pts</span>
                      </div>
                      <div className="w-full bg-brand-card rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-violet h-1.5 rounded-full" style={{ width: `${(breakdown.skillScore / 20) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Cost & Duration in INR */}
                  <div className="p-3 rounded-brand-sm border border-brand-border text-xs space-y-1">
                    <div className="flex justify-between text-brand-dark">
                      <span className="text-brand-muted">Govt College Tuition:</span>
                      <span className="font-bold text-brand-cyan">
                        ₹{career.estimated_education_cost_inr.annual_min_govt.toLocaleString('en-IN')} - ₹{career.estimated_education_cost_inr.annual_max_govt.toLocaleString('en-IN')} / yr
                      </span>
                    </div>
                    <div className="flex justify-between text-brand-dark">
                      <span className="text-brand-muted">Study Duration:</span>
                      <span className="font-semibold">{career.study_duration}</span>
                    </div>
                    <div className="flex justify-between text-brand-dark">
                      <span className="text-brand-muted">Entry Salary Range:</span>
                      <span className="font-semibold">{career.entry_salary_range_inr}</span>
                    </div>
                  </div>

                  {/* Missing Skills to develop */}
                  {missingSkills.length > 0 && (
                    <div className="space-y-1.5 text-xs">
                      <span className="font-bold text-brand-dark">Next competencies to develop:</span>
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.slice(0, 3).map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-brand-sm bg-brand-elevated border border-brand-border text-[11px] text-brand-muted font-medium"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-brand-border space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSelectCareer(career.id)}
                    className={`w-full py-2.5 px-4 rounded-brand-sm text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${isCurrentActive
                        ? 'bg-brand-elevated border border-brand-primary text-brand-primary'
                        : 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm'
                      }`}
                  >
                    <span>{isCurrentActive ? '✓ Currently Selected & Tracking' : 'Select & Track This Career Path'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/careers/${career.id}`}
                      className="flex-1 py-1.5 text-center text-xs font-semibold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark hover:bg-brand-elevated transition-colors"
                    >
                      Full Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleCompare(career.id)}
                      className="p-1.5 rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-colors"
                      title="Compare side-by-side"
                    >
                      <GitCompare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};

