# Error-Free and Error Handling - SignBridge

This document outlines the comprehensive error handling strategies implemented across the SignBridge application.

---

## 1. Frontend Form Validation & User Feedback

User inputs are validated before submission, and meaningful toast notifications guide users through successful operations or help them correct mistakes. This prevents invalid data from reaching the backend and improves user experience.

### Code Examples:

**Authentication - Login Validation** (`src/context/AuthContext.tsx`)
```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // Validate inputs before making API call
    if (!email || !password) {
      toast.error("Missing credentials", {
        description: "Email and password are required."
      });
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast.error("Email not verified", {
          description: "Please check your email and click the verification link.",
          action: {
            label: "Resend",
            onClick: () => resendConfirmation(email)
          }
        });
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error("Login failed", {
          description: "Invalid email or password. Please try again."
        });
      }
      return false;
    }

    toast.success("Login successful", { description: "Welcome back!" });
    return true;
  } catch (error) {
    toast.error("Login failed", {
      description: "An unexpected error occurred. Please try again."
    });
    return false;
  }
};
```

**Password Validation** (`src/context/AuthContext.tsx`)
```typescript
const changePassword = async (newPassword: string): Promise<boolean> => {
  try {
    if (!currentUser) {
      toast.error("Authentication required", {
        description: "Please log in to change your password."
      });
      return false;
    }

    // Validate password requirements
    if (newPassword.length < 6) {
      toast.error("Password too short", {
        description: "Password must be at least 6 characters long."
      });
      return false;
    }
    // ... continue with password update
  }
};
```

**Registration - Duplicate Email** (`src/context/AuthContext.tsx`)
```typescript
if (error.message.includes('User already registered')) {
  toast.error("Registration failed", {
    description: "Email is already in use. Please try a different email or login instead."
  });
}
```

---

## 2. Database Error Code Mapping

Supabase/PostgreSQL error codes are mapped to user-friendly messages. This transforms cryptic database errors into actionable feedback that helps users understand what went wrong.

### Code Examples:

**Chat Service - Error Code Handling** (`src/lib/services/chatService.ts`)
```typescript
static async sendMessage(params: {
  chat_id: string;
  sender_id: string;
  content: string;
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert(params)
    .select()
    .single();

  if (error) {
    // Map database error codes to user-friendly messages
    if (error.code === '23503') {
      throw new Error('Invalid chat or user. Please refresh and try again.');
    }
    if (error.code === '42501') {
      throw new Error('You do not have permission to send messages in this chat.');
    }
    if (error.message.includes('network')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw new Error(error.message || 'Failed to send message');
  }
  return data;
}
```

**Learning Context - Session & Permission Errors** (`src/context/LearningContext.tsx`)
```typescript
const handleError = (error: unknown, operation: string) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error && typeof error === 'object') {
    const err = error as { message?: string; code?: string };
    if (err.code) {
      switch (err.code) {
        case 'JWT_EXPIRED':
          errorMessage = 'Your session has expired. Please sign in again.';
          break;
        case 'PGRST116':
          errorMessage = 'Access denied. Please check your permissions.';
          break;
        default:
          errorMessage = `Database error: ${err.code}`;
      }
    }
  }
  
  toast.error(`Failed to ${operation}`, {
    description: errorMessage
  });
};
```

**User Service - RLS Policy Handling** (`src/lib/services/userService.ts`)
```typescript
if (error) {
  // For RLS errors or policy violations, return null instead of throwing
  if (
    error.code === '42501' || // insufficient_privilege
    error.code === 'PGRST301' || // Row level security violation
    error.message?.toLowerCase().includes('policy') ||
    error.message?.toLowerCase().includes('rls') ||
    error.message?.toLowerCase().includes('permission')
  ) {
    console.info(`RLS policy blocked access to user profile for user ${userId}, using fallback`);
    return null;
  }
}
```

---

## 3. File Upload Validation

Files are validated for size, type, and format before upload. Storage errors are caught and translated into helpful messages, preventing corrupted uploads and wasted bandwidth.

### Code Examples:

**Chat Attachments - Size Validation** (`src/lib/services/chatService.ts`)
```typescript
static async uploadFile(file: File, userId: string): Promise<string> {
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    throw new Error('File is too large. Maximum size is 10MB.');
  }
  
  const { error: uploadError } = await supabase.storage
    .from('chat_attachments')
    .upload(fileName, file);

  if (uploadError) {
    if (uploadError.message.includes('storage')) {
      throw new Error('Storage error. The file might be too large or the storage is full.');
    }
    if (uploadError.message.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    throw new Error(uploadError.message || 'Failed to upload file');
  }
}
```

**Forum Attachments - File Type Validation** (`src/lib/services/forumService.ts`)
```typescript
// Allowed MIME types for forum attachments
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Validate file type
if (!ALLOWED_FILE_TYPES.includes(file.type)) {
  throw new Error('Invalid file type. Allowed: Images (JPEG, PNG, GIF, WebP), PDF, Word, Excel, Text files.');
}
```

