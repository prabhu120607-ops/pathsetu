import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  ClipboardList,
  GitCompare,
  Wallet,
  Sparkles,
  MapPin,
  MessageSquareCode,
  Layers,
  BookOpen,
  Menu,
  X,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav_home'), icon: Compass },
    { path: '/assessment', label: t('nav_assessment'), icon: ClipboardList, badge: 'Step 01' },
    { path: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { path: '/careers', label: t('nav_careers'), icon: Layers },
    { path: '/compare', label: t('nav_compare'), icon: GitCompare },
    { path: '/budget', label: t('nav_budget'), icon: Wallet },
    { path: '/skill-gap', label: t('nav_skill_gap'), icon: Sparkles },
    { path: '/roadmap', label: t('nav_roadmap'), icon: Compass },
    { path: '/resources', label: t('nav_resources'), icon: BookOpen },
    { path: '/reviews', label: t('nav_reviews'), icon: MessageSquareCode, badge: 'New' },
    { path: '/navigation', label: t('nav_navigation'), icon: MapPin, badge: 'Live GPS' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={closeMobileMenu}
            >
              <div className="w-10 h-10 rounded-brand-sm bg-brand-primary flex items-center justify-center text-white shadow-sm group-hover:bg-brand-primary-hover transition-colors">
                <Compass className="w-6 h-6 text-brand-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-brand-dark tracking-tight flex items-center gap-1.5">
                  Path<span className="text-brand-primary">Setu</span>
                  <span className="text-xs font-semibold text-brand-muted font-sans">
                    {language === 'te' ? '(పథసేతు)' : 'పథసేతు'}
                  </span>
                </span>
                <span className="text-[11px] font-medium text-brand-muted -mt-0.5 hidden sm:inline">
                  {t('site_tagline')}
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden xl:flex items-center space-x-1" aria-label="Desktop Navigation">
              {navItems.slice(0, 9).map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-brand-primary-light text-brand-primary'
                        : 'text-brand-dark/80 hover:text-brand-primary hover:bg-brand-bg'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Feature Shortcuts (Reviews & Navigation) for Medium+ screens */}
              <div className="hidden md:flex items-center space-x-1.5">
                <Link
                  to="/reviews"
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    location.pathname === '/reviews'
                      ? 'border-brand-primary bg-brand-primary-light text-brand-primary'
                      : 'border-brand-border text-brand-dark/80 hover:bg-brand-bg'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Demos</span>
                </Link>

                <Link
                  to="/navigation"
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    location.pathname === '/navigation'
                      ? 'border-brand-primary bg-brand-primary-light text-brand-primary'
                      : 'border-brand-border text-brand-dark/80 hover:bg-brand-bg'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Navigate</span>
                </Link>
              </div>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-brand-sm border border-brand-border bg-brand-bg text-brand-dark hover:border-brand-primary transition-colors"
                title="Switch between English and Telugu"
              >
                <Languages className="w-3.5 h-3.5 text-brand-primary" />
                <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
              </button>

              {/* Primary Call to Action */}
              <Link
                to="/assessment"
                className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover shadow-subtle transition-all"
              >
                <span>Take Assessment</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-brand-dark hover:bg-brand-bg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm xl:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`fixed top-0 right-0 z-50 w-80 max-w-[85vw] h-full bg-white shadow-modal flex flex-col xl:hidden transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
              <Compass className="w-5 h-5 text-brand-secondary" />
            </div>
            <span className="font-bold text-brand-dark">PathSetu (పథసేతు)</span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-bg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between px-3 py-2.5 rounded-brand-sm text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-dark hover:bg-brand-bg'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-muted'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-brand-primary-light text-brand-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-brand-border bg-brand-bg/50">
          <Link
            to="/assessment"
            onClick={closeMobileMenu}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-brand-sm bg-brand-primary text-white font-bold text-sm shadow-subtle hover:bg-brand-primary-hover transition-colors"
          >
            Take Free Assessment →
          </Link>
        </div>
      </aside>
    </>
  );
};
