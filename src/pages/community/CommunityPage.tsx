import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Video,
  Plus,
  Search,
  Filter,
  Heart,
  Share2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  User,
  GraduationCap,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { communityService } from '../../services/communityService';
import { StudentStory, StoryReport } from '../../types';
import { CAREERS } from '../../data/careers';
import { FadeIn, TextReveal, MotionCard } from '../../components/common/Motion';

export const CommunityPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { language, t } = useLanguage();

  const [stories, setStories] = useState<StudentStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCareer, setSelectedCareer] = useState('all');
  const [selectedEdu, setSelectedEdu] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'students' | 'demos'>('all');

  // Reporting Modal State
  const [reportingStoryId, setReportingStoryId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<StoryReport['reason']>('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Share Notice
  const [copiedStoryId, setCopiedStoryId] = useState<string | null>(null);

  const fetchStories = async () => {
    setIsLoading(true);
    const list = await communityService.getStories({
      careerId: selectedCareer,
      educationLevel: selectedEdu,
      searchQuery,
      sortBy,
      userId: user?.id
    });
    setStories(list);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, [selectedCareer, selectedEdu, searchQuery, sortBy]);

  const handleToggleLike = async (storyId: string) => {
    const res = await communityService.toggleLike(storyId, user?.id);
    setStories(prev =>
      prev.map(s => {
        if (s.id === storyId) {
          return {
            ...s,
            is_liked_by_me: res.liked,
            likes_count: res.newCount
          };
        }
        return s;
      })
    );
  };

  const handleShareStory = (storyId: string) => {
    const url = `${window.location.origin}/community/story/${storyId}`;
    navigator.clipboard.writeText(url);
    setCopiedStoryId(storyId);
    setTimeout(() => setCopiedStoryId(null), 2000);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingStoryId || !reportDetails.trim()) return;

    await communityService.reportStory({
      story_id: reportingStoryId,
      reporter_id: user?.id,
      reason: reportReason,
      details: reportDetails.trim()
    });

    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportingStoryId(null);
      setReportDetails('');
    }, 1500);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm('Are you sure you want to delete your story submission?')) {
      await communityService.deleteStory(storyId, user?.id);
      setStories(prev => prev.filter(s => s.id !== storyId));
    }
  };

  const filteredStories = stories.filter(s => {
    if (sourceFilter === 'students' && s.is_demo_seed) return false;
    if (sourceFilter === 'demos' && !s.is_demo_seed) return false;
    return true;
  });

  return (
    <div className="py-6 sm:py-10 space-y-8">
      {/* Community Header */}
      <FadeIn duration={0.35}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-cyan border border-brand-border text-xs font-bold uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" />
                <span>Student Success Stories & Peer Learning Community</span>
              </div>
              <TextReveal
                text={language === 'te' ? 'విద్యార్థుల అనుభవాలు & వీడియో ప్రాజెక్ట్‌లు' : 'Student Success Stories & Video Community'}
                as="h1"
                className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight"
              />
              <p className="text-xs sm:text-sm text-brand-muted max-w-2xl leading-relaxed">
                Watch real students from Class 10, Intermediate, and College describe their learning progress, internship preparation, starter projects, and career pathways.
              </p>
            </div>

            <Link
              to="/community/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Share Your Story</span>
            </Link>
          </div>

          {/* Source Filter Tabs & Transparency Badge */}
          <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSourceFilter('all')}
                className={`px-3 py-1 rounded-brand-sm font-bold border transition-colors ${
                  sourceFilter === 'all'
                    ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                    : 'border-brand-border text-brand-muted hover:text-brand-dark'
                }`}
              >
                All Stories ({stories.length})
              </button>
              <button
                type="button"
                onClick={() => setSourceFilter('students')}
                className={`px-3 py-1 rounded-brand-sm font-bold border transition-colors ${
                  sourceFilter === 'students'
                    ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                    : 'border-brand-border text-brand-muted hover:text-brand-dark'
                }`}
              >
                Student Uploads
              </button>
              <button
                type="button"
                onClick={() => setSourceFilter('demos')}
                className={`px-3 py-1 rounded-brand-sm font-bold border transition-colors ${
                  sourceFilter === 'demos'
                    ? 'border-brand-primary bg-brand-elevated text-brand-primary'
                    : 'border-brand-border text-brand-muted hover:text-brand-dark'
                }`}
              >
                Verified Demo Seeds
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-brand-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Strict Transparency: Demo case studies are clearly distinguished from authentic student uploads.</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Filter Toolbar */}
      <div className="bg-brand-surface border border-brand-border rounded-brand p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by topic, skill, or student..."
            className="w-full pl-8 pr-3 py-1.5 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary text-xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Career dropdown */}
          <select
            value={selectedCareer}
            onChange={e => setSelectedCareer(e.target.value)}
            className="px-2.5 py-1.5 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark text-xs focus:outline-none focus:border-brand-primary"
          >
            <option value="all">All Career Tracks</option>
            {CAREERS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Education Level */}
          <select
            value={selectedEdu}
            onChange={e => setSelectedEdu(e.target.value)}
            className="px-2.5 py-1.5 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark text-xs focus:outline-none focus:border-brand-primary"
          >
            <option value="all">All Education Stages</option>
            <option value="Class 10">Class 10 (Secondary)</option>
            <option value="Class 12">Class 11–12 (Intermediate)</option>
            <option value="Diploma">Polytechnic / ITI</option>
            <option value="Undergraduate">Undergraduate Degree</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark text-xs focus:outline-none focus:border-brand-primary"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Appreciated</option>
          </select>
        </div>
      </div>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-brand-muted">
          Loading student video stories...
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-brand-surface border border-brand-border rounded-brand p-8">
          <Video className="w-12 h-12 text-brand-muted mx-auto" />
          <h3 className="text-base font-bold text-brand-dark">No Stories Match Your Filter</h3>
          <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
            Be the first student to publish a learning story in this category or adjust your search filter above.
          </p>
          <Link
            to="/community/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Your Video Story</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredStories.map((story, idx) => {
            const isOwner = Boolean(user && story.user_id && story.user_id === user.id);

            return (
              <FadeIn key={story.id} delay={idx * 0.05} className="h-full">
                <div className="h-full bg-brand-surface border border-brand-border rounded-brand p-5 flex flex-col justify-between space-y-4 hover:border-brand-primary/60 transition-colors">
                  <div className="space-y-3">
                    {/* Author & Source Tag */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/profile/${story.author_username || 'student'}`}
                        className="flex items-center space-x-2.5 group"
                      >
                        <img
                          src={story.author_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                          alt={story.author_name}
                          className="w-8 h-8 rounded-full object-cover border border-brand-border"
                        />
                        <div>
                          <div className="text-xs font-bold text-brand-dark group-hover:text-brand-primary transition-colors flex items-center gap-1">
                            <span>{story.author_name}</span>
                          </div>
                          <div className="text-[10px] text-brand-muted">{story.author_education}</div>
                        </div>
                      </Link>

                      {story.is_demo_seed ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-elevated text-brand-muted border border-brand-border" title="Demonstration Seed Case Study">
                          Demo Case Study
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-elevated text-brand-cyan border border-brand-border" title="Authentic Student Submission">
                          Student Story
                        </span>
                      )}
                    </div>

                    {/* Responsive Video Player */}
                    <div className="aspect-video bg-black/90 rounded-brand-sm overflow-hidden relative">
                      <video
                        src={story.video_url}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Pathway Badge */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-brand-primary">{story.career_name}</span>
                      <span className="text-brand-muted text-[10px]">
                        {new Date(story.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Story Title & Description */}
                    <div>
                      <h3 className="text-sm font-bold text-brand-dark leading-snug line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-xs text-brand-muted mt-1 leading-relaxed line-clamp-3">
                        {story.description}
                      </p>
                    </div>

                    {/* Skills Learned Badges */}
                    {story.skills_learned && story.skills_learned.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {story.skills_learned.slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-brand-elevated border border-brand-border text-[10px] font-medium text-brand-dark"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Project Link if present */}
                    {story.project_url && (
                      <div className="pt-1">
                        <a
                          href={story.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-brand-primary hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>View Public Project / Code</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(story.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-brand-sm border transition-colors ${
                        story.is_liked_by_me
                          ? 'border-red-500/30 bg-red-500/10 text-red-500 font-bold'
                          : 'border-brand-border text-brand-muted hover:text-brand-dark hover:border-brand-primary'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${story.is_liked_by_me ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{story.likes_count}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShareStory(story.id)}
                        className="p-1.5 text-brand-muted hover:text-brand-dark rounded transition-colors"
                        title="Copy share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportingStoryId(story.id)}
                        className="p-1.5 text-brand-muted hover:text-amber-500 rounded transition-colors"
                        title="Report inappropriate content"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </button>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-1.5 text-brand-muted hover:text-red-500 rounded transition-colors"
                          title="Delete my submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}

      {/* Share Toast */}
      {copiedStoryId && (
        <div className="fixed bottom-6 right-6 z-50 p-3 rounded-brand-sm bg-brand-primary text-white text-xs font-bold shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Story link copied to clipboard!</span>
        </div>
      )}

      {/* Report Modal */}
      {reportingStoryId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-brand-surface border border-brand-border rounded-brand p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="text-sm font-bold text-brand-dark flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Report Content to Moderators</span>
              </h3>
              <button
                type="button"
                onClick={() => setReportingStoryId(null)}
                className="text-brand-muted hover:text-brand-dark text-lg"
              >
                ×
              </button>
            </div>

            {reportSubmitted ? (
              <div className="p-4 rounded-brand-sm bg-brand-elevated text-xs font-bold text-brand-cyan text-center">
                Thank you. Your report has been dispatched to PathSetu student community moderators.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Reason for report</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                  >
                    <option value="spam">Spam / Commercial advertising</option>
                    <option value="inappropriate">Inappropriate language or media</option>
                    <option value="copyright">Copyright violation / Not original work</option>
                    <option value="misleading">Misleading or false educational claim</option>
                    <option value="harassment">Harassment or bullying</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-brand-dark mb-1">Provide specific details</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Describe what is inappropriate..."
                    className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportingStoryId(null)}
                    className="px-3 py-1.5 rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-brand-sm bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

