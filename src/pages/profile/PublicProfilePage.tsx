import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Building,
  GraduationCap,
  Lock,
  Globe,
  Compass,
  CheckCircle2,
  Share2,
  Video,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { communityService } from '../../services/communityService';
import { StudentStory, StudentProfile } from '../../types';
import { CAREERS } from '../../data/careers';
import { FadeIn, TextReveal } from '../../components/common/Motion';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { profile: myProfile } = useAuth();

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [stories, setStories] = useState<StudentStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const isMe = myProfile.username === username || (username === 'student' && Boolean(myProfile.name));

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      if (isMe) {
        setStudent(myProfile);
      } else {
        // Fallback for public student view
        setStudent({
          name: "Sravani Kondapalli",
          displayName: "Sravani K.",
          username: username || "sravani_agri",
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
          bio: "Agricultural Science enthusiast studying crop health, N-P-K diagnostics, and sustainable rural farming pathways.",
          educationLevel: "B.Sc Agriculture (2nd Year)",
          institutionName: "Acharya N.G. Ranga Agricultural University",
          currentClass: "Year 2",
          courseStream: "Agronomy & Soil Science",
          subjects: ["Agronomy", "Soil Chemistry", "Crop Genetics"],
          interests: ["agriculture", "rural development", "sustainability"],
          existingSkills: ["Soil Chemistry", "Crop Diagnostics", "Fertilizer Calculations"],
          workstyle: "Field & Practical (Hands-on outdoor)",
          careerInterests: ["agri_scientist", "solar_electrician"],
          selectedCareerId: "agri_scientist",
          profileVisibility: "public",
          annualBudgetInr: 25000,
          preferredLanguage: "te",
          locationCity: "Bapatla",
          locationState: "Andhra Pradesh"
        });
      }

      // Load stories by this user
      const allStories = await communityService.getStories();
      const filtered = allStories.filter(s =>
        (s.author_username && s.author_username === username) ||
        (isMe && s.author_name === myProfile.name)
      );
      setStories(filtered.filter(s => s.visibility === 'public' || isMe));
      setIsLoading(false);
    }
    fetchUser();
  }, [username, isMe, myProfile]);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-brand-muted">Loading student profile...</div>;
  }

  if (!student) {
    return (
      <div className="py-20 text-center space-y-3">
        <User className="w-12 h-12 text-brand-muted mx-auto" />
        <h2 className="text-lg font-bold text-brand-dark">Student Profile Not Found</h2>
        <Link to="/community" className="text-xs text-brand-primary font-bold hover:underline">
          ← Back to Community
        </Link>
      </div>
    );
  }

  // Private profile check (unless logged in as owner)
  if (student.profileVisibility === 'private' && !isMe) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-4 bg-brand-surface border border-brand-border rounded-brand p-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-brand-elevated border border-brand-border flex items-center justify-center text-brand-primary">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-dark">This Student Profile is Private</h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          The student has configured their account settings to keep their profile and learning journey private.
        </p>
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
        >
          <span>Explore Public Community Stories</span>
        </Link>
      </div>
    );
  }

  const careerObj = CAREERS.find(c => c.id === student.selectedCareerId) || CAREERS[0];

  return (
    <div className="py-6 sm:py-10 space-y-8 max-w-4xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-muted hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Community</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-brand-sm border border-brand-border text-brand-dark hover:border-brand-primary bg-brand-elevated transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-primary" />
          <span>{copiedLink ? 'Link Copied! ✓' : 'Share Profile'}</span>
        </button>
      </div>

      <FadeIn duration={0.35}>
        <div className="bg-brand-surface border border-brand-border rounded-brand p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-4">
              <img
                src={student.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-brand-border"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
                    {student.displayName || student.name}
                  </h1>
                  {student.username && (
                    <span className="text-xs font-semibold text-brand-muted">
                      @{student.username}
                    </span>
                  )}
                </div>

                <p className="text-xs text-brand-muted">
                  {student.educationLevel}
                  {student.courseStream && ` · ${student.courseStream}`}
                </p>

                {student.institutionName && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <Building className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{student.institutionName}</span>
                  </div>
                )}

                {student.locationCity && (
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{student.locationCity}{student.locationState ? `, ${student.locationState}` : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {isMe && (
              <Link
                to="/profile"
                className="px-4 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors"
              >
                Edit My Profile
              </Link>
            )}
          </div>

          {student.bio && (
            <p className="text-xs sm:text-sm text-brand-dark/90 leading-relaxed pt-3 border-t border-brand-border">
              {student.bio}
            </p>
          )}

          {/* Chosen Career Path */}
          <div className="p-4 rounded-brand-sm bg-brand-elevated border border-brand-border flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Active Career Track</span>
              <div className="text-sm font-bold text-brand-dark mt-0.5 flex items-center gap-2">
                <span>{careerObj.emoji}</span>
                <span>{careerObj.name}</span>
              </div>
            </div>
            <Link
              to={`/careers/${careerObj.id}`}
              className="text-xs text-brand-primary font-bold hover:underline"
            >
              Explore Track →
            </Link>
          </div>

          {/* Skills */}
          {student.existingSkills && student.existingSkills.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-brand-dark">Skills & Competencies:</div>
              <div className="flex flex-wrap gap-1.5">
                {student.existingSkills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-brand-sm bg-brand-elevated border border-brand-border text-xs font-medium text-brand-dark"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Public Stories */}
          <div className="pt-4 border-t border-brand-border space-y-4">
            <h3 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <Video className="w-4 h-4 text-brand-primary" />
              <span>Published Video Stories ({stories.length})</span>
            </h3>

            {stories.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No public video stories published yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stories.map(s => (
                  <div key={s.id} className="p-3 rounded-brand-sm bg-brand-elevated border border-brand-border space-y-2">
                    <div className="aspect-video bg-black/80 rounded-brand-sm overflow-hidden">
                      <video src={s.video_url} controls playsInline className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xs font-bold text-brand-dark line-clamp-1">{s.title}</h4>
                    <p className="text-[11px] text-brand-muted line-clamp-2">{s.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-brand-muted pt-1">
                      <span>❤️ {s.likes_count} likes</span>
                      <Link to={`/community/story/${s.id}`} className="text-brand-primary font-bold hover:underline">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

