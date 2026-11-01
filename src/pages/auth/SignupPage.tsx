import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, GraduationCap, Languages, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../types';
import { FadeIn, TextReveal } from '../../components/common/Motion';

const EDUCATION_LEVELS = [
  "Class 10 (Secondary School)",
  "Class 11–12 (Science / PCM)",
  "Class 11–12 (Science / PCB)",
  "Class 11–12 (Commerce)",
  "Class 11–12 (Arts & Humanities)",
  "Polytechnic / ITI Diploma",
  "Undergraduate Degree (B.Tech / B.E.)",
  "Undergraduate Degree (B.Sc / B.Com / B.A.)",
  "Postgraduate Degree",
  "Other / Open Schooling"
];

export const SignupPage: React.FC = () => {
  const { signUp, isConfigured } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState(EDUCATION_LEVELS[1]);
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg(language === 'te' ? 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg(language === 'te' ? 'దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి.' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg(language === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(language === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.' : 'Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg(language === 'te' ? 'దయచేసి నిబంధనలు మరియు మార్గదర్శకాలను అంగీకరించండి.' : 'Please agree to the privacy policy and community guidelines.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      educationLevel,
      preferredLanguage: preferredLang,
      acceptTerms
    });
    setIsSubmitting(false);

    if (result.success) {
      if (preferredLang !== language) {
        setLanguage(preferredLang);
      }
      // Direct student to Take Assessment to capture requirements and generate profile + paths
      navigate('/assessment?onboarding=true', { replace: true });
    } else {
      setErrorMsg(result.error || (language === 'te' ? 'రిజిస్ట్రేషన్ విఫలమైంది.' : 'Registration failed.'));
    }
  };

  return (
    <div className="py-10 sm:py-14 max-w-lg mx-auto">
      <FadeIn duration={0.4}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-brand-sm bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <TextReveal
              text={language === 'te' ? 'కొత్త విద్యార్థి నమోదు' : 'Create Student Account'}
              as="h1"
              className="text-2xl font-black text-brand-dark tracking-tight"
            />
            <p className="text-xs text-brand-muted">
              {language === 'te'
                ? 'మీ ఆసక్తి. మీ మార్గం. మా మార్గదర్శకత్వం — ఉచిత వేదిక.'
                : 'Join thousands of students discovering transparent, affordable career pathways.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Pranav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark placeholder-brand-muted focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark placeholder-brand-muted focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'ప్రస్తుత విద్యా స్థాయి' : 'Current Education Level'}
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  {EDUCATION_LEVELS.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'ఇష్టపడే భాష' : 'Preferred Platform Language'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreferredLang('en')}
                  className={`py-2 px-3 text-xs font-bold rounded-brand-sm border transition-colors flex items-center justify-center gap-1.5 ${
                    preferredLang === 'en'
                      ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                      : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>English</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredLang('te')}
                  className={`py-2 px-3 text-xs font-bold rounded-brand-sm border transition-colors flex items-center justify-center gap-1.5 ${
                    preferredLang === 'te'
                      ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                      : 'border-brand-border bg-brand-card text-brand-muted hover:border-brand-primary'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>తెలుగు (Telugu)</span>
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'పాస్‌వర్డ్' : 'Password (min. 6 characters)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark placeholder-brand-muted focus:outline-none focus:border-brand-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'పాస్‌వర్డ్ ధృవీకరించండి' : 'Confirm Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark placeholder-brand-muted focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-brand-muted">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                />
                <span className="leading-relaxed">
                  {language === 'te'
                    ? 'నేను PathSetu గోప్యతా విధానం మరియు విద్యార్థి కమ్యూనిటీ నిబంధనలను అంగీకరిస్తున్నాను.'
                    : 'I agree to the PathSetu Student Privacy Policy, ethical community guidelines, and verified data standards.'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isSubmitting ? 'Creating Account...' : (language === 'te' ? 'నమోదు పూర్తి చేసి ప్రొఫైల్ సెట్ చేయండి →' : 'Complete Registration & Setup Profile →')}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-brand-border text-xs text-brand-muted">
            <span>{language === 'te' ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have a PathSetu account?'}{' '}</span>
            <Link to="/login" className="text-brand-primary font-bold hover:underline">
              {language === 'te' ? 'ఇక్కడ లాగిన్ అవ్వండి' : 'Sign In here'}
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-brand-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Encrypted credentials · Never shared with third parties</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

