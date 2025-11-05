# Implementation Plan: Contribute New Gesture

- [ ] 1. Verify existing submission page implementation
  - Review /gesture/submit/page.tsx implementation
  - Confirm useGestureContributionSubmission hook exists and works
  - Verify all form components are functional
  - _Requirements: FR-030, FR-031; 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3_

- [ ] 2. Enhance form validation
  - [ ] 2.1 Add client-side validation
    - Validate title minimum length (2 characters)
    - Validate description minimum length (10 characters)
    - Validate language selection is required
    - Validate media type selection is required
    - Validate media file is provided before submission
    - _Requirements: FR-030; 2.3, 2.4, 2.5, 3.2, 4.2, 4.5_

  - [ ] 2.2 Add real-time validation feedback
    - Show inline error messages for invalid fields
    - Display validation errors below each field
    - Highlight invalid fields with red border
    - Clear errors when field becomes valid
    - _Requirements: FR-030; 2.3, 2.4, 2.5_

- [ ] 3. Enhance camera capture functionality
  - [ ] 3.1 Improve camera initialization
    - Add camera permission request handling
    - Display permission instructions if denied
    - Show troubleshooting steps for camera errors
    - Add retry button for failed initialization
    - _Requirements: FR-031; 6.1, 6.2, 6.3, 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 3.2 Optimize video recording
    - Implement MediaRecorder with multiple codec support
    - Add recording time limit (30 seconds)
    - Display recording timer during capture
    - Handle recording errors gracefully
    - _Requirements: FR-031; 6.5, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 3.3 Improve image capture
    - Capture high-quality still frame from video
    - Optimize image size and format (JPEG, 80% quality)
    - Stop camera feed after capture
    - Allow retake functionality
    - _Requirements: FR-031; 6.4, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 4. Enhance file upload functionality
  - [ ] 4.1 Add file validation
    - Validate file type matches media type selection
    - Check file size limits (10MB images, 50MB videos)
    - Validate file is not corrupted
    - Display specific error messages for validation failures
    - _Requirements: FR-031, FR-032; 5.1, 5.2, 5.3, 5.4, 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ] 4.2 Add upload progress indicator
    - Show progress bar during file upload
    - Display upload percentage
    - Show file size and estimated time
    - _Requirements: FR-031; 17.2_

- [ ] 5. Enhance media preview
  - [ ] 5.1 Improve preview display
    - Show full image preview for captured/uploaded images
    - Add video playback controls (play, pause, replay)
    - Display media file information (size, format, duration)
    - _Requirements: FR-031, FR-032; 5.5, 9.1, 9.2, 9.3, 9.5_

  - [ ] 5.2 Add media removal functionality
    - Display "Remove" or "Retake" button on preview
    - Clear media when remove button is clicked
    - Allow user to capture/upload new media after removal
    - Maintain form field values when media is removed
    - _Requirements: FR-032; 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 6. Implement Supabase Storage integration
  - [ ] 6.1 Set up storage buckets
    - Create "gestures" bucket in Supabase Storage
    - Configure bucket policies for authenticated uploads
    - Set up folder structure (images/, videos/)
    - _Requirements: FR-031; 12.2_

  - [ ] 6.2 Implement file upload to storage
    - Generate unique filename with timestamp and user_id
    - Upload media file to appropriate folder
    - Get public URL after upload
    - Handle upload errors and retries
    - _Requirements: FR-031; 12.2, 18.3_

- [ ] 7. Implement submission logic
  - [ ] 7.1 Create submission handler
    - Validate all form fields before submission
    - Upload media to Supabase Storage
    - Create gesture_contributions record with status='pending'
    - Store submitted_by as current user_id
    - _Requirements: FR-030, FR-031; 11.1, 12.1, 12.2, 12.3_

  - [ ] 7.2 Add submission feedback
    - Display loading indicator during submission
    - Show "Submitting..." text on submit button
    - Disable submit button during processing
    - Display success message after submission
    - Redirect to "My Contributions" page on success
    - _Requirements: FR-030; 12.4, 12.5, 17.1, 17.3, 17.4_

- [ ] 8. Build "My Contributions" view page
  - [ ] 8.1 Create view page (already exists at /gesture/view)
    - Verify page displays user's submissions
    - Show submission status badges (Pending, Approved, Rejected)
    - Display submission date and review date
    - _Requirements: FR-033; 13.1, 13.2, 13.3, 13.4_

  - [ ] 8.2 Add submission management
    - Allow users to delete pending or rejected submissions
    - Confirm deletion with dialog
    - Remove from database and storage on delete
    - _Requirements: FR-033; 13.5_

