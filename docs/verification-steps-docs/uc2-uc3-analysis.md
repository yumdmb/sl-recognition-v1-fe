# UC2 & UC3 Implementation Analysis

## Overview
This document provides a thorough comparison between the UC2 (Take Proficiency Test) and UC3 (Track Learning Progress) use case requirements and the current system implementation.

---

## UC2 - Take Proficiency Test

### Requirements Summary
| Requirement | Description |
|-------------|-------------|
| **Actor** | User (deaf, non-deaf) |
| **Trigger** | User opts to take test from dashboard prompt or test selection page |
| **Pre-condition** | User must be logged in |
| **Post-condition** | User assigned proficiency level (Beginner/Intermediate/Advanced), stored in profile, personalized learning path generated |

### Flow of Events Analysis

| Step | UC2 Requirement | Current Implementation | Status |
|------|-----------------|------------------------|--------|
| 1 | User is prompted to take a proficiency test | `ProficiencyTestPrompt` component shows AlertDialog on dashboard when `proficiency_level === null` | ✅ Implemented |
| 2 | User accepts and is directed to test selection page | "Take Test" button navigates to `/proficiency-test/select` | ✅ Implemented |
| 3 | User selects a proficiency test to begin | `TestSelectionClient` displays available tests with "Start Test" buttons | ✅ Implemented |
| 4 | System presents questions one by one | `ProficiencyTestPage` shows questions sequentially with Previous/Next navigation | ✅ Implemented |
| 5 | User provides answer for each question | `ProficiencyTestQuestion` component with radio button choices, answers stored in `userAnswers` state | ✅ Implemented |
| 6 | User submits the test | "Finish Test" button calls `submitTest()` after submitting all answers | ✅ Implemented |
| 7 | System calculates score and determines proficiency level | `calculateResultAndAssignProficiency()` in `proficiencyTestService.ts` - Score thresholds: <50% = Beginner, 50-80% = Intermediate, >80% = Advanced | ✅ Implemented |
| 8 | System displays final score and proficiency level | Results page (`/proficiency-test/results`) shows score percentage, proficiency badge, performance breakdown | ✅ Implemented |
| 9 | System generates personalized learning path | `generateLearningPath()` called after test submission, uses `recommendationEngine.ts` with role-specific paths | ✅ Implemented |
| 10 | System dynamically updates learning path as user completes tutorials/quizzes | `updateLearningPath()` called in `markTutorialDone()` and `submitQuizAnswers()` with adaptive logic based on quiz scores | ✅ Implemented |

### Alternative Flow Analysis

| Step | UC2 Requirement | Current Implementation | Status |
|------|-----------------|------------------------|--------|
| 2.1 | User can navigate to Profile page later | Profile page accessible via navigation | ✅ Implemented |
| 2.2 | User finds "Take Test" button | Profile page shows "Take Test" button when `proficiency_level === null`, "Retake Test" when level exists | ✅ Implemented |
| 2.3 | System proceeds to Step 3 | Button navigates to `/proficiency-test/select` | ✅ Implemented |

### Exception Flow Analysis

| Step | UC2 Requirement | Current Implementation | Status |
|------|-----------------|------------------------|--------|
| 4.1 | System displays error message if questions fail to load | Error Alert with "Error Loading Test" message, retry logic with exponential backoff (up to 3 attempts) | ✅ Implemented |
| 4.2 | System prompts user to Home page | "Back to Test Selection" button provided (navigates to `/proficiency-test/select` instead of Home) | ⚠️ Partial - Goes to test selection, not Home |

### Database Schema for UC2

```sql
-- Proficiency levels enum
CREATE TYPE proficiency_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- User profiles with proficiency level
ALTER TABLE public.user_profiles ADD COLUMN proficiency_level proficiency_level;

-- Proficiency tests
CREATE TABLE public.proficiency_tests (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    language TEXT, -- Added later: 'ASL' | 'MSL'
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);

-- Test questions
CREATE TABLE public.proficiency_test_questions (
    id UUID PRIMARY KEY,
    test_id UUID REFERENCES proficiency_tests(id),
    question_text TEXT NOT NULL,
    order_index INT NOT NULL
);

-- Question choices
CREATE TABLE public.proficiency_test_question_choices (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES proficiency_test_questions(id),
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false
);

-- Test attempts
CREATE TABLE public.proficiency_test_attempts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    test_id UUID REFERENCES proficiency_tests(id),
    score INT,
    completed_at TIMESTAMPTZ
);

-- Attempt answers
CREATE TABLE public.proficiency_test_attempt_answers (
    id UUID PRIMARY KEY,
    attempt_id UUID REFERENCES proficiency_test_attempts(id),
    question_id UUID REFERENCES proficiency_test_questions(id),
    choice_id UUID REFERENCES proficiency_test_question_choices(id),
    is_correct BOOLEAN NOT NULL
);
```

