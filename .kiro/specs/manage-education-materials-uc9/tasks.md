# Implementation Plan: Manage Education Materials

- [ ] 1. Extend LearningContext with admin methods
  - Add createTutorial() method calling TutorialService.createTutorial()
  - Add updateTutorial() method calling TutorialService.updateTutorial()
  - Add deleteTutorial() method calling TutorialService.deleteTutorial()
  - Add createQuizSet() method calling QuizService.createQuizSet()
  - Add updateQuizSet() method calling QuizService.updateQuizSet()
  - Add deleteQuizSet() method calling QuizService.deleteQuizSet()
  - Add createQuizQuestion() method calling QuizService.createQuizQuestion()
  - Add updateQuizQuestion() method calling QuizService.updateQuizQuestion()
  - Add deleteQuizQuestion() method calling QuizService.deleteQuizQuestion()
  - Add getQuizQuestions() method calling QuizService.getQuizSetWithQuestions()
  - Add createMaterial() method handling file upload and calling MaterialService.createMaterial()
  - Add updateMaterial() method handling optional file upload and calling MaterialService.updateMaterial()
  - Add deleteMaterial() method calling MaterialService.deleteMaterial()
  - Add error handling and toast notifications for all methods
  - Refresh content lists after successful operations
  - _Requirements: 2.4, 2.5, 3.4, 3.5, 4.2, 6.4, 6.5, 7.4, 7.5, 8.2, 10.4, 10.5, 11.4, 11.5, 12.2, 14.5, 14.6, 14.7, 15.5, 15.6, 16.2, 16.3_

- [ ]* 1.1 Write unit tests for LearningContext admin methods
  - Mock service dependencies
  - Test CRUD operations
  - Test error handling
  - _Requirements: 2.4, 3.4, 4.2, 6.4, 7.4, 8.2, 10.4, 11.4, 12.2, 14.6, 15.5, 16.3_

- [ ] 2. Update tutorials page to support admin mode
  - Modify existing TutorialsPage component to check admin status using useAdmin() hook
  - Add conditional rendering for admin controls (add, edit, delete buttons)
  - Implement handleAddTutorial() method opening dialog with empty tutorial
  - Implement handleEditTutorial() method opening dialog with selected tutorial data
  - Implement handleDeleteTutorial() method with confirmation dialog
  - Implement handleSaveTutorial() method with validation and calling LearningContext methods
  - Add isSaving state to prevent duplicate submissions
  - Ensure dialog doesn't close while saving
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 2.5, 2.6, 3.1, 3.3, 3.5, 3.6, 4.1, 4.3, 4.4, 17.1, 17.2, 17.3_

- [ ]* 2.1 Write component tests for tutorials admin functionality
  - Test admin controls rendering
  - Test add/edit/delete actions
  - Test dialog state management
  - _Requirements: 1.4, 2.1, 3.1, 4.1_

- [ ] 3. Create or update TutorialDialog component
  - Create dialog component with form fields for title, description, video URL, and level
  - Implement YouTube URL validation and thumbnail extraction
  - Add form validation for required fields and field lengths
  - Display validation errors inline
  - Implement controlled inputs with onTutorialChange callback
  - Add save and cancel buttons
  - Disable save button while isSaving is true
  - Show loading spinner on save button during save
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [ ]* 3.1 Write component tests for TutorialDialog
  - Test form rendering
  - Test validation logic
  - Test save/cancel actions
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

- [ ] 4. Update quizzes page to support admin mode
  - Modify existing QuizzesPage component to check admin status using useAdmin() hook
  - Add conditional rendering for admin controls (add, edit, delete, edit questions buttons)
  - Implement handleAddQuizSet() method opening dialog with empty quiz set
  - Implement handleEditQuizSet() method opening dialog with selected quiz set data
  - Implement handleDeleteQuizSet() method with confirmation dialog
  - Implement handleSaveQuizSet() method with validation and calling LearningContext methods
  - Implement handleEditQuestions() method navigating to question editor page
  - Add isSaving state to prevent duplicate submissions
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.3, 6.5, 6.6, 7.1, 7.3, 7.5, 7.6, 8.1, 8.3, 8.4, 9.1, 17.1, 17.2, 17.3_

- [ ]* 4.1 Write component tests for quizzes admin functionality
  - Test admin controls rendering
  - Test add/edit/delete actions
  - Test navigation to question editor
  - _Requirements: 5.4, 5.5, 6.1, 7.1, 8.1, 9.1_

- [ ] 5. Create or update QuizSetDialog component
  - Create dialog component with form fields for title and description
  - Add form validation for required fields and field lengths
  - Display validation errors inline
  - Implement controlled inputs with onQuizSetChange callback
  - Add save and cancel buttons
  - Disable save button while isSaving is true
  - Show loading spinner on save button during save
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ]* 5.1 Write component tests for QuizSetDialog
  - Test form rendering
  - Test validation logic
  - Test save/cancel actions
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ] 6. Create Quiz Questions Editor page
  - Create new page at /learning/quizzes/[setId]/questions
  - Fetch quiz set details and questions on mount using LearningContext
  - Display quiz set title and description as header
  - Display list of questions with question text, options, and correct answer
  - Add question number/order display
  - Implement handleAddQuestion() method opening dialog with empty question
  - Implement handleEditQuestion() method opening dialog with selected question data
  - Implement handleDeleteQuestion() method with confirmation dialog
  - Implement handleSaveQuestion() method with validation and calling LearningContext methods
  - Add back button to return to quizzes list
  - Add loading and error states
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.3, 10.5, 10.6, 11.1, 11.3, 11.5, 11.6, 12.1, 12.3, 12.4_

