import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Sun,
  Moon,
  Users,
  User,
  LogOut,
  ChevronDown,
  LogIn
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, isAuthenticated, isDevFallback, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Element refs for outside-click detection
  const exploreRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click & escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExploreOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close all menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setExploreOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  // 1. Primary Navigation items (Exactly 4 items + Explore)
  const primaryNavItems = [
    { path: '/', label: t('nav_home') || 'Home' },
    { path: '/assessment', label: t('nav_assessment') || 'Assessment' },
    { path: '/careers', label: t('nav_careers') || 'Careers' },
    { path: '/dashboard', label: t('nav_dashboard') || 'Dashboard' }
  ];

  // 2. Explore Secondary Features (Grouped cleanly in dropdown)
  const exploreItems = [
    {
      path: '/compare',
      label: t('nav_compare') || '3-Way Compare',
      icon: GitCompare,
      desc: 'Side-by-side career comparison'
    },
    {
      path: '/budget',
      label: t('nav_budget') || 'Budget Planner',
      icon: Wallet,
      desc: 'INR fees & statutory education costs'
    },
    {
      path: '/skill-gap',
      label: t('nav_skill_gap') || 'Skill Gap',
      icon: Sparkles,
      desc: 'Diagnose ready vs missing competencies'
    },
    {
      path: '/roadmap',
      label: t('nav_roadmap') || 'My Roadmap',
      icon: Compass,
      desc: 'Step-by-step milestones & deliverables'
    },
    {
      path: '/resources',
      label: t('nav_resources') || 'Verified Resources',
      icon: BookOpen,
      desc: 'Statutory portals (SWAYAM, NCS, AICTE)'
    },
    {
      path: '/reviews',
      label: t('nav_reviews') || 'Demos',
      icon: MessageSquareCode,
      desc: 'Interactive hands-on career simulators'
    },
    {
      path: '/navigation',
      label: t('nav_navigation') || 'Navigate',
      icon: MapPin,
      desc: 'Locate nearby colleges with live GPS'
    },
    {
      path: '/community',
      label: 'Student Stories',
      icon: Users,
      desc: 'Peer experiences and video journeys'
    }
  ];

  // Check if current route is within the Explore dropdown
  const isExploreActive = exploreItems.some(item => location.pathname === item.path);

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-surface border-b border-brand-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* ============================================================ */}
            {/* LEFT: Logo & Brand Name with Telugu title and subtle tagline */}
            {/* ============================================================ */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D] rounded-brand-sm"
                onClick={closeMobileMenu}
                aria-label="PathSetu Home"
              >
                <img
                  src="/assets/pathsetu-icon.png"
                  alt="PathSetu Logo"
                  className="w-8 h-8 rounded-brand-sm object-cover border border-brand-border flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-black text-brand-dark tracking-tight flex items-center gap-1.5 leading-none">
                    Path<span className="text-[#234B3D] dark:text-brand-primary">Setu</span>
                    <span className="text-xs font-medium text-brand-muted font-sans">
                      {language === 'te' ? '(పథసేతు)' : 'పథసేతు'}
                    </span>
                  </span>
                  <span className="text-[10px] text-brand-muted font-medium mt-0.5 hidden xl:inline max-w-[210px] truncate leading-tight">
                    {t('site_tagline')}
                  </span>
                </div>
              </Link>
            </div>

            {/* ============================================================ */}
            {/* CENTER: Clean 5-Item Navigation (Desktop: >= lg)              */}
            {/* 1. Home | 2. Assessment | 3. Careers | 4. Dashboard | 5. Explore */}
            {/* ============================================================ */}
            <nav
              className="hidden lg:flex items-center space-x-1"
              aria-label="Primary Navigation"
            >
              {primaryNavItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-brand-sm transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D] ${
                      isActive
                        ? 'text-[#234B3D] dark:text-brand-cyan bg-[#234B3D]/10 dark:bg-brand-elevated font-bold'
                        : 'text-brand-muted hover:text-brand-dark hover:bg-brand-elevated/60'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* 5. Explore Dropdown */}
              <div className="relative" ref={exploreRef}>
                <button
                  type="button"
                  onClick={() => setExploreOpen(!exploreOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' && !exploreOpen) {
                      e.preventDefault();
                      setExploreOpen(true);
                    }
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-brand-sm transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D] ${
                    isExploreActive || exploreOpen
                      ? 'text-[#234B3D] dark:text-brand-cyan bg-[#234B3D]/10 dark:bg-brand-elevated font-bold'
                      : 'text-brand-muted hover:text-brand-dark hover:bg-brand-elevated/60'
                  }`}
                  aria-expanded={exploreOpen}
                  aria-haspopup="true"
                >
                  <span>Explore</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      exploreOpen ? 'rotate-180 text-[#234B3D] dark:text-brand-cyan' : 'text-brand-muted'
                    }`}
                  />
                </button>

                {/* Explore Dropdown Menu */}
                {exploreOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-brand bg-brand-surface border border-brand-border shadow-md py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-3 py-1.5 border-b border-brand-border mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                        Secondary Career Features
                      </p>
                    </div>

                    <div className="py-0.5 space-y-0.5">
                      {exploreItems.map(item => {
                        const Icon = item.icon;
                        const isCurrent = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setExploreOpen(false)}
                            role="menuitem"
                            className={`flex items-start gap-2.5 px-3 py-2 text-xs transition-colors rounded-brand-sm mx-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D] ${
                              isCurrent
                                ? 'bg-brand-elevated text-[#234B3D] dark:text-brand-cyan font-bold'
                                : 'text-brand-dark hover:bg-brand-elevated/70'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isCurrent ? 'text-[#234B3D] dark:text-brand-cyan' : 'text-brand-muted'}`} />
                            <div className="min-w-0">
                              <p className="font-semibold leading-tight">{item.label}</p>
                              <p className="text-[10px] text-brand-muted truncate leading-normal">{item.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* ============================================================ */}
            {/* RIGHT: Compact Utilities & ONE Prominent CTA                 */}
            {/* ============================================================ */}
            <div className="flex items-center space-x-2">
              
              {/* Compact Light / Dark Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center w-8 h-8 rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark hover:border-[#234B3D] hover:text-[#234B3D] dark:hover:border-brand-primary dark:hover:text-brand-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D]"
                aria-label={theme === 'night' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                title={theme === 'night' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              >
                {theme === 'night' ? (
                  <Sun className="w-3.5 h-3.5 text-brand-cyan" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[#234B3D]" />
                )}
              </button>

              {/* Compact Language Selector */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-1 h-8 px-2.5 rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark hover:border-[#234B3D] transition-colors text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D]"
                title={language === 'en' ? 'Switch to Telugu (తెలుగు)' : 'Switch to English'}
                aria-label="Switch Language"
              >
                <Languages className="w-3.5 h-3.5 text-brand-muted" />
                <span className="text-[11px] font-bold">
                  {language === 'en' ? 'తె' : 'EN'}
                </span>
              </button>

              {/* User Account / Profile Pill (if logged in) */}
              {(isAuthenticated || isDevFallback) ? (
                <div className="relative hidden sm:block" ref={userDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 h-8 px-2 rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark hover:border-[#234B3D] transition-colors text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D]"
                    aria-expanded={userDropdownOpen}
                    aria-label="Student Account Menu"
                  >
                    <img
                      src={profile.avatar_url || profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={profile.full_name || profile.name}
                      className="w-5 h-5 rounded-full object-cover border border-brand-border"
                    />
                    <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline">
                      {(profile.full_name || profile.name || 'Student').split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-brand-muted" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-brand bg-brand-surface border border-brand-border shadow-md py-1.5 z-50 text-xs animate-in fade-in duration-100">
                      <div className="px-3 py-2 border-b border-brand-border">
                        <p className="font-bold text-brand-dark truncate">{profile.full_name || profile.name}</p>
                        <p className="text-[10px] text-brand-muted font-mono truncate">
                          @{profile.username || 'student'}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-brand-dark hover:bg-brand-elevated transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-brand-muted" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 text-brand-dark hover:bg-brand-elevated transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-brand-muted" />
                          <span>Dashboard</span>
                        </Link>
                      </div>

                      <div className="border-t border-brand-border pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-brand-elevated transition-colors text-left font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center text-xs font-semibold text-brand-muted hover:text-brand-dark px-2.5 h-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D] rounded-brand-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Single Prominent CTA: "Take Assessment" (Forest Green #234B3D) */}
              <Link
                to="/assessment"
                className="hidden sm:inline-flex items-center justify-center h-8 px-3.5 text-xs font-bold rounded-brand-sm bg-[#234B3D] text-white hover:bg-[#1B3C30] dark:bg-[#2E6351] dark:hover:bg-[#234B3D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D] shadow-xs"
              >
                <span>Take Assessment</span>
              </Link>

              {/* Mobile Menu Toggle Button (< lg) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-brand-sm text-brand-dark hover:bg-brand-elevated border border-brand-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234B3D]"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* TABLET & MOBILE DRAWER PANEL (< lg)                           */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden transition-opacity backdrop-blur-xs"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 w-80 max-w-[85vw] h-full bg-brand-surface border-l border-brand-border flex flex-col lg:hidden transform transition-transform duration-200 ease-in-out shadow-xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border">
          <div className="flex items-center space-x-2.5">
            <img
              src="/assets/pathsetu-icon.png"
              alt="PathSetu Logo"
              className="w-7 h-7 rounded-brand-sm object-cover border border-brand-border"
            />
            <span className="font-bold text-brand-dark text-sm">PathSetu (పథసేతు)</span>
          </div>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="p-1 rounded-brand-sm text-brand-muted hover:text-brand-dark hover:bg-brand-elevated border border-brand-border"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer User Bar (if logged in) */}
        {(isAuthenticated || isDevFallback) ? (
          <div className="p-3 border-b border-brand-border bg-brand-elevated flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={profile.avatar_url || profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={profile.full_name || profile.name}
                className="w-7 h-7 rounded-full object-cover border border-brand-border"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-dark truncate">{profile.full_name || profile.name}</p>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="text-[10px] text-[#234B3D] dark:text-brand-cyan hover:underline font-semibold"
                >
                  View Profile →
                </Link>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1 text-xs text-rose-500 hover:bg-brand-surface rounded"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-3 border-b border-brand-border bg-brand-elevated">
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-brand-sm border border-brand-border bg-brand-surface text-brand-dark hover:border-[#234B3D]"
            >
              <LogIn className="w-3.5 h-3.5 text-brand-muted" />
              <span>Sign In to Your Account</span>
            </Link>
          </div>
        )}

        {/* Theme & Language Bar in Drawer */}
        <div className="p-2.5 border-b border-brand-border grid grid-cols-2 gap-2 bg-brand-surface">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark"
          >
            {theme === 'night' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Day Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#234B3D]" />
                <span>Night Mode</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-semibold rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark"
          >
            <Languages className="w-3.5 h-3.5 text-brand-muted" />
            <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Section: Primary */}
          <div className="space-y-1">
            <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
              Main Menu
            </p>
            {primaryNavItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between px-3 py-2 rounded-brand-sm text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#234B3D] text-white dark:bg-brand-primary'
                      : 'text-brand-dark hover:bg-brand-elevated'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Section: Explore Tools */}
          <div className="space-y-1 pt-2 border-t border-brand-border">
            <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-brand-muted">
              Explore Tools
            </p>
            {exploreItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-brand-sm text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-elevated text-[#234B3D] dark:text-brand-cyan font-bold'
                      : 'text-brand-dark hover:bg-brand-elevated'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#234B3D] dark:text-brand-cyan' : 'text-brand-muted'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Fixed Mobile Bottom CTA */}
        <div className="p-3 border-t border-brand-border bg-brand-elevated">
          <Link
            to="/assessment"
            onClick={closeMobileMenu}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-brand-sm bg-[#234B3D] text-white font-bold text-xs hover:bg-[#1B3C30] dark:bg-[#2E6351] dark:hover:bg-[#234B3D] transition-colors"
          >
            Take Assessment →
          </Link>
        </div>
      </aside>
    </>
  );
};
