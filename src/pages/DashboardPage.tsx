import React, { useEffect, useState } from 'react';
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
  BookOpen,
  Video,
  User,
  PlusCircle,
  Award,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';
import { communityService } from '../services/communityService';
import { StudentStory } from '../types';
import { FadeIn, MotionCard } from '../components/common/Motion';

export const DashboardPage: React.FC = () => {
  const {
    user,
    profile,
    activeCareerId,
    completedMilestones,
    studyStreak,
    weeklyHours,
    calculateProfileCompletion
  } = useAuth();
  const { t, language } = useLanguage();

  const [myStories, setMyStories] = useState<StudentStory[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);

  const activeCareer = CAREERS.find(c => c.id === activeCareerId) || CAREERS[0];
  const completedForCareer = completedMilestones[activeCareer.id] || [];
  const totalMilestones = activeCareer.roadmap_milestones.length;
  const progressPct = totalMilestones > 0
    ? Math.round((completedForCareer.length / totalMilestones) * 100)
    : 35;

  const profileCompletion = calculateProfileCompletion();

  useEffect(() => {
    let isMounted = true;
    async function loadUserStories() {
      setLoadingStories(true);
      try {
        const stories = await communityService.getStories({ userId: user?.id });
        if (isMounted) {
          // If authenticated, get own stories; if demo fallback, get stories created by this student name
          const mine = stories.filter(
            s => (user?.id && s.user_id === user.id) || s.author_name === profile.full_name
          );
          setMyStories(mine);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        if (isMounted) setLoadingStories(false);
      }
    }
    loadUserStories();
    return () => {
      isMounted = false;
    };
  }, [user, profile.full_name]);

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
      statusColor: "bg-brand-elevated text-brand-muted border-brand-border",
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
    <div className="py-6 sm:py-8 space-y-8 max-w-7xl mx-auto">
      {/* Profile Completion Callout if not 100% */}
      {profileCompletion < 100 && (
        <FadeIn>
          <div className="bg-brand-surface border border-brand-border rounded-brand p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-cyan flex-shrink-0 font-bold text-xs">
                {profileCompletion}%
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-dark">
                  Complete Your Student Profile
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Adding your school, stream, learning interests, and target careers improves recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/profile/setup"
                className="px-3.5 py-1.5 text-xs font-bold rounded-brand bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
              >
                Complete Profile →
              </Link>
            </div>
          </div>
        </FadeIn>
      )}

      {/* Welcome Header */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
            alt={profile.full_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-brand-border flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                Welcome, {profile.full_name}!
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-brand-elevated text-brand-cyan border border-brand-border">
                {profile.education_level || 'Student Explorer'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Active Career Pathway: <span className="font-semibold text-brand-dark">{activeCareer.name}</span>. Stay consistent and build verifiable proof of work.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/profile"
            className="px-3.5 py-2 text-xs font-bold rounded-brand border border-brand-border bg-brand-elevated text-brand-dark hover:border-brand-primary transition-colors flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-brand-cyan" />
            <span>My Profile</span>
          </Link>
          <Link
            to="/roadmap"
            className="px-4 py-2 text-xs font-bold rounded-brand bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors flex items-center gap-1"
          >
            <span>My Roadmap →</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Roadmap Overall Progress */}
        <div className="p-6 rounded-brand bg-brand-surface border border-brand-border flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center justify-between">
              <span>Pathway Progress</span>
              <span className="text-[11px] text-brand-primary font-bold">{activeCareer.name}</span>
            </div>
            <div className="text-3xl font-black text-brand-dark mt-2">
              {progressPct}%
            </div>
            <div className="w-full bg-brand-elevated rounded-full h-2 mt-3 overflow-hidden border border-brand-border">
              <div
                className="bg-brand-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="text-xs font-semibold text-brand-dark mt-4 flex items-center justify-between">
            <span>{completedForCareer.length} of {totalMilestones} milestones mastered</span>
            <Link to="/recommendations" className="text-brand-primary hover:underline font-bold text-[11px]">
              Change Track
            </Link>
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
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-elevated text-brand-dark border border-brand-border">
                {studyStreak} Days 🔥
              </span>
            </div>
            <div className="text-xs text-brand-muted mt-0.5">
              Stay consistent — every day counts
            </div>

            {/* 7 Day Pill Icons */}
            <div className="grid grid-cols-7 gap-1.5 mt-4">
              {weekDays.map(d => (
                <div
                  key={d.day}
                  className={`flex flex-col items-center justify-center p-2 rounded-brand-sm border text-xs font-bold ${
                    d.active
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-elevated text-brand-muted border-brand-border'
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

      {/* Student Community Video Section */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-brand-cyan" />
              <h2 className="text-base font-bold text-brand-dark">
                My Success Stories & Video Uploads
              </h2>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Document your progress, explain solved problems, and inspire fellow students across India.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/community/upload"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-brand bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Upload Video</span>
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-brand bg-brand-elevated text-brand-dark border border-brand-border hover:border-brand-primary transition-colors"
            >
              <span>Explore Feed →</span>
            </Link>
          </div>
        </div>

        {myStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {myStories.map(story => (
              <div
                key={story.id}
                className="bg-brand-elevated border border-brand-border rounded-brand overflow-hidden p-3 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded overflow-hidden bg-black mb-2">
                    <img
                      src={story.thumbnail_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/80 text-white">
                      {story.visibility}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-brand-dark line-clamp-1">{story.title}</h4>
                  <p className="text-[11px] text-brand-muted line-clamp-2 mt-0.5">
                    {story.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-muted">
                  <span>{story.likes_count} likes</span>
                  <Link
                    to={`/community/story/${story.id}`}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Watch →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center rounded-brand bg-brand-elevated border border-brand-border p-4 space-y-2">
            <Video className="w-8 h-8 text-brand-muted mx-auto" />
            <h4 className="text-xs font-bold text-brand-dark">No Videos Uploaded Yet</h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Share a 1-minute video explaining a project you completed, a milestone achieved, or advice for juniors in your district!
            </p>
            <div className="pt-2">
              <Link
                to="/community/upload"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-brand bg-brand-primary text-white hover:bg-brand-primary-hover"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Upload Your First Video
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Strands Section */}
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

      {/* Lower Row: Mastery Summary Table + Next Steps Card */}
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
              <tbody className="divide-y divide-brand-border">
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

        {/* Next Steps Callout Card */}
        <div className="lg:col-span-4 bg-brand-surface border border-brand-border rounded-brand p-6 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-cyan tracking-wider">
              Next Step on Track
            </span>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              Recommended for your current track ({activeCareer.name}).
            </p>
          </div>

          <div className="bg-brand-elevated rounded-brand-sm p-4 border border-brand-border space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-surface text-brand-cyan border border-brand-border flex items-center justify-center flex-shrink-0">
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
              className="w-full flex items-center justify-center py-2 px-3 rounded-brand bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors"
            >
              Open Roadmap Task →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
