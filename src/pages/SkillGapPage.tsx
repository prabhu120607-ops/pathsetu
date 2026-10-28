import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Layers,
  Award
} from 'lucide-react';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';
import { CircularGauge } from '../components/common/CircularGauge';

export const SkillGapPage: React.FC = () => {
  const { profile, updateProfile, activeCareerId, setActiveCareerId } = useAuthProgress();
  const { t, language } = useLanguage();

  const [selectedCareerId, setSelectedCareerId] = useState<string>(activeCareerId || 'software_dev');
  const [userSkills, setUserSkills] = useState<string[]>(profile.existingSkills || []);

  const career = CAREERS.find(c => c.id === selectedCareerId) || CAREERS[0];

  const toggleSkill = (skillName: string) => {
    let next: string[];
    if (userSkills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
      next = userSkills.filter(s => s.toLowerCase() !== skillName.toLowerCase());
    } else {
      next = [...userSkills, skillName];
    }
    setUserSkills(next);
    updateProfile({ existingSkills: next });
  };

  const totalSkills = career.required_skills.length;
  const readySkills = career.required_skills.filter(req =>
    userSkills.some(us => us.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us.toLowerCase()))
  );
  const missingSkills = career.required_skills.filter(req =>
    !userSkills.some(us => us.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(us.toLowerCase()))
  );

  const readinessPct = totalSkills > 0
    ? Math.min(Math.max(Math.round((readySkills.length / totalSkills) * 100), 20), 98)
    : 40;

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stage 05 · Readiness Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Skill-Gap Diagnostics & Readiness Matrix
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
            Compare your declared skills against entry requirements. Click any skill to toggle your current mastery and view prioritized next steps.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-brand-dark block mb-1">
            Target Career Pathway:
          </label>
          <select
            value={selectedCareerId}
            onChange={e => {
              setSelectedCareerId(e.target.value);
              setActiveCareerId(e.target.value);
            }}
            className="px-3 py-2 text-xs font-semibold rounded-brand-sm border border-brand-border bg-white text-brand-dark focus:border-brand-primary focus:outline-none shadow-subtle"
          >
            {CAREERS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Readiness Gauge Row (Mirrors Reference 5 Skill Gap Analysis) */}
      <div className="bg-white border border-brand-border rounded-brand p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-around gap-8">
        <div className="text-center space-y-2">
          <CircularGauge
            value={readinessPct}
            size={180}
            strokeWidth={16}
            variant="semi"
            label={`${readinessPct}%`}
            sublabel="Readiness Match"
            color="#234B3D"
            trackColor="#E4EBDD"
          />
          <div className="text-xs text-brand-muted">
            {readySkills.length} of {totalSkills} essential entry competencies verified
          </div>
        </div>

        <div className="w-full md:w-80 space-y-4 text-xs">
          <div>
            <div className="flex justify-between font-bold text-brand-dark mb-1.5">
              <span>Foundational Academic Prerequisites</span>
              <span className="text-emerald-800">80% Match</span>
            </div>
            <div className="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden border border-brand-border">
              <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-bold text-brand-dark mb-1.5">
              <span>Technical & Domain Knowledge</span>
              <span className="text-brand-primary">{readinessPct}% Match</span>
            </div>
            <div className="w-full bg-brand-bg rounded-full h-2.5 overflow-hidden border border-brand-border">
              <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${readinessPct}%` }} />
            </div>
          </div>

          <p className="text-[11px] text-brand-muted pt-2 leading-relaxed">
            "{readySkills.length > 0 ? `You have built baseline proficiency in ${readySkills[0].name}.` : 'Beginner entry pathway.'} Gaining hands-on experience in <strong>{missingSkills[0]?.name || 'next milestone'}</strong> will substantially raise your entry profile."
          </p>
        </div>
      </div>

      {/* Interactive Skills Categorization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acquired Skills Card */}
        <div className="bg-white border border-brand-border rounded-brand p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Skills You Already Have ({readySkills.length})</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified Ready
            </span>
          </div>

          <div className="space-y-2">
            {readySkills.length === 0 ? (
              <p className="text-xs text-brand-muted italic py-3">
                No skills checked yet. Click any skill below to add it to your profile.
              </p>
            ) : (
              readySkills.map(s => (
                <div
                  key={s.name}
                  onClick={() => toggleSkill(s.name)}
                  className="p-3 rounded-brand-sm border border-emerald-200 bg-emerald-50/50 flex items-center justify-between text-xs cursor-pointer hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center gap-2 font-semibold text-brand-dark">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{s.name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">{s.level}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Priority Skills to Learn Next Card */}
        <div className="bg-white border border-brand-border rounded-brand p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Prioritized Skills to Learn ({missingSkills.length})</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Next Priorities
            </span>
          </div>

          <div className="space-y-2">
            {missingSkills.map((s, idx) => (
              <div
                key={s.name}
                onClick={() => toggleSkill(s.name)}
                className="p-3 rounded-brand-sm border border-brand-border bg-brand-bg/40 flex items-center justify-between text-xs cursor-pointer hover:border-brand-primary transition-colors"
              >
                <div>
                  <div className="font-bold text-brand-dark flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{s.name}</span>
                  </div>
                  <div className="text-[10px] text-brand-muted mt-0.5">Click when mastered to update progress</div>
                </div>
                <span className="text-[10px] font-bold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded">
                  Priority #{s.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
