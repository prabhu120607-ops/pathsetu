import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Compass,
  Layers,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';

export const DashboardPage: React.FC = () => {
  const { profile, activeCareerId, completedMilestones, studyStreak, weeklyHours } = useAuthProgress();
  const { t, language } = useLanguage();

  const activeCareer = CAREERS.find(c => c.id === activeCareerId) || CAREERS[0];
  const completedForCareer = completedMilestones[activeCareer.id] || [];
  const totalMilestones = activeCareer.roadmap_milestones.length;
  const progressPct = totalMilestones > 0
    ? Math.round((completedForCareer.length / totalMilestones) * 100)
    : 35;

  const weekDays = [
    { day: "Mo", active: true },
    { day: "Tu", active: true },
    { day: "We", active: true },
    { day: "Th", active: true },
    { day: "Fr", active: true },
    { day: "Sa", active: false },
    { day: "Su", active: false }
  ];

  const masteryItems = [
    {
      title: "Programming Foundations & Syntax",
      date: "Oct 24, 2026",
      status: "Mastered",
      statusColor: "bg-brand-elevated text-brand-dark border border-brand-border",
      score: 92
    },
    {
      title: "Relational SQL Queries & Multi-Table Joins",
      date: "Oct 26, 2026",
      status: "In Progress",
      statusColor: "bg-brand-elevated text-brand-primary border border-brand-border",
      score: 55
    },
    {
      title: "Git Version Control & Branching Workflows",
      date: "Oct 27, 2026",
      status: "Needs Review",
      statusColor: "bg-amber-100 text-brand-muted border-amber-200",
      score: 40
    },
    {
      title: "Responsive Semantic HTML & CSS Flexbox",
      date: "Oct 28, 2026",
      status: "Mastered",
      statusColor: "bg-brand-elevated text-brand-dark border border-brand-border",
      score: 95
    }
  ];

  const nextMilestone = activeCareer.roadmap_milestones.find(
    m => !completedForCareer.includes(m.id)
  ) || activeCareer.roadmap_milestones[0];

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Welcome Header (Mirrors Reference 4: "Welcome, Name!") */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Welcome, {profile.name}!
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Personalized career tracking for <span className="font-semibold text-brand-dark">{activeCareer.name}</span>. Stay consistent and build verifiable proof of work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/assessment"
            className="px-4 py-2 text-xs font-bold rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark hover:border-brand-primary transition-colors"
          >
            Update Assessment
          </Link>
          <Link
            to="/roadmap"
            className="px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white  hover:bg-brand-primary-hover transition-colors"
          >
            My Roadmap →
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Cards (Mirrors Reference 4: Math overall progress, Weekly time, Study streak) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Roadmap Overall Progress */}
        <div className="p-6 rounded-brand bg-brand-surface border border-brand-border flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Career Pathway Progress
            </div>
            <div className="text-3xl font-black text-brand-dark mt-2">
              {progressPct}%
            </div>
            <div className="w-full bg-brand-elevated rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="text-xs font-semibold text-brand-dark mt-4">
            {completedForCareer.length} of {totalMilestones} milestones mastered
          </div>
        </div>

        {/* Card 2: Weekly Time */}
        <div className="p-6 rounded-brand bg-brand-surface border border-brand-border flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Weekly Learning Time
            </div>
            <div className="text-xs text-brand-muted mt-0.5">
              Average hours practicing skills this week
            </div>
            <div className="text-3xl font-black text-brand-dark mt-3 flex items-baseline gap-1">
              <span>{Math.floor(weeklyHours)}h</span>
              <span className="text-lg font-bold text-brand-muted">{Math.round((weeklyHours % 1) * 60)}m</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-brand-dark mt-4 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Target: 15h weekly self-directed learning</span>
          </div>
        </div>

        {/* Card 3: Study Streak */}
        <div className="p-6 rounded-brand bg-brand-surface border border-brand-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                Study Streak
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-200 text-brand-dark">
                {studyStreak} Days 🔥
              </span>
            </div>
            <div className="text-xs text-brand-muted mt-0.5">
              Stay consistent — every day counts
            </div>

            {/* 7 Day Pill Icons (Mirrors Reference 4 streak flames) */}
            <div className="grid grid-cols-7 gap-1.5 mt-4">
              {weekDays.map(d => (
                <div
                  key={d.day}
                  className={`flex flex-col items-center justify-center p-2 rounded-brand-sm border text-xs font-bold ${
                    d.active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-elevated text-brand-muted border border-brand-border'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 mb-0.5 ${d.active ? 'text-white' : 'text-brand-muted'}`} />
                  <span className="text-[10px]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-xs font-semibold text-brand-dark mt-4">
            Streak active! Complete 1 lesson today to extend it.
          </div>
        </div>
      </div>

      {/* Strands Section (Mirrors Reference 4: "Strands" cards with lesson progress) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-dark">
            Learning Strands
          </h2>
          <span className="text-xs font-semibold text-brand-muted">Core Foundation Areas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Programming Foundations", done: 4, total: 6, color: "bg-brand-primary" },
            { name: "Database & SQL Design", done: 2, total: 5, color: "bg-brand-cyan" },
            { name: "Git Version Control", done: 3, total: 3, color: "bg-brand-violet" },
            { name: "Full-Stack Project Work", done: 1, total: 4, color: "bg-brand-primary" },
          ].map(strand => (
            <div
              key={strand.name}
              className="bg-brand-surface border border-brand-border rounded-brand p-4 space-y-3"
            >
              <div className="h-16 rounded-brand-sm bg-brand-elevated border border-brand-border flex items-center justify-center">
                <Layers className="w-6 h-6 text-brand-muted/70" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-dark">{strand.name}</h3>
                <div className="w-full bg-brand-elevated rounded-full h-1.5 mt-2 overflow-hidden border border-brand-border">
                  <div
                    className={`${strand.color} h-1.5 rounded-full`}
                    style={{ width: `${(strand.done / strand.total) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] font-medium text-brand-muted mt-1.5">
                  {strand.done} of {strand.total} completed milestones
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lower Row: Mastery Summary Table + Next Steps Card (Mirrors Reference 4 bottom section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mastery Summary Table */}
        <div className="lg:col-span-8 bg-brand-surface border border-brand-border rounded-brand p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand-dark">
              Mastery Summary
            </h2>
            <span className="text-xs font-semibold text-brand-muted">Recent Diagnostics</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-border text-brand-muted uppercase text-[10px] tracking-wider font-bold">
                  <th className="pb-3">Module / Quiz Title</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderLight">
                {masteryItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-brand-elevated/40 transition-colors">
                    <td className="py-3.5 font-semibold text-brand-dark">{item.title}</td>
                    <td className="py-3.5 text-brand-muted">{item.date}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <div className="w-16 bg-brand-elevated rounded-full h-1.5 overflow-hidden border border-brand-border">
                          <div
                            className="bg-brand-primary h-1.5 rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="font-bold text-brand-dark w-7">{item.score}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Steps Callout Card (Mirrors Reference 4 right card) */}
        <div className="lg:col-span-4 bg-emerald-50 border border-emerald-200 rounded-brand p-6  space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
              Next Steps
            </span>
            <p className="text-xs text-brand-dark mt-1 leading-relaxed">
              Recommended for you based on your progress and declared goals.
            </p>
          </div>

          <div className="bg-white rounded-brand-sm p-4 border border-emerald-200/80 shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-dark">
                  {nextMilestone?.title || "Complete First Project"}
                </h3>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  {nextMilestone?.desc || "Solidify what you have learned by deploying a working portfolio deliverable."}
                </p>
              </div>
            </div>

            <Link
              to="/roadmap"
              className="w-full flex items-center justify-center py-2 px-3 rounded-brand-sm bg-brand-primary text-white text-xs font-bold shadow-xs hover:bg-brand-primary-hover transition-colors"
            >
              Open Roadmap Task →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
