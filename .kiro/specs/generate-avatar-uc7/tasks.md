# Implementation Plan: Generate Avatar

- [ ] 1. Set up data models and database schema
  - Create Submission model with all required fields (id, userId, mediaUrl, mediaType, signWord, language, description, status, timestamps)
  - Implement database migration for submissions table with proper indexes
  - Define TypeScript interfaces for Submission, NewSubmission, and related types
  - _Requirements: 5.1, 5.2, 6.1, 8.4, 8.5_

- [ ] 2. Implement Avatar Repository
  - Create AvatarRepository class with CRUD operations
  - Implement create() method for new submissions
  - Implement findById() method for retrieving single submission
  - Implement findByUserId() method for user's submissions list
  - Implement findByStatus() and findAll() methods for admin queries
  - Implement updateStatus() method for approval/rejection workflow
  - _Requirements: 5.1, 5.2, 6.1, 7.1, 8.4, 8.5, 8.6_

- [ ]* 2.1 Write unit tests for Avatar Repository
  - Test submission creation with all fields
  - Test query methods return correct results
  - Test status update operations
  - _Requirements: 5.1, 5.2, 6.1, 8.4, 8.5, 8.6_

- [ ] 3. Implement Media Capture Service
  - Create MediaCaptureService class
  - Implement requestCameraAccess() using MediaDevices API
  - Implement captureImageFromStream() to capture single frame from video stream
  - Implement startVideoRecording() and stopVideoRecording() using MediaRecorder API
  - Implement createPreviewUrl() and revokePreviewUrl() for blob URL management
  - Implement stopCameraStream() for cleanup
  - Add error handling for camera permission denial and device not found
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.1 Write unit tests for Media Capture Service
  - Mock MediaDevices API and test camera access
  - Test image capture from stream
  - Test video recording lifecycle
  - Test preview URL generation and cleanup
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 4. Implement media storage functionality
  - Create media upload utility for storing images and videos
  - Implement file type validation (jpg, png, webp for images; mp4, webm for videos)
  - Implement file size validation (5MB for images, 50MB for videos)
  - Implement media compression for images (max 1920x1080)
  - Generate unique filenames and store in isolated storage
  - Return media URL after successful upload
  - _Requirements: 5.2_

- [ ] 5. Implement Avatar Service
  - Create AvatarService class coordinating submission workflow
  - Implement createSubmission() method that uploads media and persists metadata
  - Implement getUserSubmissions() method retrieving user's submissions
  - Implement getSubmissionById() method for single submission retrieval
  - Implement uploadMedia() method coordinating with storage utility
  - Add validation for required fields (signWord, language, media)
  - _Requirements: 4.4, 4.5, 5.1, 5.2, 6.1_

- [ ]* 5.1 Write unit tests for Avatar Service
  - Mock repository and storage dependencies
  - Test submission creation flow
  - Test validation logic
  - Test retrieval methods
  - _Requirements: 4.4, 4.5, 5.1, 5.2, 6.1_

- [ ] 6. Implement Admin Review Service
  - Create AdminReviewService class
  - Implement getAllSubmissions() method with optional status filtering
  - Implement approveSubmission() method updating status to 'approved'
  - Implement rejectSubmission() method updating status to 'rejected'
  - Implement getSubmissionDetails() method for review modal
  - Add admin permission validation
  - Update reviewedAt timestamp and reviewedBy field on status change
  - _Requirements: 7.1, 7.2, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ]* 6.1 Write unit tests for Admin Review Service
  - Mock repository dependency
  - Test filtering logic
  - Test status update operations
  - Test permission validation
  - _Requirements: 7.1, 7.4, 8.4, 8.5, 8.6_

- [ ] 7. Create Generate Avatar Page component
  - Create component with state management for capture mode, camera status, captured media, and form fields
  - Implement camera activation on mode selection (image/video)
  - Render live preview when camera is active
  - Implement capture button for image mode calling MediaCaptureService
  - Implement record/stop buttons for video mode
  - Display captured media preview after capture
  - Implement retake functionality that clears media and returns to live preview
  - Create form inputs for sign word (text), language (dropdown), and description (text)
  - Implement form validation displaying errors for missing required fields
  - Implement submit button calling AvatarService.createSubmission()
  - Handle submission success with redirect to My Avatars page and confirmation message
  - Add error handling for camera access failures with user-friendly messages
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.3, 5.4_

- [ ]* 7.1 Write component tests for Generate Avatar Page
  - Test camera activation on mode selection
  - Test capture button functionality
  - Test retake functionality
  - Test form validation
  - Test submission flow
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 4.4, 4.5, 5.1_

- [ ] 8. Create My Avatars Page component
  - Create component that fetches user's submissions on mount using AvatarService
  - Render list of submissions with media thumbnails
  - Display sign word, language, and description for each submission
  - Display status badge for each submission (pending/approved/rejected)
  - Implement empty state when user has no submissions
  - Add loading state while fetching submissions
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ]* 8.1 Write component tests for My Avatars Page
  - Test submission list rendering
  - Test status display
  - Test empty state
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 9. Create Admin Avatar Database Page component
  - Create component with state for submissions list, status filter, and selected submission
  - Fetch all submissions on mount using AdminReviewService
  - Implement status filter dropdown (all/pending/approved/rejected)
  - Render submissions table with user info, media thumbnail, metadata, and status
  - Implement row click to open review modal
  - Create review modal displaying full submission details
  - Add approve and reject buttons in modal calling AdminReviewService methods
  - Update submissions list after status change
  - Add loading and error states
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 9.1 Write component tests for Admin Avatar Database Page
  - Test submission list rendering
  - Test filtering functionality
  - Test review modal
  - Test approve/reject actions
  - _Requirements: 7.1, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 10. Add navigation and routing
  - Add "Generate Avatar" navigation link accessible to authenticated users
  - Create route for Generate Avatar page
  - Create route for My Avatars page
  - Create route for Admin Avatar Database page (admin-only)
  - Implement route guards for authentication and admin authorization
  - _Requirements: 1.1, 5.3, 6.1, 7.1_

- [ ] 11. Integrate components and services
  - Wire Generate Avatar Page to MediaCaptureService and AvatarService
  - Wire My Avatars Page to AvatarService
  - Wire Admin Avatar Database Page to AdminReviewService
  - Ensure proper error propagation from services to UI
  - Verify redirect flow after submission
  - Test status updates reflect in My Avatars page after admin review
  - _Requirements: 5.3, 6.1, 8.6_

- [ ]* 11.1 Write integration tests
  - Test end-to-end submission creation flow
  - Test end-to-end admin review flow
  - Verify status changes persist and display correctly
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 8.4, 8.5, 8.6_

