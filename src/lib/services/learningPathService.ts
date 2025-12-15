import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/database';
import { PerformanceAnalysis } from './evaluationService';
import { LearningRecommendation, generateRecommendations, filterByRole, prioritizeContent } from './recommendationEngine';

export interface LearningPathItem {
  id: string;
  type: 'tutorial' | 'quiz' | 'material';
  title: string;
  description: string;
  level: string;
  language: string;
  priority: number;
  completed: boolean;
  recommended_for_role: 'deaf' | 'non-deaf' | 'all';
  reason?: string;
}

export interface LearningPath {
  userId: string;
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  items: LearningPathItem[];
  generatedAt: string;
  lastUpdated: string;
}

/**
 * Generates a personalized learning path for a user based on their proficiency level and performance.
 * @param userId - The ID of the user.
 * @param proficiencyLevel - The user's assigned proficiency level.
 * @param performanceAnalysis - Optional performance analysis from proficiency test.
 * @returns Complete learning path with prioritized items.
 */
export const generateLearningPath = async (
  userId: string,
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  performanceAnalysis?: PerformanceAnalysis
): Promise<LearningPath> => {
  const supabase = createClient();
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
  // Default to ASL for now - in future, add language preference to user profile
  const preferredLanguage = 'ASL';

  // Fetch content by level
  const contentByLevel = await fetchContentByLevel(proficiencyLevel, preferredLanguage);

  // Filter content by user role
  const roleFilteredContent = filterContentByRole(contentByLevel, userRole);

  // Sort by priority based on performance analysis
  const prioritizedItems = sortByPriority(roleFilteredContent, performanceAnalysis);

  // Convert to LearningPathItem format
  const learningPathItems: LearningPathItem[] = prioritizedItems.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    level: item.level,
    language: item.language,
    priority: item.priority,
    completed: false, // Will be updated based on user progress
    recommended_for_role: determineRoleRecommendation(item, userRole),
    reason: item.reason,
  }));

  const now = new Date().toISOString();

  return {
    userId,
    proficiencyLevel,
    items: learningPathItems,
    generatedAt: now,
    lastUpdated: now,
  };
};

/**
 * Fetches learning content appropriate for the user's proficiency level.
 * @param level - The proficiency level to filter by.
 * @param language - The preferred sign language (ASL/MSL).
 * @returns Array of content items matching the level.
 */
export const fetchContentByLevel = async (
  level: 'Beginner' | 'Intermediate' | 'Advanced',
  language: string
): Promise<LearningRecommendation[]> => {
  const supabase = createClient();
  const content: LearningRecommendation[] = [];

  // Fetch tutorials
  const { data: tutorials, error: tutorialsError } = await supabase
    .from('tutorials')
    .select('*')
    .eq('level', level)
    .eq('language', language);

  if (tutorialsError) {
    console.error('Error fetching tutorials:', tutorialsError);
  } else if (tutorials) {
    tutorials.forEach((tutorial) => {
      content.push({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        description: tutorial.description,
        level: tutorial.level,
        language: tutorial.language,
        priority: 2, // Default priority, will be adjusted
        reason: 'Core learning material for your level',
      });
    });
  }

  // Fetch quizzes
  const { data: quizzes, error: quizzesError } = await supabase
    .from('quiz_sets')
    .select('*')
    .eq('language', language);

  if (quizzesError) {
    console.error('Error fetching quizzes:', quizzesError);
  } else if (quizzes) {
    quizzes.forEach((quiz) => {
      content.push({
        id: quiz.id,
        type: 'quiz',
        title: quiz.title,
        description: quiz.description,
        level: level, // Assign current level since quiz_sets don't have level field
        language: quiz.language,
        priority: 3, // Practice materials have lower priority
        reason: 'Practice to reinforce your learning',
      });
    });
  }

  // Fetch materials
  const { data: materials, error: materialsError } = await supabase
    .from('materials')
    .select('*')
    .eq('level', level)
    .eq('language', language);

  if (materialsError) {
    console.error('Error fetching materials:', materialsError);
  } else if (materials) {
    materials.forEach((material) => {
      content.push({
        id: material.id,
        type: 'material',
        title: material.title,
        description: material.description,
        level: material.level,
        language: material.language,
        priority: 4, // Reference materials have lowest priority
        reason: 'Additional resource for self-study',
      });
    });
  }

  return content;
};

