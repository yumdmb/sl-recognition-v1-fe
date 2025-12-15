# Routing & Backend Architecture Analysis

## Overview

This document analyzes your Next.js App Router routing structure and Supabase backend integration patterns, comparing against best practices.

---

## Route Structure Analysis

### ✅ What's Correct

#### 1. App Router Structure
```
src/app/
├── (main)/           ✅ Route group for protected routes
├── api/              ✅ API routes in correct location
├── auth/             ✅ Auth routes properly organized
└── proficiency-test/ ✅ Feature-based routing
```

#### 2. Route Handlers Location
Your API route handlers are correctly placed:
- `src/app/api/gesture-recognition/recognize/route.ts` ✅
- `src/app/api/gesture-recognition/search/route.ts` ✅
- `src/app/api/youtube-metadata/route.ts` ✅
- `src/app/auth/callback/route.ts` ✅ (non-API route handler is valid!)

**Note:** Route handlers can be placed ANYWHERE in the `app` directory, not just in `/api`. The `/api` prefix is just a convention for REST-like endpoints.

#### 3. Dynamic Routes
- `src/app/proficiency-test/[testId]/page.tsx` ✅ Correct dynamic segment syntax

#### 4. Route Groups
- `(main)` route group correctly used for layout sharing without affecting URL

---

## Backend/Supabase Integration Analysis

### ⚠️ Issues Found

#### 1. **CRITICAL: Client-Side Supabase in Services (Module-Level Instantiation)**

**Problem:** Services create Supabase client at module level:
```typescript
// src/lib/services/userService.ts
const supabase = createClient(); // ❌ Created at module level

export class UserService {
  static async getUserProfile(userId: string) {
    // Uses module-level supabase
  }
}
```

**Why it's problematic:**
- Module-level code runs once when the module is imported
- In Next.js, this can cause issues with SSR/hydration
- The client may be created before cookies are available
- Can lead to stale auth state

**Best Practice:**
```typescript
// Option 1: Create client inside each method
export class UserService {
  static async getUserProfile(userId: string) {
    const supabase = createClient(); // ✅ Fresh client per call
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    // ...
  }
}

// Option 2: Pass client as parameter
export class UserService {
  static async getUserProfile(supabase: SupabaseClient, userId: string) {
    // ...
  }
}
```

#### 2. **Mixed Client Creation Patterns**

You have inconsistent patterns:
```typescript
// userService.ts - uses utility function
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

// proficiencyTestService.ts - creates directly
import { createBrowserClient } from '@supabase/ssr';
const supabase = createBrowserClient<Database>(...);
```

**Recommendation:** Always use your utility functions for consistency:
- `@/utils/supabase/client` for client components
- `@/utils/supabase/server` for server components/route handlers

#### 3. **No Server-Side Data Fetching in Pages**

Your pages are all `'use client'` and fetch data client-side. This misses Next.js App Router benefits:

**Current Pattern:**
```typescript
// page.tsx
'use client';
export default function Page() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
}
```

**Better Pattern (Server Component):**
```typescript
// page.tsx (no 'use client')
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('table').select('*');
  
  return <ClientComponent initialData={data} />;
}
```

**Benefits:**
- Faster initial page load (data fetched on server)
- Better SEO (content rendered server-side)
- Reduced client-side JavaScript
- No loading spinners for initial data

---

## API Routes Analysis

### ✅ Correct Patterns

#### 1. Gesture Recognition Routes
```typescript
// src/app/api/gesture-recognition/recognize/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  // ... processing
  return NextResponse.json({ ... });
}
```
- Correct use of `NextRequest` and `NextResponse`
- Proper error handling with status codes
- FormData handling for file uploads

#### 2. YouTube Metadata Route
- Proper POST handler
- Good error handling
- Returns appropriate status codes

### ⚠️ Issues in API Routes

#### 1. **No Authentication Check in API Routes**

**Current:**
```typescript
export async function POST(request: NextRequest) {
  // No auth check - anyone can call this
  const formData = await request.formData();
  // ...
}
```

**Should be:**
```typescript
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ... rest of handler
}
```

#### 2. **File System Operations in Serverless**

```typescript
// src/app/api/gesture-recognition/recognize/route.ts
await writeFile(filepath, buffer); // ❌ Won't persist in serverless
```

**Problem:** Writing to `public/uploads` won't work in serverless environments (Vercel). Files are ephemeral.

**Solution:** Use Supabase Storage instead:
```typescript
const { data, error } = await supabase.storage
  .from('uploads')
  .upload(`gestures/${filename}`, buffer);
```

#### 3. **Empty API Folder**
```
src/app/api/avatar/  # Empty - should be removed or implemented
```

---

## Recommendations Summary

### Priority 1: Fix Service Layer Client Creation

Update all services to create Supabase client inside methods:

```typescript
// src/lib/services/userService.ts
import { createClient } from '@/utils/supabase/client';

export class UserService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient(); // ✅ Inside method
    // ...
  }
}
```

**Files to update:**
- `src/lib/services/userService.ts`
- `src/lib/services/forumService.ts`
- `src/lib/services/chatService.ts`
- `src/lib/services/materialService.ts`
- `src/lib/services/quizService.ts`
- `src/lib/services/tutorialService.ts`
- `src/lib/services/proficiencyTestService.ts`

### Priority 2: Add Auth to API Routes

Add authentication checks to protected API routes.

### Priority 3: Use Supabase Storage

Replace file system operations with Supabase Storage for serverless compatibility.

### Priority 4: Consider Server Components

For pages that fetch data, consider using Server Components for better performance.

---

## What's Working Well

1. ✅ Route handler placement is correct
2. ✅ Middleware properly refreshes sessions
3. ✅ Auth callback uses server-side route handler
4. ✅ Route groups organize protected routes
5. ✅ Dynamic routes use correct syntax
6. ✅ API routes use proper Next.js patterns
7. ✅ Error handling in services is comprehensive
8. ✅ TypeScript types from database are used

---

## Quick Reference: When to Use What

| Scenario | Use |
|----------|-----|
| Client component data fetching | `createClient()` from `@/utils/supabase/client` |
| Server component data fetching | `createClient()` from `@/utils/supabase/server` |
| Route handler (API) | `createClient()` from `@/utils/supabase/server` |
| Middleware | `createServerClient()` directly (already correct) |
| Real-time subscriptions | `createClient()` from `@/utils/supabase/client` |
