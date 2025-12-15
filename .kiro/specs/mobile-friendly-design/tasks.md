# Implementation Plan

## Phase 1: Core Infrastructure

- [ ] 1. Enhance SidebarContext with mobile detection and persistence
  - [ ] 1.1 Update SidebarContext to include isMobile state and setMobile function
    - Add isMobile boolean to SidebarState interface
    - Add setMobile function to context type
    - Integrate with useIsMobile hook
    - _Requirements: 1.1, 10.1_
  - [ ] 1.2 Add localStorage persistence for desktop sidebar state
    - Implement saveToLocalStorage function with try-catch
    - Implement loadFromLocalStorage function with fallback defaults
    - Persist desktopExpanded state on toggle
    - Restore state on initial load
    - _Requirements: 10.2, 10.3_
  - [ ]* 1.3 Write property test for sidebar state persistence
    - **Property 15: Sidebar State Persistence**
    - **Validates: Requirements 10.2, 10.3**
  - [ ]* 1.4 Write unit tests for SidebarContext
    - Test initial state values
    - Test toggle, open, close functions
    - Test localStorage integration
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 2. Update useIsMobile hook for SSR compatibility
  - [ ] 2.1 Modify useIsMobile to return undefined initially for SSR
    - Change initial state to undefined
    - Add useEffect for client-side detection
    - Return boolean only after hydration
    - _Requirements: 1.1, 1.5_
  - [ ]* 2.2 Write unit tests for useIsMobile hook
    - Test SSR initial state
    - Test client-side detection
    - Test resize event handling
    - _Requirements: 1.1_

## Phase 2: Mobile Navigation Components

- [ ] 3. Create MobileHeader component
  - [ ] 3.1 Implement MobileHeader with hamburger menu and page title
    - Create MobileHeader.tsx in src/components
    - Add hamburger menu button (Menu icon from lucide-react)
    - Add page title display (centered)
    - Add optional back button support
    - Style with fixed positioning, h-14, z-50
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ]* 3.2 Write property test for header height consistency
    - **Property 8: Consistent Header Height**
    - **Validates: Requirements 4.3**
  - [ ]* 3.3 Write unit tests for MobileHeader
    - Test hamburger menu click handler
    - Test page title rendering
    - Test back button conditional rendering
    - _Requirements: 4.1, 4.4_

- [ ] 4. Refactor AppSidebar for mobile drawer behavior
  - [ ] 4.1 Integrate Sheet component for mobile sidebar drawer
    - Import Sheet, SheetContent, SheetTrigger from ui/sheet
    - Conditionally render Sheet on mobile, fixed sidebar on desktop
    - Add overlay backdrop (built into Sheet)
    - Set drawer width to 18rem on mobile
    - _Requirements: 1.2, 1.3_
  - [ ] 4.2 Implement auto-close on navigation item click
    - Add onClick handler to navigation items
    - Call closeSidebar before navigation
    - Ensure smooth transition
    - _Requirements: 1.4_
  - [ ]* 4.3 Write property test for navigation closes sidebar
    - **Property 2: Navigation Item Closes Sidebar**
    - **Validates: Requirements 1.4**
  - [ ]* 4.4 Write property test for mobile sidebar hidden by default
    - **Property 1: Mobile Sidebar Hidden by Default**
    - **Validates: Requirements 1.1**
  - [ ]* 4.5 Write unit tests for AppSidebar mobile behavior
    - Test Sheet rendering on mobile
    - Test fixed sidebar on desktop
    - Test close on overlay click
    - Test close on navigation click
    - _Requirements: 1.2, 1.3, 1.4_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Update Main Layout

- [ ] 6. Update main layout for mobile responsiveness
  - [ ] 6.1 Modify layout.tsx to include MobileHeader conditionally
    - Import MobileHeader component
    - Render MobileHeader only on mobile viewports
    - Pass page title and menu click handler
    - Add padding-top to content area on mobile (pt-14)
    - _Requirements: 4.1, 4.2_
  - [ ] 6.2 Update content container padding for mobile
    - Change container padding from p-6 to px-4 py-4 md:p-6
    - Ensure minimum 16px horizontal padding on mobile
    - _Requirements: 5.3_
  - [ ]* 6.3 Write property test for container padding
    - **Property 11: Container Padding Minimum**
    - **Validates: Requirements 5.3**

## Phase 4: Responsive CSS Utilities

- [ ] 7. Add mobile-first responsive utility classes
  - [ ] 7.1 Update globals.css with mobile utility classes
    - Add .touch-target class (min-h-[44px] min-w-[44px])
    - Add .mobile-grid class for responsive grids
    - Add .mobile-padding class for consistent padding
    - Add responsive typography scale
    - _Requirements: 3.1, 5.1, 5.2_
  - [ ]* 7.2 Write property test for touch target minimum size
    - **Property 5: Touch Target Minimum Size**
    - **Validates: Requirements 3.1**
  - [ ]* 7.3 Write property test for body text minimum size
    - **Property 10: Body Text Minimum Size**
    - **Validates: Requirements 5.2**

## Phase 5: Component-Level Responsive Updates

- [ ] 8. Update Dashboard components for mobile
  - [ ] 8.1 Update UserDashboard grid layout
    - Change grid-cols-1 md:grid-cols-2 pattern
    - Reduce gap on mobile (gap-4 md:gap-6)
    - Ensure cards span full width on mobile
    - _Requirements: 2.1, 2.4_
  - [ ] 8.2 Update AdminDashboard grid layout
    - Apply same responsive grid pattern
    - Ensure stats cards stack on mobile
    - _Requirements: 2.1, 2.4_
  - [ ]* 8.3 Write property test for mobile grid single column
    - **Property 3: Mobile Grid Single Column**
    - **Validates: Requirements 2.1**
  - [ ]* 8.4 Write property test for mobile card full width
    - **Property 4: Mobile Card Full Width**
    - **Validates: Requirements 2.4**

