import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                <Compass className="w-5 h-5 text-brand-secondary" />
              </div>
              <span className="text-lg font-bold text-brand-dark">
                Path<span className="text-brand-primary">Setu</span> (పథసేతు)
              </span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Transparent, explainable career guidance and affordable education roadmaps built for school and college students in Tier-2/3 and rural India.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Free & Open-Access Educational Tool</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/assessment" className="text-brand-muted hover:text-brand-primary transition-colors">
                  Career Self-Assessment
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-brand-muted hover:text-brand-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-brand-muted hover:text-brand-primary transition-colors">
                  10+ Indian Career Tracks
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-brand-muted hover:text-brand-primary transition-colors">
                  3-Way Side-by-Side Comparison
                </Link>
              </li>
              <li>
                <Link to="/budget" className="text-brand-muted hover:text-brand-primary transition-colors">
                  INR Education Budget Planner
                </Link>
              </li>
              <li>
                <Link to="/skill-gap" className="text-brand-muted hover:text-brand-primary transition-colors">
                  Skill-Gap Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* New Interactive Features */}
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-3">
              Interactive & Live Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/reviews" className="text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1">
                  <span>Student Reviews & Path Demos</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Live</span>
                </Link>
              </li>
              <li>
                <Link to="/navigation" className="text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1">
                  <span>Find Institution (Live GPS)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">Map</span>
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-brand-muted hover:text-brand-primary transition-colors">
                  Milestone Roadmaps & PDF Export
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-brand-muted hover:text-brand-primary transition-colors">
                  Verified Government Portals
                </Link>
              </li>
            </ul>
          </div>

          {/* Statutory Portals */}
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-3">
              Statutory Government Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.ncs.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
                >
                  <span>National Career Service (NCS)</span>
                  <ExternalLink className="w-3 h-3 text-brand-muted/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://swayam.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
                >
                  <span>SWAYAM Free Online Courses</span>
                  <ExternalLink className="w-3 h-3 text-brand-muted/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
                >
                  <span>National Scholarship Portal (NSP)</span>
                  <ExternalLink className="w-3 h-3 text-brand-muted/70" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.skillindiadigital.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
                >
                  <span>Skill India Digital Hub</span>
                  <ExternalLink className="w-3 h-3 text-brand-muted/70" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>
            © {new Date().getFullYear()} PathSetu (పథసేతు). All verified statutory educational links cite statutory Indian authorities (NCS, AICTE, UGC, ICAR, NTA).
          </p>
          <div className="flex items-center space-x-1">
            <span>Built with care for Indian students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