- [ ]* 6.1 Write component tests for Quiz Questions Editor
  - Test question list rendering
  - Test add/edit/delete actions
  - Test navigation
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 11.1, 12.1_

- [ ] 7. Create QuestionDialog component
  - Create dialog component with form fields for question text, four options (A, B, C, D), correct answer radio group, and explanation
  - Add form validation for required fields and field lengths
  - Validate that all options are unique
  - Display validation errors inline
  - Implement controlled inputs with onQuestionChange callback
  - Auto-assign order_index based on existing questions count
  - Add save and cancel buttons
  - Disable save button while isSaving is true
  - Show loading spinner on save button during save
  - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2, 11.3_

- [ ]* 7.1 Write component tests for QuestionDialog
  - Test form rendering
  - Test validation logic
  - Test option uniqueness validation
  - Test save/cancel actions
  - _Requirements: 10.1, 10.2, 10.3, 11.1, 11.2, 11.3_

- [ ] 8. Update materials page to support admin mode
  - Modify existing MaterialsPage component to check admin status using useAdmin() hook
  - Add conditional rendering for admin controls (add, edit, delete buttons)
  - Implement handleAddMaterial() method opening dialog with empty material
  - Implement handleEditMaterial() method opening dialog with selected material data
  - Implement handleDeleteMaterial() method with confirmation dialog
  - Implement handleSaveMaterial() method with file upload, validation, and calling LearningContext methods
  - Add isSaving and uploadProgress state
  - Display upload progress during file upload
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 14.1, 14.3, 14.4, 14.8, 15.1, 15.3, 15.7, 16.1, 16.5, 17.1, 17.2, 17.3_

- [ ]* 8.1 Write component tests for materials admin functionality
  - Test admin controls rendering
  - Test add/edit/delete actions
  - Test file upload handling
  - _Requirements: 13.3, 13.4, 14.1, 15.1, 16.1_

- [ ] 9. Create or update MaterialDialog component
  - Create dialog component with form fields for title, description, level, and file upload
  - Implement file input with drag-and-drop support
  - Add file type and size validation (PDF, DOC, DOCX, PPT, PPTX, max 10MB)
  - Display selected file name and size
  - Show upload progress bar during file upload
  - Add form validation for required fields and field lengths
  - Display validation errors inline
  - Implement controlled inputs with onMaterialChange callback
  - Make file upload required for new materials, optional for edits
  - Add save and cancel buttons
  - Disable save button while isSaving is true
  - Show loading spinner on save button during save
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 15.1, 15.2, 15.3_

- [ ]* 9.1 Write component tests for MaterialDialog
  - Test form rendering
  - Test file validation
  - Test save/cancel actions
  - _Requirements: 14.1, 14.2, 14.3, 15.1, 15.2, 15.3_

- [ ] 10. Add admin navigation and routing
  - Verify admin routes are protected with AdminContext checks
  - Add route for quiz questions editor at /learning/quizzes/[setId]/questions
  - Ensure existing learning routes support admin mode
  - Add admin quick access links to learning management pages
  - _Requirements: 1.1, 5.1, 9.1, 13.1_

- [ ] 11. Implement confirmation dialogs
  - Create reusable ConfirmDialog component for delete confirmations
  - Add specific warning messages for different content types
  - For quiz sets, warn about deleting all associated questions
  - For materials, warn about deleting file from storage
  - Implement in all delete operations
  - _Requirements: 4.1, 8.1, 12.1, 16.1_

- [ ]* 11.1 Write component tests for ConfirmDialog
  - Test dialog rendering
  - Test confirm/cancel actions
  - _Requirements: 4.1, 8.1, 12.1, 16.1_

- [ ] 12. Add YouTube URL utilities
  - Create utility function to extract YouTube video ID from URL
  - Create utility function to generate thumbnail URL from video ID
  - Add URL validation for YouTube links
  - Support various YouTube URL formats (youtube.com, youtu.be, with/without www)
  - Integrate into TutorialDialog component
  - _Requirements: 2.2, 3.2_

- [ ]* 12.1 Write unit tests for YouTube utilities
  - Test video ID extraction
  - Test thumbnail URL generation
  - Test URL validation
  - _Requirements: 2.2, 3.2_

- [ ] 13. Integrate and test complete admin workflow
  - Wire all components to LearningContext
  - Verify admin role checks work correctly
  - Test tutorial management end-to-end (create, edit, delete)
  - Test quiz set management end-to-end (create, edit, delete)
  - Test question management end-to-end (create, edit, delete)
  - Test material management end-to-end (create, edit, delete with file upload)
  - Verify language filtering works for all content types
  - Verify content updates immediately reflect in user-facing pages (UC8)
  - Test error handling and toast notifications
  - Verify file cleanup on material deletion
  - _Requirements: 2.5, 2.6, 3.5, 3.6, 4.3, 4.4, 6.5, 6.6, 7.5, 7.6, 8.3, 8.4, 10.5, 10.6, 11.5, 11.6, 12.3, 12.4, 14.7, 14.8, 15.6, 15.7, 16.4, 16.5, 17.1, 17.2, 17.3_

- [ ]* 13.1 Write integration tests
  - Test end-to-end tutorial management flow
  - Test end-to-end quiz and question management flow
  - Test end-to-end material management flow with file upload
  - Verify database persistence
  - Verify storage file management
  - _Requirements: 2.4, 2.5, 3.4, 3.5, 4.2, 4.3, 6.4, 6.5, 7.4, 7.5, 8.2, 8.3, 10.4, 10.5, 11.4, 11.5, 12.2, 12.3, 14.5, 14.6, 14.7, 15.4, 15.5, 15.6, 16.2, 16.3, 16.4_

