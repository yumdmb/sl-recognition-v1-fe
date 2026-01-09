import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/database';
import { analyzeCategoryPerformance, identifyKnowledgeGaps } from './evaluationService';
import { generateRecommendations } from './recommendationEngine';

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
  const supabase = createClient();
  const { data, error } = await supabase.from('proficiency_tests').select('*');

  if (error) {
    console.error('Error fetching all proficiency tests:', error);
    throw error;
  }

  return data || [];
};

/**
 * Creates a new entry in the proficiency_test_attempts table for a user starting a test.
 * If an incomplete attempt already exists for this user and test, it will be reused.
 * @param userId - The ID of the user attempting the test.
 * @param testId - The ID of the test being attempted.
 * @returns The test attempt (existing incomplete one or newly created).
 */
export const createTestAttempt = async (userId: string, testId: string) => {
  const supabase = createClient();
  
  // First, check for existing incomplete attempt for this user and test
  const { data: existingAttempt, error: fetchError } = await supabase
    .from('proficiency_test_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('test_id', testId)
    .is('completed_at', null)  // Only get incomplete attempts
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking for existing attempt:', fetchError);
    throw fetchError;
  }

  // If an incomplete attempt exists, reuse it
  if (existingAttempt) {
    console.log('Reusing existing incomplete attempt:', existingAttempt.id);
    return existingAttempt;
  }

  // Otherwise, create a new attempt
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
  const supabase = createClient();
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
  // Using upsert to handle duplicate submissions (network retries, re-clicks)
  // This ensures idempotency - calling multiple times has the same effect as calling once
  const { data, error } = await supabase
    .from('proficiency_test_attempt_answers')
    .upsert({
      attempt_id: attemptId,
      question_id: questionId,
      choice_id: choiceId,
      is_correct: choice.is_correct,
    }, {
      onConflict: 'attempt_id,question_id',  // Update existing answer if already submitted
      ignoreDuplicates: false  // Update the row with new values
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
 * Also saves the test's language as the user's preferred language.
 * @param attemptId - The ID of the test attempt to finalize.
 * @param userId - The ID of the user to update.
 */
export const calculateResultAndAssignProficiency = async (attemptId: string, userId: string) => {
  const supabase = createClient();
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

  // 2. Get the test's language
  const { data: test, error: testError } = await supabase
    .from('proficiency_tests')
    .select('language')
    .eq('id', attempt.test_id)
    .single();

  if (testError || !test) {
    console.error('Error fetching test:', testError);
    throw testError || new Error('Test not found');
  }

  const preferredLanguage = test.language as 'ASL' | 'MSL';

  // 3. Get total number of questions for the test
  const { count: totalQuestions, error: countError } = await supabase
    .from('proficiency_test_questions')
    .select('*', { count: 'exact', head: true })
    .eq('test_id', attempt.test_id);

  if (countError || totalQuestions === null) {
    console.error('Error fetching total questions count:', countError);
    throw countError || new Error('Could not determine total questions');
  }

  // 4. Get all correct answers for the attempt
  const { count: correctAnswers, error: answersError } = await supabase
    .from('proficiency_test_attempt_answers')
    .select('*', { count: 'exact', head: true })
    .eq('attempt_id', attemptId)
    .eq('is_correct', true);

  if (answersError || correctAnswers === null) {
    console.error('Error fetching correct answers count:', answersError);
    throw answersError || new Error('Could not determine correct answers');
  }

  // 5. Calculate score and determine proficiency level
  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  let proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';

  if (score < 50) {
    proficiency_level = 'Beginner';
  } else if (score <= 80) {
    proficiency_level = 'Intermediate';
  } else {
    proficiency_level = 'Advanced';
  }

  // 6. Update the proficiency_test_attempts table
  const { error: updateAttemptError } = await supabase
    .from('proficiency_test_attempts')
    .update({ score, completed_at: new Date().toISOString() })
    .eq('id', attemptId);

  if (updateAttemptError) {
    console.error('Error updating test attempt:', updateAttemptError);
    throw updateAttemptError;
  }

  // 7. Update the user_profiles table with language-specific proficiency level AND preferred language
  // Determine which column to update based on test language
  const updateData: Record<string, string> = {
    preferred_language: preferredLanguage,
    // Also update the legacy proficiency_level for backward compatibility
    proficiency_level: proficiency_level,
  };
  
  // Set the language-specific proficiency column
  if (preferredLanguage === 'ASL') {
    updateData.asl_proficiency_level = proficiency_level;
  } else if (preferredLanguage === 'MSL') {
    updateData.msl_proficiency_level = proficiency_level;
  }

  const { error: updateUserProfileError } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', userId);

  if (updateUserProfileError) {
    console.error('Error updating user profile:', updateUserProfileError);
    throw updateUserProfileError;
  }

  return { score, proficiency_level, preferred_language: preferredLanguage };
};
/**
 * Gets comprehensive test results including performance analysis and recommendations.
 * @param attemptId - The ID of the test attempt.
 * @param userId - The ID of the user.
 * @param recentQuizScore - Optional recent quiz score percentage for adaptive recommendations.
 * @returns Complete test results with analysis and recommendations.
 */
export const getTestResultsWithAnalysis = async (
  attemptId: string, 
  userId: string,
  recentQuizScore?: number
) => {
  const supabase = createClient();
  // Get basic attempt data
  const { data: attempt, error: attemptError } = await supabase
    .from('proficiency_test_attempts')
    .select('*')
    .eq('id', attemptId)
    .single();

  if (attemptError || !attempt) {
    console.error('Error fetching attempt:', attemptError);
    throw attemptError || new Error('Attempt not found');
  }

  // Get user's proficiency level based on their preferred language
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('proficiency_level, preferred_language, asl_proficiency_level, msl_proficiency_level')
    .eq('id', userId)
    .single();

  if (profileError || !userProfile) {
    console.error('Error fetching user profile:', profileError);
    throw profileError || new Error('User profile not found');
  }

  // Determine the correct proficiency level based on preferred language
  let proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  if (userProfile.preferred_language === 'ASL' && userProfile.asl_proficiency_level) {
    proficiencyLevel = userProfile.asl_proficiency_level as 'Beginner' | 'Intermediate' | 'Advanced';
  } else if (userProfile.preferred_language === 'MSL' && userProfile.msl_proficiency_level) {
    proficiencyLevel = userProfile.msl_proficiency_level as 'Beginner' | 'Intermediate' | 'Advanced';
  } else if (userProfile.proficiency_level) {
    // Fallback to legacy proficiency_level
    proficiencyLevel = userProfile.proficiency_level as 'Beginner' | 'Intermediate' | 'Advanced';
  }

  // Perform performance analysis
  const performanceAnalysis = await analyzeCategoryPerformance(attemptId);

  // Identify knowledge gaps
  const knowledgeGaps = await identifyKnowledgeGaps(attemptId);

  // Generate learning recommendations with adaptive logic
  const recommendations = await generateRecommendations(
    userId,
    proficiencyLevel,
    performanceAnalysis,
    recentQuizScore
  );

  return {
    attempt,
    proficiencyLevel,
    performanceAnalysis,
    knowledgeGaps,
    recommendations,
  };
};

/**
 * Fetches all test attempts for a user with test details.
 * @param userId - The ID of the user.
 * @returns A list of test attempts with test information.
 */
export const getUserTestHistory = async (userId: string) => {
  const supabase = createClient();
  // First, get all attempts
  const { data: attempts, error: attemptsError } = await supabase
    .from('proficiency_test_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (attemptsError) {
    console.error('Error fetching test attempts:', attemptsError);
    throw attemptsError;
  }

  if (!attempts || attempts.length === 0) {
    return [];
  }

  // Get unique test IDs
  const testIds = [...new Set(attempts.map(a => a.test_id))];

  // Fetch test details
  const { data: tests, error: testsError } = await supabase
    .from('proficiency_tests')
    .select('id, title, description, language')
    .in('id', testIds);

  if (testsError) {
    console.error('Error fetching test details:', testsError);
    throw testsError;
  }

  // Create a map of test details
  const testMap = new Map(tests?.map(t => [t.id, t]) || []);

  // Combine attempts with test details
  const history = attempts.map(attempt => ({
    ...attempt,
    test: testMap.get(attempt.test_id) || {
      id: attempt.test_id,
      title: 'Unknown Test',
      description: null,
      language: 'MSL'
    }
  }));

  return history;
};
