# Design Document: Generate Learning Path

## Overview

The Generate Learning Path system provides comprehensive proficiency assessment and personalized learning recommendations for SignBridge users. Built on Supabase with Next.js 15, the system administers proficiency tests, evaluates user performance, assigns skill levels, and generates adaptive learning paths tailored to individual needs and roles (deaf/non-deaf). The system integrates with the learning progress tracking module (UC10) to continuously refine recommendations.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Test Selection  │  Test Taking  │  Results  │  Dashboard   │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Context Layer (React)                      │
├─────────────────────────────────────────────────────────────┤
│  LearningContext - Learning Path State & Progress           │
│  AuthContext - User Profile & Proficiency Level             │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                Service Layer (lib/services)                  │
├─────────────────────────────────────────────────────────────┤
│  proficiencyTestService.ts  │  learningPathService.ts       │
│  evaluationService.ts        │  progressService.ts           │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Layer (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│  proficiency_tests  │  test_attempts  │  user_profiles      │
│  test_questions     │  tutorials      │  quiz_sets          │
└─────────────────────────────────────────────────────────────┘
```

### Proficiency Test Flow

```
Test Selection → Test Start → Question Loop → Submit Test →
Score Calculation → Level Assignment → Learning Path Generation →
Dashboard Display → Dynamic Updates (UC10)
```

### Learning Path Generation Flow

```
User Profile + Test Results → AI Evaluation Engine →
Role-Based Filtering → Content Prioritization →
Personalized Learning Path → Progress Tracking Integration
```

## Components and Interfaces

### 1. Test Selection Page

#### Test Selection (`/proficiency-test/select`)
- **Purpose**: Display available proficiency tests and allow user selection
- **Components**:
  - Test cards showing title, description, language, and duration
  - Filter options for language (ASL/MSL)
  - "Start Test" button for each test
  - Test history display showing previous attempts
- **State Management**: Local state for test list and filters
- **API Integration**: Fetch proficiency tests from database

### 2. Test Taking Interface

#### Test Page (`/proficiency-test/[testId]`)
- **Purpose**: Administer proficiency test with question-by-question presentation
- **Components**:
  - Progress indicator (e.g., "Question 3 of 10")
  - Question display with text and optional video
  - Multiple choice options (radio buttons)
  - Navigation buttons (Next, Previous, Submit)
  - Timer display (optional)
  - Exit confirmation dialog
- **State Management**: 
  - Current question index
  - User answers array
  - Test attempt ID
  - Time tracking
- **API Integration**: 
  - Fetch test questions
  - Create test attempt
  - Submit answers

### 3. Results Display

#### Results Page (`/proficiency-test/results`)
- **Purpose**: Display test results, score, and assigned proficiency level
- **Components**:
  - Score display (points and percentage)
  - Proficiency level badge (Beginner/Intermediate/Advanced)
  - Performance breakdown by question category
  - Strengths and areas for improvement
  - "View Learning Path" button
  - "Retake Test" button
- **State Management**: Test attempt results from API
- **API Integration**: Fetch test attempt results and analysis

### 4. Dashboard Integration

#### Proficiency Level Display
- **Purpose**: Show user's current proficiency level on dashboard
- **Components**:
  - Proficiency level badge
  - Progress bar showing advancement toward next level
  - "Take Test" or "Retake Test" button
  - Link to learning path
- **Integration**: Displayed in UserDashboard component

#### Learning Path Panel
- **Purpose**: Display personalized learning recommendations
- **Components**:
  - Recommended tutorials list
  - Suggested quizzes
  - Downloadable materials
  - Progress indicators for each item
  - "Start Learning" buttons
- **Integration**: Displayed in UserDashboard component

### 5. Context Provider

#### LearningContext Extension
```typescript
interface LearningContextType {
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  learningPath: LearningPathItem[];
  currentTest: ProficiencyTest | null;
  testAttempt: TestAttempt | null;
  
  // Test methods
  startTest: (testId: string) => Promise<void>;
  submitAnswer: (questionId: string, answerId: string) => Promise<void>;
  submitTest: () => Promise<TestResults>;
  
  // Learning path methods
  generateLearningPath: () => Promise<void>;
  updateLearningPath: () => Promise<void>;
  getLearningRecommendations: () => Promise<LearningPathItem[]>;
}
```

## Data Models

### Proficiency Test Models

```typescript
interface ProficiencyTest {
  id: string;
  title: string;
  description: string;
  language: 'ASL' | 'MSL';
  level: 'beginner' | 'intermediate' | 'advanced';
  passing_score: number;
  created_at: string;
  updated_at: string;
}

interface ProficiencyTestQuestion {
  id: string;
  test_id: string;
  question_text: string;
  video_url?: string;
  points: number;
  created_at: string;
}

interface ProficiencyTestQuestionChoice {
  id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
  created_at: string;
}

interface ProficiencyTestAttempt {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  passed: boolean;
  started_at: string;
  completed_at?: string;
  created_at: string;
}

interface ProficiencyTestAttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_choice_id: string;
  is_correct: boolean;
  created_at: string;
}
```

### Learning Path Models

```typescript
interface LearningPathItem {
  id: string;
  type: 'tutorial' | 'quiz' | 'material';
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'ASL' | 'MSL';
  priority: number;
  completed: boolean;
  recommended_for_role: 'deaf' | 'non-deaf' | 'all';
}