- [ ] 9. Build admin review interface
  - [ ] 9.1 Create admin submissions page
    - Display all pending submissions in table/grid
    - Show gesture word, description, language, media
    - Display submitter information
    - Add filters for status (pending, approved, rejected)
    - _Requirements: FR-034; 14.1, 14.2_

  - [ ] 9.2 Implement approval/rejection actions
    - Add "Approve" and "Reject" buttons for each submission
    - Update status to 'approved' when approved
    - Update status to 'rejected' when rejected
    - Set reviewed_by to current admin user_id
    - Set reviewed_at timestamp
    - _Requirements: FR-034; 14.3, 14.4, 14.5_

  - [ ] 9.3 Add admin notification system
    - Notify submitter when gesture is approved/rejected
    - Display notification badge for pending submissions
    - Show count of pending submissions on admin dashboard
    - _Requirements: FR-034; 14.5_

- [ ] 10. Implement RLS policies
  - [ ] 10.1 Create user access policies
    - Allow users to insert their own submissions
    - Allow users to view their own submissions
    - Allow users to delete their own pending/rejected submissions
    - _Requirements: FR-030, FR-033; 1.3, 13.2, 13.5_

  - [ ] 10.2 Create admin access policies
    - Allow admins to view all submissions
    - Allow admins to update submission status
    - Allow admins to delete any submission
    - _Requirements: FR-034; 14.1, 14.3_

- [ ] 11. Add error handling
  - [ ] 11.1 Handle camera errors
    - Display error for permission denied
    - Show error for camera not found
    - Display error for camera in use
    - Provide troubleshooting steps
    - Suggest file upload as alternative
    - _Requirements: FR-031; 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ] 11.2 Handle upload errors
    - Display error for network failures
    - Show error for storage upload failures
    - Display error for file validation failures
    - Preserve form data on error
    - Allow retry after error
    - _Requirements: FR-031; 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 11.3 Handle submission errors
    - Display specific error messages
    - Log errors for debugging
    - Provide retry button
    - Maintain form state on error
    - _Requirements: FR-030; 18.1, 18.4, 18.5_

- [ ] 12. Add loading states
  - [ ] 12.1 Implement form loading states
    - Show skeleton loader while page loads
    - Display loading spinner during submission
    - Show progress indicator during media upload
    - Disable form inputs during submission
    - _Requirements: FR-030, FR-031; 17.1, 17.2, 17.3_

  - [ ] 12.2 Add camera loading states
    - Show "Initializing camera..." message
    - Display loading spinner during camera start
    - Show "Recording..." indicator during video capture
    - _Requirements: FR-031; 6.2, 8.3_

- [ ] 13. Optimize performance
  - [ ] 13.1 Implement media optimization
    - Compress images before upload (80% quality, max 1920x1080)
    - Limit video recording duration (30 seconds)
    - Optimize video codec selection
    - _Requirements: FR-031; 5.4, 8.2_

  - [ ] 13.2 Add form data persistence
    - Save form data to sessionStorage on change
    - Restore form data on page reload
    - Clear sessionStorage after successful submission
    - _Requirements: FR-030; 18.4_

- [ ] 14. Add user guidance
  - [ ] 14.1 Create submission guidelines
    - Display tips for quality gesture submissions
    - Show example of good vs bad submissions
    - Provide gesture demonstration guidelines
    - Add link to detailed submission guide
    - _Requirements: FR-030, FR-031; 1.5_

  - [ ] 14.2 Add contextual help
    - Display helpful hints for each form field
    - Show camera positioning tips
    - Provide video recording best practices
    - Add tooltips for unclear options
    - _Requirements: FR-030, FR-031; 1.5, 4.4_

- [ ]* 15. Testing and quality assurance
  - [ ]* 15.1 Write unit tests
    - Test form validation logic
    - Test file type validation
    - Test camera initialization
    - Test media capture functions
    - _Requirements: FR-030, FR-031, FR-032; All requirements_

  - [ ]* 15.2 Write integration tests
    - Test complete submission flow via camera
    - Test complete submission flow via upload
    - Test admin approval workflow
    - Test status updates and notifications
    - _Requirements: FR-030, FR-031, FR-033, FR-034; All requirements_

  - [ ]* 15.3 Perform E2E testing
    - Test user submits gesture via camera capture
    - Test user submits gesture via file upload
    - Test admin approves submission
    - Test approved gesture appears in browse
    - Test user views submission status
    - _Requirements: FR-030, FR-031, FR-032, FR-033, FR-034; All requirements_
