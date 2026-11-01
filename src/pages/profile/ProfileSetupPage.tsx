import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, BookOpen, MapPin, Building, Globe, Lock, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FadeIn, TextReveal } from '../../components/common/Motion';

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
];

export const ProfileSetupPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || PRESET_AVATARS[0]);
  const [displayName, setDisplayName] = useState(profile.displayName || profile.name);
  const [username, setUsername] = useState(profile.username || `student_${Math.random().toString(36).substring(2, 6)}`);
  const [bio, setBio] = useState(profile.bio || '');
  const [institutionName, setInstitutionName] = useState(profile.institutionName || '');
  const [courseStream, setCourseStream] = useState(profile.courseStream || '');
  const [locationCity, setLocationCity] = useState(profile.locationCity || '');
  const [locationState, setLocationState] = useState(profile.locationState || '');
  const [learningGoals, setLearningGoals] = useState(profile.learningGoals || '');
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '');
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>(profile.profileVisibility || 'public');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (goToAssessment = true) => {
    setIsSaving(true);
    await updateProfile({
      avatarUrl,
      displayName: displayName.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      bio: bio.trim(),
      institutionName: institutionName.trim(),
      courseStream: courseStream.trim(),
      locationCity: locationCity.trim(),
      locationState: locationState.trim(),
      learningGoals: learningGoals.trim(),
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
      profileVisibility
    });
    setIsSaving(false);

    if (goToAssessment) {
      navigate('/assessment');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-2xl mx-auto space-y-8">
      <FadeIn duration={0.4}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-brand-border pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-cyan border border-brand-border text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 01 · Profile Completion Wizard</span>
            </div>
            <TextReveal
              text={language === 'te' ? 'మీ విద్యార్థి ప్రొఫైల్ పూర్తి చేయండి' : 'Complete Your Student Profile'}
              as="h1"
              className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight"
            />
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {language === 'te'
                ? 'మీ వివరాలు సరైన విద్యా మార్గాలు మరియు స్కాలర్‌షిప్‌లను సిఫార్సు చేయడానికి సహాయపడతాయి.'
                : 'Help us personalize your career pathway matches, statutory scholarships, and peer community.'}
            </p>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-brand-dark">
              {language === 'te' ? 'ప్రొఫైల్ అవతార్ ఎంచుకోండి' : 'Choose a Student Avatar'}
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`relative rounded-full p-0.5 border-2 transition-all ${
                    avatarUrl === url ? 'border-brand-primary scale-110' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar option ${i + 1}`} className="w-12 h-12 rounded-full object-cover" />
                  {avatarUrl === url && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'డిస్ప్లే పేరు' : 'Display Name / Nickname'}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Pranav S."
                className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'యూజర్‌నేమ్' : 'Username (Unique handle)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted text-xs">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="pranav_student"
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">
              {language === 'te' ? 'సంక్షిప్త పరిచయం' : 'Short Biography (1-2 sentences)'}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="e.g. Class 12 student exploring software development, coding competitions, and affordable engineering polytechnics."
              className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Academic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'పాఠశాల / కళాశాల పేరు (ఐచ్ఛికం)' : 'School / College / Institution (Optional)'}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={institutionName}
                  onChange={e => setInstitutionName(e.target.value)}
                  placeholder="e.g. Govt Model Junior College"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'కోర్సు లేదా గ్రూప్' : 'Current Course or Stream'}
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={courseStream}
                  onChange={e => setCourseStream(e.target.value)}
                  placeholder="e.g. MPC / BiPC / CEC / CSE"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'నగరం లేదా జిల్లా' : 'City or District'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={locationCity}
                  onChange={e => setLocationCity(e.target.value)}
                  placeholder="e.g. Guntur / Vijayawada"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                {language === 'te' ? 'రాష్ట్రం' : 'State'}
              </label>
              <input
                type="text"
                value={locationState}
                onChange={e => setLocationState(e.target.value)}
                placeholder="e.g. Andhra Pradesh / Telangana"
                className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Learning Goals */}
          <div>
            <label className="block text-xs font-bold text-brand-dark mb-1">
              {language === 'te' ? 'మీ తక్షణ అభ్యాస లక్ష్యం' : 'What is your primary learning goal right now?'}
            </label>
            <input
              type="text"
              value={learningGoals}
              onChange={e => setLearningGoals(e.target.value)}
              placeholder="e.g. Master Python basics, build a portfolio project, and compare college options."
              className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
            />
          </div>

          {/* Social / Portfolio Links (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                GitHub / Project URL (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-dark mb-1">
                LinkedIn Profile (Optional)
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full px-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Profile Visibility Controls */}
          <div className="p-4 rounded-brand-sm bg-brand-elevated border border-brand-border space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-brand-dark flex items-center gap-1.5">
                  {profileVisibility === 'public' ? <Globe className="w-3.5 h-3.5 text-brand-cyan" /> : <Lock className="w-3.5 h-3.5 text-brand-primary" />}
                  <span>Profile Privacy & Visibility</span>
                </h4>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  {profileVisibility === 'public'
                    ? 'Other students can discover your learning journey and public project videos.'
                    : 'Your profile and videos will be private. Only you can view them.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setProfileVisibility('public')}
                  className={`px-3 py-1 text-xs font-bold rounded-brand-sm border transition-colors ${
                    profileVisibility === 'public'
                      ? 'border-brand-primary bg-brand-surface text-brand-primary'
                      : 'border-brand-border text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setProfileVisibility('private')}
                  className={`px-3 py-1 text-xs font-bold rounded-brand-sm border transition-colors ${
                    profileVisibility === 'private'
                      ? 'border-brand-primary bg-brand-surface text-brand-primary'
                      : 'border-brand-border text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  Private
                </button>
              </div>
            </div>
            <p className="text-[10px] text-brand-muted">
              🔒 Note: We strictly protect student privacy. Your email address and account credentials are never made public.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark text-xs font-bold transition-colors"
            >
              Save & Go to Dashboard
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-brand-sm bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <span>{isSaving ? 'Saving...' : (language === 'te' ? 'సేవ్ చేసి కెరీర్ అసెస్‌మెంట్ ప్రారంభించండి →' : 'Save & Start Career Discovery Questionnaire →')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