/**
 * Filters content based on user role (deaf/non-deaf).
 * Prioritizes role-specific content while allowing access to universal content.
 * @param content - Array of content items.
 * @param userRole - The user's role (deaf/non-deaf).
 * @returns Filtered content array.
 */
export const filterContentByRole = (
  content: LearningRecommendation[],
  userRole: string
): LearningRecommendation[] => {
  // For now, return all content since we don't have explicit role markers
  // In a full implementation, this would:
  // 1. Check for a 'recommended_for_role' field in the database
  // 2. Prioritize content matching the user's role
  // 3. Include universal content for all users
  // 4. Filter out content explicitly marked for other roles

  // Future enhancement: Add role-specific filtering logic
  return filterByRole(content, userRole);
};

/**
 * Sorts learning items by priority based on user needs and performance.
 * @param content - Array of content items.
 * @param performanceAnalysis - Optional performance analysis to inform prioritization.
 * @returns Sorted array of content items.
 */
export const sortByPriority = (
  content: LearningRecommendation[],
  performanceAnalysis?: PerformanceAnalysis
): LearningRecommendation[] => {
  // If we have performance analysis, adjust priorities based on weaknesses
  if (performanceAnalysis && performanceAnalysis.weaknesses.length > 0) {
    const weaknessKeywords = performanceAnalysis.weaknesses.map((w) =>
      w.toLowerCase()
    );

    content.forEach((item) => {
      // Check if item addresses a weakness
      const addressesWeakness = weaknessKeywords.some(
        (keyword) =>
          item.title.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
      );

      if (addressesWeakness) {
        // Boost priority for items addressing weaknesses
        item.priority = 1;
        item.reason = `Recommended to strengthen ${performanceAnalysis.weaknesses[0]}`;
      }
    });
  }

  // Use existing prioritization logic
  return prioritizeContent(content);
};

/**
 * Determines the role recommendation for a content item.
 * @param item - The content item.
 * @param userRole - The user's role.
 * @returns Role recommendation ('deaf', 'non-deaf', or 'all').
 */
const determineRoleRecommendation = (
  item: LearningRecommendation,
  userRole: string
): 'deaf' | 'non-deaf' | 'all' => {
  // For now, mark all content as universal
  // In a full implementation, this would check database fields
  // or content metadata to determine role-specific recommendations
  return 'all';
};


/**
 * Updates the learning path based on user progress changes.
 * This function should be called when a user completes tutorials, quizzes, or other learning activities.
 * @param userId - The ID of the user.
 * @param completedItemId - The ID of the completed learning item.
 * @param completedItemType - The type of the completed item ('tutorial', 'quiz', 'material').
 * @returns Updated learning path.
 */
export const updateLearningPath = async (
  userId: string,
  completedItemId: string,
  completedItemType: 'tutorial' | 'quiz' | 'material'
): Promise<LearningPath> => {
  const supabase = createClient();
  // Fetch user's current proficiency level
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('proficiency_level, role')
    .eq('id', userId)
    .single();

  if (profileError || !userProfile) {
    console.error('Error fetching user profile:', profileError);
    throw profileError || new Error('User profile not found');
  }

  const proficiencyLevel = userProfile.proficiency_level || 'Beginner';

  // Mark the completed item
  // In a full implementation, this would update a user_learning_progress table
  // For now, we'll regenerate the path with updated completion status

  // Check if completion should trigger difficulty adjustment
  let adjustedLevel = proficiencyLevel;
  if (completedItemType === 'quiz') {
    adjustedLevel = await adjustDifficulty(userId, completedItemId, proficiencyLevel);
  }

  // Recalculate recommendations based on new progress
  const updatedPath = await recalculateRecommendations(
    userId,
    adjustedLevel,
    completedItemId
  );

  return updatedPath;
};

/**
 * Recalculates learning recommendations when user completes content.
 * Removes completed items and suggests new content based on progress.
 * @param userId - The ID of the user.
 * @param proficiencyLevel - The user's current proficiency level.
 * @param completedItemId - The ID of the recently completed item.
 * @returns Updated learning path with new recommendations.
 */