**Gesture Contributions - Upload with Retry** (`src/lib/supabase/gestureContributions.ts`)
```typescript
// Upload with retry logic
let uploadError = null;
const maxRetries = 3;

for (let attempt = 0; attempt <= maxRetries; attempt++) {
  const { error } = await supabase.storage
    .from('gesture-contributions')
    .upload(filePath, data.file, { contentType: data.file.type });
  
  if (!error) {
    uploadError = null;
    break;
  }
  uploadError = error;
  console.log(`Upload attempt ${attempt + 1} failed, retrying...`);
}

if (uploadError) {
  throw new Error(`File upload failed after ${maxRetries + 1} attempts: ${uploadError.message}`);
}
```

---

## 4. Authentication & Authorization Guards

All protected operations verify user authentication before execution. Unauthorized access attempts are blocked early with clear error messages, ensuring data security and proper access control.

### Code Examples:

**Gesture Contributions - Auth Check** (`src/lib/supabase/gestureContributions.ts`)
```typescript
static async submitContribution(data: GestureContributionFormData) {
  const supabase = createClient();
  try {
    const { data: userSession } = await supabase.auth.getUser();
    
    // Check authentication before any operation
    if (!userSession.user) {
      throw new Error('User not authenticated');
    }

    // Validate required fields
    if (!data.file) {
      throw new Error('Media file is required.');
    }
    
    // ... proceed with authenticated operation
  }
}
```

**Forum Service - User Verification** (`src/lib/services/forumService.ts`)
```typescript
static async createPost(post: Omit<ForumPost, 'id' | 'created_at' | 'updated_at'>): Promise<ForumPost> {
  const supabase = createClient();
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({ ...post, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating forum post:', error);
    throw error;
  }
}
```

**Delete Operation - Auth Verification** (`src/lib/supabase/gestureContributions.ts`)
```typescript
static async deleteContribution(id: string): Promise<{ error: unknown }> {
  const supabase = createClient();
  try {
    const { data: userSession } = await supabase.auth.getUser();
    if (!userSession.user) {
      throw new Error('User not authenticated for delete operation');
    }

    const { error } = await supabase
      .from('gesture_contributions')
      .delete()
      .eq('id', id);
      
    return { error };
  } catch (error) {
    console.error('Error deleting contribution:', error);
    return { error };
  }
}
```

---

## 5. Timeout & Network Resilience

Long-running operations are wrapped with timeouts to prevent infinite loading states. Network failures are handled gracefully with fallback data, ensuring the application remains responsive even under poor connectivity.

### Code Examples:

**Auth Context - Timeout Wrapper** (`src/context/AuthContext.tsx`)
```typescript
const changePassword = async (newPassword: string): Promise<boolean> => {
  // Wrap updateUser in a timeout since it can hang
  const updatePromise = supabase.auth.updateUser({
    password: newPassword
  });
  
  const timeoutPromise = new Promise<{ error: { message: string } }>((_, reject) => {
    setTimeout(() => reject(new Error('Password update timed out')), 3000);
  });
  
  let updateResult;
  try {
    updateResult = await Promise.race([updatePromise, timeoutPromise]);
  } catch {
    // If it times out, assume success (USER_UPDATED event fired)
    console.log('updateUser timed out, but USER_UPDATED fired, assuming success');
    updateResult = { error: null };
  }

  if (updateResult.error) {
    toast.error("Password change failed", {
      description: updateResult.error.message
    });
    return false;
  }

  toast.success("Password changed successfully");
  return true;
};
```

**Profile Fetch with Timeout** (`src/context/AuthContext.tsx`)
```typescript
const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Try to get user profile from database with timeout
    const profilePromise = UserService.getUserProfile(supabaseUser.id);
    const timeoutPromise = new Promise<null>((resolve) => 
      setTimeout(() => {
        console.warn('Profile fetch timeout, using fallback');
        resolve(null);
      }, 5000)
    );
    
    const profile = await Promise.race([profilePromise, timeoutPromise]);
    
    if (profile) {
      return { /* profile data */ };
    }
  } catch {
    console.info('Failed to fetch user profile from database, using fallback.');
  }
  
  // Return fallback user data from metadata
  return fallbackUser;
};
```

