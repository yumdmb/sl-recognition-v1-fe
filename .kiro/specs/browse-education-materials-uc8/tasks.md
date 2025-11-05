# Implementation Plan: Browse Education Materials

## Implementation Status: 95% Complete

**Status Summary:**
- All pages implemented: tutorials, materials, quizzes
- Services: tutorialService, materialService, quizService all functional
- Progress tracking works
- Essentially complete with minor polish needed

---

- [x] 1. Set up data models and database schema
  - Create Tutorial, Quiz, QuizQuestion, QuizOption, and Material models with all required fields
  - Create UserTutorialProgress and UserQuizAttempt models for tracking
  - Implement database migrations for all tables (tutorials, quizzes, quiz_questions, quiz_options, materials, user_tutorial_progress, user_quiz_attempts, user_quiz_answers)
  - Add proper indexes for performance optimization
  - Define TypeScript interfaces for all models
  - _Requirements: 1.1, 2.5, 3.1, 4.6, 5.1_
  - _Implementation: All database tables exist with proper schema_

- [x] 2. Implement Tutorial Repository
  - Create TutorialRepository class with CRUD operations
  - Implement findAll() method to retrieve all tutorials
  - Implement findById() method for single tutorial retrieval
  - Implement findByLevel() method for filtering tutorials by proficiency level
  - Implement findWithUserProgress() method joining tutorials with user progress data
  - _Requirements: 1.1, 1.2, 1.3_
  - _Implementation: tutorialService handles all tutorial operations_

- [ ]* 2.1 Write unit tests for Tutorial Repository
  - Test tutorial retrieval methods
  - Test user progress join queries
  - _Requirements: 1.1, 1.2, 1.3_
  - _Status: Tests NOT IMPLEMENTED_

- [x] 3. Implement Quiz Repository
  - Create QuizRepository class with CRUD operations
  - Implement findAll() method to retrieve all quizzes
  - Implement findById() method including questions and options
  - Implement findWithUserAttempts() method joining quizzes with user attempt history
  - Implement saveQuizResult() method to store quiz attempts and answers
  - Implement findUserAttempts() method to retrieve user's quiz history
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.6_
  - _Implementation: quizService handles all quiz operations_

- [ ]* 3.1 Write unit tests for Quiz Repository
  - Test quiz retrieval with questions
  - Test quiz result storage
  - Test attempt history retrieval
  - _Requirements: 3.1, 4.6_
  - _Status: Tests NOT IMPLEMENTED_

- [x] 4. Implement Material Repository
  - Create MaterialRepository class with CRUD operations
  - Implement findAll() method to retrieve all materials
  - Implement findById() method for single material retrieval
  - Implement findByLevel() method for filtering by proficiency level
  - Implement findByCategory() method for category filtering
  - _Requirements: 5.1, 5.2_
  - _Implementation: materialService handles all material operations_

- [ ]* 4.1 Write unit tests for Material Repository
  - Test material retrieval methods
  - Test filtering operations
  - _Requirements: 5.1, 5.2_
  - _Status: Tests NOT IMPLEMENTED_

- [x] 5. Implement User Progress Repository
  - Create UserProgressRepository class
  - Implement updateTutorialStatus() method to update or create tutorial progress records
  - Implement getTutorialStatus() method to retrieve user's status for a tutorial
  - Implement saveQuizAttempt() method to record quiz attempts
  - Implement getUserProgress() method calculating aggregate progress metrics
  - _Requirements: 2.4, 2.5, 4.6_
  - _Implementation: Progress tracking integrated with LearningContext_

- [ ]* 5.1 Write unit tests for User Progress Repository
  - Test tutorial status updates
  - Test quiz attempt recording
  - Test progress calculation
  - _Requirements: 2.4, 2.5, 4.6_

- [ ] 6. Implement Tutorial Service
  - Create TutorialService class coordinating tutorial operations
  - Implement getTutorials() method fetching tutorials with user progress status
  - Implement getTutorialById() method retrieving single tutorial with user status
  - Implement updateTutorialStatus() method updating completion status
  - Coordinate with ProgressTrackingService for status updates
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4, 2.5_

- [ ]* 6.1 Write unit tests for Tutorial Service
  - Mock repository dependencies
  - Test tutorial fetching with progress
  - Test status update logic
  - _Requirements: 1.1, 2.4, 2.5_

- [ ] 7. Implement Quiz Service
  - Create QuizService class coordinating quiz operations
  - Implement getQuizzes() method fetching quizzes with user attempt history
  - Implement getQuizById() method retrieving quiz with all questions and options
  - Implement submitQuiz() method calculating score and saving results
  - Implement getQuizAttempts() method retrieving user's quiz history
  - Add answer validation logic comparing user answers with correct answers
  - Coordinate with ProgressTrackingService for quiz completion
  - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 7.1 Write unit tests for Quiz Service
  - Mock repository dependencies
  - Test score calculation logic
  - Test answer validation
  - Test quiz submission flow
  - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [ ] 8. Implement Material Service
  - Create MaterialService class coordinating material operations
  - Implement getMaterials() method fetching materials with optional level filter
  - Implement getMaterialById() method retrieving single material
  - Implement getDownloadUrl() method generating download URLs
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2_

