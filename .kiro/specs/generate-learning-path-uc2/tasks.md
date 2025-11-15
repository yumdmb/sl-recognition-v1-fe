# Implementation Plan: Generate Learning Path

- [x] 1. Set up proficiency test database schema
  - Create proficiency_tests table with test metadata
  - Create proficiency_test_questions table with question content
  - Create proficiency_test_question_choices table with answer options
  - Create proficiency_test_attempts table for tracking user attempts
  - Create proficiency_test_attempt_answers table for storing user responses
  - Set up RLS policies for test data access
  - _Requirements: FR-015 (1.1, 1.2, 1.3, 1.4, 1.5), FR-016 (2.1, 2.2, 2.3, 2.4, 2.5), FR-017 (3.1, 3.2, 3.3, 3.4, 3.5), FR-023 (8.1, 8.2, 8.3, 8.4, 8.5)_
  - _Implementation: supabase/migrations/20250615115100_create_proficiency_test_schema.sql, 20250615120700_seed_proficiency_tests.sql_

- [x] 2. Build proficiency test service layer
  - [x] 2.1 Create proficiency test data access functions
    - Implement getProficiencyTests() to fetch available tests
    - Implement getTestById() to fetch specific test details
    - Implement getTestQuestions() to fetch questions with choices
    - Implement getTestAttemptHistory() to fetch user's previous attempts
    - _Requirements: FR-015 (1.2, 1.5), FR-023 (8.4, 8.5)_
    - _Implementation: src/lib/services/proficiencyTestService.ts (getAllProficiencyTests, getProficiencyTest)_
    - _Note: getTestAttemptHistory not yet implemented_

  - [x] 2.2 Create test attempt management functions
    - Implement createTestAttempt() to start new test session
    - Implement saveAnswer() to record user's answer for each question
    - Implement submitTest() to finalize test and calculate score
    - Implement getAttemptResults() to fetch completed attempt details
    - _Requirements: FR-016 (2.1, 2.4, 2.5), FR-017 (3.1, 3.5), FR-023 (8.2)_
    - _Implementation: proficiencyTestService.ts (createTestAttempt, submitAnswer, calculateResultAndAssignProficiency)_

- [x] 3. Implement AI evaluation engine





  - [x] 3.1 Create scoring algorithm
    - Implement calculateScore() to sum points from correct answers
    - Implement calculatePercentage() for score percentage
    - Implement determineProficiencyLevel() based on score thresholds
    - _Requirements: FR-017 (3.1, 3.2, 3.3)_
    - _Implementation: proficiencyTestService.ts calculateResultAndAssignProficiency function_
    - _Note: Basic scoring implemented (Beginner <50%, Intermediate 50-80%, Advanced >80%)_



  - [x] 3.2 Build performance analysis functions
    - Implement analyzeCategoryPerformance() to identify strengths/weaknesses
    - Implement identifyKnowledgeGaps() based on incorrect answers
    - Implement generateInsights() for personalized feedback
    - _Requirements: FR-019 (5.1, 5.2, 5.3, 5.4, 5.5)_
    - _Implementation: src/lib/services/evaluationService.ts_
    - _Note: Rule-based AI using statistical analysis, threshold logic, and pattern recognition. Groups questions into categories (Basic 1-3, Intermediate 4-7, Advanced 8+), identifies strengths (>70%) and weaknesses (<50%), generates personalized insights based on performance patterns_

  - [x] 3.3 Create recommendation engine
    - Implement generateRecommendations() based on weak areas
    - Implement prioritizeContent() by relevance to user needs
    - Implement filterByRole() for deaf/non-deaf specific content
    - _Requirements: FR-018 (4.1, 4.2, 4.3), FR-019 (5.5), FR-021 (7.1, 7.2, 7.3, 7.4, 7.5)_
    - _Implementation: src/lib/services/recommendationEngine.ts_
    - _Note: Generates personalized learning paths by fetching tutorials, quizzes, and materials matching proficiency level. Prioritizes content addressing weak areas (Priority 1), practice quizzes (Priority 2), and reference materials (Priority 3). Includes filterByRole() for future role-specific content filtering. Integration function getTestResultsWithAnalysis() added to proficiencyTestService.ts_

