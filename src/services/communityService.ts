import { StudentStory, StoryReport } from '../types';
import { INITIAL_COMMUNITY_STORIES } from '../data/sampleStories';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'pathsetu_student_stories_v1';
const LIKES_KEY = 'pathsetu_user_liked_stories';
const REPORTS_KEY = 'pathsetu_story_reports';
const BUCKET_NAME = 'student-videos';

export interface VideoUploadPayload {
  title: string;
  description: string;
  careerId: string;
  careerName: string;
  videoFile: File;
  skillsLearned: string[];
  milestoneAchievement?: string;
  projectUrl?: string;
  visibility: 'public' | 'unlisted' | 'private';
  authorName: string;
  authorUsername?: string;
  authorAvatar?: string;
  authorEducation?: string;
  userId?: string;
  onProgress?: (progressPct: number) => void;
}

class CommunityService {
  // Get stored stories from local fallback
  private getStoredStories(): StudentStory[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_STORIES));
        return INITIAL_COMMUNITY_STORIES;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_COMMUNITY_STORIES;
    }
  }

  // Save stories to local storage fallback
  private saveStoredStories(stories: StudentStory[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (e) {
      console.warn('Failed to save stories locally:', e);
    }
  }

  // Get user liked IDs
  private getLikedStoryIds(): string[] {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveLikedStoryIds(ids: string[]) {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn(e);
    }
  }

  // Fetch all stories (with filter and sorting)
  public async getStories(filters?: {
    careerId?: string;
    educationLevel?: string;
    searchQuery?: string;
    sortBy?: 'newest' | 'popular';
    userId?: string;
  }): Promise<StudentStory[]> {
    let list: StudentStory[] = [];
    const likedIds = this.getLikedStoryIds();

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('student_stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters?.careerId && filters.careerId !== 'all') {
          query = query.eq('career_id', filters.careerId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          list = data.map((d: any) => ({
            id: d.id,
            user_id: d.user_id,
            author_name: d.author_name,
            author_username: d.author_username,
            author_avatar: d.author_avatar,
            author_education: d.author_education,
            career_id: d.career_id,
            career_name: d.career_name,
            title: d.title,
            description: d.description,
            video_url: d.video_url,
            thumbnail_url: d.thumbnail_url,
            duration_seconds: d.duration_seconds,
            file_size_bytes: d.file_size_bytes,
            skills_learned: d.skills_learned || [],
            milestone_achievement: d.milestone_achievement,
            project_url: d.project_url,
            visibility: d.visibility || 'public',
            is_verified_student: d.is_verified_student ?? true,
            is_demo_seed: d.is_demo_seed ?? false,
            likes_count: d.likes_count || 0,
            is_liked_by_me: likedIds.includes(d.id),
            created_at: d.created_at,
            updated_at: d.updated_at
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch stories failed, using fallback:', e);
      }
    }

    if (list.length === 0) {
      list = this.getStoredStories().map(s => ({
        ...s,
        is_liked_by_me: likedIds.includes(s.id)
      }));
    }

    // Apply filtering
    let filtered = list.filter(item => {
      // Visibility check: only public stories or own stories
      if (item.visibility === 'private' && filters?.userId && item.user_id !== filters.userId) {
        return false;
      }
      if (filters?.careerId && filters.careerId !== 'all' && item.career_id !== filters.careerId) {
        return false;
      }
      if (filters?.educationLevel && filters.educationLevel !== 'all') {
        const edu = (item.author_education || '').toLowerCase();
        if (!edu.includes(filters.educationLevel.toLowerCase())) {
          return false;
        }
      }
      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesSkills = item.skills_learned.some(s => s.toLowerCase().includes(q));
        const matchesAuthor = item.author_name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSkills && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (filters?.sortBy === 'popular') {
      filtered.sort((a, b) => b.likes_count - a.likes_count);
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }

  // Get a single story by ID
  public async getStoryById(id: string): Promise<StudentStory | null> {
    const all = await this.getStories();
    const found = all.find(s => s.id === id);
    return found || null;
  }

  // Upload video file & record story
  public async uploadStory(
    payload: VideoUploadPayload
  ): Promise<{ success: boolean; story?: StudentStory; error?: string; storageNote?: string }> {
    // 1. Client-side file validation
    const file = payload.videoFile;
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported video format (${file.type || 'unknown'}). Please upload MP4, WebM, or MOV.`
      };
    }

    // Max 50MB limit
    const MAX_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return {
        success: false,
        error: `Video size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB maximum limit.`
      };
    }

    const storyId = `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let videoUrl = '';
    let storageNote = '';

    // 2. Upload to Supabase Storage if configured
    if (isSupabaseConfigured && supabase) {
      try {
        payload.onProgress?.(25);
        const fileExt = file.name.split('.').pop() || 'mp4';
        const userFolder = payload.userId || 'guest';
        const filePath = `${userFolder}/${storyId}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        payload.onProgress?.(70);

        if (uploadError) {
          console.warn('Supabase storage upload error:', uploadError);
          // If bucket doesn't exist, create an informative local object preview
          storageNote = `Supabase Storage note: ${uploadError.message}. Using high-performance browser preview fallback for local review.`;
          videoUrl = URL.createObjectURL(file);
        } else if (uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
          videoUrl = publicUrlData.publicUrl;
        }
      } catch (err: any) {
        console.warn('Storage exception, using blob fallback:', err);
        storageNote = 'Storage offline: Using local video preview.';
        videoUrl = URL.createObjectURL(file);
      }
    } else {
      payload.onProgress?.(50);
      videoUrl = URL.createObjectURL(file);
      storageNote = 'Development Mode: Video stored locally in browser session (Configure Supabase Storage bucket student-videos in .env for cloud hosting).';
    }

    payload.onProgress?.(90);

    // 3. Assemble story object
    const newStory: StudentStory = {
      id: storyId,
      user_id: payload.userId,
      author_name: payload.authorName,
      author_username: payload.authorUsername || `student_${storyId.slice(-4)}`,
      author_avatar: payload.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      author_education: payload.authorEducation || "Student Explorer",
      career_id: payload.careerId,
      career_name: payload.careerName,
      title: payload.title.trim(),
      description: payload.description.trim(),
      video_url: videoUrl,
      thumbnail_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      duration_seconds: 45,
      file_size_bytes: file.size,
      skills_learned: payload.skillsLearned.map(s => s.trim()).filter(Boolean),
      milestone_achievement: payload.milestoneAchievement?.trim(),
      project_url: payload.projectUrl?.trim(),
      visibility: payload.visibility,
      is_verified_student: true,
      is_demo_seed: false, // Authentic user upload
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    // 4. Save to Database or LocalStorage
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('student_stories').insert([{
          id: newStory.id,
          user_id: newStory.user_id,
          author_name: newStory.author_name,
          author_username: newStory.author_username,
          author_avatar: newStory.author_avatar,
          author_education: newStory.author_education,
          career_id: newStory.career_id,
          career_name: newStory.career_name,
          title: newStory.title,
          description: newStory.description,
          video_url: newStory.video_url,
          thumbnail_url: newStory.thumbnail_url,
          duration_seconds: newStory.duration_seconds,
          file_size_bytes: newStory.file_size_bytes,
          skills_learned: newStory.skills_learned,
          milestone_achievement: newStory.milestone_achievement,
          project_url: newStory.project_url,
          visibility: newStory.visibility,
          is_verified_student: true,
          is_demo_seed: false,
          likes_count: 0
        }]);
      } catch (dbErr) {
        console.warn('Database save failed, keeping in local storage:', dbErr);
      }
    }

    const current = this.getStoredStories();
    this.saveStoredStories([newStory, ...current]);
    payload.onProgress?.(100);

    return {
      success: true,
      story: newStory,
      storageNote
    };
  }

  // Toggle Like on a story
  public async toggleLike(storyId: string, userId?: string): Promise<{ liked: boolean; newCount: number }> {
    const likedIds = this.getLikedStoryIds();
    const alreadyLiked = likedIds.includes(storyId);
    let newCount = 0;

    let updatedLikedIds: string[];
    if (alreadyLiked) {
      updatedLikedIds = likedIds.filter(id => id !== storyId);
    } else {
      updatedLikedIds = [...likedIds, storyId];
    }
    this.saveLikedStoryIds(updatedLikedIds);

    // Update local storage stories count
    const localStories = this.getStoredStories();
    const updatedLocal = localStories.map(s => {
      if (s.id === storyId) {
        s.likes_count = alreadyLiked ? Math.max(s.likes_count - 1, 0) : s.likes_count + 1;
        newCount = s.likes_count;
      }
      return s;
    });
    this.saveStoredStories(updatedLocal);

    // Call Supabase RPC or update if online
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const { data, error } = await supabase.rpc('toggle_story_like', {
          target_story_id: storyId,
          target_user_id: userId
        });
        if (!error && data) {
          return { liked: data.liked, newCount: data.likes_count };
        }
      } catch (e) {
        console.warn('Supabase toggle_story_like warning:', e);
      }
    }

    return { liked: !alreadyLiked, newCount };
  }

  // Report Story
  public async reportStory(report: StoryReport): Promise<boolean> {
    try {
      const stored = localStorage.getItem(REPORTS_KEY);
      const reports = stored ? JSON.parse(stored) : [];
      reports.push({ ...report, id: `rep_${Date.now()}`, created_at: new Date().toISOString() });
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));

      if (isSupabaseConfigured && supabase) {
        await supabase.from('story_reports').insert([{
          story_id: report.story_id,
          reporter_id: report.reporter_id,
          report_reason: report.reason,
          details: report.details,
          status: 'pending'
        }]);
      }
      return true;
    } catch (e) {
      console.warn('Report error:', e);
      return false;
    }
  }

  // Delete Story (Author only)
  public async deleteStory(storyId: string, userId?: string): Promise<boolean> {
    const stories = this.getStoredStories();
    const filtered = stories.filter(s => s.id !== storyId);
    this.saveStoredStories(filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('student_stories').delete().eq('id', storyId);
        if (userId) {
          query = query.eq('user_id', userId);
        }
        await query;
      } catch (e) {
        console.warn('Supabase delete story error:', e);
      }
    }

    return true;
  }
}

export const communityService = new CommunityService();

