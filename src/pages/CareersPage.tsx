import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, GitCompare, Bookmark, ArrowRight, Check } from 'lucide-react';
import { CAREERS } from '../data/careers';
import { useAuthProgress } from '../context/AuthProgressContext';
import { useLanguage } from '../context/LanguageContext';

export const CareersPage: React.FC = () => {
  const { toggleComparisonCareer, selectedComparisonIds, setActiveCareerId, activeCareerId } = useAuthProgress();
  const { t, language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Technology & Engineering',
    'Design & Creative Media',
    'Agriculture & Rural Sciences',
    'Clean Energy & Technical Trades',
    'Healthcare & Medicine',
    'Education & Teaching',
    'Commerce & Finance',
    'Banking & Social Development'
  ];

  const filteredCareers = CAREERS.filter(career => {
    const matchesSearch =
      career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.name_te.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.required_skills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || career.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
          Explore 10+ Diverse Indian Career Pathways
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
          Verified educational pathways, statutory Indian eligibility requirements, realistic INR government college costs, and free online alternatives.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-4  space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-brand-sm border border-brand-border focus:border-brand-primary focus:outline-none bg-brand-bg/40 text-brand-dark"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-brand-elevated text-brand-dark/70 hover:bg-brand-borderLight'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.map(career => {
          const isComparing = selectedComparisonIds.includes(career.id);
          const isActive = activeCareerId === career.id;

          return (
            <div
              key={career.id}
              className={`bg-white border rounded-brand p-6  hover: transition-all flex flex-col justify-between ${
                isActive ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-brand-border'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{career.emoji}</span>
                  <div className="flex items-center gap-1.5">
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-brand-cyan">
                        Active Pathway
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-elevated text-brand-cyan border border-brand-border">
                      {career.badge}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-brand-dark">
                    {career.name}
                  </h3>
                  <div className="text-xs font-semibold text-brand-muted">
                    {career.name_te} • {career.category}
                  </div>
                  <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed">
                    {career.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Govt College Tuition:</span>
                    <span className="font-bold text-brand-cyan">
                      ₹{career.estimated_education_cost_inr.annual_min_govt.toLocaleString('en-IN')}/yr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Duration:</span>
                    <span className="font-semibold text-brand-dark">{career.study_duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Entry Salary:</span>
                    <span className="font-semibold text-brand-dark">{career.entry_salary_range_inr}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-brand-border flex items-center gap-2">
                <Link
                  to={`/careers/${career.id}`}
                  className="flex-1 text-center py-2 px-3 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover  transition-colors"
                >
                  View Details & Skills
                </Link>

                <button
                  type="button"
                  onClick={() => toggleComparisonCareer(career.id)}
                  className={`p-2 rounded-brand-sm border transition-colors ${
                    isComparing
                      ? 'border-brand-primary bg-brand-elevated text-brand-cyan border border-brand-border'
                      : 'border-brand-border text-brand-muted hover:text-brand-dark hover:bg-brand-elevated'
                  }`}
                  title={isComparing ? 'Remove from Compare' : 'Add to 3-Way Compare'}
                >
                  <GitCompare className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