### Key Implementation Files for UC2

| File | Purpose |
|------|---------|
| `src/app/proficiency-test/select/page.tsx` | Test selection page (Server Component) |
| `src/app/proficiency-test/[testId]/page.tsx` | Test taking page with question navigation |
| `src/app/proficiency-test/results/page.tsx` | Results display with recommendations |
| `src/app/proficiency-test/history/` | Test history viewing |
| `src/components/proficiency-test/ProficiencyTestPrompt.tsx` | Initial dashboard prompt |
| `src/components/proficiency-test/ProficiencyTestQuestion.tsx` | Question display component |
| `src/lib/services/proficiencyTestService.ts` | Core test logic and scoring |
| `src/context/LearningContext.tsx` | State management for test flow |

---

## UC3 - Track Learning Progress (Generate Learning Path)

### Requirements Summary
| Requirement | Description |
|-------------|-------------|
| **Actor** | User (deaf, non-deaf) |
| **Trigger** | User views their dashboard |
| **Pre-condition** | User is logged in and has interacted with at least one tutorial or quiz |
| **Post-condition** | User sees up-to-date summary of learning progress |

### Flow of Events Analysis

| Step | UC3 Requirement | Current Implementation | Status |
|------|-----------------|------------------------|--------|
| 1 | System retrieves user's interaction data for tutorials and quizzes | `getTutorials()` and `getQuizSets()` fetch data with user progress via `LearningContext` | ✅ Implemented |
| 2 | System calculates tutorial progress (started, in-progress, completed) | `LearningProgress` component calculates: `startedTutorials`, `inProgressTutorials`, `completedTutorials` from `tutorial_progress.status` | ✅ Implemented |
| 3 | System calculates overall tutorial completion percentage | `totalProgress = (completedTutorials.length / startedTutorials.length) * 100` | ✅ Implemented |
| 4 | System calculates quiz completion and retrieves individual quiz scores | `QuizProgress` component shows `attemptedQuizzes`, `overallCompletion`, individual scores from `quiz_progress` table | ✅ Implemented |
| 5 | System displays calculated progress on dashboard | `UserDashboard` renders `LearningProgress`, `QuizProgress`, and `LearningPathPanel` components | ✅ Implemented |
| 6 | User views tutorials and quizzes completion at dashboard | Dashboard shows progress cards with percentages, counts, and individual item progress bars | ✅ Implemented |

### Database Schema for UC3

```sql
-- Tutorial progress tracking
CREATE TABLE public.tutorial_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    tutorial_id UUID REFERENCES tutorials(id),
    status TEXT CHECK (status IN ('started', 'completed')),
    last_watched_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    UNIQUE(user_id, tutorial_id)
);

-- Quiz progress tracking
CREATE TABLE public.quiz_progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    quiz_set_id UUID REFERENCES quiz_sets(id),
    completed BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    last_attempted_at TIMESTAMPTZ,
    UNIQUE(user_id, quiz_set_id)
);
```

### Key Implementation Files for UC3

| File | Purpose |
|------|---------|
| `src/app/(main)/dashboard/page.tsx` | Dashboard entry point |
| `src/components/UserDashboard.tsx` | User dashboard layout |
| `src/components/user/LearningProgress.tsx` | Tutorial progress display |
| `src/components/user/QuizProgress.tsx` | Quiz progress display |
| `src/components/user/LearningPathPanel.tsx` | Personalized recommendations |
| `src/lib/services/tutorialService.ts` | Tutorial progress operations |
| `src/lib/services/quizService.ts` | Quiz progress operations |
| `src/lib/services/recommendationEngine.ts` | Learning path generation |

---

## Learning Path Generation (UC2 Post-condition + UC3 Integration)

### Implementation Details

The learning path generation is a sophisticated system that:

1. **Initial Generation** (after proficiency test):
   - Called via `generateLearningPath()` in `LearningContext`
   - Uses `getTestResultsWithAnalysis()` to get performance data
   - Calls `generateRecommendations()` with user's proficiency level and performance analysis