interface LearningPathRecommendation {
  user_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced';
  recommended_items: LearningPathItem[];
  generated_at: string;
  last_updated: string;
}
```

### Database Schema

**Table: `proficiency_tests`**
```sql
CREATE TABLE proficiency_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ASL', 'MSL')),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  passing_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `proficiency_test_questions`**
```sql
CREATE TABLE proficiency_test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES proficiency_tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  video_url TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `proficiency_test_question_choices`**
```sql
CREATE TABLE proficiency_test_question_choices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES proficiency_test_questions(id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `proficiency_test_attempts`**
```sql
CREATE TABLE proficiency_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES proficiency_tests(id) ON DELETE CASCADE,
  score INTEGER,
  passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `proficiency_test_attempt_answers`**
```sql
CREATE TABLE proficiency_test_attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES proficiency_test_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES proficiency_test_questions(id) ON DELETE CASCADE,
  selected_choice_id UUID REFERENCES proficiency_test_question_choices(id),
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## AI Evaluation Engine

### Evaluation Algorithm

```typescript
interface EvaluationResult {
  score: number;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

function evaluateTestResults(
  attempt: ProficiencyTestAttempt,
  answers: ProficiencyTestAttemptAnswer[],
  test: ProficiencyTest
): EvaluationResult {
  // 1. Calculate raw score
  const totalPoints = answers.reduce((sum, answer) => 
    sum + (answer.is_correct ? getQuestionPoints(answer.question_id) : 0), 0
  );
  
  // 2. Determine proficiency level based on score thresholds
  const percentage = (totalPoints / test.passing_score) * 100;
  let level: 'beginner' | 'intermediate' | 'advanced';
  
  if (percentage >= 80) level = 'advanced';
  else if (percentage >= 60) level = 'intermediate';
  else level = 'beginner';
  
  // 3. Analyze answer patterns to identify strengths/weaknesses
  const categoryPerformance = analyzeCategoryPerformance(answers);
  
  // 4. Generate recommendations based on weak areas
  const recommendations = generateRecommendations(categoryPerformance, level);
  
  return {
    score: totalPoints,
    proficiency_level: level,
    strengths: categoryPerformance.strong,
    weaknesses: categoryPerformance.weak,
    recommendations
  };
}
```

### Learning Path Generation Algorithm

```typescript
function generateLearningPath(
  user: UserProfile,
  evaluationResult: EvaluationResult
): LearningPathItem[] {
  // 1. Fetch all available content
  const allContent = fetchAllLearningContent();
  
  // 2. Filter by proficiency level
  const levelAppropriate = allContent.filter(
    item => item.level === evaluationResult.proficiency_level
  );
  
  // 3. Filter by user role (deaf/non-deaf)
  const roleFiltered = levelAppropriate.filter(
    item => item.recommended_for_role === user.role || 
            item.recommended_for_role === 'all'
  );
  
  // 4. Prioritize based on weaknesses
  const prioritized = prioritizeByWeaknesses(
    roleFiltered,
    evaluationResult.weaknesses
  );
  
  // 5. Add foundational content for beginners
  if (evaluationResult.proficiency_level === 'beginner') {
    prioritized.unshift(...getFoundationalContent());
  }
  
  // 6. Return top 20 recommendations
  return prioritized.slice(0, 20);
}
```

## Error Handling

### Test Administration Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Questions failed to load | "Unable to load test questions. Please try again." | Retry button, redirect to test selection |
| Network error during test | "Connection lost. Your progress has been saved." | Auto-save answers, allow resume |
| Test session expired | "Your test session has expired. Please restart." | Restart test button |
| Submission failed | "Failed to submit test. Retrying..." | Auto-retry 3 times, then manual retry |

### Learning Path Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Path generation failed | "Unable to generate learning path. Using default recommendations." | Show default content by level |
| Content not found | "Some recommended content is unavailable." | Filter out missing items |
| Update failed | "Failed to update learning path." | Use cached path, retry in background |

## Testing Strategy

### Unit Tests
- Test scoring algorithm with various answer combinations
- Test proficiency level assignment logic
- Test learning path generation algorithm
- Test role-based content filtering
- Test AI evaluation functions

### Integration Tests
- Complete test taking flow (start to results)
- Test attempt creation and answer recording
- Learning path generation after test completion
- Profile update with new proficiency level
- Dynamic path updates based on progress

### E2E Tests
- User takes proficiency test and receives results
- Learning path appears on dashboard
- User retakes test and level updates
- Different paths for deaf vs non-deaf users
- Error handling during test submission

## Performance Considerations

### Optimization Strategies
- Cache test questions to reduce database queries
- Preload next question while user answers current
- Generate learning path asynchronously after test submission
- Index database tables for fast test retrieval
- Paginate learning path recommendations

### Loading States
- Skeleton loaders for test questions
- Progress indicators during test submission
- Loading spinner for learning path generation
- Optimistic UI updates for answer selection

## Security Considerations

### Test Integrity
- Prevent answer inspection through client-side code
- Randomize question order per attempt
- Randomize choice order per question
- Time-limit test sessions to prevent cheating
- Validate all answers server-side

### Data Protection
- RLS policies ensure users only see their own attempts
- Encrypt test answers in transit
- Prevent unauthorized access to correct answers
- Log all test attempts for audit trail

## Future Enhancements

1. **Adaptive Testing**: Adjust question difficulty based on previous answers
2. **Video-Based Questions**: Add gesture recognition questions
3. **Timed Tests**: Add optional time limits per question
4. **Practice Mode**: Allow users to practice without affecting proficiency level
5. **Detailed Analytics**: Provide in-depth performance analysis
6. **Learning Path Sharing**: Allow users to share custom learning paths
7. **Gamification**: Add badges and achievements for test completion
8. **Multi-Language Support**: Expand beyond ASL and MSL
