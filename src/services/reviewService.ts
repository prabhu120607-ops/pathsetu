import { StudentReview } from '../types';
import { INITIAL_SAMPLE_REVIEWS } from '../data/sampleReviews';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'pathsetu_student_reviews_v2';
const BROADCAST_CHANNEL_NAME = 'pathsetu_realtime_reviews';

class ReviewService {
  private broadcastChannel: BroadcastChannel | null = null;
  private listeners: ((reviews: StudentReview[]) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'REVIEWS_UPDATED') {
            const updated = this.getStoredReviews();
            this.notifyListeners(updated);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }
  }

  private getStoredReviews(): StudentReview[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REVIEWS));
        return INITIAL_SAMPLE_REVIEWS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_SAMPLE_REVIEWS;
    }
  }

  private saveStoredReviews(reviews: StudentReview[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'REVIEWS_UPDATED' });
      }
      this.notifyListeners(reviews);
    } catch (e) {
      console.warn('Failed to save reviews locally', e);
    }
  }

  private notifyListeners(reviews: StudentReview[]) {
    this.listeners.forEach(fn => fn(reviews));
  }

  public subscribe(callback: (reviews: StudentReview[]) => void): () => void {
    this.listeners.push(callback);

    // Also connect to Supabase Realtime if configured
    let supabaseChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      supabaseChannel = supabase
        .channel('public:reviews')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'reviews' },
          async () => {
            const fresh = await this.getReviews();
            callback(fresh);
          }
        )
        .subscribe();
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(fn => fn !== callback);
      if (supabaseChannel) {
        supabaseChannel.unsubscribe();
      }
    };
  }

  public async getReviews(filters?: {
    careerId?: string;
    demoId?: string;
    minRating?: number;
    onlyVerified?: boolean;
  }): Promise<StudentReview[]> {
    let list: StudentReview[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('reviews')
          .select('*')
          .eq('moderation_status', 'published')
          .order('created_at', { ascending: false });

        if (filters?.careerId && filters.careerId !== 'all') {
          query = query.eq('career_id', filters.careerId);
        }
        if (filters?.demoId && filters.demoId !== 'all') {
          query = query.eq('demo_id', filters.demoId);
        }

        const { data, error } = await query;
        if (!error && data) {
          list = data as StudentReview[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local reviews', e);
      }
    }

    if (list.length === 0) {
      list = this.getStoredReviews();
    }

    // Apply client filters
    return list.filter(r => {
      if (r.moderation_status !== 'published') return false;
      if (filters?.careerId && filters.careerId !== 'all' && r.career_id !== filters.careerId) {
        return false;
      }
      if (filters?.demoId && filters.demoId !== 'all' && r.demo_id !== filters.demoId) {
        return false;
      }
      if (filters?.minRating && r.rating < filters.minRating) {
        return false;
      }
      if (filters?.onlyVerified && !r.is_verified_participation) {
        return false;
      }
      return true;
    });
  }

  public async submitReview(input: {
    careerId: string;
    careerName: string;
    demoId?: string;
    demoTitle?: string;
    displayName: string;
    educationStage: string;
    state?: string;
    rating: number;
    whatLearned: string;
    whatWasDifficult: string;
    recommendations: string;
    completionStatus: 'completed' | 'in_progress' | 'audited';
    isVerifiedParticipation: boolean;
  }): Promise<{ review: StudentReview; message: string }> {
    const newReview: StudentReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      career_id: input.careerId,
      career_name: input.careerName,
      demo_id: input.demoId,
      demo_title: input.demoTitle,
      student_display_name: input.displayName.trim() || 'Anonymous Student',
      student_state: input.state || 'India',
      education_stage: input.educationStage || 'Student Explorer',
      rating: input.rating,
      what_learned: input.whatLearned.trim(),
      what_was_difficult: input.whatWasDifficult.trim(),
      beginner_recommendations: input.recommendations.trim(),
      completion_status: input.completionStatus,
      is_verified_participation: input.isVerifiedParticipation,
      is_demo_seed: false,
      moderation_status: 'published', // Published directly for verified/demo workflow with reporting available
      helpful_count: 0,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reviews').insert([newReview]);
      } catch (e) {
        console.warn('Failed to insert review into Supabase, saving locally', e);
      }
    }

    const current = this.getStoredReviews();
    const updated = [newReview, ...current];
    this.saveStoredReviews(updated);

    return {
      review: newReview,
      message: 'Your review has been successfully posted!'
    };
  }

  public async toggleHelpful(reviewId: string): Promise<number> {
    const reviews = this.getStoredReviews();
    let newCount = 0;
    const updated = reviews.map(r => {
      if (r.id === reviewId) {
        r.helpful_count = (r.helpful_count || 0) + 1;
        newCount = r.helpful_count;
      }
      return r;
    });
    this.saveStoredReviews(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.rpc('increment_helpful_count', { review_id: reviewId });
      } catch {
        // Fallback already updated in local
      }
    }
    return newCount;
  }
}

export const reviewService = new ReviewService();
