import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';

export const BudgetPage: React.FC = () => {
  const { userBudget, setUserBudget } = useAuthProgress();
  const { t, language } = useLanguage();

  const [inputBudget, setInputBudget] = useState<number>(userBudget || 35000);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('software_dev');

  const activeCareer = CAREERS.find(c => c.id === selectedCareerId) || CAREERS[0];
  const cost = activeCareer.estimated_education_cost_inr;
  const avgGovt = Math.round((cost.annual_min_govt + cost.annual_max_govt) / 2);
  const avgPvt = Math.round((cost.annual_min_pvt + cost.annual_max_pvt) / 2);

  const govtSurplus = inputBudget - avgGovt;
  const pvtSurplus = inputBudget - avgPvt;

  const handleApplyBudget = () => {
    setUserBudget(inputBudget);
  };

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-primary border border-brand-border text-xs font-bold uppercase tracking-wider mb-2">
          <Wallet className="w-3.5 h-3.5" />
          <span>Stage 04 · Budget Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
          INR Education Budget & Affordability Planner
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
          {t('budget_explanation')}
        </p>
      </div>

      {/* Main Budget Input Card */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8  space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <label className="text-xs font-bold text-brand-dark block mb-2">
              {t('budget_input_label')}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-brand-primary">₹</span>
              <input
                type="number"
                min={0}
                max={500000}
                step={5000}
                value={inputBudget}
                onChange={e => setInputBudget(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-base font-bold text-brand-dark rounded-brand-sm border border-brand-border focus:border-brand-primary focus:outline-none bg-brand-bg/50"
              />
              <button
                type="button"
                onClick={handleApplyBudget}
                className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-brand-sm hover:bg-brand-primary-hover whitespace-nowrap "
              >
                Save Budget
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-brand-muted mt-2">
              <span>₹5,000 (Subsidized / ITI)</span>
              <span>₹50,000 (Govt Degree)</span>
              <span>₹2,50,000+ (Private)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-dark block mb-2">
              Select Career Pathway to Evaluate:
            </label>
            <select
              value={selectedCareerId}
              onChange={e => setSelectedCareerId(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-semibold rounded-brand-sm border border-brand-border focus:border-brand-primary focus:outline-none bg-brand-bg/50 text-brand-dark"
            >
              {CAREERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Range Slider */}
        <input
          type="range"
          min={5000}
          max={200000}
          step={5000}
          value={inputBudget}
          onChange={e => setInputBudget(Number(e.target.value))}
          className="w-full accent-brand-primary cursor-pointer"
        />
      </div>

      {/* Affordability Verdict Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Government Route Verdict */}
        <div className={`p-6 rounded-brand border  space-y-4 ${
          govtSurplus >= 0
            ? 'bg-brand-elevated/70 border-emerald-200'
            : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-emerald-950">
              Government College Pathway
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              govtSurplus >= 0 ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {govtSurplus >= 0 ? '100% Affordable ✓' : 'Partial Gap'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-brand-muted">Average Govt Annual Fee:</div>
            <div className="text-2xl font-black text-brand-dark">
              ₹{avgGovt.toLocaleString('en-IN')} / year
            </div>
          </div>

          <p className="text-xs text-brand-dark/90 leading-relaxed">
            {govtSurplus >= 0
              ? `Your annual budget of ₹${inputBudget.toLocaleString('en-IN')} comfortably covers government college fees with a surplus of ₹${govtSurplus.toLocaleString('en-IN')}, which can cover textbooks, hostel living, and certification exams.`
              : `Your budget has a shortfall of ₹${Math.abs(govtSurplus).toLocaleString('en-IN')} against government fees. However, this is typically 100% covered by State Fee Reimbursement (JVD/ePASS) or NSP post-matric scholarships.`}
          </p>

          <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-900 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Eligible for State Government 100% fee reimbursement via CET merit</span>
          </div>
        </div>

        {/* Private Route Verdict */}
        <div className={`p-6 rounded-brand border  space-y-4 ${
          pvtSurplus >= 0
            ? 'bg-brand-elevated/70 border-emerald-200'
            : 'bg-rose-50/70 border-rose-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-brand-dark">
              Private University Pathway
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              pvtSurplus >= 0 ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
            }`}>
              {pvtSurplus >= 0 ? 'Affordable' : 'Deficit / High Cost'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-brand-muted">Average Private Annual Fee:</div>
            <div className="text-2xl font-black text-brand-dark">
              ₹{avgPvt.toLocaleString('en-IN')} / year
            </div>
          </div>

          <p className="text-xs text-brand-dark/90 leading-relaxed">
            {pvtSurplus >= 0
              ? `Your budget covers private college expenses without student debt.`
              : `Private tuition exceeds your budget by ₹${Math.abs(pvtSurplus).toLocaleString('en-IN')} / year. PathSetu recommends prioritizing state government quotas or polytechnics to avoid high-interest commercial bank loans.`}
          </p>

          <div className="pt-2 border-t border-rose-200/60 text-xs text-rose-900 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-700" />
            <span>Private college management quotas are rarely subsidized by state aid</span>
          </div>
        </div>
      </div>

      {/* Free Statutory Alternatives (SWAYAM & Skill India) */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6  space-y-4">
        <h2 className="text-base font-bold text-brand-dark">
          100% Free Statutory Alternatives for {activeCareer.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeCareer.free_learning_alternatives.map((alt, i) => (
            <div key={i} className="p-4 rounded-brand-sm border border-brand-border bg-brand-bg/40 text-xs space-y-2">
              <span className="font-bold text-brand-primary block">Verified Open Route #{i + 1}</span>
              <p className="text-brand-dark/90 leading-relaxed">{alt}</p>
              <div className="text-[11px] text-brand-cyan font-semibold">Tuition Cost: ₹0 (Free Access)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
