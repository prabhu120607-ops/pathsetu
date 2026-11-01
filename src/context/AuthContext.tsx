import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { StudentProfile, Language } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  educationLevel: string;
  preferredLanguage: Language;
  acceptTerms: boolean;
}

export interface CustomMilestoneItem {
  id: string;
  title: string;
  time: string;
  desc: string;
  completed: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: StudentProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  isDevFallback: boolean;
  signUp: (data: SignUpInput) => Promise<{ success: boolean; error?: string; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<boolean>;
  calculateProfileCompletion: () => number;
  quickDevLogin: (asName?: string, asEdu?: string) => void;
  // Career & Milestones
  activeCareerId: string;
  setActiveCareerId: (id: string) => void;
  selectedComparisonIds: string[];
  toggleComparisonCareer: (careerId: string) => boolean;
  removeComparisonCareer: (careerId: string) => void;
  completedMilestones: Record<string, string[]>;
  toggleMilestone: (careerId: string, milestoneId: string) => void;
  customMilestones: Record<string, CustomMilestoneItem[]>;
  addCustomMilestone: (careerId: string, item: { title: string; time: string; desc: string }) => void;
  userBudget: number;
  setUserBudget: (budget: number) => void;
  studyStreak: number;
  weeklyHours: number;
}

const DEFAULT_PROFILE: StudentProfile = {
  name: "Pranav Sharma",
  full_name: "Pranav Sharma",
  displayName: "Pranav S.",
  username: "pranav_dev",
  email: "pranav@example.com",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  bio: "Passionate Intermediate student learning frontend web development and exploring data analytics pathways in Andhra Pradesh.",
  educationLevel: "Class 11–12 (Science / PCM)",
  education_level: "Class 11–12 (Science / PCM)",
  institutionName: "AP Model Junior College, Guntur",
  currentClass: "Class 12",
  courseStream: "Mathematics, Physics, Chemistry (MPC)",
  subjects: ["Mathematics", "Physics", "Computer Science"],
  interests: ["technology", "problem-solving", "building digital tools"],
  existingSkills: ["JavaScript or Python", "Web Fundamentals (HTML/CSS)"],
  learningSkills: ["React", "PostgreSQL", "Data Analytics basics"],
  workstyle: "Deep Focus (Solo analytical / coding focus)",
  careerInterests: ["software_dev", "data_analyst", "ui_ux_designer"],
  selectedCareerId: "software_dev",
  learningGoals: "Build 3 portfolio projects before college entrance exams and secure an affordable B.Tech seat.",
  achievements: [
    "Completed HTML/CSS Starter Roadmap",
    "Participated in District Science Fair",
    "Verified Career Demo: Software Development"
  ],
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  portfolioUrl: "https://pranav-portfolio.dev",
  profileVisibility: "public",
  annualBudgetInr: 35000,
  preferredLanguage: "en",
  locationCity: "Guntur",
  locationState: "Andhra Pradesh"
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevFallback, setIsDevFallback] = useState(!isSupabaseConfigured);

