import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  Video,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Lock,
  Globe,
  Eye,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { communityService } from '../../services/communityService';
import { CAREERS } from '../../data/careers';
import { FadeIn, TextReveal } from '../../components/common/Motion';

export const VideoUploadPage: React.FC = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [careerId, setCareerId] = useState(profile.selectedCareerId || 'software_dev');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [skillsLearnedInput, setSkillsLearnedInput] = useState('HTML/CSS, JavaScript, Git');
  const [milestoneAchievement, setMilestoneAchievement] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [confirmRights, setConfirmRights] = useState(false);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`Selected video (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB maximum limit. Please select a shorter or compressed clip.`);
      setVideoFile(null);
      setPreviewUrl(null);
      return;
    }

    setErrorMessage(null);
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!videoFile) {
      setErrorMessage('Please select a video file to upload.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please provide a descriptive story title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe what you learned or built.');
      return;
    }
    if (!confirmRights) {
      setErrorMessage('Please confirm that you have rights to share this video.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const careerObj = CAREERS.find(c => c.id === careerId) || CAREERS[0];
    const skillsArray = skillsLearnedInput.split(',').map(s => s.trim()).filter(Boolean);

    const res = await communityService.uploadStory({
      title,
      description,
      careerId: careerObj.id,
      careerName: careerObj.name,
      videoFile,
      skillsLearned: skillsArray,
      milestoneAchievement,
      projectUrl,
      visibility,
      authorName: profile.name,
      authorUsername: profile.username,
      authorAvatar: profile.avatarUrl,
      authorEducation: profile.educationLevel,
      userId: user?.id,
      onProgress: pct => setUploadProgress(pct)
    });

    setIsUploading(false);

    if (res.success) {
      setStatusMessage('Your video story has been published to the student community!');
      setTimeout(() => {
        navigate('/community');
      }, 1800);
    } else {
      setErrorMessage(res.error || 'Failed to upload video.');
    }
  };

  // If user is guest, offer convenient login prompt
  if (!isAuthenticated && !user) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-4 bg-brand-surface border border-brand-border rounded-brand p-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary">
          <Video className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-brand-dark">Sign In to Share Your Story</h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          Only registered students can upload learning journey videos to protect our peer community from spam.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-dark hover:bg-brand-elevated transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 max-w-2xl mx-auto space-y-6">
      <Link
        to="/community"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-dark transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Community</span>
      </Link>

      <FadeIn duration={0.35}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1 border-b border-brand-border pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-cyan border border-brand-border text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Peer Story Submission</span>
            </div>
            <TextReveal
              text={language === 'te' ? 'మీ అభ్యాస అనుభవ వీడియోను అప్‌లోడ్ చేయండి' : 'Share Your Learning Journey Video'}
              as="h1"
              className="text-2xl font-black text-brand-dark tracking-tight"
            />
            <p className="text-xs text-brand-muted leading-relaxed">
              Record a 30 to 90 second clip describing what you practiced, a project you built, a career demo you tested, or lessons learned.
            </p>
          </div>

          {statusMessage && (
            <div className="p-4 rounded-brand-sm bg-brand-elevated border border-brand-border text-xs text-brand-dark flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-brand-sm bg-brand-elevated border border-red-500/30 text-red-500 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Video File Upload Picker */}
            <div>
              <label className="block font-bold text-brand-dark mb-1.5">
                Video File (MP4, WebM, MOV · Max 50MB)
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-brand-border rounded-brand p-6 text-center cursor-pointer hover:border-brand-primary transition-colors bg-brand-card"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {videoFile ? (
                  <div className="space-y-2">
                    <FileVideo className="w-8 h-8 text-brand-primary mx-auto" />
                    <div className="font-bold text-brand-dark">{videoFile.name}</div>
                    <div className="text-[11px] text-brand-muted">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB · Click to change file
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-brand-muted mx-auto" />
                    <div className="font-bold text-brand-dark">Click to browse or drop video file here</div>
                    <div className="text-[11px] text-brand-muted">Recommended length: 30 to 120 seconds</div>
                  </div>
                )}
              </div>

              {/* Video Preview Player */}
              {previewUrl && (
                <div className="mt-3 aspect-video bg-black/90 rounded-brand-sm overflow-hidden border border-brand-border">
                  <video src={previewUrl} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Story Title (e.g. How I built a portfolio website in Intermediate)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Give your story a clear, informative title..."
                className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Story Description & Key Takeaways
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What challenges did you face? What did you build? What advice would you give to another student just starting?"
                className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
                required
              />
            </div>

            {/* Career Pathway Selector */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Relevant Career Pathway
              </label>
              <select
                value={careerId}
                onChange={e => setCareerId(e.target.value)}
                className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                {CAREERS.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name} ({c.category})</option>
                ))}
              </select>
            </div>

            {/* Skills Learned */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Skills Demonstrated / Learned (Comma separated)
              </label>
              <input
                type="text"
                value={skillsLearnedInput}
                onChange={e => setSkillsLearnedInput(e.target.value)}
                placeholder="e.g. HTML/CSS, React, Git, Soil Testing"
                className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Project URL */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Project Link or GitHub Repository (Optional)
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={e => setProjectUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full px-3 py-2 rounded-brand-sm border border-brand-border bg-brand-card text-brand-dark focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block font-bold text-brand-dark mb-1">
                Visibility Setting
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'public', label: 'Public Feed', desc: 'Visible to everyone' },
                  { id: 'unlisted', label: 'Unlisted', desc: 'Only with direct link' },
                  { id: 'private', label: 'Private', desc: 'Only visible to you' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setVisibility(opt.id as any)}
                    className={`p-2.5 rounded-brand-sm border text-left transition-colors ${
                      visibility === opt.id
                        ? 'border-brand-primary bg-brand-elevated text-brand-primary font-bold'
                        : 'border-brand-border text-brand-muted hover:border-brand-primary'
                    }`}
                  >
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-[10px] text-brand-muted font-normal mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-brand-muted">
                <input
                  type="checkbox"
                  checked={confirmRights}
                  onChange={e => setConfirmRights(e.target.checked)}
                  className="mt-0.5 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
                />
                <span className="leading-relaxed">
                  I confirm that I have the necessary rights to share this video, it represents authentic educational progress, and complies with PathSetu student community standards.
                </span>
              </label>
            </div>

            {/* Upload Progress Indicator */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold text-brand-primary">
                  <span>Uploading Video & Generating Streamable Assets...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-brand-elevated rounded-full h-2 overflow-hidden border border-brand-border">
                  <div
                    className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit & Cancel */}
            <div className="pt-4 border-t border-brand-border flex items-center justify-between gap-3">
              <Link
                to="/community"
                className="px-4 py-2 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Publishing Video...' : 'Publish to Student Community'}</span>
              </button>
            </div>
          </form>
        </div>
      </FadeIn>
    </div>
  );
};

