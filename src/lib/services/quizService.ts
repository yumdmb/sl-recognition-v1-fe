import { createClient } from '@/utils/supabase/client';
import type { 
  QuizSet, 
  QuizQuestion, 
  QuizSetWithProgress, 
  QuizSetWithQuestions,
  QuizProgress,
  Database 
} from '@/types/database';

export class QuizService {
  // Get all quiz sets with optional progress for a user
  static async getQuizSets(userId?: string, language?: 'ASL' | 'MSL', level?: 'beginner' | 'intermediate' | 'advanced'): Promise<QuizSetWithProgress[]> {
    const supabase = createClient();
    try {
      let query = supabase
        .from('quiz_sets')
        .select(`
          *,
          quiz_questions(count)
        `)
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      if (level) {
        query = query.eq('level', level);
      }

      const { data: quizSets, error } = await query;

      if (error) throw error;

      if (!quizSets) return [];

      // Get question counts for each quiz set
      const quizSetsWithCounts = await Promise.all(
        quizSets.map(async (quizSet) => {
          const { count } = await supabase
            .from('quiz_questions')
            .select('*', { count: 'exact', head: true })
            .eq('quiz_set_id', quizSet.id);

          return {
            ...quizSet,
            questionCount: count || 0
          };
        })
      );

      // If userId provided, get progress for each quiz set
      if (userId) {
        const { data: progressData } = await supabase
          .from('quiz_progress')
          .select('*')
          .eq('user_id', userId);

        const progressMap = new Map(
          progressData?.map(p => [p.quiz_set_id, p]) || []
        );

        return quizSetsWithCounts.map(quizSet => ({
          ...quizSet,
          progress: progressMap.get(quizSet.id)
        }));
      }

      return quizSetsWithCounts;
    } catch (error) {
      console.error('Error fetching quiz sets:', error);
      throw error;
    }
  }

  // Get single quiz set with questions
  static async getQuizSetWithQuestions(id: string): Promise<QuizSetWithQuestions | null> {
    const supabase = createClient();
    try {
      const { data: quizSet, error: quizError } = await supabase
        .from('quiz_sets')
        .select('*')
        .eq('id', id)
        .single();

      if (quizError) throw quizError;
      if (!quizSet) return null;

      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_set_id', id)
        .order('order_index', { ascending: true });

      if (questionsError) throw questionsError;

      return {
        ...quizSet,
        questions: questions || [],
        questionCount: questions?.length || 0
      };
    } catch (error) {
      console.error('Error fetching quiz set with questions:', error);
      throw error;
    }
  }

  // Create new quiz set (admin only)
  static async createQuizSet(
    quizSet: Database['public']['Tables']['quiz_sets']['Insert']
  ): Promise<QuizSet> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('quiz_sets')
        .insert([quizSet])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quiz set:', error);
      throw error;
    }
  }

  // Update quiz set (admin only)
  static async updateQuizSet(
    id: string, 
    updates: Database['public']['Tables']['quiz_sets']['Update']
  ): Promise<QuizSet> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('quiz_sets')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quiz set:', error);
      throw error;
    }
  }

  // Delete quiz set (admin only)
  static async deleteQuizSet(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('quiz_sets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting quiz set:', error);
      throw error;
    }
  }

  // Create new quiz question (admin only)
  static async createQuizQuestion(
    question: Database['public']['Tables']['quiz_questions']['Insert']
  ): Promise<QuizQuestion> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert([question])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quiz question:', error);
      throw error;
    }
  }

  // Update quiz question (admin only)
  static async updateQuizQuestion(
    id: string, 
    updates: Database['public']['Tables']['quiz_questions']['Update']
  ): Promise<QuizQuestion> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quiz question:', error);
      throw error;
    }
  }

  // Delete quiz question (admin only)
  static async deleteQuizQuestion(id: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      throw error;
    }
  }

  // Submit quiz answers and update progress
  static async submitQuizAnswers(
    userId: string,
    quizSetId: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<{ score: number; totalQuestions: number; passed: boolean }> {
    const supabase = createClient();
    try {
      // Get quiz questions to check answers
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('id, correct_answer')
        .eq('quiz_set_id', quizSetId);

      if (questionsError) throw questionsError;
      if (!questions) throw new Error('No questions found');

      // Calculate score
      const correctAnswers = new Map(
        questions.map(q => [q.id, q.correct_answer])
      );

      let score = 0;
      for (const answer of answers) {
        if (correctAnswers.get(answer.questionId) === answer.answer) {
          score++;
        }
      }

      const totalQuestions = questions.length;
      const passed = score >= Math.ceil(totalQuestions * 0.6); // 60% pass rate

      // Update quiz progress
      const { error: progressError } = await supabase
        .from('quiz_progress')
        .upsert({
          user_id: userId,
          quiz_set_id: quizSetId,
          completed: passed,
          score,
          total_questions: totalQuestions,
          last_attempted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,quiz_set_id'
        });

      if (progressError) throw progressError;

      return { score, totalQuestions, passed };
    } catch (error) {
      console.error('Error submitting quiz answers:', error);
      throw error;
    }
  }

  // Get user's quiz progress
  static async getUserQuizProgress(userId: string): Promise<QuizProgress[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('quiz_progress')
        .select('*')
        .eq('user_id', userId)
        .order('last_attempted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user quiz progress:', error);
      throw error;
    }
  }

  // Get quiz progress for specific quiz set
  static async getQuizProgress(userId: string, quizSetId: string): Promise<QuizProgress | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('quiz_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('quiz_set_id', quizSetId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
      throw error;
    }
  }

  // Reset quiz progress for quizzes matching a specific level and language
  // Called when user retakes proficiency test and gets the same level
  static async resetQuizProgressByLevelAndLanguage(
    userId: string,
    level: string,
    language: 'ASL' | 'MSL'
  ): Promise<void> {
    const supabase = createClient();
    try {
      // 1. Get all quiz set IDs matching the level and language
      const { data: quizSets, error: quizSetsError } = await supabase
        .from('quiz_sets')
        .select('id')
        .eq('level', level.toLowerCase())
        .eq('language', language);

      if (quizSetsError) throw quizSetsError;
      if (!quizSets || quizSets.length === 0) return;

      const quizSetIds = quizSets.map(qs => qs.id);

      // 2. Delete quiz progress for those quiz sets
      const { error: deleteError } = await supabase
        .from('quiz_progress')
        .delete()
        .eq('user_id', userId)
        .in('quiz_set_id', quizSetIds);

      if (deleteError) throw deleteError;
      
      console.log(`Reset quiz progress for ${quizSetIds.length} quizzes at ${level} level for ${language}`);
    } catch (error) {
      console.error('Error resetting quiz progress:', error);
      throw error;
    }
  }
}