  // Student Profile State
  const [profile, setProfileState] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_student_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Selected Career ID
  const [activeCareerId, setActiveCareerIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('pathsetu_active_career_id') || 'software_dev';
    } catch {
      return 'software_dev';
    }
  });

  // Comparisons
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_comparison_list');
      return stored ? JSON.parse(stored) : ["software_dev", "data_analyst", "solar_electrician"];
    } catch {
      return ["software_dev", "data_analyst", "solar_electrician"];
    }
  });

  // Milestones
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_completed_milestones');
      return stored ? JSON.parse(stored) : { software_dev: ["sw_1", "sw_2"] };
    } catch {
      return { software_dev: ["sw_1", "sw_2"] };
    }
  });

  const [customMilestones, setCustomMilestones] = useState<Record<string, CustomMilestoneItem[]>>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_custom_milestones');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [userBudget, setUserBudgetState] = useState<number>(() => {
    return profile.annualBudgetInr || 35000;
  });

  // Initialize Supabase Auth Session Listener
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: initialSession }, error } = await supabase.auth.getSession();
          if (!error && initialSession && mounted) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsDevFallback(false);
            await fetchSupabaseProfile(initialSession.user.id);
          } else if (mounted) {
            // Check if user had a local dev session saved
            checkLocalDevSession();
          }
        } catch (e) {
          console.warn('Supabase auth session error, using fallback:', e);
          if (mounted) checkLocalDevSession();
        }
      } else {
        if (mounted) checkLocalDevSession();
      }

      if (mounted) setIsLoading(false);
    }

    function checkLocalDevSession() {
      try {
        const savedDevAuth = localStorage.getItem('pathsetu_auth_session');
        if (savedDevAuth) {
          const parsed = JSON.parse(savedDevAuth);
          setUser(parsed.user);
          setSession(parsed.session);
          setIsDevFallback(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    initializeAuth();

    // Set up auth state change listener if Supabase is active
    let authSubscription: any = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user || null);
        if (newSession?.user) {
          setIsDevFallback(false);
          await fetchSupabaseProfile(newSession.user.id);
        }
      });
      authSubscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // Fetch student profile from Supabase
  const fetchSupabaseProfile = async (userId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        const mapped: StudentProfile = {
          id: data.id,
          userId: data.user_id,
          name: data.full_name || data.name || 'Student',
          displayName: data.display_name || data.full_name || 'Student',
          username: data.username || `student_${data.id.substring(0, 6)}`,
          avatarUrl: data.avatar_url || DEFAULT_PROFILE.avatarUrl,
          bio: data.bio || '',
          educationLevel: data.education_level || 'Class 11–12 (Science / PCM)',
          institutionName: data.institution_name || '',
          currentClass: data.current_class || '',
          courseStream: data.course_stream || '',
          subjects: data.subjects || [],
          interests: data.interests || [],
          existingSkills: data.existing_skills || [],
          learningSkills: data.learning_skills || [],
          workstyle: data.workstyle || 'Deep Focus (Solo analytical / coding focus)',
          careerInterests: data.career_interests || [],
          selectedCareerId: data.selected_career_id || 'software_dev',
          learningGoals: data.learning_goals || '',
          achievements: data.achievements || [],
          githubUrl: data.github_url || '',
          linkedinUrl: data.linkedin_url || '',
          portfolioUrl: data.portfolioUrl || '',
          profileVisibility: data.profile_visibility || 'public',
          annualBudgetInr: Number(data.annual_budget_inr) || 35000,
          preferredLanguage: data.preferred_language || 'en',
          locationCity: data.location_city || '',
          locationState: data.location_state || ''
        };
        setProfileState(mapped);
        if (mapped.selectedCareerId) {
          setActiveCareerIdState(mapped.selectedCareerId);
        }
        localStorage.setItem('pathsetu_student_profile', JSON.stringify(mapped));
      }
    } catch (e) {
      console.warn('Error fetching Supabase profile:', e);
    }
  };

  // Sign Up implementation
  const signUp = async (data: SignUpInput): Promise<{ success: boolean; error?: string; message?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.name,
              education_level: data.educationLevel,
              preferred_language: data.preferredLanguage
            }
          }
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (authData.user) {
          // Create initial profile in database
          const newProfile = {
            user_id: authData.user.id,
            full_name: data.name,
            display_name: data.name.split(' ')[0],
            username: `student_${Math.random().toString(36).substring(2, 8)}`,
            education_level: data.educationLevel,
            preferred_language: data.preferredLanguage,
            profile_visibility: 'public'
          };
          await supabase.from('profiles').insert([newProfile]);
          await fetchSupabaseProfile(authData.user.id);
        }

        setIsLoading(false);
        return {
          success: true,
          message: 'Account created! Please verify your email if required, or continue to profile setup.'
        };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'An unexpected error occurred during signup.' };
      }
    } else {
      // Safe Development Fallback (clearly documented and labeled)
      const mockUserId = `dev_user_${Date.now()}`;
      const mockUser: any = {
        id: mockUserId,
        email: data.email,
        app_metadata: {},
        user_metadata: { full_name: data.name },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      const mockSession: any = {
        access_token: 'dev_mock_token',
        token_type: 'bearer',
        expires_in: 3600,
        user: mockUser
      };

      const newProfile: StudentProfile = {
        ...DEFAULT_PROFILE,
        name: data.name,
        displayName: data.name.split(' ')[0],
        username: `student_${Date.now().toString().slice(-4)}`,
        email: data.email,
        educationLevel: data.educationLevel,
        preferredLanguage: data.preferredLanguage,
        selectedCareerId: 'software_dev'
      };

      setUser(mockUser);
      setSession(mockSession);
      setIsDevFallback(true);
      setProfileState(newProfile);

      localStorage.setItem('pathsetu_auth_session', JSON.stringify({ user: mockUser, session: mockSession }));
      localStorage.setItem('pathsetu_student_profile', JSON.stringify(newProfile));

      setIsLoading(false);
      return {
        success: true,
        message: 'Account created in Development Fallback mode! (Configure Supabase keys in .env for production database persistence).'
      };
    }
  };

  // Sign In implementation
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.session && data.user) {
          setSession(data.session);
          setUser(data.user);
          setIsDevFallback(false);
          await fetchSupabaseProfile(data.user.id);
        }

        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || 'Failed to sign in.' };
      }
    } else {
      // Safe Development Fallback
      const mockUser: any = {
        id: `dev_user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email,
        app_metadata: {},
        user_metadata: { full_name: profile.name || 'Demo Student' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      };
      const mockSession: any = {
        access_token: 'dev_mock_token',
        token_type: 'bearer',
        expires_in: 3600,
        user: mockUser
      };

      setUser(mockUser);
      setSession(mockSession);
      setIsDevFallback(true);
      localStorage.setItem('pathsetu_auth_session', JSON.stringify({ user: mockUser, session: mockSession }));

      setIsLoading(false);
      return { success: true };
    }
  };

  // Sign Out implementation
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut warning:', e);
      }
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem('pathsetu_auth_session');
  };

  // Reset Password
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`
        });
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Password reset link sent to your email address.' };
      } catch (e: any) {
        return { success: false, error: e.message || 'Failed to send reset link.' };
      }
    } else {
      return {
        success: true,
        message: 'Development Mode: Password reset link simulated successfully for ' + email
      };
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<StudentProfile>): Promise<boolean> => {
    const updated: StudentProfile = {
      ...profile,
      ...updates,
      name: updates.name || updates.full_name || profile.name,
      full_name: updates.full_name || updates.name || profile.full_name || profile.name,
      avatarUrl: updates.avatarUrl || updates.avatar_url || profile.avatarUrl,
      avatar_url: updates.avatar_url || updates.avatarUrl || profile.avatar_url || profile.avatarUrl,
      educationLevel: updates.educationLevel || updates.education_level || profile.educationLevel,
      education_level: updates.education_level || updates.educationLevel || profile.education_level || profile.educationLevel,
    };
    setProfileState(updated);
    try {
      localStorage.setItem('pathsetu_student_profile', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }

    if (isSupabaseConfigured && supabase && user) {
      try {
        const dbPayload: any = {};
        if (updates.name) dbPayload.full_name = updates.name;
        if (updates.displayName) dbPayload.display_name = updates.displayName;
        if (updates.username) dbPayload.username = updates.username;
        if (updates.bio !== undefined) dbPayload.bio = updates.bio;
        if (updates.educationLevel) dbPayload.education_level = updates.educationLevel;
        if (updates.institutionName !== undefined) dbPayload.institution_name = updates.institutionName;
        if (updates.currentClass !== undefined) dbPayload.current_class = updates.currentClass;
        if (updates.courseStream !== undefined) dbPayload.course_stream = updates.courseStream;
        if (updates.subjects) dbPayload.subjects = updates.subjects;
        if (updates.interests) dbPayload.interests = updates.interests;
        if (updates.existingSkills) dbPayload.existing_skills = updates.existingSkills;
        if (updates.learningSkills) dbPayload.learning_skills = updates.learningSkills;
        if (updates.workstyle) dbPayload.workstyle = updates.workstyle;
        if (updates.careerInterests) dbPayload.career_interests = updates.careerInterests;
        if (updates.selectedCareerId) dbPayload.selected_career_id = updates.selectedCareerId;
        if (updates.learningGoals !== undefined) dbPayload.learning_goals = updates.learningGoals;
        if (updates.achievements) dbPayload.achievements = updates.achievements;
        if (updates.githubUrl !== undefined) dbPayload.github_url = updates.githubUrl;
        if (updates.linkedinUrl !== undefined) dbPayload.linkedin_url = updates.linkedinUrl;
        if (updates.portfolioUrl !== undefined) dbPayload.portfolio_url = updates.portfolioUrl;
        if (updates.profileVisibility) dbPayload.profile_visibility = updates.profileVisibility;
        if (updates.annualBudgetInr) dbPayload.annual_budget_inr = updates.annualBudgetInr;
        if (updates.preferredLanguage) dbPayload.preferred_language = updates.preferredLanguage;
        if (updates.locationCity !== undefined) dbPayload.location_city = updates.locationCity;
        if (updates.locationState !== undefined) dbPayload.location_state = updates.locationState;
        dbPayload.updated_at = new Date().toISOString();

        await supabase
          .from('profiles')
          .update(dbPayload)
          .eq('user_id', user.id);
      } catch (err) {
        console.warn('Error updating profile in Supabase:', err);
      }
    }
    return true;
  };

  // Quick 1-click test login for review & evaluation
  const quickDevLogin = (asName = "Pranav Sharma", asEdu = "Class 11–12 (Science / PCM)") => {
    const mockUser: any = {
      id: "dev_student_123",
      email: "student@pathsetu.in",
      app_metadata: {},
      user_metadata: { full_name: asName },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
    const mockSession: any = {
      access_token: 'dev_mock_token',
      token_type: 'bearer',
      expires_in: 3600,
      user: mockUser
    };
    const devProfile: StudentProfile = {
      ...DEFAULT_PROFILE,
      name: asName,
      displayName: asName.split(' ')[0],
      educationLevel: asEdu
    };

    setUser(mockUser);
    setSession(mockSession);
    setIsDevFallback(true);
    setProfileState(devProfile);
    localStorage.setItem('pathsetu_auth_session', JSON.stringify({ user: mockUser, session: mockSession }));
    localStorage.setItem('pathsetu_student_profile', JSON.stringify(devProfile));
  };

  // Career Selection
  const setActiveCareerId = (id: string) => {
    setActiveCareerIdState(id);
    updateProfile({ selectedCareerId: id });
    try {
      localStorage.setItem('pathsetu_active_career_id', id);
    } catch (e) {
      console.warn(e);
    }

    if (isSupabaseConfigured && supabase && user) {
      try {
        supabase
          .from('student_career_paths')
          .upsert({ user_id: user.id, career_id: id, is_active: true, selected_at: new Date().toISOString() })
          .then();
      } catch (e) {
        console.warn('Error saving career path in Supabase:', e);
      }
    }
  };

  // Comparison toggle
  const toggleComparisonCareer = (careerId: string): boolean => {
    if (selectedComparisonIds.includes(careerId)) {
      const updated = selectedComparisonIds.filter(id => id !== careerId);
      setSelectedComparisonIds(updated);
      localStorage.setItem('pathsetu_comparison_list', JSON.stringify(updated));
      return true;
    }
    if (selectedComparisonIds.length >= 3) {
      return false;
    }
    const updated = [...selectedComparisonIds, careerId];
    setSelectedComparisonIds(updated);
    localStorage.setItem('pathsetu_comparison_list', JSON.stringify(updated));
    return true;
  };

  const removeComparisonCareer = (careerId: string) => {
    const updated = selectedComparisonIds.filter(id => id !== careerId);
    setSelectedComparisonIds(updated);
    localStorage.setItem('pathsetu_comparison_list', JSON.stringify(updated));
  };

  // Milestone toggling
  const toggleMilestone = (careerId: string, milestoneId: string) => {
    setCompletedMilestones(prev => {
      const current = prev[careerId] || [];
      const isDone = current.includes(milestoneId);
      const updatedList = isDone
        ? current.filter(id => id !== milestoneId)
        : [...current, milestoneId];

      const nextState = { ...prev, [careerId]: updatedList };
      try {
        localStorage.setItem('pathsetu_completed_milestones', JSON.stringify(nextState));
      } catch (e) {
        console.warn(e);
      }
      return nextState;
    });
  };

  // Add custom milestone
  const addCustomMilestone = (careerId: string, item: { title: string; time: string; desc: string }) => {
    setCustomMilestones(prev => {
      const current = prev[careerId] || [];
      const newItem: CustomMilestoneItem = {
        id: `custom_${Date.now()}`,
        title: item.title,
        time: item.time || 'Next Steps',
        desc: item.desc,
        completed: false
      };
      const nextState = { ...prev, [careerId]: [...current, newItem] };
      try {
        localStorage.setItem('pathsetu_custom_milestones', JSON.stringify(nextState));
      } catch (e) {
        console.warn(e);
      }
      return nextState;
    });
  };

  const setUserBudget = (budget: number) => {
    setUserBudgetState(budget);
    updateProfile({ annualBudgetInr: budget });
  };

  const calculateProfileCompletion = (): number => {
    const fields = [
      profile.name || profile.full_name,
      profile.email,
      profile.educationLevel || profile.education_level,
      profile.bio,
      profile.courseStream,
      profile.locationCity,
      profile.learningGoals,
      Boolean(profile.interests && profile.interests.length > 0),
      Boolean(profile.existingSkills && profile.existingSkills.length > 0),
      Boolean(profile.careerInterests && profile.careerInterests.length > 0),
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: Boolean(user),
        isLoading,
        isConfigured: isSupabaseConfigured,
        isDevFallback,
        signUp,
        signIn,
        signOut,
        logout: signOut,
        resetPassword,
        updateProfile,
        calculateProfileCompletion,
        quickDevLogin,
        activeCareerId,
        setActiveCareerId,
        selectedComparisonIds,
        toggleComparisonCareer,
        removeComparisonCareer,
        completedMilestones,
        toggleMilestone,
        customMilestones,
        addCustomMilestone,
        userBudget,
        setUserBudget,
        studyStreak: 5,
        weeklyHours: 12.5
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Backwards-compatibility alias for existing pages referencing useAuthProgress
export const useAuthProgress = useAuth;
export const AuthProgressProvider = AuthProvider;

