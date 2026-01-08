# AI Evaluation Engine

The AI Evaluation Engine provides comprehensive performance analysis and personalized learning recommendations for proficiency test results.

## Overview

The engine consists of three main services:

1. **evaluationService.ts** - Performance analysis and knowledge gap identification
2. **recommendationEngine.ts** - Learning path generation and content prioritization
3. **proficiencyTestService.ts** - Integration with test management

## Features

### Performance Analysis

- **Category Performance**: Groups questions into skill categories and calculates performance metrics
- **Strengths & Weaknesses**: Identifies areas where users excel or need improvement
- **Personalized Insights**: Generates contextual feedback based on performance patterns
- **Knowledge Gap Identification**: Pinpoints specific questions answered incorrectly

### Recommendation Engine

- **Personalized Learning Paths**: Generates recommendations based on proficiency level and weaknesses
- **Role-Based Filtering**: Adapts content for deaf vs. non-deaf users
- **Content Prioritization**: Orders recommendations by relevance and importance
- **Multi-Type Content**: Includes tutorials, quizzes, and materials

## Usage

### Complete Evaluation Flow

```typescript
import { getTestResultsWithAnalysis } from '@/lib/services/proficiencyTestService';

// After user completes a test
const results = await getTestResultsWithAnalysis(attemptId, userId);

console.log('Score:', results.attempt.score);
console.log('Proficiency Level:', results.proficiencyLevel);
console.log('Strengths:', results.performanceAnalysis.strengths);
console.log('Weaknesses:', results.performanceAnalysis.weaknesses);
console.log('Insights:', results.performanceAnalysis.insights);
console.log('Knowledge Gaps:', results.knowledgeGaps);
console.log('Recommendations:', results.recommendations);
```

### Performance Analysis Only

```typescript
import { analyzeCategoryPerformance } from '@/lib/services/evaluationService';

const analysis = await analyzeCategoryPerformance(attemptId);

// Access category-level performance
analysis.categoryPerformance.forEach(cat => {
  console.log(`${cat.category}: ${cat.correct}/${cat.total} (${cat.percentage}%)`);
});
```

### Knowledge Gap Identification

```typescript
import { identifyKnowledgeGaps } from '@/lib/services/evaluationService';

const gaps = await identifyKnowledgeGaps(attemptId);

gaps.forEach(gap => {
  console.log(`Question: ${gap.questionText}`);
  console.log(`Your answer: ${gap.userAnswer}`);
  console.log(`Correct answer: ${gap.correctAnswer}`);
});
```

### Generate Recommendations

```typescript
import { generateRecommendations } from '@/lib/services/recommendationEngine';

const recommendations = await generateRecommendations(
  userId,
  'Intermediate',
  performanceAnalysis
);

recommendations.forEach(rec => {
  console.log(`[${rec.type}] ${rec.title}`);
  console.log(`Reason: ${rec.reason}`);
  console.log(`Priority: ${rec.priority}`);
});
```

## Data Structures

### PerformanceAnalysis

```typescript
interface PerformanceAnalysis {
  strengths: string[];              // Categories with >70% correct
  weaknesses: string[];             // Categories with <50% correct
  insights: string[];               // Personalized feedback messages
  categoryPerformance: {
    category: string;               // Category name
    correct: number;                // Number of correct answers
    total: number;                  // Total questions in category
    percentage: number;             // Percentage correct
  }[];
}
```

### KnowledgeGap

```typescript
interface KnowledgeGap {
  questionId: string;               // Question identifier
  questionText: string;             // The question content
  userAnswer: string;               // User's selected answer
  correctAnswer: string;            // The correct answer
}
```

### LearningRecommendation

```typescript
interface LearningRecommendation {
  id: string;                       // Content identifier
  type: 'tutorial' | 'quiz' | 'material';
  title: string;                    // Content title
  description: string;              // Content description
  level: string;                    // Proficiency level
  language: string;                 // ASL or MSL
  priority: number;                 // 1 = highest priority
  reason: string;                   // Why this is recommended
}
```

## Algorithm Details

### Category Grouping

Questions are grouped into categories based on their order_index:
- **Basic Concepts**: Questions 1-3
- **Intermediate Skills**: Questions 4-7
- **Advanced Techniques**: Questions 8+

### Proficiency Level Thresholds

- **Beginner**: < 50% correct
- **Intermediate**: 50-80% correct
- **Advanced**: > 80% correct

### Recommendation Prioritization

1. **Priority 1**: Tutorials addressing weak areas
2. **Priority 2**: Quizzes for practice
3. **Priority 3**: Materials for reference

Within each priority level, content is sorted alphabetically.

### Insight Generation

Insights are generated based on:
- Overall performance percentage
- Category-specific performance
- Performance consistency across categories
- Variance in scores

## Integration Points

### With Test Taking Flow

```typescript
// In test submission handler
const { score, proficiency_level } = await calculateResultAndAssignProficiency(
  attemptId,
  userId
);

// Get comprehensive results with analysis
const results = await getTestResultsWithAnalysis(attemptId, userId);

// Display results to user
// Show recommendations on dashboard
```

### With Dashboard

```typescript
// Fetch user's latest test results
const latestAttempt = await getLatestTestAttempt(userId);

if (latestAttempt) {
  const results = await getTestResultsWithAnalysis(latestAttempt.id, userId);
  
  // Display recommendations in learning path panel
  displayRecommendations(results.recommendations);
}
```

### With Learning Context

```typescript
// In LearningContext provider
const [learningPath, setLearningPath] = useState<LearningRecommendation[]>([]);

const updateLearningPath = async () => {
  const results = await getTestResultsWithAnalysis(attemptId, userId);
  setLearningPath(results.recommendations);
};
```

## Future Enhancements

1. **Machine Learning Integration**: Use ML models for more sophisticated pattern recognition
2. **Question Categories**: Add explicit category fields to questions for better grouping
3. **Adaptive Testing**: Adjust question difficulty based on previous answers
4. **Progress Tracking**: Update recommendations based on completed learning items
5. **Role-Specific Content**: Add explicit role markers to content for better filtering
6. **Collaborative Filtering**: Recommend content based on similar users' success
7. **Time-Based Analysis**: Consider time spent on questions in evaluation
8. **Multi-Language Support**: Expand beyond ASL and MSL

## Error Handling

All functions include error handling and logging:

```typescript
try {
  const results = await getTestResultsWithAnalysis(attemptId, userId);
  // Use results
} catch (error) {
  console.error('Error getting test results:', error);
  // Show user-friendly error message
  // Fall back to basic results without analysis
}
```

## Testing

To test the evaluation engine:

1. Complete a proficiency test
2. Call `getTestResultsWithAnalysis` with the attempt ID
3. Verify performance analysis matches expected categories
4. Check that recommendations are appropriate for proficiency level
5. Confirm insights are relevant to performance

## Performance Considerations

- Analysis functions make multiple database queries
- Consider caching results for frequently accessed attempts
- Recommendations are limited to top 20 items
- Use database indexes on foreign keys for optimal performance

## Dependencies

- Supabase client for database access
- Database types from `@/types/database`
- Existing proficiency test schema and data