**Auth Initialization Timeout** (`src/context/AuthContext.tsx`)
```typescript
const initializeAuth = async () => {
  try {
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
    );
    
    const sessionPromise = supabase.auth.getSession();
    
    const { data: { session }, error } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]) as Awaited<typeof sessionPromise>;
    
    // ... handle session
  } catch (error) {
    console.error('Error initializing auth:', error);
    // On timeout or error, still allow the app to proceed
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6. Centralized Error Logging

Errors are logged with detailed context (error codes, messages, hints, stack traces) for debugging while displaying simplified messages to users. This aids development troubleshooting without exposing technical details.

### Code Examples:

**Learning Context - Detailed Error Logging** (`src/context/LearningContext.tsx`)
```typescript
const handleError = (error: unknown, operation: string) => {
  console.error(`Error in ${operation}:`, error);
  
  // Log more detailed error information
  if (error && typeof error === 'object') {
    const err = error as { message?: string; code?: string; hint?: string; details?: string; stack?: string };
    console.error('Detailed error info:', {
      message: err.message,
      code: err.code,
      hint: err.hint,
      details: err.details,
      stack: err.stack
    });
  }
  
  // Show simplified message to user
  toast.error(`Failed to ${operation}`, {
    description: errorMessage
  });
};
```

**Forum Service - Structured Error Logging** (`src/lib/services/forumService.ts`)
```typescript
if (error) {
  console.error('Error fetching forum posts:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
  throw new Error(`Failed to fetch forum posts: ${error.message}`);
}
```

**User Service - Comprehensive Error Context** (`src/lib/services/userService.ts`)
```typescript
} catch (error) {
  console.warn('Unexpected error in getUserProfile:', {
    error: error,
    userId: userId,
    errorType: typeof error,
    errorMessage: error instanceof Error ? error.message : 'Unknown error'
  });
  
  // Always return null to prevent crashes
  return null;
}
```

---

## Summary Table

| Error Type | Location | Key Technique |
|------------|----------|---------------|
| **Form Validation** | AuthContext.tsx | Input validation + actionable toast messages |
| **Database Errors** | chatService.ts, LearningContext.tsx | Error code mapping (23503, 42501, JWT_EXPIRED) |
| **File Upload** | chatService.ts, forumService.ts | Size/type validation + retry logic |
| **Authentication** | gestureContributions.ts, forumService.ts | Session verification before operations |
| **Timeout/Network** | AuthContext.tsx | Promise.race() timeout wrapper + fallback data |
| **Error Logging** | LearningContext.tsx, forumService.ts | Detailed console logs + simplified user messages |

---

## Screenshots to Capture (UI/UX Guide)

### 1. Frontend Form Validation & User Feedback

| Screenshot | URL | How to Trigger |
|------------|-----|----------------|
| Empty credentials error | `/auth/login` | Click "Sign In" without entering email/password |
| Invalid login error | `/auth/login` | Enter wrong email/password, click "Sign In" |
| Email not verified | `/auth/login` | Login with unverified email account |
| Registration duplicate email | `/auth/register` | Register with an existing email |
| Password too short | Profile page → Change Password | Enter password less than 6 characters |

### 2. Database Error Code Mapping

| Screenshot | URL | How to Trigger |
|------------|-----|----------------|
| Session expired toast | Any protected page | Wait for JWT to expire, or manually clear cookies |
| Permission denied | `/interaction/forum` | Try to post/comment without being logged in |

### 3. File Upload Validation

| Screenshot | URL | How to Trigger |
|------------|-----|----------------|
| File too large error | `/interaction/forum` → Create Post with attachment | Upload file > 10MB |
| Invalid file type | `/interaction/forum` → Create Post with attachment | Upload unsupported file type (e.g., .exe) |
| Profile picture upload error | `/profile` | Upload invalid image format |

### 4. Authentication & Authorization Guards

| Screenshot | URL | How to Trigger |
|------------|-----|----------------|
| Login required toast | `/avatar/generate` | Access page without being logged in |
| Must be logged in to comment | `/interaction/forum` | Try to comment without login |
| Admin access denied | `/avatar/admin-database` | Access as non-admin user |

### 5. Timeout & Network Resilience

| Screenshot | URL | How to Trigger |
|------------|-----|----------------|
| Loading state with timeout | `/dashboard` | Slow network or disconnect briefly |
| Password update timeout | `/profile` → Change Password | Change password (may show success even on timeout) |

### 6. Centralized Error Logging

| Screenshot | Browser DevTools | How to Trigger |
|------------|------------------|----------------|
| Console error logs | Press F12 → Console tab | Trigger any error above, check console for detailed logs |

---

## Quick Screenshot Checklist

**Easiest screenshots to capture:**

1. ✅ `/auth/login` → Empty form → Click "Sign In" → **"Missing credentials" toast**
2. ✅ `/auth/login` → Wrong password → **"Invalid email or password" toast**
3. ✅ `/auth/register` → Use existing email → **"Email already in use" toast**
4. ✅ `/interaction/forum` → Not logged in → Click "Create Post" → **"Must be logged in" toast**
5. ✅ `/avatar/generate` → Not logged in → **Redirects with "Please log in" toast**
6. ✅ `/profile` → Change Password → Short password → **"Password too short" toast**

**For code screenshots:**
- Open the file in VS Code/Kiro
- Highlight the relevant try-catch block or validation code
- Take screenshot showing both the code and line numbers
