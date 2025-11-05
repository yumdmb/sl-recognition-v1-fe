# Design Document: Access Dashboard

## Overview

The Access Dashboard system provides role-specific landing pages that serve as the central hub for user navigation and information display. Built with Next.js 15 and integrated with Supabase, the dashboard dynamically adapts its layout and content based on user roles (non-deaf, deaf, admin), displaying personalized learning progress, quick access shortcuts, and relevant statistics. The system integrates with UC10 (Track User Learning Progress) to provide real-time progress updates.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Dashboard Page  │  User Dashboard  │  Admin Dashboard      │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Context Layer (React)                      │
├─────────────────────────────────────────────────────────────┤
│  AuthContext - User Role & Profile                          │
│  LearningContext - Progress Data                            │
│  AdminContext - Admin Statistics                            │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                Service Layer (lib/services)                  │
├─────────────────────────────────────────────────────────────┤
│  dashboardService.ts  │  progressService.ts  │  statsService│
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Layer (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│  user_profiles  │  tutorial_progress  │  quiz_progress      │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Routing Flow

```
Login Success → Role Check → 
  ├─ Admin → Admin Dashboard
  └─ User (deaf/non-deaf) → User Dashboard
      ├─ Load Profile
      ├─ Load Learning Progress
      ├─ Load Quick Access Links
      └─ Render Dashboard
```

## Components and Interfaces

### 1. Dashboard Page Component

#### Dashboard Page (`/(main)/dashboard/page.tsx`)
- **Purpose**: Main dashboard entry point that routes to role-specific views
- **Components**:
  - Role detection logic
  - Conditional rendering of UserDashboard or AdminDashboard
  - Loading state while fetching user data
- **State Management**: AuthContext for user role
- **API Integration**: Fetch user profile and role

### 2. User Dashboard Component

#### UserDashboard (`/components/UserDashboard.tsx`)
- **Purpose**: Display personalized dashboard for non-deaf and deaf users
- **Components**:
  - Welcome header with user name
  - Proficiency level badge
  - Learning progress panel
  - Quick access panel
  - Recommended content section
  - Recent activity feed
- **Props**:
  ```typescript
  interface UserDashboardProps {
    user: UserProfile;
    learningProgress: LearningProgress;
    recommendedContent: LearningPathItem[];
  }
  ```
- **State Management**: LearningContext for progress data
- **API Integration**: Dashboard service for aggregated data

### 3. Admin Dashboard Component

#### AdminDashboard (`/components/AdminDashboard.tsx`)
- **Purpose**: Display system statistics and management tools for administrators
- **Components**:
  - System statistics cards (total users, pending approvals)
  - Recent activity timeline
  - Quick access panel for admin features
  - Content management shortcuts
  - User management overview
- **Props**:
  ```typescript
  interface AdminDashboardProps {
    stats: AdminStatistics;
    recentActivity: ActivityItem[];
  }
  ```
- **State Management**: AdminContext for statistics
- **API Integration**: Admin service for system metrics

### 4. Dashboard Widgets

#### Learning Progress Widget
- **Purpose**: Display tutorial and quiz completion statistics
- **Components**:
  - Progress bars for tutorials (started, in-progress, completed)
  - Quiz completion percentage
  - Average quiz score
  - Visual charts (pie chart or bar chart)
- **Data Source**: UC10 progress tracking service

#### Proficiency Level Widget
- **Purpose**: Show current proficiency level and progress
- **Components**:
  - Level badge (Beginner/Intermediate/Advanced)
  - Progress bar to next level
  - "Take Test" or "Retake Test" button
- **Data Source**: User profile proficiency_level field

#### Quick Access Widget
- **Purpose**: Provide navigation shortcuts to key features
- **Components**:
  - Grid or list of feature cards
  - Icons and labels for each feature
  - Click handlers for navigation
- **Role-Based Content**:
  - User: Recognize Gesture, Tutorials, Contribute Gesture, Search Gestures
  - Admin: User Management, Content Management, Gesture Approvals, Avatar Approvals

#### Recommended Content Widget
- **Purpose**: Display personalized learning recommendations
- **Components**:
  - List of recommended tutorials
  - Suggested quizzes
  - Downloadable materials
  - "Start" buttons for each item
- **Data Source**: Learning path from UC2

#### Admin Statistics Widget
- **Purpose**: Show system-wide metrics for administrators
- **Components**:
  - Total registered users count
  - Pending gesture contributions count
  - Pending avatar submissions count
  - Active users today count
  - Recent sign-ups list
- **Data Source**: Admin statistics service

### 5. Navigation Integration

#### App Sidebar Integration
- **Purpose**: Provide consistent navigation across all pages
- **Components**:
  - Dashboard link (highlighted when active)
  - Role-based menu items
  - User profile section
  - Logout button
- **State Management**: SidebarContext for open/closed state

## Data Models

### Dashboard Data Models

```typescript
interface DashboardData {
  user: UserProfile;
  learningProgress: LearningProgress;
  recommendedContent: LearningPathItem[];
  recentActivity: ActivityItem[];
}

interface LearningProgress {
  tutorials: {
    total: number;
    started: number;
    inProgress: number;
    completed: number;
    completionPercentage: number;
  };
  quizzes: {
    total: number;
    attempted: number;
    completed: number;
    averageScore: number;
    completionPercentage: number;
  };
  materials: {
    total: number;
    downloaded: number;
  };
}

interface AdminStatistics {
  totalUsers: number;
  activeUsersToday: number;
  pendingGestureContributions: number;
  pendingAvatarSubmissions: number;
  recentSignUps: UserProfile[];
  contentStats: {
    totalTutorials: number;
    totalQuizzes: number;
    totalMaterials: number;
    totalGestures: number;
  };
}

interface ActivityItem {
  id: string;
  type: 'tutorial_completed' | 'quiz_completed' | 'gesture_contributed' | 'level_up';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface QuickAccessItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  roles: ('non-deaf' | 'deaf' | 'admin')[];
}
```

### Database Queries

**Fetch User Dashboard Data**
```typescript
async function getUserDashboardData(userId: string): Promise<DashboardData> {
  // Fetch user profile
  const user = await getUserProfile(userId);
  
  // Fetch learning progress from UC10
  const learningProgress = await getLearningProgress(userId);
  
  // Fetch recommended content from UC2
  const recommendedContent = await getLearningRecommendations(userId);
  
  // Fetch recent activity
  const recentActivity = await getRecentActivity(userId);
  
  return {
    user,
    learningProgress,
    recommendedContent,
    recentActivity
  };
}
```

**Fetch Admin Dashboard Data**
```typescript
async function getAdminDashboardData(): Promise<AdminStatistics> {
  // Count total users
  const totalUsers = await countUsers();
  
  // Count active users today
  const activeUsersToday = await countActiveUsersToday();
  
  // Count pending approvals
  const pendingGestureContributions = await countPendingGestureContributions();
  const pendingAvatarSubmissions = await countPendingAvatarSubmissions();
  
  // Fetch recent sign-ups
  const recentSignUps = await getRecentSignUps(10);
  
  // Fetch content statistics
  const contentStats = await getContentStatistics();
  
  return {
    totalUsers,
    activeUsersToday,
    pendingGestureContributions,
    pendingAvatarSubmissions,
    recentSignUps,
    contentStats
  };
}
```

## Error Handling

### Dashboard Loading Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Failed to load dashboard | "Unable to load dashboard. Please try again." | Retry button, refresh page |
| Role not found | "Unable to determine user role. Showing default view." | Display basic dashboard, log error |
| Progress data unavailable | "Learning progress temporarily unavailable." | Show dashboard without progress widget |
| Network error | "You appear to be offline. Showing cached data." | Display cached data, auto-retry |

### Error Display Strategy

- **Toast notifications**: For transient errors (network issues)
- **Error boundaries**: Catch component-level errors
- **Fallback UI**: Display partial dashboard if some data fails to load
- **Retry mechanisms**: Auto-retry failed requests up to 3 times

## Responsive Design

### Breakpoints

```css
/* Mobile: 320px - 768px */
- Single column layout
- Stacked widgets
- Collapsed sidebar (hamburger menu)
- Simplified quick access (2 columns)

/* Tablet: 768px - 1024px */
- Two column layout
- Side-by-side widgets
- Collapsible sidebar
- Quick access grid (3 columns)

/* Desktop: 1024px+ */
- Multi-column layout
- Expanded sidebar
- Full widget display
- Quick access grid (4 columns)
```

### Layout Adaptation

```typescript
// Responsive dashboard layout
<div className="dashboard-container">
  {/* Mobile: Stack vertically */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <WelcomeWidget />
    <ProficiencyLevelWidget />
    <LearningProgressWidget />
    <QuickAccessWidget />
    <RecommendedContentWidget />
    <RecentActivityWidget />
  </div>
</div>
```

## Performance Considerations

### Optimization Strategies

1. **Data Caching**: Cache dashboard data in context for 5 minutes
2. **Lazy Loading**: Load widgets progressively as they come into view
3. **Skeleton Loaders**: Show loading skeletons while fetching data
4. **Debounced Refresh**: Prevent excessive API calls on rapid navigation
5. **Optimistic Updates**: Update UI immediately, sync with server in background

### Loading Strategy

```typescript
// Progressive dashboard loading
1. Load user profile (fast, cached)
2. Render dashboard skeleton
3. Load learning progress (parallel)
4. Load recommended content (parallel)
5. Load recent activity (parallel)
6. Render widgets as data arrives
```

## Security Considerations

### Access Control

- Verify user authentication before rendering dashboard
- Check user role before displaying admin-specific content
- Implement RLS policies to restrict data access by role
- Validate all API requests with authentication tokens

### Data Protection

- Never expose sensitive user data in client-side code
- Sanitize all user inputs before display
- Use HTTPS for all API communications
- Implement rate limiting on dashboard API endpoints

## Testing Strategy

### Unit Tests
- Test role detection logic
- Test dashboard data aggregation functions
- Test widget rendering with various data states
- Test responsive layout breakpoints

### Integration Tests
- Test complete dashboard loading flow
- Test navigation from dashboard to other pages
- Test real-time progress updates
- Test admin vs user dashboard differences

### E2E Tests
- User logs in and sees personalized dashboard
- Admin logs in and sees admin dashboard
- Dashboard updates after completing tutorial
- Quick access links navigate correctly
- Dashboard works on mobile, tablet, desktop

## Future Enhancements

1. **Customizable Widgets**: Allow users to rearrange dashboard widgets
2. **Dark Mode**: Add theme toggle for dashboard
3. **Notifications Center**: Centralized notification panel
4. **Activity Feed**: Real-time updates of platform activity
5. **Dashboard Analytics**: Track user engagement with dashboard features
6. **Personalized Greetings**: Time-based greetings (Good morning, etc.)
7. **Achievement Badges**: Display earned badges and milestones
8. **Social Features**: Show friend activity and leaderboards
