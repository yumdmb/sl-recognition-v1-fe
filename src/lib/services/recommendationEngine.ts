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
  recommended_for_role?: 'deaf' | 'non-deaf' | 'all';
}

/**
 * Generates personalized learning recommendations based on performance analysis and user profile.
 * Uses role-specific path generation for deaf and non-deaf users.
 * @param userId - The ID of the user.
 * @param proficiencyLevel - The user's assigned proficiency level.
 * @param performanceAnalysis - Analysis of the user's test performance.
 * @param recentQuizScore - Optional recent quiz score percentage for adaptive recommendations.
 * @returns Array of learning recommendations prioritized by relevance.
 */
export const generateRecommendations = async (
  userId: string,
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  performanceAnalysis: PerformanceAnalysis,
  recentQuizScore?: number
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

  // Use role-specific path generation with adaptive logic
  if (userRole === 'deaf') {
    return generateDeafUserPath(proficiencyLevel, performanceAnalysis, recentQuizScore);
  } else if (userRole === 'non-deaf') {
    return generateNonDeafUserPath(proficiencyLevel, performanceAnalysis, recentQuizScore);
  }

  // Fallback to generic recommendations for admin or unknown roles
  const [tutorials, quizzes, materials] = await Promise.all([
    fetchTutorials(proficiencyLevel),
    fetchQuizzes(proficiencyLevel),
    fetchMaterials(proficiencyLevel),
  ]);

  const recommendations: LearningRecommendation[] = [];

  // Add tutorials addressing weak areas
  if (performanceAnalysis.weaknesses.length > 0) {
    tutorials.forEach((tutorial) => {
      recommendations.push({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        description: tutorial.description,
        level: tutorial.level,
        language: tutorial.language,
        priority: 1,
        reason: `Recommended to strengthen ${performanceAnalysis.weaknesses[0]}`,
        recommended_for_role: tutorial.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
      });
    });
  }

  // Add quizzes for practice
  quizzes.forEach((quiz) => {
    recommendations.push({
      id: quiz.id,
      type: 'quiz',
      title: quiz.title,
      description: quiz.description,
      level: proficiencyLevel,
      language: quiz.language,
      priority: 2,
      reason: 'Practice to reinforce your learning',
      recommended_for_role: quiz.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
    });
  });

  // Add materials for reference
  materials.forEach((material) => {
    recommendations.push({
      id: material.id,
      type: 'material',
      title: material.title,
      description: material.description,
      level: material.level,
      language: material.language,
      priority: 3,
      reason: 'Additional resource for self-study',
      recommended_for_role: material.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
    });
  });

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
 * @returns Filtered and sorted content array with role-specific content prioritized.
 */
export const filterByRole = <T extends { recommended_for_role?: string }>(
  content: T[],
  userRole: string
): T[] => {
  // Normalize user role to match database values
  const normalizedRole = userRole === 'deaf' ? 'deaf' : 'non-deaf';
  
  // Sort content to prioritize role-specific content
  return content.sort((a, b) => {
    const aRole = a.recommended_for_role || 'all';
    const bRole = b.recommended_for_role || 'all';
    
    // Prioritize content matching user's role
    if (aRole === normalizedRole && bRole !== normalizedRole) return -1;
    if (bRole === normalizedRole && aRole !== normalizedRole) return 1;
    
    // Then prioritize universal content ('all')
    if (aRole === 'all' && bRole !== 'all') return -1;
    if (bRole === 'all' && aRole !== 'all') return 1;
    
    // Keep original order for same priority
    return 0;
  });
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

/**
 * Adjusts proficiency level based on recent quiz performance.
 * @param currentLevel - The user's current proficiency level.
 * @param quizScore - Recent quiz score percentage (0-100).
 * @returns Adjusted proficiency level for content recommendations.
 */
const adjustLevelByPerformance = (
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  quizScore?: number
): 'Beginner' | 'Intermediate' | 'Advanced' => {
  if (!quizScore) return currentLevel;

  // High performance (>80%) - suggest advanced content
  if (quizScore > 80) {
    if (currentLevel === 'Beginner') return 'Intermediate';
    if (currentLevel === 'Intermediate') return 'Advanced';
    return 'Advanced';
  }

  // Low performance (<50%) - suggest foundational content
  if (quizScore < 50) {
    if (currentLevel === 'Advanced') return 'Intermediate';
    if (currentLevel === 'Intermediate') return 'Beginner';
    return 'Beginner';
  }

  // Average performance (50-80%) - keep current level
  return currentLevel;
};

/**
 * Generates learning path specifically for deaf users.
 * Prioritizes visual learning materials and sign language-first content.
 * @param proficiencyLevel - The user's proficiency level.
 * @param performanceAnalysis - Analysis of the user's test performance.
 * @param recentQuizScore - Optional recent quiz score percentage for adaptive recommendations.
 * @returns Array of learning recommendations tailored for deaf users.
 */
export const generateDeafUserPath = async (
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  performanceAnalysis: PerformanceAnalysis,
  recentQuizScore?: number
): Promise<LearningRecommendation[]> => {
  // Adjust level based on recent performance
  const adjustedLevel = adjustLevelByPerformance(proficiencyLevel, recentQuizScore);
  
  // Fetch all available learning content using adjusted level
  const [tutorials, quizzes, materials] = await Promise.all([
    fetchTutorials(adjustedLevel),
    fetchQuizzes(adjustedLevel),
    fetchMaterials(adjustedLevel),
  ]);

  // Filter for deaf-specific and universal content
  const deafTutorials = tutorials.filter(
    t => t.recommended_for_role === 'deaf' || t.recommended_for_role === 'all'
  );
  const deafQuizzes = quizzes.filter(
    q => q.recommended_for_role === 'deaf' || q.recommended_for_role === 'all'
  );
  const deafMaterials = materials.filter(
    m => m.recommended_for_role === 'deaf' || m.recommended_for_role === 'all'
  );

  const recommendations: LearningRecommendation[] = [];

  // Determine reason based on performance
  let recommendationReason = `Visual learning to strengthen ${performanceAnalysis.weaknesses[0]}`;
  if (recentQuizScore !== undefined) {
    if (recentQuizScore > 80) {
      recommendationReason = `Advanced content based on your excellent performance (${Math.round(recentQuizScore)}%)`;
    } else if (recentQuizScore < 50) {
      recommendationReason = `Foundational content to strengthen ${performanceAnalysis.weaknesses[0]}`;
    }
  }

  // Prioritize visual learning tutorials addressing weak areas
  if (performanceAnalysis.weaknesses.length > 0) {
    deafTutorials.forEach((tutorial) => {
      recommendations.push({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        description: tutorial.description,
        level: tutorial.level,
        language: tutorial.language,
        priority: tutorial.recommended_for_role === 'deaf' ? 1 : 2,
        reason: recommendationReason,
        recommended_for_role: tutorial.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
      });
    });
  }

  // Add sign language-first practice quizzes
  deafQuizzes.forEach((quiz) => {
    recommendations.push({
      id: quiz.id,
      type: 'quiz',
      title: quiz.title,
      description: quiz.description,
      level: proficiencyLevel,
      language: quiz.language,
      priority: quiz.recommended_for_role === 'deaf' ? 2 : 3,
      reason: 'Practice with visual sign language content',
      recommended_for_role: quiz.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
    });
  });

  // Add deaf community-specific resources
  deafMaterials.forEach((material) => {
    recommendations.push({
      id: material.id,
      type: 'material',
      title: material.title,
      description: material.description,
      level: material.level,
      language: material.language,
      priority: material.recommended_for_role === 'deaf' ? 3 : 4,
      reason: 'Deaf community resources and visual references',
      recommended_for_role: material.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
    });
  });

  return prioritizeContent(recommendations).slice(0, 20);
};

/**
 * Generates learning path specifically for non-deaf users.
 * Includes comparative content with sign language and spoken language.
 * @param proficiencyLevel - The user's proficiency level.
 * @param performanceAnalysis - Analysis of the user's test performance.
 * @param recentQuizScore - Optional recent quiz score percentage for adaptive recommendations.
 * @returns Array of learning recommendations tailored for non-deaf users.
 */
export const generateNonDeafUserPath = async (
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  performanceAnalysis: PerformanceAnalysis,
  recentQuizScore?: number
): Promise<LearningRecommendation[]> => {
  // Adjust level based on recent performance
  const adjustedLevel = adjustLevelByPerformance(proficiencyLevel, recentQuizScore);
  
  // Fetch all available learning content using adjusted level
  const [tutorials, quizzes, materials] = await Promise.all([
    fetchTutorials(adjustedLevel),
    fetchQuizzes(adjustedLevel),
    fetchMaterials(adjustedLevel),
  ]);

  // Filter for non-deaf-specific and universal content
  const nonDeafTutorials = tutorials.filter(
    t => t.recommended_for_role === 'non-deaf' || t.recommended_for_role === 'all'
  );
  const nonDeafQuizzes = quizzes.filter(
    q => q.recommended_for_role === 'non-deaf' || q.recommended_for_role === 'all'
  );
  const nonDeafMaterials = materials.filter(
    m => m.recommended_for_role === 'non-deaf' || m.recommended_for_role === 'all'
  );

  const recommendations: LearningRecommendation[] = [];

  // Determine reason based on performance
  let recommendationReason = `Comparative learning to strengthen ${performanceAnalysis.weaknesses[0]}`;
  if (recentQuizScore !== undefined) {
    if (recentQuizScore > 80) {
      recommendationReason = `Advanced content based on your excellent performance (${Math.round(recentQuizScore)}%)`;
    } else if (recentQuizScore < 50) {
      recommendationReason = `Foundational content to strengthen ${performanceAnalysis.weaknesses[0]}`;
    }
  }

  // Prioritize comparative content (sign + spoken language)
  if (performanceAnalysis.weaknesses.length > 0) {
    nonDeafTutorials.forEach((tutorial) => {
      recommendations.push({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        description: tutorial.description,
        level: tutorial.level,
        language: tutorial.language,
        priority: tutorial.recommended_for_role === 'non-deaf' ? 1 : 2,
        reason: recommendationReason,
        recommended_for_role: tutorial.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
      });
    });
  }

  // Add pronunciation and context practice
  nonDeafQuizzes.forEach((quiz) => {
    recommendations.push({
      id: quiz.id,
      type: 'quiz',
      title: quiz.title,
      description: quiz.description,
      level: proficiencyLevel,
      language: quiz.language,
      priority: quiz.recommended_for_role === 'non-deaf' ? 2 : 3,
      reason: 'Practice with pronunciation and context explanations',
      recommended_for_role: quiz.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
    });
  });

  // Add hearing perspective resources
  nonDeafMaterials.forEach((material) => {
    recommendations.push({
      id: material.id,
      type: 'material',
      title: material.title,
      description: material.description,
      level: material.level,
      language: material.language,
      priority: material.recommended_for_role === 'non-deaf' ? 3 : 4,
      reason: 'Resources with hearing perspective and context',
      recommended_for_role: material.recommended_for_role as 'deaf' | 'non-deaf' | 'all' || 'all',
    });
  });

  return prioritizeContent(recommendations).slice(0, 20);
};