- [x] 4. Build learning path service




  - [x] 4.1 Create learning path generation functions

    - Implement generateLearningPath() to create personalized path
    - Implement fetchContentByLevel() to get level-appropriate materials
    - Implement filterContentByRole() for role-specific recommendations
    - Implement sortByPriority() to order learning items
    - _Requirements: FR-018 (4.1, 4.2, 4.3, 4.4, 4.5), FR-021 (7.1, 7.2, 7.3, 7.4, 7.5)_
    - _Status: NOT IMPLEMENTED - No learningPathService.ts exists_


  - [x] 4.2 Implement dynamic path update functions






    - Implement updateLearningPath() based on progress changes
    - Implement recalculateRecommendations() when user completes content
    - Implement adjustDifficulty() based on quiz performance
    - _Requirements: FR-020 (6.1, 6.2, 6.3, 6.4, 6.5)_
    - _Status: NOT IMPLEMENTED_

- [x] 5. Create test selection page
  - [x] 5.1 Build test selection UI
    - Create test selection page at /proficiency-test/select
    - Display available tests with cards showing title, description, language
    - Add filter options for language (ASL/MSL)
    - Show test history with previous attempts and scores
    - _Requirements: FR-015 (1.1, 1.2, 1.3, 1.5), FR-023 (8.4, 8.5)_
    - _Implementation: src/app/proficiency-test/select/page.tsx_
    - _Note: Language filter and test history not yet implemented_

  - [x] 5.2 Implement test selection logic
    - Fetch and display available proficiency tests
    - Handle test selection and navigation to test page
    - Display "Take Test" button for new users
    - Show "Retake Test" option for users with existing attempts
    - _Requirements: FR-015 (1.2, 1.3, 1.4), FR-023 (8.1, 8.2)_
    - _Implementation: select/page.tsx uses getAllProficiencyTests()_

- [x] 6. Build test taking interface
  - [x] 6.1 Create test page UI
    - Create dynamic test page at /proficiency-test/[testId]
    - Display progress indicator (e.g., "Question 3 of 10")
    - Show question text and optional video demonstration
    - Render multiple choice options as radio buttons
    - Add navigation buttons (Next, Previous, Submit)
    - _Requirements: FR-016 (2.2, 2.3)_
    - _Implementation: src/app/proficiency-test/[testId]/page.tsx, src/components/proficiency-test/ProficiencyTestQuestion.tsx_

  - [x] 6.2 Implement test taking logic
    - Initialize test attempt when user starts test
    - Load questions one by one in sequential order
    - Record user's answer selection for each question
    - Enable/disable navigation based on answer selection
    - Handle test submission and redirect to results
    - _Requirements: FR-016 (2.1, 2.2, 2.4, 2.5)_
    - _Implementation: [testId]/page.tsx handleNext, handlePrevious, handleFinish functions_

  - [x] 6.3 Add test session management
    - Track time spent on test (optional)
    - Implement auto-save for answers
    - Add exit confirmation dialog
    - Handle session timeout gracefully
    - _Requirements: FR-016 (2.1), FR-024 (9.2, 9.3)_
    - _Note: Basic session management exists, no auto-save or timeout handling_

- [x] 7. Create results display page
  - [x] 7.1 Build results page UI
    - Create results page at /proficiency-test/results
    - Display score (points and percentage)
    - Show proficiency level badge (Beginner/Intermediate/Advanced)
    - Display performance breakdown by category
    - Show strengths and areas for improvement
    - Add "View Learning Path" and "Retake Test" buttons
    - _Requirements: FR-017 (3.4, 3.5), FR-019 (5.4)_
    - _Implementation: src/app/proficiency-test/results/page.tsx_
    - _Note: ✅ Complete - Full results page with score, proficiency badge, performance breakdown by category, strengths/weaknesses, insights, and learning recommendations. Includes loading states, error handling, and action buttons._

  - [x] 7.2 Implement results logic
    - Fetch test attempt results from database
    - Calculate and display score and proficiency level
    - Generate performance insights using AI evaluation
    - Update user profile with new proficiency level
    - Trigger learning path generation
    - _Requirements: FR-017 (3.1, 3.2, 3.3, 3.4, 3.5), FR-018 (4.1), FR-019 (5.1, 5.2, 5.3, 5.4, 5.5)_
    - _Implementation: getTestResultsWithAnalysis() in proficiencyTestService.ts fetches attempt, analysis, and recommendations_
    - _Note: ✅ Complete - Results page displays AI-generated insights, category performance, strengths/weaknesses, and personalized learning recommendations. Profile update happens during test submission._

