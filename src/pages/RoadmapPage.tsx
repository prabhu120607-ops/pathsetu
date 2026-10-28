import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  FileDown,
  Sparkles,
  ArrowRight,
  Share2,
  Trash2
} from 'lucide-react';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';

export const RoadmapPage: React.FC = () => {
  const {
    activeCareerId,
    setActiveCareerId,
    completedMilestones,
    toggleMilestone,
    customMilestones,
    addCustomMilestone
  } = useAuthProgress();

  const { t, language } = useLanguage();

  const [selectedCareerId, setSelectedCareerId] = useState<string>(activeCareerId || 'software_dev');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  const career = CAREERS.find(c => c.id === selectedCareerId) || CAREERS[0];
  const completedForCareer = completedMilestones[career.id] || [];
  const customList = customMilestones[career.id] || [];

  const totalSteps = career.roadmap_milestones.length + customList.length;
  const totalCompleted = completedForCareer.length;
  const progressPct = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  const handleToggle = (stepId: string) => {
    toggleMilestone(career.id, stepId);
    if (!completedForCareer.includes(stepId)) {
      // Fire rewarding confetti!
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Fallback silently if canvas-confetti is not loaded
      }
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addCustomMilestone(career.id, {
      title: newTitle.trim(),
      time: newTime.trim() || 'Custom Goal',
      desc: newDesc.trim() || 'Custom milestone defined by student.'
    });
    setNewTitle('');
    setNewTime('');
    setNewDesc('');
    setIsAddCustomOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const nextAction = career.roadmap_milestones.find(m => !completedForCareer.includes(m.id)) || career.roadmap_milestones[0];

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Page Title & Career Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Stage 06 · Actionable Roadmap</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Personalized Learning & Career Milestones
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
            Ordered, step-by-step pathway from beginner to job-ready. Track progress, add custom milestones, and export your career plan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCareerId}
            onChange={e => {
              setSelectedCareerId(e.target.value);
              setActiveCareerId(e.target.value);
            }}
            className="px-3 py-2 text-xs font-bold rounded-brand-sm border border-brand-border bg-white text-brand-dark shadow-subtle focus:border-brand-primary focus:outline-none"
          >
            {CAREERS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-brand-sm border border-brand-border bg-white text-brand-dark hover:bg-brand-bg shadow-subtle transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-brand-muted" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Progress Card + Next Recommended Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Progress Bar Card */}
        <div className="md:col-span-4 bg-white border border-brand-border rounded-brand p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              Roadmap Progress
            </span>
            <div className="text-3xl font-black text-brand-dark mt-2">
              {progressPct}% Completed
            </div>
            <div className="w-full bg-brand-bg rounded-full h-2.5 mt-3 overflow-hidden border border-brand-border">
              <div
                className="bg-brand-primary h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="text-xs font-semibold text-brand-muted mt-4">
            {totalCompleted} of {totalSteps} milestones achieved
          </div>
        </div>

        {/* Next Recommended Action Banner */}
        <div className="md:col-span-8 bg-emerald-50 border border-emerald-200 rounded-brand p-6 shadow-subtle flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Next Action</span>
            </div>
            <h3 className="text-lg font-bold text-emerald-950 mt-1">
              {nextAction.title}
            </h3>
            <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
              {nextAction.desc}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-emerald-800">
              Estimated Duration: {nextAction.time}
            </span>
            <button
              onClick={() => handleToggle(nextAction.id)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-brand-sm shadow-subtle transition-colors"
            >
              Mark Done ✓
            </button>
          </div>
        </div>
      </div>

      {/* Milestones Checklist */}
      <div className="bg-white border border-brand-border rounded-brand p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <h2 className="text-base font-bold text-brand-dark">
            Milestone Checklist for {career.name}
          </h2>
          <button
            onClick={() => setIsAddCustomOpen(!isAddCustomOpen)}
            className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Step</span>
          </button>
        </div>

        {/* Custom Milestone Form Drawer */}
        {isAddCustomOpen && (
          <form onSubmit={handleAddCustom} className="p-4 rounded-brand-sm bg-brand-bg border border-brand-border space-y-3">
            <h4 className="text-xs font-bold text-brand-dark">Add Your Custom Learning Milestone</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Milestone Title (e.g., Complete FreeCodeCamp JS Module)"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-white text-brand-dark focus:border-brand-primary focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Estimated Time (e.g., 2 Weeks)"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-white text-brand-dark focus:border-brand-primary focus:outline-none"
              />
            </div>
            <textarea
              placeholder="Brief description of what you plan to accomplish..."
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-white text-brand-dark focus:border-brand-primary focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddCustomOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-brand-muted hover:text-brand-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-brand-sm hover:bg-brand-primary-hover shadow-subtle"
              >
                Add Milestone
              </button>
            </div>
          </form>
        )}

        {/* Milestone Steps Timeline */}
        <div className="space-y-4">
          {career.roadmap_milestones.map((ms, idx) => {
            const isDone = completedForCareer.includes(ms.id);
            return (
              <div
                key={ms.id}
                onClick={() => handleToggle(ms.id)}
                className={`p-4 rounded-brand-sm border transition-all cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-brand-border hover:border-brand-primary/60 hover:bg-brand-bg/40'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-brand-primary flex-shrink-0"
                  aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-brand-muted" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                      Step {idx + 1} • {ms.time}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm font-bold ${isDone ? 'line-through text-brand-dark/70' : 'text-brand-dark'}`}>
                    {ms.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {ms.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Custom Milestones */}
          {customList.map(ms => {
            const isDone = completedForCareer.includes(ms.id);
            return (
              <div
                key={ms.id}
                onClick={() => handleToggle(ms.id)}
                className={`p-4 rounded-brand-sm border transition-all cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-brand-border hover:border-brand-primary/60 hover:bg-brand-bg/40'
                }`}
              >
                <button type="button" className="mt-0.5 text-brand-primary flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-brand-muted" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.2 rounded">
                      Custom • {ms.time}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold ${isDone ? 'line-through text-brand-dark/70' : 'text-brand-dark'}`}>
                    {ms.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {ms.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
