# Implementation Plan

- [x] 1. Restructure Sidebar Navigation





  - [x] 1.1 Refactor AppSidebar to use flat navigation structure


    - Update `getMenuItems` function to return flat menu items without sub-navigation
    - Remove all `subItems` arrays from menu configuration
    - Update menu item rendering to remove expandable/collapsible logic
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  - [x] 1.2 Implement role-based navigation filtering

    - Add role-based filtering for admin vs user navigation items
    - Admin sees "Manage Submissions" instead of "New Gesture Contribution"
    - Hide "Admin Settings" from sidebar for all users
    - _Requirements: 1.1, 1.3_
  - [x] 1.3 Update navigation labels and order

    - Rename "Gesture Recognition" menu items with correct labels
    - Set correct navigation order: Dashboard, Gesture Recognition, Gesture Dictionary, New Gesture Contribution, 3D Avatar Generation, Learning Materials, Forum, Chat, Profile
    - Update href paths to correct destinations
    - _Requirements: 3.1, 3.2, 3.3, 8.1, 8.2, 8.3, 8.4_
  - [ ]* 1.4 Write property test for navigation structure
    - **Property 1: Navigation Structure Consistency**
    - **Property 2: Navigation Labels Correctness**
    - **Validates: Requirements 1.1, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 8.1, 8.2, 8.3, 8.4**

- [x] 2. Update Profile Page for Role-Based Display




  - [x] 2.1 Remove proficiency level section for admin users

    - Add conditional rendering to prevent proficiency level section from rendering when user role is 'admin'
    - Ensure proficiency test buttons are also not rendered for admin
    - Use conditional: `{role !== 'admin' && <ProficiencySection />}` to completely remove from React tree
    - _Requirements: 1.2_
  - [ ]* 2.2 Write property test for role-based UI rendering
    - **Property 3: Role-Based UI Rendering**
    - **Validates: Requirements 1.2**

- [x] 3. Update Gesture Browse Page for Admin





  - [x] 3.1 Remove Add Gesture button for admin users


    - Add role check to prevent Add Gesture button from rendering for admin users
    - Use conditional: `{role !== 'admin' && <AddGestureButton />}` to remove from React tree
    - Only render for non-admin users
    - _Requirements: 1.4_
  - [x] 3.2 Update contributions display for admin


    - Change "My Contributions" label to "All Contributions" for admin
    - Remove user_id filter when admin views contributions
    - Show all user contributions instead of filtering by current user
    - _Requirements: 1.5_
  - [ ]* 3.3 Write property test for admin gesture browse restrictions
    - **Property 4: Admin Gesture Browse Restrictions**
    - **Validates: Requirements 1.4, 1.5**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Profile Edit Functionality
  - [ ] 5.1 Create Edit Profile dialog component
    - Create `EditProfileDialog` component with form fields for name
    - Add form validation using zod schema
    - Implement save functionality calling UserService
    - _Requirements: 4.1_
  - [ ] 5.2 Add profile picture upload functionality
    - Create `ProfilePictureUpload` component with image preview
    - Implement file type validation (jpg, png, gif, webp only)
    - Upload to Supabase storage and update user profile
    - _Requirements: 4.3_
  - [ ] 5.3 Update UserService with profile management methods
    - Add `updateProfile` method to update user name and avatar
    - Add `uploadAvatar` method to handle file upload to storage
    - Implement proper error handling and validation
    - _Requirements: 4.4_
  - [ ]* 5.4 Write property test for profile update round-trip
    - **Property 5: Profile Update Round-Trip**
    - **Validates: Requirements 4.4**
  - [ ]* 5.5 Write property test for file upload validation
    - **Property 7: File Upload Type Validation**
    - **Validates: Requirements 4.3**

- [ ] 6. Implement Change Password Functionality
  - [ ] 6.1 Create Change Password dialog component
    - Create `ChangePasswordDialog` component with current password, new password, and confirm fields
    - Add form validation for password requirements
    - Implement password change using Supabase Auth
    - _Requirements: 4.2_
  - [ ] 6.2 Add password validation schema
    - Implement zod schema for password validation
    - Require minimum 8 characters, uppercase, and number
    - Validate password confirmation matches
    - _Requirements: 4.2_
  - [ ]* 6.3 Write property test for password change validation
    - **Property 6: Password Change Validation**
    - **Validates: Requirements 4.2**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Fix Chat Real-Time Message Bug











  - [x] 8.1 Debug and fix message subscription


    - Review ChatLayout component's real-time subscription setup
    - Ensure new messages are added to state without page reload
    - Fix any issues with subscription callback handling
    - _Requirements: 5.1_
  - [x] 8.2 Implement proper message state updates


    - Update message list state when new message received via subscription
    - Ensure sender information is properly fetched for new messages
    - Handle edge cases like duplicate messages
    - _Requirements: 5.1_
  - [ ]* 8.3 Write property test for real-time message delivery
    - **Property 8: Real-Time Message Delivery**
    - **Validates: Requirements 5.1**