- [x] 8. Integrate with dashboard

  - [x] 8.1 Add proficiency level display to dashboard
    - Create proficiency level badge component
    - Display current proficiency level on user dashboard
    - Show progress bar toward next level
    - Add "Take Test" or "Retake Test" button
    - _Requirements: FR-017 (3.3, 3.4), FR-023 (8.1)_
    - _Implementation: src/app/(main)/profile/page.tsx shows proficiency level with "Take Test" button_
    - _Note: No progress bar toward next level_

  - [x] 8.2 Create learning path panel for dashboard
    - Build learning path recommendations component
    - Display recommended tutorials, quizzes, and materials
    - Show progress indicators for each learning item
    - Add "Start Learning" buttons for each item
    - Link to full learning path view
    - _Requirements: FR-018 (4.4, 4.5), FR-021 (7.4)_
    - _Implementation: src/components/user/LearningPathPanel.tsx - Fully integrated into UserDashboard_
    - _Features:_
      - ✅ Fetches user's latest test attempt and recommendations
      - ✅ Displays top 5 recommendations with priority badges
      - ✅ Shows content type icons (tutorial/quiz/material)
      - ✅ Includes "Start Learning" buttons with correct navigation routes
      - ✅ Navigation: tutorials → /learning/tutorials, quizzes → /learning/quizzes/[id], materials → /learning/materials
      - ✅ Links to full learning path view when >5 recommendations
      - ✅ Handles loading, error, and empty states
      - ✅ Prompts users without proficiency level to take test

  - [x] 8.3 Add initial test prompt for new users
    - Display prompt to take proficiency test on first login
    - Allow users to accept or decline the prompt
    - Store user preference to avoid repeated prompts
    - Provide "Take Test" button in profile for later access
    - _Requirements: FR-015 (1.1, 1.3)_
    - _Implementation: src/components/proficiency-test/ProficiencyTestPrompt.tsx integrated in src/app/(main)/dashboard/page.tsx_
    - _Note: ✅ Fully integrated - Shows on first dashboard visit for users without proficiency_level, uses localStorage to prevent repeated prompts_

- [ ] 9. Implement LearningContext updates
  - [ ] 9.1 Extend LearningContext with proficiency test state
    - Add proficiency level state to context
    - Add current test and test attempt state
    - Add learning path state
    - _Requirements: FR-015 (1.4), FR-016 (2.1), FR-017 (3.3), FR-018 (4.1)_
    - _Status: NOT IMPLEMENTED - LearningContext has no proficiency test state_

  - [ ] 9.2 Add proficiency test methods to context
    - Implement startTest() method
    - Implement submitAnswer() method
    - Implement submitTest() method
    - Implement getTestResults() method
    - _Requirements: FR-016 (2.1, 2.4, 2.5), FR-017 (3.1, 3.5)_
    - _Status: NOT IMPLEMENTED_

  - [ ] 9.3 Add learning path methods to context
    - Implement generateLearningPath() method
    - Implement updateLearningPath() method
    - Implement getLearningRecommendations() method
    - _Requirements: FR-018 (4.1, 4.2, 4.3), FR-020 (6.1, 6.4, 6.5)_
    - _Status: NOT IMPLEMENTED_

