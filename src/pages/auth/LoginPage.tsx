import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FadeIn, TextReveal } from '../../components/common/Motion';

export const LoginPage: React.FC = () => {
  const { signIn, quickDevLogin, isConfigured, isDevFallback } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to assessment onboarding after login to build profile and career paths
  const from = (location.state as any)?.from?.pathname || '/assessment?onboarding=true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg(language === 'te' ? 'దయచేసి ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.' : 'Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.error || (language === 'te' ? 'లాగిన్ విఫలమైంది. వివరాలు తనిఖీ చేయండి.' : 'Login failed. Please check your credentials.'));
    }
  };

  const handleQuickLogin = (name: string, edu: string) => {
    quickDevLogin(name, edu);
    navigate('/assessment?onboarding=true', { replace: true });
  };

  return (
    <div className="py-10 sm:py-16 max-w-md mx-auto">
      <FadeIn duration={0.4}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-brand-sm bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary">
              <Lock className="w-6 h-6" />
            </div>
            <TextReveal
              text={language === 'te' ? 'విద్యార్థి లాగిన్' : 'Student Sign In'}
              as="h1"
              className="text-2xl font-black text-brand-dark tracking-tight"
            />
            <p className="text-xs text-brand-muted">
              {language === 'te'
                ? 'మీ కెరీర్ పురోగతి మరియు వ్యక్తిగత మార్గదర్శకత్వం పొందండి.'
                : 'Access your saved career paths, learning roadmaps, and community stories.'}
            </p>
          </div>

          {/* Dev Mode Banner (Clear transparency) */}
          {(!isConfigured || isDevFallback) && (
            <div className="p-3.5 rounded-brand-sm bg-brand-elevated border border-brand-border text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-brand-cyan">
                <Sparkles className="w-4 h-4" />
                <span>Development Mode Active</span>
              </div>
              <p className="text-[11px] text-brand-muted leading-relaxed">
                Supabase credentials not yet configured in <code className="px-1 py-0.5 rounded bg-brand-surface border border-brand-border">.env</code>. You can test sign-in with any credentials or click the button below.
              </p>
              <button
                type="button"
                onClick={() => handleQuickLogin('Pranav Sharma', 'Class 11–12 (Science / PCM)')}
                className="w-full py-1.5 px-3 rounded-brand-sm bg-brand-surface border border-brand-border text-brand-dark hover:border-brand-primary text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>⚡ Instant Dev Sign-In as Pranav</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-brand-dark">
                  {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-brand-primary hover:underline font-semibold"
                >
                  {language === 'te' ? 'మర్చిపోయారా?' : 'Forgot password?'}
                </Link>
              </div>
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isSubmitting ? 'Verifying...' : (language === 'te' ? 'లాగిన్ అవ్వండి →' : 'Sign In →')}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-brand-border text-xs text-brand-muted">
            <span>{language === 'te' ? 'ఖాతా లేదా?' : "Don't have an account yet?"}{' '}</span>
            <Link to="/signup" className="text-brand-primary font-bold hover:underline">
              {language === 'te' ? 'ఉచితంగా నమోదు చేయండి' : 'Create Free Account'}
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-brand-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>100% Free & Open-Access Educational Tool</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

