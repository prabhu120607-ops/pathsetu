import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FadeIn, TextReveal } from '../../components/common/Motion';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await resetPassword(email.trim());
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Password reset link sent to your email.');
    } else {
      setErrorMsg(res.error || 'Failed to send reset link.');
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-md mx-auto">
      <FadeIn duration={0.4}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-brand-sm bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary">
              <Mail className="w-6 h-6" />
            </div>
            <TextReveal
              text={language === 'te' ? 'పాస్‌వర్డ్ రీసెట్' : 'Reset Your Password'}
              as="h1"
              className="text-2xl font-black text-brand-dark tracking-tight"
            />
            <p className="text-xs text-brand-muted">
              {language === 'te'
                ? 'మీ నమోదిత ఈమెయిల్ నమోదు చేయండి. మేము పునరుద్ధరణ లింక్‌ను పంపుతాము.'
                : 'Enter your registered email and we will send you secure recovery instructions.'}
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-brand-sm bg-brand-elevated border border-brand-border text-xs text-brand-dark space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-cyan">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reset Instructions Dispatched</span>
              </div>
              <p className="text-[11px] text-brand-muted leading-relaxed">
                {successMsg}
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {!successMsg && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Your Email Address'}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isSubmitting ? 'Sending...' : (language === 'te' ? 'రీసెట్ లింక్ పంపండి →' : 'Send Reset Link →')}</span>
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-brand-border">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-dark transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'te' ? 'లాగిన్‌కు తిరిగి వెళ్ళండి' : 'Back to Sign In'}</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