- [ ]* 8.1 Write unit tests for Material Service
  - Mock repository dependencies
  - Test material fetching
  - Test download URL generation
  - _Requirements: 5.1, 6.1, 6.2_

- [ ] 9. Implement Progress Tracking Service
  - Create ProgressTrackingService class
  - Implement updateTutorialProgress() method updating tutorial status and timestamps
  - Implement updateQuizProgress() method recording quiz attempts
  - Implement getUserProgress() method calculating overall progress metrics
  - Calculate tutorial completion percentage
  - Calculate quiz completion percentage and average score
  - _Requirements: 2.5, 4.6_

- [ ]* 9.1 Write unit tests for Progress Tracking Service
  - Mock repository dependencies
  - Test progress calculation logic
  - Test status update coordination
  - _Requirements: 2.5, 4.6_

- [ ] 10. Create Tutorial List Component
  - Create component displaying list of tutorials
  - Fetch tutorials on mount using TutorialService
  - Display tutorial title, thumbnail, duration, and level for each item
  - Display completion status badge (not started/in progress/completed)
  - Implement level filter dropdown (all/beginner/intermediate/advanced)
  - Add play button for each tutorial navigating to tutorial player
  - Implement loading and error states
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ]* 10.1 Write component tests for Tutorial List
  - Test tutorial list rendering
  - Test status display
  - Test filtering functionality
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 11. Create Tutorial Player Component
  - Create component for playing tutorial videos
  - Fetch tutorial details on mount using TutorialService
  - Embed video player with tutorial video URL
  - Display tutorial title, description, and current status
  - Implement status update controls (mark as in progress, mark as complete)
  - Call TutorialService.updateTutorialStatus() when user changes status
  - Handle video playback events to auto-update status to in progress
  - Add error handling for video loading failures
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 11.1 Write component tests for Tutorial Player
  - Test video display
  - Test status update UI
  - Test completion marking
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [ ] 12. Create Quiz List Component
  - Create component displaying list of quizzes
  - Fetch quizzes with attempt history on mount using QuizService
  - Display quiz title, description, question count, and level
  - Display best score and attempt count for quizzes user has taken
  - Add start button for each quiz navigating to quiz component
  - Implement loading and error states
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 12.1 Write component tests for Quiz List
  - Test quiz list rendering
  - Test attempt history display
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 13. Create Quiz Component
  - Create component for taking quizzes
  - Fetch quiz questions on mount using QuizService
  - Display questions one at a time with multiple choice options
  - Implement answer selection for each question
  - Add next/previous navigation between questions
  - Display progress indicator showing current question number
  - Implement submit button calling QuizService.submitQuiz()
  - Display quiz results after submission (score, percentage, correct/incorrect count)
  - Show correct answers and explanations after submission
  - Display previous attempt history
  - Add loading and error states
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 13.1 Write component tests for Quiz Component
  - Test question navigation
  - Test answer selection
  - Test quiz submission
  - Test result display
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 14. Create Materials List Component
  - Create component displaying list of downloadable materials
  - Fetch materials on mount using MaterialService
  - Display material title, description, file type, and file size
  - Display level badge for each material
  - Implement level filter dropdown
  - Add download button for each material calling MaterialService.getDownloadUrl()
  - Implement browser download using generated URL
  - Add loading and error states
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3_

- [ ]* 14.1 Write component tests for Materials List
  - Test material list rendering
  - Test download functionality
  - Test filtering
  - _Requirements: 5.1, 5.2, 6.1, 6.2_

- [ ] 15. Create Learning Materials Page Component
  - Create main page component with tabbed interface
  - Implement tabs for Tutorials, Quizzes, and Materials sections
  - Render TutorialListComponent in tutorials tab
  - Render QuizListComponent in quizzes tab
  - Render MaterialsListComponent in materials tab
  - Implement tab switching functionality
  - Add page header and navigation breadcrumbs
  - _Requirements: 1.1, 3.1, 5.1, 7.1, 7.2, 7.3_

- [ ]* 15.1 Write component tests for Learning Materials Page
  - Test tab switching
  - Test component rendering in each tab
  - _Requirements: 1.1, 3.1, 5.1_

- [ ] 16. Add navigation and routing
  - Add "Learning Materials" navigation link accessible to authenticated users
  - Create route for Learning Materials page
  - Create route for Tutorial Player page with tutorial ID parameter
  - Create route for Quiz page with quiz ID parameter
  - Implement route guards for authentication
  - Add navigation from dashboard quick access panel
  - _Requirements: 1.1, 2.1, 4.1_

- [ ] 17. Integrate components and services
  - Wire Tutorial List and Player to TutorialService
  - Wire Quiz List and Component to QuizService
  - Wire Materials List to MaterialService
  - Ensure proper error propagation from services to UI
  - Verify tutorial status updates persist and display correctly
  - Verify quiz results save and display in attempt history
  - Test navigation flow between list and detail views
  - Verify progress tracking integration with dashboard (UC10)
  - _Requirements: 2.5, 4.6, 7.1, 7.2, 7.3_

- [ ]* 17.1 Write integration tests
  - Test end-to-end tutorial viewing and status update flow
  - Test end-to-end quiz taking and submission flow
  - Test material download flow
  - Verify progress updates reflect in user progress tracking
  - _Requirements: 2.5, 4.6_

