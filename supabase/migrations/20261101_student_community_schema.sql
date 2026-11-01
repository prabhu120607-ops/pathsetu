-- =============================================================================
-- PATHSETU (పథసేతు) — STUDENT COMMUNITY, AUTHENTICATION & VIDEO SHARING SCHEMA
-- Migration: 20261101_student_community_schema.sql
-- Enables Student Profiles, Multi-Step Career Assessments, Video Stories,
-- Story Likes, and Content Moderation Reports with Row Level Security (RLS).
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. EXTEND OR CREATE PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  education_level TEXT NOT NULL DEFAULT 'Class 11–12 (Science / PCM)',
  institution_name TEXT,
  current_class TEXT,
  course_stream TEXT,
  location_city TEXT,
  location_state TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
  interests JSONB DEFAULT '[]'::jsonb,
  subjects JSONB DEFAULT '[]'::jsonb,
  existing_skills JSONB DEFAULT '[]'::jsonb,
  learning_skills JSONB DEFAULT '[]'::jsonb,
  career_interests JSONB DEFAULT '[]'::jsonb,
  selected_career_id TEXT REFERENCES public.careers(id) ON DELETE SET NULL,
  learning_goals TEXT,
  achievements JSONB DEFAULT '[]'::jsonb,
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
  annual_budget_inr NUMERIC DEFAULT 35000,
  workstyle TEXT DEFAULT 'Deep Focus (Solo analytical / coding focus)',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns safely if profiles table already existed from earlier migration
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT DEFAULT 'Student';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
    ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
    ALTER TABLE public.profiles ADD COLUMN bio TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'institution_name') THEN
    ALTER TABLE public.profiles ADD COLUMN institution_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'course_stream') THEN
    ALTER TABLE public.profiles ADD COLUMN course_stream TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'learning_skills') THEN
    ALTER TABLE public.profiles ADD COLUMN learning_skills JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'selected_career_id') THEN
    ALTER TABLE public.profiles ADD COLUMN selected_career_id TEXT REFERENCES public.careers(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'learning_goals') THEN
    ALTER TABLE public.profiles ADD COLUMN learning_goals TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'achievements') THEN
    ALTER TABLE public.profiles ADD COLUMN achievements JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'github_url') THEN
    ALTER TABLE public.profiles ADD COLUMN github_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') THEN
    ALTER TABLE public.profiles ADD COLUMN linkedin_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'portfolio_url') THEN
    ALTER TABLE public.profiles ADD COLUMN portfolio_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_visibility') THEN
    ALTER TABLE public.profiles ADD COLUMN profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private'));
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. CAREER ASSESSMENTS TABLE (5-STEP DISCOVERY HISTORY)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  education_level TEXT NOT NULL,
  current_stream TEXT,
  interest_tags JSONB DEFAULT '[]'::jsonb,
  problem_solving_interests JSONB DEFAULT '[]'::jsonb,
  strength_tags JSONB DEFAULT '[]'::jsonb,
  existing_skills JSONB DEFAULT '[]'::jsonb,
  skills_to_learn JSONB DEFAULT '[]'::jsonb,
  workstyle_preference TEXT,
  environment_preference TEXT,
  annual_budget_inr NUMERIC DEFAULT 35000,
  weekly_hours NUMERIC DEFAULT 10,
  relocation_willingness TEXT,
  preferred_language TEXT DEFAULT 'en',
  step_responses JSONB DEFAULT '{}'::jsonb,
  top_matches JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. STUDENT CAREER PATHS (ACTIVE TRACKING)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_career_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  career_id TEXT REFERENCES public.careers(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, career_id)
);

-- -----------------------------------------------------------------------------
-- 4. STUDENT SUCCESS STORIES (COMMUNITY VIDEO SHARING)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_stories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_username TEXT,
  author_avatar TEXT,
  author_education TEXT,
  career_id TEXT REFERENCES public.careers(id) ON DELETE CASCADE,
  career_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER DEFAULT 0,
  file_size_bytes BIGINT DEFAULT 0,
  skills_learned JSONB DEFAULT '[]'::jsonb,
  milestone_achievement TEXT,
  project_url TEXT,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
  is_verified_student BOOLEAN DEFAULT TRUE,
  is_demo_seed BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. STORY LIKES TABLE (PREVENTS DUPLICATE LIKES)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.story_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id TEXT REFERENCES public.student_stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(story_id, user_id)
);

