import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Edit3,
  MapPin,
  Building,
  GraduationCap,
  Globe,
  Lock,
  Compass,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Video,
  LogOut,
  Flame,
  Clock,
  Share2,
  Languages
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { communityService } from '../../services/communityService';
import { StudentStory } from '../../types';
import { CAREERS } from '../../data/careers';
import { FadeIn, TextReveal, MotionCard } from '../../components/common/Motion';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, activeCareerId, setActiveCareerId, signOut, studyStreak, weeklyHours, completedMilestones } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [myStories, setMyStories] = useState<StudentStory[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangeCareerModalOpen, setIsChangeCareerModalOpen] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState(profile.name);
  const [editDisplayName, setEditDisplayName] = useState(profile.displayName || profile.name);
  const [editBio, setEditBio] = useState(profile.bio || '');
  const [editInstitution, setEditInstitution] = useState(profile.institutionName || '');
  const [editCourse, setEditCourse] = useState(profile.courseStream || '');
  const [editCity, setEditCity] = useState(profile.locationCity || '');
  const [editState, setEditState] = useState(profile.locationState || '');
  const [editGoals, setEditGoals] = useState(profile.learningGoals || '');
  const [editGithub, setEditGithub] = useState(profile.githubUrl || '');
  const [editLinkedin, setEditLinkedin] = useState(profile.linkedinUrl || '');
  const [editPortfolio, setEditPortfolio] = useState(profile.portfolioUrl || '');
  const [editVisibility, setEditVisibility] = useState<'public' | 'private'>(profile.profileVisibility || 'public');
  const [newSkillInput, setNewSkillInput] = useState('');

  const activeCareer = CAREERS.find(c => c.id === activeCareerId) || CAREERS[0];
  const userMilestonesCount = (completedMilestones[activeCareer.id] || []).length;

  useEffect(() => {
    async function loadStories() {
      setIsLoadingStories(true);
      const stories = await communityService.getStories();
      // Filter for stories matching current user or username
      const filtered = stories.filter(s =>
        (s.user_id && profile.userId && s.user_id === profile.userId) ||
        (s.author_username && profile.username && s.author_username === profile.username) ||
        s.author_name === profile.name
      );
      setMyStories(filtered);
      setIsLoadingStories(false);
    }
    loadStories();
  }, [profile.name, profile.username, profile.userId]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName.trim(),
      displayName: editDisplayName.trim(),
      bio: editBio.trim(),
      institutionName: editInstitution.trim(),
      courseStream: editCourse.trim(),
      locationCity: editCity.trim(),
      locationState: editState.trim(),
      learningGoals: editGoals.trim(),
      githubUrl: editGithub.trim(),
      linkedinUrl: editLinkedin.trim(),
      portfolioUrl: editPortfolio.trim(),
      profileVisibility: editVisibility
    });
    setIsEditModalOpen(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const current = profile.existingSkills || [];
    if (!current.includes(newSkillInput.trim())) {
      updateProfile({ existingSkills: [...current, newSkillInput.trim()] });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const current = profile.existingSkills || [];
    updateProfile({ existingSkills: current.filter(s => s !== skillToRemove) });
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story submission?')) {
      await communityService.deleteStory(storyId, profile.userId);
      setMyStories(prev => prev.filter(s => s.id !== storyId));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="py-6 sm:py-10 space-y-8">
      {/* Header Profile Card */}
      <FadeIn duration={0.35}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="relative">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-brand-border"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-brand-primary border-2 border-brand-surface flex items-center justify-center text-[10px] text-white" title="Verified Student">
                  ✓
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
                    {profile.name}
                  </h1>
                  {profile.username && (
                    <span className="text-xs font-semibold text-brand-muted">
                      @{profile.username}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    profile.profileVisibility === 'public'
                      ? 'bg-brand-elevated text-brand-cyan border-brand-border'
                      : 'bg-brand-elevated text-brand-primary border-brand-border'
                  }`}>
                    {profile.profileVisibility === 'public' ? 'Public Profile' : 'Private Profile'}
                  </span>
                </div>

                <p className="text-xs text-brand-muted">
                  {profile.educationLevel}
                  {profile.courseStream && ` · ${profile.courseStream}`}
                </p>

                {profile.institutionName && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <Building className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{profile.institutionName}</span>
                  </div>
                )}

                {profile.locationCity && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{profile.locationCity}{profile.locationState ? `, ${profile.locationState}` : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-dark hover:border-brand-primary bg-brand-elevated transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                <span>Edit Profile</span>
              </button>

              <Link
                to={`/profile/${profile.username || 'student'}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark transition-colors"
                title="View how others see your profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public View</span>
              </Link>
            </div>
          </div>

          {/* Biography */}
          {profile.bio && (
            <div className="pt-4 border-t border-brand-border">
              <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-brand-border text-center">
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-brand-border">
              <div className="text-lg font-black text-brand-primary">{userMilestonesCount}</div>
              <div className="text-[11px] font-semibold text-brand-muted">Milestones Mastered</div>
            </div>
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-brand-border">
              <div className="text-lg font-black text-brand-cyan">{studyStreak} Days 🔥</div>
              <div className="text-[11px] font-semibold text-brand-muted">Study Streak</div>
            </div>
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-brand-border">
              <div className="text-lg font-black text-brand-primary">{myStories.length}</div>
              <div className="text-[11px] font-semibold text-brand-muted">Stories Shared</div>
            </div>
            <div className="p-3 rounded-brand-sm bg-brand-elevated border border-brand-border">
              <div className="text-lg font-black text-brand-cyan">₹{(profile.annualBudgetInr || 35000).toLocaleString('en-IN')}</div>
              <div className="text-[11px] font-semibold text-brand-muted">Education Budget / yr</div>
            </div>
          </div>

          {/* Social Links */}
          {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl) && (
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-brand-border text-xs">
              <span className="font-semibold text-brand-muted">Verified Links:</span>
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center gap-1 font-medium">
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center gap-1 font-medium">
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center gap-1 font-medium">
                  <span>Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Selected Career Path Banner */}
      <FadeIn delay={0.1}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-cyan">
                <Compass className="w-4 h-4" />
                <span>Currently Tracking Career Pathway</span>
              </div>
              <h2 className="text-xl font-bold text-brand-dark mt-1 flex items-center gap-2">
                <span>{activeCareer.emoji}</span>
                <span>{activeCareer.name}</span>
                <span className="text-xs font-normal text-brand-muted">({activeCareer.category})</span>
              </h2>
              <p className="text-xs text-brand-muted mt-1 max-w-2xl leading-relaxed">
                {activeCareer.desc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsChangeCareerModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-dark hover:border-brand-primary bg-brand-elevated transition-colors"
              >
                Change Path
              </button>
              <Link
                to="/roadmap"
                className="px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
              >
                View Roadmap →
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Skills & Learning Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verified Skills */}
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-dark">
              Verified & Existing Skills
            </h3>
            <span className="text-xs text-brand-muted">{(profile.existingSkills || []).length} active</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(profile.existingSkills || []).map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-brand-sm bg-brand-elevated border border-brand-border text-xs font-medium text-brand-dark"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-brand-muted hover:text-red-500 text-xs ml-0.5"
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2 border-t border-brand-border">
            <input
              type="text"
              value={newSkillInput}
              onChange={e => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Python, SQL)..."
              className="flex-1 px-3 py-1.5 text-xs rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-bold rounded-brand-sm bg-brand-elevated border border-brand-border text-brand-dark hover:border-brand-primary transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Goals & Achievements */}
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 space-y-4">
          <h3 className="text-sm font-bold text-brand-dark">
            Learning Goals & Certifications
          </h3>

          {profile.learningGoals ? (
            <p className="text-xs text-brand-muted leading-relaxed">
              🎯 <span className="font-semibold text-brand-dark">Primary Goal:</span> {profile.learningGoals}
            </p>
          ) : (
            <p className="text-xs text-brand-muted italic">
              No learning goals written yet. Click &quot;Edit Profile&quot; to set your goals.
            </p>
          )}

          <div className="pt-2 border-t border-brand-border space-y-2">
            <div className="text-xs font-bold text-brand-dark">Milestones & Proofs of Work:</div>
            {(profile.achievements || []).map((ach, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-brand-muted">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan flex-shrink-0" />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uploaded Success Story Videos Section */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-brand-dark flex items-center gap-2">
              <Video className="w-5 h-5 text-brand-primary" />
              <span>My Video Stories & Project Walkthroughs</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Share your milestones, project demos, and learning takeaways with fellow students.
            </p>
          </div>

          <Link
            to="/community/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Video Story</span>
          </Link>
        </div>

        {isLoadingStories ? (
          <div className="p-8 text-center text-xs text-brand-muted">Loading your stories...</div>
        ) : myStories.length === 0 ? (
          <div className="p-8 border border-dashed border-brand-border rounded-brand text-center space-y-3">
            <Video className="w-8 h-8 text-brand-muted mx-auto" />
            <div className="text-sm font-bold text-brand-dark">No Video Stories Uploaded Yet</div>
            <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
              Have you completed a career demo, coded your first page, or tested a circuit? Record a short video describing what you learned and inspire other students.
            </p>
            <Link
              to="/community/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
            >
              <span>Publish Your First Story →</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myStories.map(story => (
              <div
                key={story.id}
                className="bg-brand-elevated border border-brand-border rounded-brand p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-video bg-black/80 rounded-brand-sm overflow-hidden relative">
                    <video
                      src={story.video_url}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1">
                    <span className="font-bold text-brand-cyan">{story.career_name}</span>
                    <span className="capitalize">{story.visibility}</span>
                  </div>

                  <h4 className="text-sm font-bold text-brand-dark line-clamp-2">
                    {story.title}
                  </h4>

                  <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                    {story.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                  <span className="text-brand-muted">❤️ {story.likes_count} likes</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/community/story/${story.id}`}
                      className="text-brand-primary font-bold hover:underline"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                      title="Delete story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Settings & Sign Out */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">Account Preferences</h3>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage language, theme, and sign out of your PathSetu account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-2 text-xs font-semibold rounded-brand-sm border border-brand-border text-brand-dark hover:border-brand-primary bg-brand-elevated transition-colors flex items-center gap-1.5"
          >
            <Languages className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{language === 'en' ? 'తెలుగుకు మారండి' : 'Switch to English'}</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 text-xs font-bold rounded-brand-sm border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-base font-bold text-brand-dark">Edit Profile Details</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-brand-muted hover:text-brand-dark text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-dark mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Institution</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={e => setEditInstitution(e.target.value)}
                    className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Stream / Group</label>
                  <input
                    type="text"
                    value={editCourse}
                    onChange={e => setEditCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">City / District</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">State</label>
                  <input
                    type="text"
                    value={editState}
                    onChange={e => setEditState(e.target.value)}
                    className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Learning Goals</label>
                <input
                  type="text"
                  value={editGoals}
                  onChange={e => setEditGoals(e.target.value)}
                  className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Profile Visibility</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditVisibility('public')}
                    className={`flex-1 py-1.5 px-3 rounded-brand-sm border font-bold text-xs ${
                      editVisibility === 'public'
                        ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                        : 'border-brand-border text-brand-muted'
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditVisibility('private')}
                    className={`flex-1 py-1.5 px-3 rounded-brand-sm border font-bold text-xs ${
                      editVisibility === 'private'
                        ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                        : 'border-brand-border text-brand-muted'
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-brand-sm bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-hover"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Career Modal */}
      {isChangeCareerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-base font-bold text-brand-dark">Select Career Pathway to Track</h3>
              <button
                type="button"
                onClick={() => setIsChangeCareerModalOpen(false)}
                className="text-brand-muted hover:text-brand-dark text-lg"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {CAREERS.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveCareerId(c.id);
                    setIsChangeCareerModalOpen(false);
                  }}
                  className={`p-3 rounded-brand-sm border cursor-pointer transition-colors flex items-center justify-between ${
                    c.id === activeCareerId
                      ? 'border-brand-primary bg-brand-elevated text-brand-primary font-bold'
                      : 'border-brand-border hover:border-brand-primary bg-brand-card text-brand-dark'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.emoji}</span>
                    <div>
                      <div className="font-bold">{c.name}</div>
                      <div className="text-[11px] text-brand-muted font-normal">{c.category} · {c.study_duration}</div>
                    </div>
                  </div>
                  {c.id === activeCareerId && (
                    <span className="text-xs font-bold text-brand-cyan">Active ✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

