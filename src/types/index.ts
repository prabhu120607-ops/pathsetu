export type Language = 'en' | 'te';

export type WorkstylePreference =
  | 'Deep Focus (Solo analytical / coding focus)'
  | 'Creative & Visual (Design / media)'
  | 'Field & Practical (Hands-on outdoor)'
  | 'Collaborative & People-Focused'
  | 'Analytical & Structured';

export interface RequiredSkill {
  name: string;
  level: 'Core' | 'Essential' | 'Advanced';
  priority: number; // 1 = highest, 3 = secondary
}

export interface CareerCostINR {
  government_route: string;
  private_route: string;
  self_taught_open_route: string;
  annual_min_govt: number;
  annual_max_govt: number;
  annual_min_pvt: number;
  annual_max_pvt: number;
}

export interface OfficialReferenceLink {
  title: string;
  url: string;
}

export interface Career {
  id: string;
  name: string;
  name_te: string;
  category: string;
  emoji: string;
  badge: string;
  desc: string;
  desc_te: string;
  target_interests: string[];
  target_subjects: string[];
  target_education_levels: string[];
  typical_workstyle: string;
  verified_education_pathways: string[];
  eligibility_conditions: string;
  relevant_entrance_exams: string[];
  estimated_education_cost_inr: CareerCostINR;
  free_learning_alternatives: string[];
  scholarship_opportunities: string[];
  entry_salary_range_inr: string;
  study_duration: string;
  required_skills: RequiredSkill[];
  starter_projects: string[];
  roadmap_milestones: {
    id: string;
    title: string;
    title_te?: string;
    time: string;
    desc: string;
    desc_te?: string;
  }[];
  official_reference_links: OfficialReferenceLink[];
  role_summary: string;
  key_responsibilities: string[];
  ideal_dna: {
    mindset: string;
    vibe: string;
    standard: string;
  };
  industry_growth: string;
  open_roles_india: string;
}

export interface StudentProfile {
  name: string;
  educationLevel: string;
  currentClass: string;
  subjects: string[];
  interests: string[];
  existingSkills: string[];
  workstyle: string;
  careerInterests: string[];
  annualBudgetInr: number;
  preferredLanguage: Language;
  locationCity: string;
  locationState: string;
}

export interface RecommendationMatch {
  career: Career;
  compatibilityScore: number; // 0-100
  breakdown: {
    interestScore: number;
    subjectScore: number;
    skillScore: number;
    educationScore: number;
    workstyleScore: number;
  };
  matchedInterests: string[];
  matchedSubjects: string[];
  matchedSkills: string[];
  missingSkills: string[];
  rationale: string;
}

export interface SkillGapAnalysisResult {
  careerId: string;
  careerName: string;
  readinessPercentage: number;
  softSkillsReadiness: number;
  techSkillsReadiness: number;
  readySkills: string[];
  inProgressSkills: string[];
  missingSkills: string[];
  priorityNext: RequiredSkill[];
}

export interface MilestoneProgress {
  careerId: string;
  completedStepIds: string[];
  customMilestones: {
    id: string;
    title: string;
    time: string;
    desc: string;
    completed: boolean;
  }[];
  updatedAt: string;
}

export interface ResourcePortal {
  name: string;
  name_te: string;
  category: 'Government Central' | 'Online Learning' | 'Testing & Admission' | 'Scholarships' | 'Technical Education';
  authority: string;
  url: string;
  verified_date: string;
  features: string[];
  description: string;
  description_te: string;
}

export interface CareerDemo {
  id: string;
  careerId: string;
  title: string;
  title_te: string;
  description: string;
  category: string;
  estimatedMinutes: number;
  type: 'code' | 'data' | 'design_critique' | 'agriculture' | 'solar_calculator';
  initialCode?: string;
  testPrompt?: string;
  expectedOutputHint?: string;
  dataset?: any[];
  questionPrompt?: string;
}

export interface StudentReview {
  id: string;
  career_id: string;
  career_name: string;
  demo_id?: string;
  demo_title?: string;
  student_display_name: string;
  student_state?: string;
  education_stage: string;
  rating: number; // 1 to 5
  what_learned: string;
  what_was_difficult: string;
  beginner_recommendations: string;
  completion_status: 'completed' | 'in_progress' | 'audited';
  is_verified_participation: boolean;
  is_demo_seed?: boolean;
  moderation_status: 'published' | 'pending' | 'rejected';
  helpful_count: number;
  created_at: string;
}

export interface Destination {
  id: string;
  name: string;
  name_te: string;
  category: 'University' | 'Polytechnic / ITI' | 'Skill Development Center' | 'Agricultural Institute' | 'Medical College';
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  contact_phone?: string;
  website?: string;
  affiliations?: string;
  verified_date: string;
  features: string[];
}

export interface RouteGeometry {
  coordinates: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMinutes: number;
  summary: string;
}
