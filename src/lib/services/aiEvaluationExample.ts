/**
 * Example usage of the AI Evaluation Engine
 * 
 * This file demonstrates how to use the evaluation and recommendation services
 * to analyze test results and generate personalized learning paths.
 */

import {
  analyzeCategoryPerformance,
  identifyKnowledgeGaps,
  generateInsights,
} from './evaluationService';
import {
  generateRecommendations,
  filterByRole,
  prioritizeContent,
} from './recommendationEngine';
import { getTestResultsWithAnalysis } from './proficiencyTestService';

/**
 * Example: Complete evaluation flow after a user completes a test
 * 
 * Usage:
 * ```typescript
 * const results = await evaluateTestAndGeneratePath(attemptId, userId);
 * console.log('Score:', results.attempt.score);
 * console.log('Level:', results.proficiencyLevel);
 * console.log('Strengths:', results.performanceAnalysis.strengths);
 * console.log('Weaknesses:', results.performanceAnalysis.weaknesses);
 * console.log('Recommendations:', results.recommendations);
 * ```
 */
export const evaluateTestAndGeneratePath = async (
  attemptId: string,
  userId: string
) => {
  // This function wraps getTestResultsWithAnalysis for convenience
  return await getTestResultsWithAnalysis(attemptId, userId);
};

/**
 * Example: Get only performance analysis without recommendations
 * 
 * Usage:
 * ```typescript
 * const analysis = await getPerformanceAnalysisOnly(attemptId);
 * console.log('Category Performance:', analysis.categoryPerformance);
 * console.log('Insights:', analysis.insights);
 * ```
 */
export const getPerformanceAnalysisOnly = async (attemptId: string) => {
  return await analyzeCategoryPerformance(attemptId);
};

/**
 * Example: Get knowledge gaps for targeted learning
 * 
 * Usage:
 * ```typescript
 * const gaps = await getKnowledgeGapsOnly(attemptId);
 * gaps.forEach(gap => {
 *   console.log(`Question: ${gap.questionText}`);
 *   console.log(`Your answer: ${gap.userAnswer}`);
 *   console.log(`Correct answer: ${gap.correctAnswer}`);
 * });
 * ```
 */
export const getKnowledgeGapsOnly = async (attemptId: string) => {
  return await identifyKnowledgeGaps(attemptId);
};

/**
 * Example: Generate recommendations based on custom performance data
 * 
 * Usage:
 * ```typescript
 * const customAnalysis = {
 *   strengths: ['Basic Concepts'],
 *   weaknesses: ['Advanced Techniques'],
 *   insights: ['Focus on advanced grammar'],
 *   categoryPerformance: [...]
 * };
 * const recommendations = await getCustomRecommendations(
 *   userId,
 *   'Intermediate',
 *   customAnalysis
 * );
 * ```
 */
export const getCustomRecommendations = async (
  userId: string,
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  performanceAnalysis: any
) => {
  return await generateRecommendations(userId, proficiencyLevel, performanceAnalysis);
};

// Export individual functions for direct use
export {
  analyzeCategoryPerformance,
  identifyKnowledgeGaps,
  generateInsights,
  generateRecommendations,
  filterByRole,
  prioritizeContent,
  getTestResultsWithAnalysis,
};