-- -----------------------------------------------------------------------------
-- 6. STORY REPORTS TABLE (MODERATION & TRUST)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.story_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id TEXT REFERENCES public.student_stories(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  report_reason TEXT NOT NULL CHECK (report_reason IN ('spam', 'inappropriate', 'copyright', 'harassment', 'misleading')),
  details TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. HELPER RPC FUNCTIONS
-- -----------------------------------------------------------------------------

-- Atomically toggle like on a story
CREATE OR REPLACE FUNCTION public.toggle_story_like(target_story_id TEXT, target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  already_liked BOOLEAN;
  new_count INTEGER;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.story_likes
    WHERE story_id = target_story_id AND user_id = target_user_id
  ) INTO already_liked;

  IF already_liked THEN
    DELETE FROM public.story_likes
    WHERE story_id = target_story_id AND user_id = target_user_id;

    UPDATE public.student_stories
    SET likes_count = GREATEST(COALESCE(likes_count, 1) - 1, 0)
    WHERE id = target_story_id
    RETURNING likes_count INTO new_count;

    RETURN jsonb_build_object('liked', false, 'likes_count', new_count);
  ELSE
    INSERT INTO public.story_likes (story_id, user_id)
    VALUES (target_story_id, target_user_id);

    UPDATE public.student_stories
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = target_story_id
    RETURNING likes_count INTO new_count;

    RETURN jsonb_build_object('liked', true, 'likes_count', new_count);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view public profiles; user can manage their own
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
CREATE POLICY "Public profiles read" ON public.profiles
  FOR SELECT USING (profile_visibility = 'public' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "User profile manage" ON public.profiles;
CREATE POLICY "User profile manage" ON public.profiles
  FOR ALL USING (auth.uid() = user_id);

-- Career Assessments: Only the student can view and insert their own assessments
DROP POLICY IF EXISTS "User assessment access" ON public.career_assessments;
CREATE POLICY "User assessment access" ON public.career_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Student Career Paths: User manages their chosen paths
DROP POLICY IF EXISTS "User career path access" ON public.student_career_paths;
CREATE POLICY "User career path access" ON public.student_career_paths
  FOR ALL USING (auth.uid() = user_id);

-- Stories: Anyone can view public stories; authors can view their unlisted/private stories
DROP POLICY IF EXISTS "Public stories read" ON public.student_stories;
CREATE POLICY "Public stories read" ON public.student_stories
  FOR SELECT USING (visibility = 'public' OR auth.uid() = user_id);

-- Authors can insert, update, and delete their own stories
DROP POLICY IF EXISTS "Author story insert" ON public.student_stories;
CREATE POLICY "Author story insert" ON public.student_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Author story update" ON public.student_stories;
CREATE POLICY "Author story update" ON public.student_stories
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Author story delete" ON public.student_stories;
CREATE POLICY "Author story delete" ON public.student_stories
  FOR DELETE USING (auth.uid() = user_id);

-- Story Likes: Authenticated users manage their own likes
DROP POLICY IF EXISTS "User likes select" ON public.story_likes;
CREATE POLICY "User likes select" ON public.story_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "User likes manage" ON public.story_likes;
CREATE POLICY "User likes manage" ON public.story_likes
  FOR ALL USING (auth.uid() = user_id);

-- Story Reports: Authenticated users can insert reports
DROP POLICY IF EXISTS "Authenticated report insert" ON public.story_reports;
CREATE POLICY "Authenticated report insert" ON public.story_reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- -----------------------------------------------------------------------------
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION FOR VIDEO SHARING
-- -----------------------------------------------------------------------------
-- In Supabase Dashboard -> Storage:
-- 1. Create a public or restricted bucket named: 'student-videos'
-- 2. Allow mime types: video/mp4, video/webm, video/quicktime
-- 3. Max file size: 52428800 (50MB)
--
-- Storage SQL Policies (run in Supabase SQL editor):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('student-videos', 'student-videos', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "Public video access" ON storage.objects FOR SELECT USING (bucket_id = 'student-videos');
-- CREATE POLICY "Authenticated video upload" ON storage.objects FOR INSERT WITH CHECK (
--   bucket_id = 'student-videos' AND auth.role() = 'authenticated'
-- );
-- CREATE POLICY "Owner video delete" ON storage.objects FOR DELETE USING (
--   bucket_id = 'student-videos' AND auth.uid()::text = (storage.foldername(name))[1]
-- );