- [ ] 10. Build role-specific learning path logic
  - [ ] 10.1 Implement deaf user path generation
    - Filter content for visual learning materials
    - Prioritize sign language-first content
    - Include deaf community-specific resources
    - _Requirements: FR-021 (7.1, 7.3)_

  - [ ] 10.2 Implement non-deaf user path generation
    - Include comparative content (sign + spoken language)
    - Add pronunciation and context explanations
    - Include hearing perspective resources
    - _Requirements: FR-021 (7.2, 7.3)_

  - [ ] 10.3 Create role indicator in learning path
    - Mark content as deaf-specific, non-deaf-specific, or universal
    - Display role indicators on learning items
    - Allow cross-role content access with clear labeling
    - _Requirements: FR-021 (7.4, 7.5)_

- [ ] 11. Implement dynamic learning path updates
  - [ ] 11.1 Create progress tracking integration
    - Connect to UC10 progress tracking system
    - Listen for tutorial completion events
    - Listen for quiz completion events
    - _Requirements: FR-020 (6.1, 6.4)_

  - [ ] 11.2 Build adaptive recommendation logic
    - Recalculate recommendations when user completes content
    - Suggest advanced content for high quiz scores
    - Recommend foundational materials for struggling topics
    - Update learning path automatically
    - _Requirements: FR-020 (6.1, 6.2, 6.3, 6.4)_

  - [ ] 11.3 Add learning path update notifications
    - Notify users when new content is recommended
    - Display "New Recommendations" badge on dashboard
    - Show what triggered the update (e.g., "Based on your recent quiz score")
    - _Requirements: FR-020 (6.5)_

- [ ] 12. Add error handling and validation
  - [ ] 12.1 Implement test loading error handling
    - Handle failed question loading with retry option
    - Display error message and redirect to test selection
    - Log errors for administrative review
    - _Requirements: FR-024 (9.1, 9.4, 9.5)_

  - [ ] 12.2 Add test submission error handling
    - Implement auto-save for answers during network issues
    - Auto-retry submission up to 3 times
    - Provide manual retry option if auto-retry fails
    - Preserve user progress during errors
    - _Requirements: FR-024 (9.2)_

  - [ ] 12.3 Handle learning path generation errors
    - Fallback to default recommendations if generation fails
    - Filter out unavailable content items
    - Retry path generation in background
    - Display appropriate error messages
    - _Requirements: FR-024 (9.1, 9.4)_

- [ ] 13. Implement test retake functionality
  - [ ] 13.1 Add retake capability
    - Allow users to retake tests at any time
    - Create new test attempt for each retake
    - Maintain history of all attempts
    - _Requirements: FR-023 (8.1, 8.2, 8.4)_

  - [ ] 13.2 Handle proficiency level updates
    - Update user profile if retake results in higher level
    - Regenerate learning path for new proficiency level
    - Display level progression in test history
    - _Requirements: FR-023 (8.3), FR-017 (3.3), FR-018 (4.1)_

  - [ ] 13.3 Create test history view
    - Display all test attempts with dates and scores
    - Show proficiency level progression over time
    - Add visual chart for score trends
    - _Requirements: FR-023 (8.4, 8.5)_

- [ ]* 14. Testing and quality assurance
  - [ ]* 14.1 Write unit tests
    - Test scoring algorithm with various answer combinations
    - Test proficiency level assignment logic
    - Test learning path generation algorithm
    - Test role-based content filtering
    - _Requirements: FR-017 (3.1, 3.2, 3.3), FR-018 (4.1, 4.2, 4.3), FR-021 (7.1, 7.2, 7.3)_

  - [ ]* 14.2 Write integration tests
    - Test complete test taking flow (start to results)
    - Test learning path generation after test completion
    - Test profile update with new proficiency level
    - Test dynamic path updates based on progress
    - _Requirements: FR-015 (1.1-1.5), FR-016 (2.1-2.5), FR-017 (3.1-3.5), FR-018 (4.1-4.5), FR-020 (6.1-6.5)_

  - [ ]* 14.3 Perform E2E testing
    - Test user takes proficiency test and receives results
    - Test learning path appears on dashboard
    - Test user retakes test and level updates
    - Test different paths for deaf vs non-deaf users
    - _Requirements: FR-015 (1.1-1.5), FR-016 (2.1-2.5), FR-017 (3.1-3.5), FR-018 (4.1-4.5), FR-021 (7.1-7.5), FR-023 (8.1-8.5)_
