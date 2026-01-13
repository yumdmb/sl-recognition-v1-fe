import { createClient } from '@/utils/supabase/client';

/**
 * Admin service for managing proficiency test questions and choices.
 * All operations require admin role (enforced by RLS policies).
 */
export const ProficiencyTestAdminService = {
  /**
   * Create a new question for a test.
   */
  async createQuestion(
    testId: string,
    questionText: string,
    orderIndex: number,
    imageUrl?: string
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('proficiency_test_questions')
      .insert({
        test_id: testId,
        question_text: questionText,
        order_index: orderIndex,
        image_url: imageUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
      throw error;
    }
    return data;
  },

  /**
   * Update an existing question.
   */
  async updateQuestion(
    questionId: string,
    data: {
      question_text?: string;
      order_index?: number;
      image_url?: string | null;
    }
  ) {
    const supabase = createClient();
    const { data: updated, error } = await supabase
      .from('proficiency_test_questions')
      .update(data)
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating question:', error);
      throw error;
    }
    return updated;
  },

  /**
   * Delete a question (also deletes its choices via cascade).
   */
  async deleteQuestion(questionId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('proficiency_test_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
    return true;
  },

  /**
   * Create a new choice for a question.
   */
  async createChoice(
    questionId: string,
    choiceText: string,
    isCorrect: boolean,
    imageUrl?: string
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('proficiency_test_question_choices')
      .insert({
        question_id: questionId,
        choice_text: choiceText,
        is_correct: isCorrect,
        image_url: imageUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating choice:', error);
      throw error;
    }
    return data;
  },

  /**
   * Update an existing choice.
   */
  async updateChoice(
    choiceId: string,
    data: {
      choice_text?: string;
      is_correct?: boolean;
      image_url?: string | null;
    }
  ) {
    const supabase = createClient();
    const { data: updated, error } = await supabase
      .from('proficiency_test_question_choices')
      .update(data)
      .eq('id', choiceId)
      .select()
      .single();

    if (error) {
      console.error('Error updating choice:', error);
      throw error;
    }
    return updated;
  },

  /**
   * Delete a choice.
   */
  async deleteChoice(choiceId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('proficiency_test_question_choices')
      .delete()
      .eq('id', choiceId);

    if (error) {
      console.error('Error deleting choice:', error);
      throw error;
    }
    return true;
  },

  /**
   * Get all tests with their questions and choices for admin management.
   */
  async getAllTestsWithDetails() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('proficiency_tests')
      .select(`
        *,
        questions:proficiency_test_questions (
          *,
          choices:proficiency_test_question_choices (*)
        )
      `)
      .order('title');

    if (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }

    // Sort questions by order_index
    return data?.map(test => ({
      ...test,
      questions: test.questions?.sort((a: { order_index: number }, b: { order_index: number }) => 
        a.order_index - b.order_index
      ) || []
    })) || [];
  },

  /**
   * Reorder questions within a test.
   */
  async reorderQuestions(questionIds: string[]) {
    const supabase = createClient();
    
    const updates = questionIds.map((id, index) => ({
      id,
      order_index: index + 1,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('proficiency_test_questions')
        .update({ order_index: update.order_index })
        .eq('id', update.id);

      if (error) {
        console.error('Error reordering questions:', error);
        throw error;
      }
    }

    return true;
  },
};