- [x] 9. Implement Unread Message Indicators




  - [x] 9.1 Add unread count tracking to ChatService


    - Implement `getUnreadCounts` method to fetch unread counts per chat
    - Add `subscribeToUnreadCounts` for real-time unread updates
    - Update message_status table queries for efficient unread counting
    - _Requirements: 5.2_
  - [x] 9.2 Create unread indicator badge component


    - Create `UnreadBadge` component with red indicator styling
    - Display count or dot based on unread message count
    - Integrate into ChatList component
    - _Requirements: 5.2_
  - [x] 9.3 Implement mark as read on chat open


    - Call markMessagesAsRead when user opens a chat
    - Update unread count state after marking as read
    - Remove indicator badge when count reaches 0
    - _Requirements: 5.3_
  - [ ]* 9.4 Write property test for unread message indicator state
    - **Property 9: Unread Message Indicator State**
    - **Validates: Requirements 5.2, 5.3**

- [x] 10. Add Chat Error Handling





  - [x] 10.1 Implement message send error handling


    - Add try-catch around message send operations
    - Display error toast when send fails
    - Add retry button for failed messages
    - _Requirements: 5.4_

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Create Forum Database Migration





  - [x] 12.1 Create migration for comment_likes table


    - Create comment_likes table with comment_id, user_id
    - Add unique constraint on (comment_id, user_id)
    - Add RLS policies for like access
    - _Requirements: 6.6_

  - [x] 12.2 Create migration for forum_attachments table


    - Create forum_attachments table with file_url, file_type, file_name
    - Add foreign keys to forum_posts and forum_comments
    - Add RLS policies for attachment access
    - _Requirements: 6.3_

- [x] 13. Fix Forum Data Fetching Bug




  - [x] 13.1 Debug and fix forum posts fetching

    - Review ForumService.getPosts implementation
    - Fix any issues with Supabase query or error handling
    - Ensure posts load correctly on page navigation
    - _Requirements: 6.1_

- [x] 14. Implement Comment Like System



  - [x] 14.1 Add like methods to ForumService


    - Implement `likeComment` method to add a like
    - Implement `unlikeComment` method to remove a like
    - Implement `getCommentLikes` to fetch like count and user's like status
    - _Requirements: 6.6_

  - [x] 14.2 Create like button component for comments

    - Create `LikeButton` component with heart icon
    - Display current like count
    - Highlight when user has liked
    - Handle like toggle (clicking again removes the like)
    - _Requirements: 6.6_
  - [ ]* 14.3 Write property test for like persistence
    - **Property 10: Comment Like Persistence and Consistency**
    - **Validates: Requirements 6.6**

- [x] 15. Implement Forum Image Attachments




  - [x] 15.1 Add attachment methods to ForumService

    - Implement `uploadAttachment` method for image upload
    - Implement `getAttachments` to fetch attachments for a post
    - Support image attachments only (jpg, png, gif, webp)
    - _Requirements: 6.3_

  - [x] 15.2 Create image upload component


    - Create `ImageAttachmentUpload` component with drag-and-drop
    - Support image file types only
    - Show upload progress and preview
    - _Requirements: 6.3_
  - [x] 15.3 Display image attachments with fixed thumbnail size


    - Render image thumbnails with fixed dimensions (max 300x200px)
    - Use object-fit: cover to maintain aspect ratio
    - Create `ImageThumbnail` component with consistent sizing
    - _Requirements: 6.4_
  - [x] 15.4 Create image modal for full-size view


    - Create `ImageModal` component for viewing full-size images
    - Open modal when user clicks on thumbnail
    - Include close button and click-outside-to-close functionality
    - _Requirements: 6.5_
  - [ ]* 15.5 Write property test for image thumbnail consistency
    - **Property 13: Image Thumbnail Consistency**
    - **Validates: Requirements 6.4, 6.5**

- [x] 16. Redesign Forum Card Layout






  - [x] 16.1 Update forum post card design

    - Show post title prominently
    - Add content preview with "Read more" expansion
    - Display author, timestamp, and comment count
    - Display image thumbnails with fixed sizing
    - _Requirements: 6.2_

  - [x] 16.2 Improve comment threading display

    - Add proper indentation for nested replies
    - Add collapse/expand functionality for threads
    - Add like button with count for each comment
    - _Requirements: 6.7_
  - [ ]* 16.3 Write property test for comment threading structure
    - **Property 11: Comment Threading Structure**
    - **Validates: Requirements 6.7**

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - Note: No test framework configured in project. Property tests are optional.

- [ ] 18. Implement Global Error Handling
  - [ ] 18.1 Create centralized error handler utility
    - Create `handleApiError` function for consistent error processing
    - Map Supabase error codes to user-friendly messages
    - Log errors for debugging
    - _Requirements: 7.1, 7.4_
  - [ ] 18.2 Add form validation error display
    - Create reusable form error display component
    - Highlight invalid fields with red border
    - Show specific error messages below fields
    - _Requirements: 7.2_
  - [ ] 18.3 Add network error handling
    - Detect network connectivity issues
    - Display retry option for failed requests
    - Show connection status indicator
    - _Requirements: 7.3_
  - [ ]* 18.4 Write property test for error handling consistency
    - **Property 12: Error Handling Consistency**
    - **Validates: Requirements 7.1, 7.2**

- [ ] 19. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
