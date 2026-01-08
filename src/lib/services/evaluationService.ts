import { createClient } from '@/utils/supabase/client';

export interface PerformanceAnalysis {
  strengths: string[];
  weaknesses: string[];
  insights: string[];
  categoryPerformance: {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
}

export interface KnowledgeGap {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
}

/**
 * Analyzes user performance by identifying patterns in correct and incorrect answers.
 * Groups questions by their position ranges to simulate categories.
 * @param attemptId - The ID of the test attempt to analyze.
 * @returns Performance analysis with strengths and weaknesses.
 */
export const analyzeCategoryPerformance = async (
  attemptId: string
): Promise<PerformanceAnalysis> => {
  const supabase = createClient();
  // Fetch all answers for the attempt with question details
  const { data: answers, error } = await supabase
    .from('proficiency_test_attempt_answers')
    .select(`
      *,
      question:proficiency_test_questions (
        id,
        question_text,
        order_index
      )
    `)
    .eq('attempt_id', attemptId);

  if (error || !answers) {
    console.error('Error fetching answers for analysis:', error);
    throw error || new Error('No answers found');
  }

  // Group questions into categories based on order_index ranges
  // This simulates categories: Basic (1-3), Intermediate (4-7), Advanced (8-10)
  const categories = [
    { name: 'Basic Concepts', min: 0, max: 3 },
    { name: 'Intermediate Skills', min: 4, max: 7 },
    { name: 'Advanced Techniques', min: 8, max: 100 },
  ];

  const categoryPerformance = categories.map((category) => {
    const categoryAnswers = answers.filter(
      (answer) =>
        answer.question.order_index >= category.min &&
        answer.question.order_index <= category.max
    );

    const correct = categoryAnswers.filter((a) => a.is_correct).length;
    const total = categoryAnswers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      category: category.name,
      correct,
      total,
      percentage,
    };
  });

  // Identify strengths (categories with >70% correct)
  const strengths = categoryPerformance
    .filter((cat) => cat.percentage >= 70 && cat.total > 0)
    .map((cat) => cat.category);

  // Identify weaknesses (categories with <50% correct)
  const weaknesses = categoryPerformance
    .filter((cat) => cat.percentage < 50 && cat.total > 0)
    .map((cat) => cat.category);

  // Generate insights based on performance
  const insights = generateInsights(categoryPerformance, answers);

  return {
    strengths,
    weaknesses,
    insights,
    categoryPerformance,
  };
};

/**
 * Identifies specific knowledge gaps based on incorrect answers.
 * @param attemptId - The ID of the test attempt.
 * @returns Array of knowledge gaps with question details.
 */
export const identifyKnowledgeGaps = async (
  attemptId: string
): Promise<KnowledgeGap[]> => {
  const supabase = createClient();
  // Fetch incorrect answers with full question and choice details
  const { data: incorrectAnswers, error } = await supabase
    .from('proficiency_test_attempt_answers')
    .select(`
      *,
      question:proficiency_test_questions (
        id,
        question_text
      ),
      selected_choice:proficiency_test_question_choices!choice_id (
        choice_text
      )
    `)
    .eq('attempt_id', attemptId)
    .eq('is_correct', false);

  if (error) {
    console.error('Error fetching incorrect answers:', error);
    throw error;
  }

  if (!incorrectAnswers || incorrectAnswers.length === 0) {
    return [];
  }

  // For each incorrect answer, find the correct choice
  const knowledgeGaps: KnowledgeGap[] = await Promise.all(
    incorrectAnswers.map(async (answer: Record<string, unknown>) => {
      const question = answer.question as { id: string; question_text: string };
      const selectedChoice = answer.selected_choice as { choice_text: string };
      
      const { data: correctChoice } = await supabase
        .from('proficiency_test_question_choices')
        .select('choice_text')
        .eq('question_id', answer.question_id)
        .eq('is_correct', true)
        .single();

      return {
        questionId: question.id,
        questionText: question.question_text,
        userAnswer: selectedChoice.choice_text,
        correctAnswer: correctChoice?.choice_text || 'Unknown',
      };
    })
  );

  return knowledgeGaps;
};

/**
 * Generates personalized insights based on performance patterns.
 * @param categoryPerformance - Performance breakdown by category.
 * @param answers - All answers from the attempt.
 * @returns Array of insight strings.
 */
export const generateInsights = (
  categoryPerformance: {
    category: string;
    correct: number;
    total: number;
    percentage: number;
  }[],
  answers: Array<{ is_correct: boolean }>
): string[] => {
  const insights: string[] = [];
  const totalCorrect = answers.filter((a) => a.is_correct).length;
  const totalQuestions = answers.length;
  const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

  // Overall performance insight
  if (overallPercentage >= 80) {
    insights.push(
      'Excellent performance! You have a strong grasp of sign language concepts.'
    );
  } else if (overallPercentage >= 60) {
    insights.push(
      'Good progress! Focus on strengthening your weaker areas to advance further.'
    );
  } else {
    insights.push(
      'Keep practicing! Building a strong foundation will help you improve quickly.'
    );
  }

  // Category-specific insights
  categoryPerformance.forEach((cat) => {
    if (cat.total === 0) return;

    if (cat.percentage >= 80) {
      insights.push(`You excel at ${cat.category.toLowerCase()}.`);
    } else if (cat.percentage < 50) {
      insights.push(
        `Consider reviewing ${cat.category.toLowerCase()} to strengthen your understanding.`
      );
    }
  });

  // Consistency insight
  const percentages = categoryPerformance
    .filter((cat) => cat.total > 0)
    .map((cat) => cat.percentage);
  const variance =
    percentages.reduce((sum, p) => sum + Math.pow(p - overallPercentage, 2), 0) /
    percentages.length;

  if (variance < 100) {
    insights.push('Your performance is consistent across different skill areas.');
  } else {
    insights.push(
      'Your skills vary across different areas. Focus on your weaker topics for balanced improvement.'
    );
  }

  return insights;
};
