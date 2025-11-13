import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';
import { PerformanceAnalysis } from './evaluationService';

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface LearningRecommendation {
  id: string;
  type: 'tutorial' | 'quiz' | 'material';
  title: string;
  description: string;
  level: string;
  language: string;
  priority: number;
  reason: string;
}

/**
 * Generates personalized learning recommendations based on performance analysis and user profile.
 * @param userId - The ID of the user.
 * @param proficiencyLevel - The user's assigned proficiency level.
 * @param performanceAnalysis - Analysis of the user's test performance.
 * @returns Array of learning recommendations prioritized by relevance.
 */
export const generateRecommendations = async (
  userId: string,
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  performanceAnalysis: PerformanceAnalysis
): Promise<LearningRecommendation[]> => {
  // Fetch user profile to get role
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError || !userProfile) {
    console.error('Error fetching user profile:', profileError);
    throw profileError || new Error('User profile not found');
  }

  const userRole = userProfile.role;

  // Fetch all available learning content
  const [tutorials, quizzes, materials] = await Promise.all([
    fetchTutorials(proficiencyLevel),
    fetchQuizzes(proficiencyLevel),
    fetchMaterials(proficiencyLevel),
  ]);

  // Filter content by user role
  const filteredTutorials = filterByRole(tutorials, userRole);
  const filteredQuizzes = filterByRole(quizzes, userRole);
  const filteredMaterials = filterByRole(materials, userRole);

  // Prioritize content based on weaknesses
  const recommendations: LearningRecommendation[] = [];

  // Add tutorials addressing weak areas (highest priority)
  if (performanceAnalysis.weaknesses.length > 0) {
    filteredTutorials.forEach((tutorial) => {
      recommendations.push({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        description: tutorial.description,
        level: tutorial.level,
        language: tutorial.language,
        priority: 1,
        reason: `Recommended to strengthen ${performanceAnalysis.weaknesses[0]}`,
      });
    });
  }

  // Add quizzes for practice (medium priority)
  filteredQuizzes.forEach((quiz) => {
    recommendations.push({
      id: quiz.id,
      type: 'quiz',
      title: quiz.title,
      description: quiz.description,
      level: proficiencyLevel,
      language: quiz.language,
      priority: 2,
      reason: 'Practice to reinforce your learning',
    });
  });

  // Add materials for reference (lower priority)
  filteredMaterials.forEach((material) => {
    recommendations.push({
      id: material.id,
      type: 'material',
      title: material.title,
      description: material.description,
      level: material.level,
      language: material.language,
      priority: 3,
      reason: 'Additional resource for self-study',
    });
  });

  // Sort by priority and limit to top 20
  return prioritizeContent(recommendations).slice(0, 20);
};

/**
 * Fetches tutorials matching the user's proficiency level.
 * @param level - The proficiency level to filter by.
 * @returns Array of tutorials.
 */
const fetchTutorials = async (level: string) => {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('level', level);

  if (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }

  return data || [];
};

/**
 * Fetches quizzes matching the user's proficiency level.
 * @param level - The proficiency level to filter by.
 * @returns Array of quiz sets.
 */
const fetchQuizzes = async (level: string) => {
  const { data, error } = await supabase
    .from('quiz_sets')
    .select('*');

  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }

  // Note: quiz_sets don't have a level field in current schema
  // Return all quizzes for now
  return data || [];
};

/**
 * Fetches learning materials matching the user's proficiency level.
 * @param level - The proficiency level to filter by.
 * @returns Array of materials.
 */
const fetchMaterials = async (level: string) => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('level', level);

  if (error) {
    console.error('Error fetching materials:', error);
    return [];
  }

  return data || [];
};

/**
 * Filters content based on user role (deaf/non-deaf).
 * Prioritizes role-specific content while allowing access to all content.
 * @param content - Array of content items.
 * @param userRole - The user's role (deaf/non-deaf).
 * @returns Filtered content array.
 */
export const filterByRole = <T extends { language?: string }>(
  content: T[],
  userRole: string
): T[] => {
  // For now, we don't have explicit role markers in content
  // Return all content, but in a real implementation, you would:
  // 1. Check for a 'recommended_for_role' field
  // 2. Prioritize content matching the user's role
  // 3. Include universal content for all users

  // Simple implementation: return all content
  // In future, add role-specific filtering logic
  return content;
};

/**
 * Prioritizes content by relevance to user needs.
 * Sorts by priority (lower number = higher priority) and then by title.
 * @param recommendations - Array of learning recommendations.
 * @returns Sorted array of recommendations.
 */
export const prioritizeContent = (
  recommendations: LearningRecommendation[]
): LearningRecommendation[] => {
  return recommendations.sort((a, b) => {
    // First sort by priority
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // Then sort alphabetically by title
    return a.title.localeCompare(b.title);
  });
};
