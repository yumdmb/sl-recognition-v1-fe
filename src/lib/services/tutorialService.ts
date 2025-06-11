import { createClient } from '@/utils/supabase/client';
import type { 
  Tutorial, 
  TutorialWithProgress, 
  TutorialProgress,
  Database 
} from '@/types/database';

const supabase = createClient();

export class TutorialService {
  // Get all tutorials with optional progress for a user
  static async getTutorials(userId?: string, language?: 'ASL' | 'MSL'): Promise<TutorialWithProgress[]> {
    try {
      let query = supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      const { data: tutorials, error } = await query;

      if (error) throw error;

      if (!tutorials) return [];

      // If userId provided, get progress for each tutorial
      if (userId) {
        const { data: progressData } = await supabase
          .from('tutorial_progress')
          .select('tutorial_id, progress')
          .eq('user_id', userId);

        const progressMap = new Map(
          progressData?.map(p => [p.tutorial_id, p.progress]) || []
        );

        return tutorials.map(tutorial => ({
          ...tutorial,
          progress: progressMap.get(tutorial.id) || 0
        }));
      }

      return tutorials;    } catch (error) {
      console.error('Error fetching tutorials:', error);
      
      // Provide more detailed error information
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: (error as any).message,
          code: (error as any).code,
          hint: (error as any).hint,
          details: (error as any).details
        });
      }
      
      throw error;
    }
  }

  // Get single tutorial by ID
  static async getTutorial(id: string, userId?: string): Promise<TutorialWithProgress | null> {
    try {
      const { data: tutorial, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!tutorial) return null;

      // Get progress if userId provided
      if (userId) {
        const { data: progress } = await supabase
          .from('tutorial_progress')
          .select('progress')
          .eq('user_id', userId)
          .eq('tutorial_id', id)
          .single();

        return {
          ...tutorial,
          progress: progress?.progress || 0
        };
      }

      return tutorial;
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      throw error;
    }
  }

  // Create new tutorial (admin only)
  static async createTutorial(
    tutorial: Database['public']['Tables']['tutorials']['Insert']
  ): Promise<Tutorial> {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .insert([tutorial])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tutorial:', error);
      throw error;
    }
  }

  // Update tutorial (admin only)
  static async updateTutorial(
    id: string, 
    updates: Database['public']['Tables']['tutorials']['Update']
  ): Promise<Tutorial> {
    try {
      const { data, error } = await supabase
        .from('tutorials')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tutorial:', error);
      throw error;
    }
  }

  // Delete tutorial (admin only)
  static async deleteTutorial(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      throw error;
    }
  }

  // Update user's tutorial progress
  static async updateProgress(
    userId: string, 
    tutorialId: string, 
    progress: number
  ): Promise<TutorialProgress> {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .upsert({
          user_id: userId,
          tutorial_id: tutorialId,
          progress: Math.max(0, Math.min(100, progress)),
          last_watched_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
      throw error;
    }
  }

  // Get user's tutorial progress
  static async getUserProgress(userId: string): Promise<TutorialProgress[]> {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_watched_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  }
}
