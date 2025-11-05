# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SignBridge is a sign language recognition and learning platform supporting American Sign Language (ASL) and Malaysian Sign Language (MSL). The application is built with Next.js 15 and Supabase, designed for three user roles: non-deaf users, deaf users, and administrators.

**Collaboration**: This project is a Final Year Project developed in collaboration with Dr. Anthony Chong from The Malaysian Sign Language and Deaf Studies National Organisation (MyBIM).

## Development Commands

### Running the Application
```bash
pnpm dev           # Start development server with Turbopack
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
```

### Database Management
```bash
supabase start     # Start local Supabase (optional)
supabase db push   # Apply migrations to Supabase project
supabase db reset  # Reset local database and reapply migrations
```

## Architecture Overview

### Authentication & User Management

The application uses Supabase authentication with a custom user profile system:

- **AuthContext** (`src/context/AuthContext.tsx`): Central authentication state management with `useAuth()` hook
- **User Profiles**: Stored in `user_profiles` table with role-based access control
- **User Roles**: `admin`, `deaf`, `non-deaf` - each with different permissions and UI access
- **Profile Loading**: AuthContext attempts database fetch first, falls back to Supabase user metadata if RLS policies block access

**Important**: When working with authentication, always use `useAuth()` hook. User data flows from Supabase Auth → AuthContext → Components.

### Context Providers (Global State)

The app uses React Context for state management - contexts are composed in layers:

1. **AuthContext**: Authentication and user data
2. **SidebarContext**: UI state for sidebar visibility
3. **LanguageContext**: ASL/MSL language selection (global to entire app)
4. **AdminContext**: Admin-specific state and operations
5. **LearningContext**: Learning progress tracking across tutorials/materials/quizzes

All authenticated pages are wrapped in these providers via `src/app/(main)/layout.tsx`.

### Service Layer Architecture

Business logic is organized in service classes in `src/lib/services/`:

- **userService.ts**: User profile CRUD operations
- **tutorialService.ts**: Tutorial content and progress tracking
- **materialService.ts**: Learning materials with file storage
- **quizService.ts**: Quiz management and submissions
- **forumService.ts**: Community forum operations
- **chatService.ts**: Real-time messaging
- **proficiencyTestService.ts**: Skill assessment

**Pattern**: Services use static methods and return typed data. Always import from service layer instead of writing raw Supabase queries in components.

### Supabase Client Pattern

- **Client-side**: Use `createClient()` from `src/utils/supabase/client.ts`
- **Server-side**: Use server utilities from `src/utils/supabase/server.ts`
- **Path alias**: `@/utils/supabase/client` and `@/utils/supabase/server`

Never instantiate Supabase clients directly - always use these utilities.

### Route Organization

```
src/app/
├── (main)/                    # Authenticated routes (protected by layout)
│   ├── admin/                 # Admin dashboard and controls
│   ├── avatar/                # 3D avatar generation (generate, my-avatars, admin-database)
│   ├── dashboard/             # User dashboard with progress overview
│   ├── gesture/               # Gesture contribution system (submit, browse, view)
│   ├── gesture-recognition/   # AI gesture recognition (upload, search)
│   ├── interaction/           # Community features (chat, forum)
│   ├── learning/              # Learning modules (tutorials, materials, quizzes)
│   ├── profile/               # User profile management
│   └── layout.tsx             # Auth guard + context providers
├── auth/                      # Authentication pages (login, register, callback)
└── api/                       # Next.js API routes
    ├── gesture-recognition/   # Recognition endpoints (recognize, search)
    ├── avatar/                # Avatar generation API
    └── youtube-metadata/      # YouTube video info fetching
```

**Key Pattern**: All routes under `(main)/` are automatically protected by the layout's auth check. Public routes (auth pages, landing) are outside this directory.

### Language Selection System

The **LanguageContext** provides global ASL/MSL language selection:

- Use `useLanguage()` hook to access current language and `setLanguage` function
- Language state persists across the app (not page-specific)
- Affects gesture recognition, search results, and learning content
- Type: `'ASL' | 'MSL'`

When building features that vary by language, always check the language context.

### Database Structure

Key tables (see `supabase/migrations/` for full schema):

- **user_profiles**: Extended user data beyond Supabase auth
- **tutorials**: YouTube video-based learning with progress tracking
- **materials**: File-based learning resources with Supabase Storage
- **quiz_sets** / **quiz_questions** / **quiz_submissions**: Quiz system
- **proficiency_tests** / **proficiency_test_attempts**: Skill assessments
- **gestures_asl** / **gestures_msl**: Searchable gesture databases
- **gesture_contributions**: Community-submitted gestures pending approval
- **forum_posts** / **forum_comments**: Community discussion
- **chat_conversations** / **chat_messages**: Real-time messaging
- **avatar_generations**: 3D avatar storage and metadata

**Important**: All tables use Row Level Security (RLS). When debugging "no rows returned" errors, check RLS policies first.

### Component Organization

- **`src/components/ui/`**: Shadcn/ui reusable components (Button, Card, Dialog, etc.)
- **`src/components/[feature]/`**: Feature-specific components organized by domain
- **Path alias**: Always use `@/components/...` for imports

### TypeScript Configuration

- **Path alias**: `@/*` maps to `./src/*`
- **Target**: ES2017 with strict mode enabled
- **Types**: Database types in `src/types/database.ts`

## Key Implementation Patterns

### Forms with Validation

Use React Hook Form + Zod for all forms:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  // define schema
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Toast Notifications

Use Sonner for user feedback:

```typescript
import { toast } from 'sonner';

toast.success('Title', { description: 'Message' });
toast.error('Title', { description: 'Message' });
```

### File Storage Pattern

Supabase Storage is used for images, videos, and documents:

- **Buckets**: `materials`, `avatars`, `gesture-contributions`
- **Pattern**: Upload to storage first, then store URL/path in database
- **Access**: Use Supabase client's `.storage.from('bucket-name')` API

### Real-time Features

Chat uses Supabase Realtime subscriptions:

- Subscribe to table changes with `.on('postgres_changes', ...)`
- Always clean up subscriptions in useEffect cleanup function
- Pattern in `chatService.ts` shows subscription management

### Admin Access Control

Admin features should check user role:

```typescript
const { currentUser } = useAuth();
if (currentUser?.role !== 'admin') {
  // Redirect or show access denied
}
```

AdminContext provides additional admin-specific state.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Migrations

- All migrations in `supabase/migrations/` use timestamp-based naming
- Migrations cover: schema, RLS policies, functions, triggers, and seed data
- Apply with `supabase db push` or through Supabase SQL Editor
- Never modify existing migrations - create new ones for changes

## Testing Considerations

When testing user flows:

1. **Authentication**: Test all three user roles (admin, deaf, non-deaf) as they have different access levels
2. **Language switching**: Verify ASL/MSL toggle affects appropriate features
3. **RLS policies**: If queries fail, check RLS policies match user context
4. **Real-time features**: Test chat and forum with multiple browser sessions
5. **File uploads**: Verify Supabase Storage buckets have correct permissions

## Known Patterns & Conventions

- **Error Handling**: Services log errors and return null/throw - components handle with toast messages
- **Loading States**: Use React state + conditional rendering, not global loading context
- **Styling**: Tailwind CSS classes, custom colors in config (signlang-primary, etc.)
- **Icons**: Lucide React library for all icons
- **Date Formatting**: date-fns library for date operations
- **Animations**: Framer Motion for complex animations, CSS for simple transitions