export const recalculateRecommendations = async (
  userId: string,
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  completedItemId?: string
): Promise<LearningPath> => {
  const supabase = createClient();
  // Fetch user profile
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileError || !userProfile) {
    console.error('Error fetching user profile:', profileError);
    throw profileError || new Error('User profile not found');
  }

  // Default to ASL for now - in future, add language preference to user profile
  const preferredLanguage = 'ASL';

  // Fetch fresh content for the current level
  const contentByLevel = await fetchContentByLevel(proficiencyLevel, preferredLanguage);

  // Filter by role
  const roleFilteredContent = filterContentByRole(contentByLevel, userProfile.role);

  // Remove the completed item from recommendations
  const filteredContent = completedItemId
    ? roleFilteredContent.filter((item) => item.id !== completedItemId)
    : roleFilteredContent;

  // Sort by priority
  const prioritizedItems = prioritizeContent(filteredContent);

  // Convert to LearningPathItem format
  const learningPathItems: LearningPathItem[] = prioritizedItems.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    level: item.level,
    language: item.language,
    priority: item.priority,
    completed: item.id === completedItemId,
    recommended_for_role: determineRoleRecommendation(item, userProfile.role),
    reason: item.reason,
  }));

  const now = new Date().toISOString();

  return {
    userId,
    proficiencyLevel,
    items: learningPathItems,
    generatedAt: now, // Keep original generation time in full implementation
    lastUpdated: now,
  };
};

/**
 * Adjusts difficulty level based on quiz performance.
 * If user consistently scores high, suggests advancing to next level.
 * If user struggles, recommends staying at current level or reviewing basics.
 * @param userId - The ID of the user.
 * @param quizId - The ID of the completed quiz.
 * @param currentLevel - The user's current proficiency level.
 * @returns Adjusted proficiency level recommendation.
 */
export const adjustDifficulty = async (
  userId: string,
  quizId: string,
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced'
): Promise<'Beginner' | 'Intermediate' | 'Advanced'> => {
  const supabase = createClient();
  // Fetch the user's recent quiz progress for this quiz
  const { data: quizProgress, error: progressError } = await supabase
    .from('quiz_progress')
    .select('score, total_questions')
    .eq('user_id', userId)
    .eq('quiz_set_id', quizId)
    .order('last_attempted_at', { ascending: false })
    .limit(3);

  if (progressError) {
    console.error('Error fetching quiz progress:', progressError);
    // Return current level if we can't fetch progress
    return currentLevel;
  }

  if (!quizProgress || quizProgress.length === 0) {
    // No progress found, keep current level
    return currentLevel;
  }

  // Calculate average performance
  const averagePercentage =
    quizProgress.reduce((sum, progress) => {
      const percentage = progress.total_questions > 0 
        ? (progress.score / progress.total_questions) * 100 
        : 0;
      return sum + percentage;
    }, 0) / quizProgress.length;

  // Determine if level adjustment is needed
  if (averagePercentage >= 85 && currentLevel !== 'Advanced') {
    // User is performing excellently, suggest next level
    if (currentLevel === 'Beginner') {
      console.log(`User ${userId} performing well, suggesting Intermediate level`);
      return 'Intermediate';
    } else if (currentLevel === 'Intermediate') {
      console.log(`User ${userId} performing well, suggesting Advanced level`);
      return 'Advanced';
    }
  } else if (averagePercentage < 50 && currentLevel !== 'Beginner') {
    // User is struggling, suggest reviewing previous level
    if (currentLevel === 'Advanced') {
      console.log(`User ${userId} struggling, suggesting Intermediate level`);
      return 'Intermediate';
    } else if (currentLevel === 'Intermediate') {
      console.log(`User ${userId} struggling, suggesting Beginner level`);
      return 'Beginner';
    }
  }

  // No adjustment needed
  return currentLevel;
};

/**
 * Gets the current learning path for a user.
 * In a full implementation, this would fetch from a stored learning_paths table.
 * For now, it generates a fresh path based on current proficiency level.
 * @param userId - The ID of the user.
 * @returns The user's current learning path.
 */
export const getCurrentLearningPath = async (
  userId: string
): Promise<LearningPath | null> => {
  const supabase = createClient();
  // Fetch user's proficiency level
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('proficiency_level')
    .eq('id', userId)
    .single();

  if (profileError || !userProfile) {
    console.error('Error fetching user profile:', profileError);
    return null;
  }

  const proficiencyLevel = userProfile.proficiency_level || 'Beginner';

  // Generate learning path
  // In a full implementation, this would check for an existing path first
  return await generateLearningPath(userId, proficiencyLevel);
};