- [ ] 9. Update Profile page for mobile
  - [ ] 9.1 Make profile page responsive
    - Update grid from lg:grid-cols-3 to grid-cols-1 lg:grid-cols-3
    - Stack user info and actions cards on mobile
    - Ensure form fields are full width on mobile
    - _Requirements: 2.1, 2.4, 2.5_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: Chat Interface Mobile Optimization

- [ ] 11. Optimize ChatLayout for mobile
  - [ ] 11.1 Implement full-screen view switching for mobile chat
    - Show chat list OR message area (not both) on mobile
    - Add back button to message area header
    - Ensure smooth transitions between views
    - _Requirements: 6.1, 6.2_
  - [ ] 11.2 Update message bubble styling for mobile
    - Set max-width to 85% on mobile
    - Ensure proper padding and margins
    - _Requirements: 6.4_
  - [ ]* 11.3 Write property test for message bubble max width
    - **Property 12: Message Bubble Max Width**
    - **Validates: Requirements 6.4**
  - [ ]* 11.4 Write unit tests for ChatLayout mobile behavior
    - Test view switching between list and messages
    - Test back button functionality
    - _Requirements: 6.1, 6.2_

## Phase 7: Forum Interface Mobile Optimization

- [ ] 12. Optimize Forum components for mobile
  - [ ] 12.1 Update ForumPostCard for mobile layout
    - Ensure single column layout on mobile
    - Stack action buttons appropriately
    - Prevent horizontal overflow
    - _Requirements: 7.1, 7.2_
  - [ ] 12.2 Update comment thread indentation for mobile
    - Reduce indentation on mobile to prevent overflow
    - Use max-width constraints
    - _Requirements: 7.3_
  - [ ] 12.3 Update forum post form for mobile
    - Make form fields full width
    - Ensure touch-friendly input sizes
    - _Requirements: 7.4_
  - [ ]* 12.4 Write property test for forum post single column
    - **Property 13: Forum Post Single Column**
    - **Validates: Requirements 7.1**
  - [ ]* 12.5 Write property test for no horizontal overflow
    - **Property 14: No Horizontal Overflow**
    - **Validates: Requirements 7.2**

## Phase 8: Learning Content Mobile Optimization

- [ ] 13. Optimize Learning components for mobile
  - [ ] 13.1 Update MaterialGrid for mobile
    - Single column on mobile, 2 columns on tablet+
    - Optimize image sizes for mobile
    - _Requirements: 8.1_
  - [ ] 13.2 Update TutorialGrid for mobile
    - Responsive video player sizing
    - Maintain aspect ratio
    - _Requirements: 8.2_
  - [ ] 13.3 Update QuizGrid and quiz interface for mobile
    - Large touch targets for answer buttons
    - Full-width question display
    - _Requirements: 8.3_
  - [ ] 13.4 Update progress indicators for mobile
    - Ensure visibility on small screens
    - Appropriate sizing
    - _Requirements: 8.4_

## Phase 9: Gesture Recognition Mobile Optimization

- [ ] 14. Optimize Gesture Recognition for mobile
  - [ ] 14.1 Update camera capture for mobile
    - Full width camera feed
    - Maintain aspect ratio
    - _Requirements: 9.1_
  - [ ] 14.2 Update gesture dictionary grid for mobile
    - 1-2 column grid on mobile
    - Touch-friendly card interactions
    - _Requirements: 9.3_
  - [ ] 14.3 Update gesture upload interface for mobile
    - Mobile-friendly file selection
    - Camera capture option
    - _Requirements: 9.4_

## Phase 10: Touch Target and Spacing Updates

- [ ] 15. Update button and interactive element sizes
  - [ ] 15.1 Apply touch-target class to navigation menu items
    - Ensure 44px minimum height
    - Add adequate spacing between items (8px minimum)
    - _Requirements: 3.1, 3.2_
  - [ ] 15.2 Update action button spacing throughout app
    - Ensure 12px minimum spacing between adjacent buttons
    - Apply to card footers, form actions, etc.
    - _Requirements: 3.4_
  - [ ] 15.3 Ensure clickable cards have full-area click handlers
    - Verify card click handlers cover entire card
    - _Requirements: 3.3_
  - [ ]* 15.4 Write property test for navigation item spacing
    - **Property 6: Navigation Item Spacing**
    - **Validates: Requirements 3.2**

## Phase 11: Typography and Spacing Refinements

- [ ] 16. Update typography for mobile
  - [ ] 16.1 Apply responsive heading sizes
    - h1: text-2xl md:text-3xl (24px mobile, 30px desktop)
    - h2: text-xl md:text-2xl (20px mobile, 24px desktop)
    - h3: text-lg md:text-xl (18px mobile, 20px desktop)
    - _Requirements: 5.1_
  - [ ] 16.2 Ensure body text minimum size
    - Base font size 16px minimum
    - Input fields 16px to prevent iOS zoom
    - _Requirements: 5.2_
  - [ ] 16.3 Update section spacing for mobile
    - Reduce vertical spacing on mobile (space-y-4 md:space-y-6)
    - _Requirements: 5.4_
  - [ ]* 16.4 Write property test for mobile heading font sizes
    - **Property 9: Mobile Heading Font Sizes**
    - **Validates: Requirements 5.1**

- [ ] 17. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
