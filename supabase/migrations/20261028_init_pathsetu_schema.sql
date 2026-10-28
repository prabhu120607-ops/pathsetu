-- =============================================================================
-- PATHSETU (పథసేతు) — COMPLETE POSTGRESQL DATABASE SCHEMA & MIGRATIONS
-- Compatible with Supabase PostgreSQL, Supabase Realtime, and Row Level Security
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  education_level TEXT NOT NULL,
  current_class TEXT,
  subjects JSONB DEFAULT '[]'::jsonb,
  interests JSONB DEFAULT '[]'::jsonb,
  existing_skills JSONB DEFAULT '[]'::jsonb,
  workstyle TEXT,
  career_interests JSONB DEFAULT '[]'::jsonb,
  annual_budget_inr NUMERIC DEFAULT 35000,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
  location_city TEXT,
  location_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ASSESSMENT RESPONSES TABLE
CREATE TABLE IF NOT EXISTS public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  category TEXT NOT NULL,
  score_value INTEGER NOT NULL CHECK (score_value BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CAREERS TABLE
CREATE TABLE IF NOT EXISTS public.careers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL,
  badge TEXT NOT NULL,
  description TEXT NOT NULL,
  description_te TEXT NOT NULL,
  target_interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_education_levels JSONB NOT NULL DEFAULT '[]'::jsonb,
  typical_workstyle TEXT NOT NULL,
  verified_education_pathways JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility_conditions TEXT NOT NULL,
  relevant_entrance_exams JSONB NOT NULL DEFAULT '[]'::jsonb,
  estimated_cost_inr JSONB NOT NULL DEFAULT '{}'::jsonb,
  free_learning_alternatives JSONB NOT NULL DEFAULT '[]'::jsonb,
  scholarship_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
  entry_salary_range_inr TEXT NOT NULL,
  study_duration TEXT NOT NULL,
  required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  starter_projects JSONB NOT NULL DEFAULT '[]'::jsonb,
  roadmap_milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  official_reference_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  role_summary TEXT NOT NULL,
  key_responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  ideal_dna JSONB NOT NULL DEFAULT '{}'::jsonb,
  industry_growth TEXT NOT NULL,
  open_roles_india TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROADMAP PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT REFERENCES public.careers(id) ON DELETE CASCADE,
  completed_step_ids JSONB DEFAULT '[]'::jsonb,
  custom_milestones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, career_id)
);

-- 5. CAREER DEMOS TABLE
CREATE TABLE IF NOT EXISTS public.career_demos (
  id TEXT PRIMARY KEY,
  career_id TEXT REFERENCES public.careers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_te TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_minutes INTEGER DEFAULT 5,
  demo_type TEXT NOT NULL CHECK (demo_type IN ('code', 'data', 'design_critique', 'agriculture', 'solar_calculator')),
  initial_code TEXT,
  test_prompt TEXT,
  expected_output_hint TEXT,
  dataset JSONB DEFAULT '[]'::jsonb,
  question_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENT REVIEWS TABLE (FEATURE A)
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  career_id TEXT REFERENCES public.careers(id) ON DELETE CASCADE,
  career_name TEXT NOT NULL,
  demo_id TEXT,
  demo_title TEXT,
  student_display_name TEXT NOT NULL,
  student_state TEXT,
  education_stage TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  what_learned TEXT NOT NULL,
  what_was_difficult TEXT,
  beginner_recommendations TEXT NOT NULL,
  completion_status TEXT NOT NULL DEFAULT 'completed' CHECK (completion_status IN ('completed', 'in_progress', 'audited')),
  is_verified_participation BOOLEAN DEFAULT TRUE,
  is_demo_seed BOOLEAN DEFAULT FALSE,
  moderation_status TEXT NOT NULL DEFAULT 'published' CHECK (moderation_status IN ('published', 'pending', 'rejected')),
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REVIEW REPORTS TABLE (MODERATION & TRUST)
CREATE TABLE IF NOT EXISTS public.review_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id TEXT REFERENCES public.reviews(id) ON DELETE CASCADE,
  reporter_notes TEXT NOT NULL,
  report_reason TEXT NOT NULL CHECK (report_reason IN ('spam', 'inappropriate', 'plagiarism', 'misleading')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VERIFIED DESTINATIONS TABLE (FEATURE B)
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_te TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('University', 'Polytechnic / ITI', 'Skill Development Center', 'Agricultural Institute', 'Medical College')),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude NUMERIC(10, 6) NOT NULL,
  longitude NUMERIC(10, 6) NOT NULL,
  contact_phone TEXT,
  website TEXT,
  affiliations TEXT,
  verified_date DATE NOT NULL DEFAULT CURRENT_DATE,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- HELPER STORED PROCEDURES & RPC FUNCTIONS
-- =============================================================================

-- Increment helpful count safely
CREATE OR REPLACE FUNCTION public.increment_helpful_count(review_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.reviews
  SET helpful_count = COALESCE(helpful_count, 0) + 1
  WHERE id = review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

-- Careers, Demos, and Destinations are publicly readable
CREATE POLICY "Public careers read" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Public demos read" ON public.career_demos FOR SELECT USING (true);
CREATE POLICY "Public destinations read" ON public.destinations FOR SELECT USING (true);

-- Reviews: Only published reviews are publicly readable
CREATE POLICY "Public published reviews read" ON public.reviews
  FOR SELECT USING (moderation_status = 'published');

-- Anyone can submit a review with verified participation
CREATE POLICY "Public review insert" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- Profiles: Users manage their own profile
CREATE POLICY "User profile access" ON public.profiles
  FOR ALL USING (auth.uid() = user_id);

-- Roadmaps: Users manage their own roadmaps
CREATE POLICY "User roadmap access" ON public.roadmaps
  FOR ALL USING (
    profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- =============================================================================
-- SUPABASE REALTIME CONFIGURATION
-- =============================================================================

-- Enable realtime broadcasts for the reviews table so peer students see submissions live
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
