# Technical Documentation: SignBridge

This document provides a technical overview of the Sign Language Recognition project. It details the project structure, key components, and the purpose of different modules and folders.

## 1. Project Overview

This is a web application built with [Next.js](https://nextjs.org/), a React framework. It uses [TypeScript](https://www.typescriptlang.org/) for type safety and [Tailwind CSS](https://tailwindcss.com/) for styling, likely with a component library like [shadcn/ui](https://ui.shadcn.com/). The backend and database are powered by [Supabase](https://supabase.com/).

## 2. Folder Structure

The project follows a structure common for Next.js applications, with a clear separation of concerns.

```
.
├── docs/                  # Project documentation
├── public/                # Static assets (images, icons)
├── src/                   # Main source code
│   ├── app/               # Next.js App Router (routing and pages)
│   ├── components/        # Reusable React components
│   ├── context/           # React Context for global state management
│   ├── data/              # Static data for the application
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Helper functions, services, and utilities
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions, including Supabase helpers
└── supabase/              # Supabase configuration and database migrations
```

### 2.1. `src/app` - Routing and Pages

This directory uses the Next.js App Router. Each folder represents a route segment.

-   [`src/app/layout.tsx`](src/app/layout.tsx:1): The root layout that applies to all pages.
-   [`src/app/page.tsx`](src/app/page.tsx:1): The main landing page of the application.
-   **Route Groups:**
    -   ` (main) `: A route group for pages that share the main application layout (e.g., after a user logs in). It includes the dashboard, learning modules, etc.
-   **Specific Routes:**
    -   [`src/app/auth/`](src/app/auth/): Contains authentication-related pages like [`login`](src/app/auth/login/page.tsx:1) and [`reset-password`](src/app/auth/reset-password/page.tsx:1).
    -   [`src/app/proficiency-test/`](src/app/proficiency-test/): Contains pages for the proficiency testing module, including test selection, test taking interface, and results display with AI-powered analysis.

### 2.2. `src/components` - UI Components

This is a crucial folder containing all the reusable React components, organized by feature.

-   [`src/components/admin/`](src/components/admin/): Components for the admin dashboard.
-   [`src/components/chat/`](src/components/chat/): Components for the real-time chat feature.
-   [`src/components/gesture/`](src/components/gesture/): Components for viewing, submitting, and managing sign language gestures.
-   [`src/components/gesture-recognition/`](src/components/gesture-recognition/): Components for the core feature of recognizing gestures from camera input or file upload.
-   [`src/components/landing/`](src/components/landing/): Components used to build the public-facing landing page.
-   [`src/components/learning/`](src/components/learning/): Components for tutorials, quizzes, and learning materials.
-   [`src/components/proficiency-test/`](src/components/proficiency-test/): UI components for taking proficiency tests.
-   [`src/components/ui/`](src/components/ui/): General-purpose UI components like buttons, cards, dialogs, etc. These are likely from `shadcn/ui` and form the design system of the application.
-   [`src/components/user/`](src/components/user/): Components for the user-specific dashboard and profile sections.

### 2.3. `src/context` - Global State Management

This folder contains React Context providers to manage global state across the application, avoiding the need for prop drilling.

-   [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx:1): Manages user authentication state, including the user object and session information.
-   [`src/context/LanguageContext.tsx`](src/context/LanguageContext.tsx:1): Manages the currently selected sign language (e.g., ASL, MSL) for a consistent user experience.
-   [`src/context/LearningContext.tsx`](src/context/LearningContext.tsx:1): Manages comprehensive learning state including:
    - Tutorial, quiz, and material management with CRUD operations
    - Proficiency test state (current test, test attempts, proficiency level)
    - Learning path recommendations and generation
    - Progress tracking across all learning modules
    - Centralized loading states (`tutorialsLoading`, `materialsLoading`, `quizSetsLoading`, `proficiencyTestLoading`)
    - Error handling with user-friendly toast notifications
-   [`src/context/SidebarContext.tsx`](src/context/SidebarContext.tsx:1): Manages the collapsed/expanded state of the application's sidebar.

### 2.4. `src/lib` - Services and Utilities

This directory contains the core business logic and interactions with external services, particularly Supabase.

-   [`src/lib/services/`](src/lib/services/): A collection of services that encapsulate the logic for different features. Each service file (e.g., [`chatService.ts`](src/lib/services/chatService.ts:1), [`tutorialService.ts`](src/lib/services/tutorialService.ts:1), [`proficiencyTestService.ts`](src/lib/services/proficiencyTestService.ts:1), [`evaluationService.ts`](src/lib/services/evaluationService.ts:1), [`recommendationEngine.ts`](src/lib/services/recommendationEngine.ts:1)) is responsible for fetching and manipulating data for its respective domain.
-   [`src/lib/supabase/`](src/lib/supabase/): Contains functions that directly interact with Supabase tables, abstracting the database queries away from the UI components.
-   [`src/lib/utils.ts`](src/lib/utils.ts:1): A utility file for common helper functions used throughout the application (e.g., formatting dates, class name merging).

### 2.5. `src/hooks` - Custom React Hooks

This folder contains custom hooks to encapsulate and reuse stateful logic.

-   [`src/hooks/useAuth.ts`](src/hooks/useAuth.ts:1): Provides an easy way to access authentication status and user data from the `AuthContext`.
-   [`src/hooks/useCamera.ts`](src/hooks/useCamera.ts:1): Encapsulates logic for accessing and managing the device camera feed.
-   [`src/hooks/useGestureContributions.ts`](src/hooks/useGestureContributions.ts:1): Manages the state and logic for fetching and displaying gesture contributions.

### 2.6. `supabase/` - Database Management

This directory is dedicated to Supabase, containing all the necessary files for managing the database schema.

-   [`supabase/config.toml`](supabase/config.toml:1): The main configuration file for the Supabase CLI.
-   [`supabase/migrations/`](supabase/migrations/): This is a critical folder that contains all the SQL migration files. Each file represents a change to the database schema (e.g., creating a table, adding a column, setting up policies). This allows for version control of the database structure.

## 3. Core Technical Concepts

### 3.1. Authentication

Authentication is handled using Supabase Auth. The [`middleware.ts`](src/middleware.ts:1) file likely intercepts requests to protect routes, redirecting unauthenticated users from protected pages to the login page. The `AuthContext` provides the user's session data to the components.

### 3.2. Data Fetching

Data is fetched from the Supabase database. The application uses a layered approach:

1.  **UI Components:** Trigger data fetching (e.g., inside a `useEffect` or through a user action).
2.  **Service Layer (`/lib/services`):** Components call functions in the service layer. These functions contain the business logic.
3.  **Data Access Layer (`/lib/supabase`):** The service layer functions call Supabase client methods to query the database.

This separation makes the code more modular, easier to test, and simpler to maintain.

### 3.3. State Management

-   **Local State:** `useState` and `useReducer` are used for component-level state.
-   **Global State:** `useContext` is used for global state that needs to be shared across many components (e.g., user session, language preference).

### 3.4. Gesture Recognition

The gesture recognition module (in [`src/components/gesture-recognition/`](src/components/gesture-recognition/)) is the core of the application. It likely involves:
1.  Capturing video from the user's camera using the browser's MediaStream API (encapsulated in the [`useCamera`](src/hooks/useCamera.ts:1) hook).
2.  Sending the video frames or processed data to a machine learning model for inference. The model could be running in the browser (e.g., with TensorFlow.js) or on a server.
3.  Displaying the recognition results to the user.

### 3.5. Proficiency Testing & Learning Path Generation

The proficiency testing system (in [`src/app/proficiency-test/`](src/app/proficiency-test/)) evaluates user sign language skills and generates personalized learning paths:

1.  **Test Selection** ([`select/page.tsx`](src/app/proficiency-test/select/page.tsx:1)): 
    - Displays available proficiency tests fetched via `getAllProficiencyTests()`
    - Shows test cards with title, description, and "Start Test" button
    - Navigates to test taking interface when user selects a test

2.  **Test Taking** ([`[testId]/page.tsx`](src/app/proficiency-test/[testId]/page.tsx:1)): 
    - Uses `LearningContext` methods (`startTest`, `submitAnswer`, `submitTest`)
    - Initializes test attempt when user starts
    - Displays questions one at a time with progress indicator
    - Tracks user answers locally before submission
    - Submits all answers and calculates results on test completion
    - **Error Handling & Recovery**:
      - Implements retry logic with up to 3 attempts for test loading failures
      - Distinguishes between critical errors (invalid test ID, unauthorized) and transient errors (network issues)
      - Logs errors with timestamps for administrative review
      - Provides user-friendly error messages with retry options
      - Auto-saves user answers to localStorage to prevent data loss during network issues
      - Offers manual retry option after automatic retry attempts are exhausted

3.  **Scoring & Analysis**: The system calculates scores and assigns proficiency levels (Beginner/Intermediate/Advanced).

4.  **AI Evaluation**: The [`evaluationService.ts`](src/lib/services/evaluationService.ts:1) analyzes performance by category, identifies strengths (>70% correct) and weaknesses (<50% correct), and generates personalized insights.

5.  **Recommendation Engine**: The [`recommendationEngine.ts`](src/lib/services/recommendationEngine.ts:1) generates learning paths by:
    - Fetching tutorials, quizzes, and materials matching the user's proficiency level
    - Prioritizing content addressing weak areas (Priority 1)
    - Including practice quizzes (Priority 2) and reference materials (Priority 3)
    - Filtering content by user role (deaf/non-deaf) using the `recommended_for_role` field:
      - **Deaf users**: Prioritizes visual learning materials and sign language-first content
      - **Non-deaf users**: Includes comparative content with spoken language context
      - **Universal content**: Available to all users regardless of role
    - **Adaptive Difficulty Adjustment**: Uses `adjustLevelByPerformance()` to dynamically adjust content difficulty based on recent quiz scores:
      - High performance (>80%): Suggests content one level higher
      - Low performance (<50%): Suggests content one level lower
      - Average performance (50-80%): Maintains current level

6.  **Results Display** ([`results/page.tsx`](src/app/proficiency-test/results/page.tsx:1)): 
    - Uses `LearningContext.getTestResults()` to fetch comprehensive analysis
    - Shows score percentage and proficiency level badge
    - Displays category performance breakdown with visual progress bars
    - Lists strengths, weaknesses, and AI-generated insights
    - Shows top 5 personalized learning recommendations
    - Provides "Retake Test" and "View Learning Path" action buttons

7.  **Dashboard Integration**: 
    - The [`LearningPathPanel.tsx`](src/components/user/LearningPathPanel.tsx:1) component displays top 5 personalized recommendations on the user dashboard
    - The profile page ([`src/app/(main)/profile/page.tsx`](src/app/(main)/profile/page.tsx:1)) shows proficiency level with a visual progress bar indicating advancement toward the next level (Beginner→Intermediate requires 50%, Intermediate→Advanced requires 80%)

8.  **Test History** ([`history/page.tsx`](src/app/proficiency-test/history/page.tsx:1)):
    - Displays all test attempts with dates, scores, and proficiency levels
    - Shows proficiency level progression over time with visual timeline
    - Uses `getUserTestHistory()` from `proficiencyTestService.ts` to fetch attempt history
    - Includes test details (title, language) for each attempt
    - Sorted by most recent attempts first

9.  **Dynamic Learning Path Updates**: The system automatically updates learning paths based on user progress:
    - **Tutorial Completion**: When a user completes a tutorial via `markTutorialDone()`, the system triggers `updateLearningPath()` to refresh recommendations
    - **Quiz Completion**: When a user completes a quiz via `submitQuizAnswers()`, the system passes the quiz score to `updateLearningPath()` for adaptive difficulty adjustment
    - **Adaptive Feedback**: Users receive contextual toast notifications explaining why their learning path was updated (e.g., "Great job! Your learning path now includes more advanced content" for scores >80%)
    - **Progress Tracking Integration**: Seamlessly integrates with UC10 progress tracking to ensure recommendations stay current with user achievements

**State Management**: All proficiency test state and operations are centralized in [`LearningContext.tsx`](src/context/LearningContext.tsx:1), which provides:
- `proficiencyLevel`: Current user proficiency level
- `currentTest`: Active test with questions
- `testAttempt`: Current test attempt record
- `learningPath`: Personalized learning recommendations
- `hasNewRecommendations`: Flag indicating new recommendations are available
- `lastUpdateTrigger`: Message explaining what triggered the last path update
- Methods: `startTest()`, `submitAnswer()`, `submitTest()`, `getTestResults()`, `generateLearningPath()`, `updateLearningPath()`, `getLearningRecommendations()`

**Error Handling & Resilience**: The proficiency testing system implements comprehensive error handling:
- **Retry Logic**: Automatic retry with exponential backoff for network-related failures (up to 3 attempts)
- **Error Classification**: Distinguishes between critical errors (invalid test ID, unauthorized access) and recoverable errors (network issues)
- **Data Persistence**: Auto-saves user answers to localStorage to prevent data loss during submission failures
- **Fallback Mechanisms**: Provides default recommendations when personalized path generation fails
- **Background Recovery**: Automatically retries failed operations in the background without blocking user interaction
- **Administrative Logging**: Logs detailed error information (timestamp, error message, stack trace, retry count) for debugging
- **User-Friendly Feedback**: Displays clear error messages with actionable recovery options (retry buttons, redirect to test selection)

## 4. Conclusion

This project is a well-structured, modern web application that leverages the strengths of the Next.js and Supabase ecosystems. The clear separation of concerns in the folder structure makes it scalable and maintainable. The core functionalities are organized into distinct modules, from user authentication and learning materials to the complex gesture recognition system and AI-powered proficiency assessment with personalized learning path generation.