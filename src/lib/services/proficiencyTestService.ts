import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

// Initialize Supabase client
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type ProficiencyTest = Database['public']['Tables']['proficiency_tests']['Row'] & {
  questions: (Database['public']['Tables']['proficiency_test_questions']['Row'] & {
    choices: Database['public']['Tables']['proficiency_test_question_choices']['Row'][];
  })[];
};

/**
 * Fetches a single proficiency test, including all its questions and their respective choices.
 * @param testId - The ID of the proficiency test to fetch.
 * @returns The proficiency test data.
 */
export const getProficiencyTest = async (testId: string): Promise<ProficiencyTest | null> => {
  const { data, error } = await supabase
    .from('proficiency_tests')
    .select(`
      *,
      questions:proficiency_test_questions (
        *,
        choices:proficiency_test_question_choices (*)
      )
    `)
    .eq('id', testId)
    .single();

  if (error) {
    console.error('Error fetching proficiency test:', error);
    throw error;
  }

  return data as ProficiencyTest | null;
};

/**
 * Fetches all proficiency tests.
 * @returns A list of proficiency tests.
 */
export const getAllProficiencyTests = async (): Promise<Database['public']['Tables']['proficiency_tests']['Row'][]> => {
  const { data, error } = await supabase.from('proficiency_tests').select('*');

  if (error) {
    console.error('Error fetching all proficiency tests:', error);
    throw error;
  }

  return data || [];
};

/**
 * Creates a new entry in the proficiency_test_attempts table for a user starting a test.
 * @param userId - The ID of the user attempting the test.
 * @param testId - The ID of the test being attempted.
 * @returns The newly created test attempt.
 */
export const createTestAttempt = async (userId: string, testId: string) => {
  const { data, error } = await supabase
    .from('proficiency_test_attempts')
    .insert({ user_id: userId, test_id: testId })
    .select()
    .single();

  if (error) {
    console.error('Error creating test attempt:', error);
    throw error;
  }

  return data;
};

/**
 * Saves a user's answer to a specific question in the proficiency_test_attempt_answers table.
 * It also determines if the selected answer is correct.
 * @param attemptId - The ID of the current test attempt.
 * @param questionId - The ID of the question being answered.
 * @param choiceId - The ID of the selected choice.
 * @returns The newly created answer record.
 */
export const submitAnswer = async (attemptId: string, questionId: string, choiceId: string) => {
  // First, determine if the choice is correct
  const { data: choice, error: choiceError } = await supabase
    .from('proficiency_test_question_choices')
    .select('is_correct')
    .eq('id', choiceId)
    .single();

  if (choiceError || !choice) {
    console.error('Error fetching choice correctness:', choiceError);
    throw choiceError || new Error('Choice not found');
  }

  // Now, submit the answer with the correctness flag
  const { data, error } = await supabase
    .from('proficiency_test_attempt_answers')
    .insert({
      attempt_id: attemptId,
      question_id: questionId,
      choice_id: choiceId,
      is_correct: choice.is_correct,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }

  return data;
};

/**
 * Calculates the final score, updates the attempt, and assigns a proficiency level to the user.
 * @param attemptId - The ID of the test attempt to finalize.
 * @param userId - The ID of the user to update.
 */
export const calculateResultAndAssignProficiency = async (attemptId: string, userId: string) => {
  // 1. Get the test_id from the attempt
  const { data: attempt, error: attemptError } = await supabase
    .from('proficiency_test_attempts')
    .select('test_id')
    .eq('id', attemptId)
    .single();

  if (attemptError || !attempt) {
    console.error('Error fetching attempt:', attemptError);
    throw attemptError || new Error('Attempt not found');
  }

  // 2. Get total number of questions for the test
  const { count: totalQuestions, error: countError } = await supabase
    .from('proficiency_test_questions')
    .select('*', { count: 'exact', head: true })
    .eq('test_id', attempt.test_id);

  if (countError || totalQuestions === null) {
    console.error('Error fetching total questions count:', countError);
    throw countError || new Error('Could not determine total questions');
  }

  // 3. Get all correct answers for the attempt
  const { count: correctAnswers, error: answersError } = await supabase
    .from('proficiency_test_attempt_answers')
    .select('*', { count: 'exact', head: true })
    .eq('attempt_id', attemptId)
    .eq('is_correct', true);

  if (answersError || correctAnswers === null) {
    console.error('Error fetching correct answers count:', answersError);
    throw answersError || new Error('Could not determine correct answers');
  }

  // 4. Calculate score and determine proficiency level
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  let proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';

  if (score < 50) {
    proficiency_level = 'Beginner';
  } else if (score <= 80) {
    proficiency_level = 'Intermediate';
  } else {
    proficiency_level = 'Advanced';
  }

  // 5. Update the proficiency_test_attempts table
  const { error: updateAttemptError } = await supabase
    .from('proficiency_test_attempts')
    .update({ score, completed_at: new Date().toISOString() })
    .eq('id', attemptId);

  if (updateAttemptError) {
    console.error('Error updating test attempt:', updateAttemptError);
    throw updateAttemptError;
  }

  // 6. Update the user_profiles table
  const { error: updateUserProfileError } = await supabase
    .from('user_profiles')
    .update({ proficiency_level })
    .eq('id', userId);

  if (updateUserProfileError) {
    console.error('Error updating user profile:', updateUserProfileError);
    throw updateUserProfileError;
  }

  return { score, proficiency_level };
};