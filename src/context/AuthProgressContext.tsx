import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface CustomMilestoneItem {
  id: string;
  title: string;
  time: string;
  desc: string;
  completed: boolean;
}

interface AuthProgressContextType {
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  selectedComparisonIds: string[];
  toggleComparisonCareer: (careerId: string) => boolean;
  removeComparisonCareer: (careerId: string) => void;
  activeCareerId: string;
  setActiveCareerId: (id: string) => void;
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
  educationLevel: "Class 11–12 (Science / PCM)",
  currentClass: "Class 12",
  subjects: ["Mathematics", "Physics", "Computer Science"],
  interests: ["technology", "problem-solving", "building"],
  existingSkills: ["JavaScript or Python", "Web Fundamentals (HTML/CSS)"],
  workstyle: "Deep Focus (Solo analytical / coding focus)",
  careerInterests: ["software_dev", "data_analyst", "ui_ux_designer"],
  annualBudgetInr: 35000,
  preferredLanguage: "en",
  locationCity: "Hyderabad",
  locationState: "Telangana"
};

const AuthProgressContext = createContext<AuthProgressContextType | undefined>(undefined);

export const AuthProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_student_profile');
      return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_comparison_list');
      return stored ? JSON.parse(stored) : ["software_dev", "data_analyst", "solar_electrician"];
    } catch {
      return ["software_dev", "data_analyst", "solar_electrician"];
    }
  });

  const [activeCareerId, setActiveCareerIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('pathsetu_active_career_id') || 'software_dev';
    } catch {
      return 'software_dev';
    }
  });

  const [completedMilestones, setCompletedMilestones] = useState<Record<string, string[]>>(() => {
    try {
      const stored = localStorage.getItem('pathsetu_completed_milestones');
      return stored ? JSON.parse(stored) : {
        software_dev: ["sw_1", "sw_2"]
      };
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

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfileState(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('pathsetu_student_profile', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const setUserBudget = (budget: number) => {
    setUserBudgetState(budget);
    updateProfile({ annualBudgetInr: budget });
  };

  const setActiveCareerId = (id: string) => {
    setActiveCareerIdState(id);
    try {
      localStorage.setItem('pathsetu_active_career_id', id);
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleComparisonCareer = (careerId: string): boolean => {
    if (selectedComparisonIds.includes(careerId)) {
      const updated = selectedComparisonIds.filter(id => id !== careerId);
      setSelectedComparisonIds(updated);
      localStorage.setItem('pathsetu_comparison_list', JSON.stringify(updated));
      return true;
    }
    if (selectedComparisonIds.length >= 3) {
      return false; // Limit reached
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

  return (
    <AuthProgressContext.Provider
      value={{
        profile,
        updateProfile,
        selectedComparisonIds,
        toggleComparisonCareer,
        removeComparisonCareer,
        activeCareerId,
        setActiveCareerId,
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
    </AuthProgressContext.Provider>
  );
};

export const useAuthProgress = () => {
  const context = useContext(AuthProgressContext);
  if (!context) {
    throw new Error('useAuthProgress must be used within an AuthProgressProvider');
  }
  return context;
};
