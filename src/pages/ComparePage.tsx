import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { CAREERS } from '../data/careers';
import { CircularGauge } from '../components/common/CircularGauge';
import { Career } from '../types';

export const ComparePage: React.FC = () => {
  const { selectedComparisonIds, toggleComparisonCareer, removeComparisonCareer } = useAuthProgress();
  const { t, language } = useLanguage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedCareers: Career[] = selectedComparisonIds
    .map(id => CAREERS.find(c => c.id === id))
    .filter((c): c is Career => c !== undefined);

  const recommendedScholarships = [
    {
      id: "sch_01",
      title: "AICTE Pragati Scholarship for Girl Students",
      sponsor: "All India Council for Technical Education (AICTE)",
      amount: "₹50,000 / year",
      deadline: "October 31",
      status: "Verified Open",
      url: "https://scholarships.gov.in/",
      details: "Available for female students admitted to 1st year degree/diploma courses in AICTE-approved institutions with family income < ₹8 Lakh."
    },
    {
      id: "sch_02",
      title: "National Scholarship Portal (NSP) Post-Matric Scheme",
      sponsor: "Ministry of Social Justice & Empowerment",
      amount: "₹15,000 - ₹35,000 / year",
      deadline: "November 15",
      status: "Annual Scheme",
      url: "https://scholarships.gov.in/",
      details: "Covers tuition fees and maintenance allowance for students from SC/ST/OBC and minority rural backgrounds studying post-matric."
    },
    {
      id: "sch_03",
      title: "State Government Full Fee Reimbursement (JVD / EBC)",
      sponsor: "State Department of Higher Education (AP & TS)",
      amount: "100% Tuition Fees Paid",
      deadline: "December 10",
      status: "Active Portal",
      url: "https://telanganaepass.cgg.gov.in/",
      details: "Direct payment of sanctioned course tuition fees to colleges for eligible state CET/EAPCET admitted students."
    }
  ];

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Page Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Side-by-Side Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Career & Education Cost Comparison
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Compare up to 3 career pathways. Evaluates verified government vs private costs in INR, eligibility, and scholarships.
          </p>
        </div>

        {selectedCareers.length < 3 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white shadow-subtle hover:bg-brand-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Career to Compare</span>
          </button>
        )}
      </div>

      {/* 3-Column Comparison Matrix (Mirrors Reference 3 "College Compare") */}
      {selectedCareers.length === 0 ? (
        <div className="bg-white border border-brand-border rounded-brand p-12 text-center space-y-4">
          <GitCompare className="w-12 h-12 text-brand-muted mx-auto" />
          <h3 className="font-bold text-brand-dark text-lg">No Careers Selected for Comparison</h3>
          <p className="text-xs text-brand-muted max-w-md mx-auto">
            Select up to 3 careers from the catalog to compare duration, government vs private tuition fees, and scholarship eligibility side-by-side.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-brand-sm bg-brand-primary text-white text-xs font-bold"
          >
            Select Careers to Compare
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {selectedCareers.map(career => {
            const cost = career.estimated_education_cost_inr;
            const avgGovt = Math.round((cost.annual_min_govt + cost.annual_max_govt) / 2);
            const avgPvt = Math.round((cost.annual_min_pvt + cost.annual_max_pvt) / 2);
            const totalGovt4Yr = avgGovt * 4;

            return (
              <div
                key={career.id}
                className="bg-white border border-brand-border rounded-brand p-6 shadow-subtle flex flex-col justify-between relative space-y-6"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeComparisonCareer(career.id)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header: Title + Tag */}
                <div className="pr-8">
                  <div className="text-2xl mb-2">{career.emoji}</div>
                  <h2 className="text-lg font-bold text-brand-dark leading-snug">
                    {career.name}
                  </h2>
                  <div className="text-xs font-semibold text-brand-muted mt-0.5">
                    {career.category}
                  </div>
                </div>

                {/* Semi-Circular Cost Gauge (Mirrors Reference 3: Cost Gauge) */}
                <div className="pt-2 pb-4 border-t border-b border-brand-borderLight text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-2">
                    Estimated Annual Govt Tuition
                  </div>
                  <div className="text-xl font-black text-brand-dark">
                    ₹{avgGovt.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-brand-muted"> / year</span>
                  </div>

                  <div className="my-3 flex justify-center">
                    <CircularGauge
                      value={avgGovt}
                      max={avgPvt || 100000}
                      variant="semi"
                      size={140}
                      strokeWidth={12}
                      label={`₹${Math.round(avgGovt / 1000)}k`}
                      sublabel={`of ₹${Math.round(avgPvt / 1000)}k Pvt`}
                      color="#234B3D"
                      trackColor="#E4EBDD"
                    />
                  </div>

                  <div className="text-xs text-brand-muted">
                    Total 4-Yr Govt: <span className="font-bold text-brand-dark">₹{totalGovt4Yr.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 4-Year Stacked Cost Breakdown (Mirrors Reference 3: '23, '24, '25, '26 stacked bars) */}
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-brand-dark uppercase text-[10px] tracking-wider mb-2">
                    4-Year Education Breakdown
                  </div>
                  {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((yr, idx) => (
                    <div key={idx} className="flex items-center justify-between text-brand-muted">
                      <span className="w-14 font-semibold text-[11px]">{yr}</span>
                      <div className="flex-1 mx-2 bg-brand-bg rounded-full h-2 overflow-hidden flex border border-brand-border">
                        {/* Govt Portion */}
                        <div className="bg-brand-primary h-2" style={{ width: '45%' }} title="Govt Tuition" />
                        {/* Books & Exams */}
                        <div className="bg-emerald-400 h-2" style={{ width: '20%' }} title="Books & Lab" />
                        {/* Potential Scholarship Offset */}
                        <div className="bg-brand-secondary h-2" style={{ width: '35%' }} title="Scholarship Offset" />
                      </div>
                      <span className="text-[11px] font-bold text-brand-dark">
                        ₹{avgGovt.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-brand-muted">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-brand-primary" /> Tuition
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Books/Labs
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-brand-secondary" /> Aid Offset
                    </span>
                  </div>
                </div>

                {/* Core Attributes */}
                <div className="space-y-3 pt-3 border-t border-brand-borderLight text-xs">
                  <div>
                    <span className="font-bold text-brand-dark">Study Duration:</span>
                    <p className="text-brand-muted mt-0.5">{career.study_duration}</p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-dark">Eligibility & Entrance:</span>
                    <p className="text-brand-muted mt-0.5">{career.eligibility_conditions}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.relevant_entrance_exams.map(e => (
                        <span key={e} className="px-1.5 py-0.5 bg-brand-bg rounded text-[10px] font-semibold border border-brand-border">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-brand-dark">Entry Salary (India):</span>
                    <p className="font-semibold text-emerald-800 mt-0.5">{career.entry_salary_range_inr}</p>
                  </div>

                  <div>
                    <span className="font-bold text-brand-dark">Key Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.required_skills.slice(0, 3).map(s => (
                        <span key={s.name} className="px-2 py-0.5 bg-brand-bg rounded-md text-[10px] font-medium border border-brand-border">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-2">
                  <Link
                    to={`/careers/${career.id}`}
                    className="w-full block text-center py-2 px-3 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors"
                  >
                    View In-Depth Profile →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommended Scholarships Section (Mirrors Reference 3 lower section) */}
      <section className="bg-white border border-brand-border rounded-brand p-6 shadow-subtle space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">
              Recommended Government Scholarships & Financial Aid
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Verified statutory Indian financial schemes applicable to your selected pathways.
            </p>
          </div>
          <a
            href="https://scholarships.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
          >
            <span>See National Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-4">
          {recommendedScholarships.map(sch => (
            <div
              key={sch.id}
              className="p-4 rounded-brand-sm border border-brand-border bg-brand-bg/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <h3 className="text-sm font-bold text-brand-dark">{sch.title}</h3>
                </div>
                <div className="text-xs text-brand-muted">{sch.sponsor}</div>
                <p className="text-xs text-brand-dark/80 pt-1 max-w-2xl leading-relaxed">
                  {sch.details}
                </p>
              </div>

              <div className="flex sm:flex-col items-end gap-2 text-right flex-shrink-0">
                <div className="text-sm font-black text-brand-primary">{sch.amount}</div>
                <div className="text-xs text-brand-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline: {sch.deadline}</span>
                </div>
                <a
                  href={sch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 px-4 py-1.5 rounded-brand-sm bg-brand-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-brand-primary-hover shadow-subtle"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Career Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-brand-lg max-w-lg w-full p-6 shadow-modal max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-dark text-base">Select Career to Compare</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-brand-muted hover:text-brand-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {CAREERS.map(c => {
                const isSelected = selectedComparisonIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      toggleComparisonCareer(c.id);
                      setIsAddModalOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-brand-sm border flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-brand-primary-light border-brand-primary text-brand-primary'
                        : 'border-brand-border hover:bg-brand-bg text-brand-dark'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{c.emoji}</span>
                      <div>
                        <div className="font-bold text-xs">{c.name}</div>
                        <div className="text-[11px] text-brand-muted">{c.category}</div>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="text-xs font-bold text-brand-primary">Selected ✓</span>
                    ) : (
                      <span className="text-xs font-bold text-brand-muted group-hover:text-brand-primary">+ Add</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