2. **Role-Specific Paths**:
   - **Deaf Users**: `generateDeafUserPath()` - Prioritizes visual learning, sign language-first content
   - **Non-Deaf Users**: `generateNonDeafUserPath()` - Includes comparative content with spoken language

3. **Adaptive Updates** (UC2 Step 10):
   - `updateLearningPath(recentQuizScore)` called after:
     - Tutorial completion (`markTutorialDone()`)
     - Quiz submission (`submitQuizAnswers()`)
   - Adjusts content level based on quiz performance:
     - Score > 80%: Suggests more advanced content
     - Score < 50%: Suggests foundational content
     - Score 50-80%: Maintains current level

4. **Recommendation Prioritization**:
   - Priority 1: Content addressing weak areas (from performance analysis)
   - Priority 2: Practice quizzes
   - Priority 3: Reference materials
   - Role-specific content prioritized over universal content

### Recommendation Engine Flow

```
User completes proficiency test
    ↓
calculateResultAndAssignProficiency()
    ↓
generateLearningPath()
    ↓
getTestResultsWithAnalysis()
    ↓
analyzeCategoryPerformance() + identifyKnowledgeGaps()
    ↓
generateRecommendations(userId, proficiencyLevel, performanceAnalysis)
    ↓
[Role Check: deaf/non-deaf]
    ↓
generateDeafUserPath() OR generateNonDeafUserPath()
    ↓
fetchTutorials() + fetchQuizzes() + fetchMaterials()
    ↓
Filter by role + prioritizeContent()
    ↓
Return top 20 recommendations
```

---

## Summary: Implementation Completeness

### UC2 - Take Proficiency Test
| Aspect | Status | Notes |
|--------|--------|-------|
| Main Flow | ✅ 100% | All 10 steps implemented |
| Alternative Flow | ✅ 100% | Profile page "Take Test" button works |
| Exception Flow | ⚠️ 90% | Error handling exists, but redirects to test selection instead of Home |
| Database Schema | ✅ Complete | All required tables with RLS policies |
| UI/UX | ✅ Complete | Question navigation, progress saving, retry logic |

### UC3 - Track Learning Progress
| Aspect | Status | Notes |
|--------|--------|-------|
| Main Flow | ✅ 100% | All 6 steps implemented |
| Alternative Flow | N/A | No alternative flow defined |
| Exception Flow | N/A | No exception flow defined |
| Database Schema | ✅ Complete | tutorial_progress and quiz_progress tables |
| UI/UX | ✅ Complete | Dashboard widgets with real-time progress |

### Additional Features Beyond UC Requirements
1. **Test History**: Users can view all past test attempts (`/proficiency-test/history`)
2. **Retake Test**: Users can retake tests to improve their level
3. **Adaptive Learning Path**: Path updates based on ongoing quiz performance
4. **Role-Specific Content**: Different recommendations for deaf vs non-deaf users
5. **Performance Analysis**: Detailed breakdown of strengths, weaknesses, and insights
6. **Knowledge Gap Identification**: System identifies specific areas needing improvement
7. **Answer Persistence**: Test answers saved to localStorage for recovery
8. **Retry Logic**: Exponential backoff for network failures during test submission

---

## Minor Gaps/Recommendations

1. **Exception Flow Navigation**: Consider changing error redirect from `/proficiency-test/select` to `/dashboard` (Home) to match UC2 specification exactly.

2. **Pre-condition Enforcement**: UC3 states user should have "interacted with at least one tutorial or quiz" - currently dashboard shows even without interactions (shows 0% progress).

3. **Dynamic Path Update Notification**: The `hasNewRecommendations` flag and toast notifications are implemented but could be more prominent to inform users when their path updates.

---

## Verification Steps

### To Verify UC2:
1. Log in as a new user (no proficiency level)
2. Observe the proficiency test prompt on dashboard
3. Click "Take Test" → should navigate to `/proficiency-test/select`
4. Select a test → should navigate to `/proficiency-test/[testId]`
5. Answer questions using Previous/Next navigation
6. Click "Finish Test" → should show results with score and level
7. Check profile page → proficiency level should be displayed
8. Check dashboard → learning path recommendations should appear

### To Verify UC3:
1. Log in as a user with proficiency level
2. Navigate to dashboard
3. Observe LearningProgress card (tutorial stats)
4. Observe QuizProgress card (quiz stats)
5. Observe LearningPathPanel (recommendations)
6. Start a tutorial → progress should update
7. Complete a quiz → progress and learning path should update
