import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Search, Filter } from 'lucide-react';
import { RESOURCES } from '../data/resources';
import { useLanguage } from '../context/LanguageContext';

export const ResourcesPage: React.FC = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Government Central',
    'Online Learning',
    'Technical Education',
    'Testing & Admission',
    'Scholarships'
  ];

  const filteredResources = RESOURCES.filter(res => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || res.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6 sm:py-8 space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Stage 04 · Verified Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
          Verified Indian Educational & Career Portals
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
          Zero commercial affiliate links or coaching advertisements. Only official statutory authorities (NCS, SWAYAM, AICTE, NTA, UGC, Skill India, NCERT).
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-brand-border rounded-brand p-4 shadow-subtle space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search verified portals, ministries, or keywords..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-brand-sm border border-brand-border focus:border-brand-primary focus:outline-none bg-brand-bg/40 text-brand-dark"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-brand-bg text-brand-dark/70 hover:bg-brand-borderLight'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Portal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res, idx) => (
          <div
            key={idx}
            className="bg-white border border-brand-border rounded-brand p-6 shadow-subtle hover:shadow-card hover:border-brand-primary transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-brand-dark leading-snug">
                    {res.name}
                  </h3>
                  <div className="text-xs font-semibold text-brand-muted">
                    {language === 'te' ? res.name_te : res.authority}
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold whitespace-nowrap flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>

              <p className="text-xs text-brand-dark/90 leading-relaxed">
                {language === 'te' ? res.description_te : res.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {res.features.map(f => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded-md bg-brand-bg text-brand-dark/80 text-[10px] font-medium border border-brand-border"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-borderLight flex items-center justify-between text-xs">
              <span className="text-[11px] text-brand-muted">
                Last verified: {res.verified_date}
              </span>

              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-brand-sm bg-brand-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-primary-hover shadow-subtle transition-colors"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
