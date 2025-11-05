# Design Document: User Account Management

## Overview

The User Account Management system provides authentication, authorization, and profile management for the SignBridge platform. Built on Supabase Auth with Next.js 15, the system implements secure email-based authentication with role-based access control (RBAC) supporting three user types: non-deaf, deaf, and admin.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Authentication Pages  │  Profile Pages  │  Protected Routes │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Context Layer (React)                      │
├─────────────────────────────────────────────────────────────┤
│              AuthContext (Global State)                      │
│  - Current User  - Session  - Role  - Auth Methods          │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                Service Layer (lib/services)                  │
├─────────────────────────────────────────────────────────────┤
│  authService.ts  │  userService.ts  │  profileService.ts    │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Layer (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│  Supabase Auth  │  PostgreSQL (user_profiles)  │  RLS       │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
Registration Flow:
User → Register Form → Validation → Supabase Auth → Email Sent → 
Email Verification → Account Activated → Login

Login Flow:
User → Login Form → Credentials → Supabase Auth → Session Created → 
Role Loaded → Dashboard Redirect

Password Reset Flow:
User → Forgot Password → Email Sent → Reset Link → New Password → 
Password Updated → Login
```

## Components and Interfaces

### 1. Authentication Pages

#### Login Page (`/auth/login`)
- **Purpose**: User authentication entry point
- **Components**:
  - Login form with email and password fields
  - "Forgot Password" link
  - "Register" link
  - Form validation with Zod
- **State Management**: Local form state with React Hook Form
- **API Integration**: Supabase Auth signInWithPassword

#### Register Page (`/auth/register`)
- **Purpose**: New user account creation
- **Components**:
  - Registration form (name, email, password, role)
  - Password strength indicator
  - Terms and conditions checkbox
  - Form validation
- **State Management**: Local form state
- **API Integration**: Supabase Auth signUp with metadata

#### Forgot Password Page (`/auth/forgot-password`)
- **Purpose**: Initiate password reset process
- **Components**:
  - Email input form
  - Success message display
- **API Integration**: Supabase Auth resetPasswordForEmail

#### Reset Password Page (`/auth/reset-password`)
- **Purpose**: Complete password reset with new password
- **Components**:
  - New password form
  - Password confirmation field
  - Password strength validation
- **API Integration**: Supabase Auth updateUser

#### Callback Page (`/auth/callback`)
- **Purpose**: Handle OAuth and email verification callbacks
- **Functionality**: Process tokens and redirect appropriately

### 2. Profile Management

#### Profile Page (`/(main)/profile`)
- **Purpose**: Display and edit user profile information
- **Components**:
  - Profile information display
  - Edit profile form
  - Change password section
  - Avatar upload (future enhancement)
- **State Management**: AuthContext + local form state
- **API Integration**: User profile service

### 3. Context Provider

#### AuthContext
```typescript
interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata: UserMetadata) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

**Responsibilities**:
- Maintain authentication state
- Provide authentication methods
- Handle session management
- Sync with Supabase Auth state changes

### 4. Middleware

#### Route Protection (`middleware.ts`)
```typescript
// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/learning',
  '/gesture-recognition',
  '/interaction',
  '/avatar',
  '/gesture'
];

// Admin-only routes
const adminRoutes = [
  '/admin'
];
```

**Functionality**:
- Intercept requests to protected routes
- Verify authentication status
- Check role-based permissions
- Redirect unauthorized users

## Data Models

### User Profile Model

```typescript
interface UserProfile {
  id: string;                    // UUID from auth.users
  name: string;                  // Full name
  email: string;                 // Email address
  role: 'non-deaf' | 'deaf' | 'admin';  // User role
  proficiency_level?: 'beginner' | 'intermediate' | 'advanced';
  avatar_url?: string;           // Profile picture URL
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

### Database Schema

**Table: `user_profiles`**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'non-deaf' CHECK (role IN ('non-deaf', 'deaf', 'admin')),
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## Error Handling

### Authentication Errors

| Error Type | User Message | Action |
|------------|--------------|--------|
| Invalid credentials | "Invalid email or password. Please try again." | Allow retry |
| Email not verified | "Please verify your email before logging in." | Show resend verification option |
| Account locked | "Your account has been locked. Please contact support." | Display support contact |
| Network error | "Connection error. Please check your internet and try again." | Allow retry |

### Validation Errors

| Field | Validation Rule | Error Message |
|-------|----------------|---------------|
| Email | Valid email format | "Please enter a valid email address" |
| Password | Min 8 characters, 1 uppercase, 1 number | "Password must be at least 8 characters with 1 uppercase and 1 number" |
| Name | Min 2 characters | "Name must be at least 2 characters" |
| Password confirmation | Matches password | "Passwords do not match" |

### Error Display Strategy

- **Inline validation**: Show errors below form fields as user types
- **Toast notifications**: Display success/error messages for actions
- **Error boundaries**: Catch and display component-level errors gracefully

## Security Considerations

### Password Security
- Minimum 8 characters
- Require uppercase, lowercase, and number
- Hash passwords using Supabase Auth (bcrypt)
- Never store plain text passwords
- Implement password reset token expiration (24 hours)

### Session Management
- Use HTTP-only cookies for session tokens
- Implement session timeout (7 days default)
- Refresh tokens automatically
- Clear all session data on logout

### Input Validation
- Client-side validation with Zod schemas
- Server-side validation in Supabase RLS policies
- Sanitize all user inputs
- Prevent SQL injection through parameterized queries

### CSRF Protection
- Next.js built-in CSRF protection
- Verify origin headers
- Use SameSite cookie attribute

## Testing Strategy

### Unit Tests
- AuthContext methods (signUp, signIn, signOut)
- Form validation logic
- Password strength validation
- Email format validation

### Integration Tests
- Complete registration flow
- Login and logout flow
- Password reset flow
- Profile update flow
- Role-based access control

### E2E Tests
- User registration journey
- Login and navigate to dashboard
- Update profile information
- Change password
- Logout and verify session cleared

### Test Data
- Create test users for each role
- Mock Supabase Auth responses
- Test with invalid inputs
- Test edge cases (expired tokens, network failures)

## Performance Considerations

### Optimization Strategies
- Cache user profile data in AuthContext
- Lazy load profile components
- Debounce form validation
- Optimize database queries with indexes

### Loading States
- Show skeleton loaders during authentication
- Display loading spinners for form submissions
- Implement optimistic UI updates for profile changes

## Future Enhancements

1. **Social Authentication**: Add Google, Facebook OAuth
2. **Two-Factor Authentication**: SMS or authenticator app
3. **Avatar Upload**: Profile picture management
4. **Account Deletion**: Self-service account removal
5. **Activity Log**: Track login history and account changes
6. **Password Policies**: Configurable complexity requirements
7. **Session Management**: View and revoke active sessions
8. **Email Preferences**: Manage notification settings
