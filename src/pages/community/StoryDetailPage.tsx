import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Flag,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  BookOpen,
  Send,
  X
} from 'lucide-react';
import { StudentStory } from '../../types';
import { communityService } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { FadeIn, MotionCard } from '../../components/common/Motion';

export const StoryDetailPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState<StudentStory | null>(null);
  const [relatedStories, setRelatedStories] = useState<StudentStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Reporting modal
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'spam' | 'inappropriate' | 'copyright' | 'harassment' | 'misleading'>('misleading');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadStory() {
      if (!storyId) return;
      setLoading(true);
      try {
        const item = await communityService.getStoryById(storyId);
        if (isMounted) {
          if (item) {
            setStory(item);
            setLiked(!!item.is_liked_by_me);
            setLikeCount(item.likes_count || 0);

            // Fetch related stories in the same career track
            const all = await communityService.getStories({ careerId: item.career_id });
            setRelatedStories(all.filter(s => s.id !== item.id).slice(0, 3));
          } else {
            setStory(null);
          }
        }
      } catch (err) {
        console.error('Failed to load story:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadStory();
    return () => {
      isMounted = false;
    };
  }, [storyId]);

  const handleLike = async () => {
    if (!story) return;
    const res = await communityService.toggleLike(story.id, user?.id);
    setLiked(res.liked);
    setLikeCount(res.newCount);
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;
    await communityService.reportStory({
      story_id: story.id,
      reporter_id: user?.id,
      reason: reportReason,
      details: reportDetails
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSubmitted(false);
      setReportDetails('');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm text-brand-muted">Loading student story details...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-muted">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark">Student Story Not Found</h2>
        <p className="text-sm text-brand-muted">
          The requested video story may have been removed by its creator or the URL is incorrect.
        </p>
        <div className="pt-4">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-brand bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community Stories
          </Link>
        </div>
      </div>
    );
  }

  const authorProfileLink = story.author_username
    ? `/profile/${story.author_username}`
    : '/community';

  return (
    <div className="py-6 sm:py-8 space-y-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Feed</span>
        </Link>

        {story.is_demo_seed ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-elevated text-brand-muted text-[11px] font-bold border border-brand-border">
            <span>Demo Reference Case Study</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-elevated text-brand-cyan text-[11px] font-bold border border-brand-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Verified Student Story</span>
          </span>
        )}
      </div>

      {/* Main Grid: Video + Story Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player & Detailed Information (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Container */}
          <FadeIn>
            <div className="bg-black border border-brand-border rounded-brand overflow-hidden shadow-sm">
              <video
                controls
                playsInline
                className="w-full aspect-video object-contain bg-black"
                poster={story.thumbnail_url}
                src={story.video_url}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </FadeIn>

          {/* Action Row: Title, Likes, Share, Report */}
          <div className="bg-brand-surface border border-brand-border rounded-brand p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-elevated text-brand-primary border border-brand-border">
                    {story.career_name}
                  </span>
                  <span className="text-xs text-brand-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(story.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
                  {story.title}
                </h1>
              </div>

              {/* Like, Share, Report Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-brand text-xs font-bold border transition-colors ${
                    liked
                      ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900'
                      : 'bg-brand-elevated text-brand-dark border-brand-border hover:border-brand-primary'
                  }`}
                  aria-label="Like this story"
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current text-rose-500' : 'text-brand-muted'}`} />
                  <span>{likeCount}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-brand text-xs font-bold bg-brand-elevated text-brand-dark border border-brand-border hover:border-brand-primary transition-colors"
                  aria-label="Share story URL"
                  title="Copy Link to Clipboard"
                >
                  <Share2 className="w-4 h-4 text-brand-cyan" />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  className="p-2 rounded-brand text-brand-muted hover:text-brand-dark bg-brand-elevated border border-brand-border hover:border-rose-500 transition-colors"
                  aria-label="Report inappropriate story"
                  title="Report Story"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-brand-border text-sm text-brand-dark leading-relaxed whitespace-pre-line">
              {story.description}
            </div>

            {/* Milestone Achievement Callout (if available) */}
            {story.milestone_achievement && (
              <div className="bg-brand-elevated border border-brand-border rounded-brand p-4 flex items-start gap-3">
                <Award className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                    Milestone Completed
                  </h4>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {story.milestone_achievement}
                  </p>
                </div>
              </div>
            )}

            {/* Skills Learned Badges */}
            {story.skills_learned && story.skills_learned.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                  Skills Demonstrated
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {story.skills_learned.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-brand-sm bg-brand-elevated text-brand-dark border border-brand-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project / External Link */}
            {story.project_url && (
              <div className="pt-3 border-t border-brand-border">
                <a
                  href={story.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
                >
                  <span>View Project / Portfolio Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Author Card & Related Stories (1 col) */}
        <div className="space-y-6">
          {/* Author Profile Summary */}
          <div className="bg-brand-surface border border-brand-border rounded-brand p-5 space-y-4">
            <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
              About the Student Creator
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={story.author_avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                alt={story.author_name}
                className="w-12 h-12 rounded-full object-cover border border-brand-border"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-brand-dark truncate">
                  {story.author_name}
                </h4>
                <p className="text-xs text-brand-muted flex items-center gap-1 truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>{story.author_education || 'Student Explorer'}</span>
                </p>
                {story.author_username && (
                  <p className="text-[11px] text-brand-muted font-mono">
                    @{story.author_username}
                  </p>
                )}
              </div>
            </div>

            {story.author_username && (
              <div className="pt-2">
                <Link
                  to={authorProfileLink}
                  className="w-full flex items-center justify-center py-2 px-3 rounded-brand text-xs font-bold bg-brand-elevated text-brand-dark border border-brand-border hover:border-brand-primary transition-colors"
                >
                  View Student Profile →
                </Link>
              </div>
            )}
          </div>

          {/* Quick Upload CTA */}
          <div className="bg-brand-surface border border-brand-border rounded-brand p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                Share Your Own Journey
              </h3>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Are you working through a course or building a project? Inspire other students by uploading a short 1-minute video breakdown.
            </p>
            <Link
              to="/community/upload"
              className="w-full flex items-center justify-center py-2 px-3 rounded-brand text-xs font-bold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
            >
              Upload Your Story
            </Link>
          </div>

          {/* Related Stories in same pathway */}
          {relatedStories.length > 0 && (
            <div className="bg-brand-surface border border-brand-border rounded-brand p-5 space-y-4">
              <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                More in {story.career_name}
              </h3>

              <div className="space-y-3">
                {relatedStories.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/community/story/${rel.id}`}
                    className="flex items-start gap-3 group p-2 rounded-brand hover:bg-brand-elevated transition-colors"
                  >
                    <img
                      src={rel.thumbnail_url}
                      alt={rel.title}
                      className="w-16 h-12 object-cover rounded border border-brand-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-brand-dark group-hover:text-brand-primary line-clamp-2 transition-colors">
                        {rel.title}
                      </h5>
                      <p className="text-[11px] text-brand-muted mt-0.5 truncate">
                        By {rel.author_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-brand-surface border border-brand-border rounded-brand p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-500">
                <Flag className="w-4 h-4" />
                <h3 className="text-sm font-bold text-brand-dark">Report Student Story</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="p-1 rounded text-brand-muted hover:text-brand-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-brand-dark">Report Submitted</h4>
                <p className="text-xs text-brand-muted">
                  Thank you for keeping our community safe. Our team will review this story.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <p className="text-xs text-brand-muted leading-relaxed">
                  Help us maintain a constructive, respectful learning environment for all Indian students.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-dark">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e: any) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-brand bg-brand-elevated border border-brand-border text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  >
                    <option value="misleading">Misleading Career or Education Claims</option>
                    <option value="inappropriate">Inappropriate or Offensive Content</option>
                    <option value="spam">Promotional Spam or Commercial Ads</option>
                    <option value="copyright">Copyright or Intellectual Property Infringement</option>
                    <option value="harassment">Harassment or Abuse</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-dark">Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional context to help reviewers..."
                    className="w-full px-3 py-2 text-xs rounded-brand bg-brand-elevated border border-brand-border text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-brand bg-brand-elevated border border-brand-border text-brand-muted hover:text-brand-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold rounded-brand bg-rose-600 text-white hover:bg-rose-700"
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

