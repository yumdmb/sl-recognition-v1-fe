---
inclusion: always
---

# Project Development Standards

## Documentation Research

**Always use Context7 MCP** to verify latest documentation before using any library, framework, or API:
- Prevents using outdated/deprecated patterns
- Ensures current best practices
- Example: "Use Context7 to verify latest Supabase/Next.js/Radix UI documentation"

## Database Schema Changes

**Rule**: Never make manual schema changes in remote Supabase Studio. Always use migration workflow.

**Before Development**: Always verify the actual database schema using Supabase MCP before developing features that involve database operations. Don't assume how the schema looks - check it first.

### Required Migration Workflow

**Complete workflow**: See [docs/database-migration-guide.md](../../docs/database-migration-guide.md)

**Quick Steps:**
1. Create migration: `npx supabase migration new <snake_case_name>`
2. Write SQL with: IF EXISTS, RLS policies, indexes, comments, rollback docs
3. Test locally: `npx supabase db reset` → verify in Studio (http://127.0.0.1:54323)
4. Test app: `npm run dev` (keep `.env.local` with LOCAL keys)
5. Generate types: `npx supabase gen types typescript --local > src/types/database.types.ts`
6. Push to remote: `npx supabase db push` (no `.env.local` change needed!)
7. Commit: migration file + types file

**Required in SQL:**
```sql
-- Migration: [description]
-- Rollback: [SQL to undo]

CREATE TABLE IF NOT EXISTS public.table_name (...);
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON public.table_name FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX idx_table_column ON public.table_name(column);
COMMENT ON TABLE public.table_name IS 'description';
```

**Never:**
- Make schema changes directly in remote Studio
- Skip local testing
- Modify applied migrations
- Push without generating types
- Change `.env.local` to push migrations (CLI uses project link!)

**Environment:**
```env
# .env.local - Keep LOCAL keys during development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from_npx_supabase_status>
```

Get keys: `npx supabase status` → Copy "API URL" and "Publishable key"

**Key Point**: CLI commands (`db push`, `db pull`) use `npx supabase link` credentials, NOT `.env.local`!

## Development Workflow

**Active Development**: When actively developing features, use `npm run dev` only. Do NOT run `npm run build` unless:
- You're preparing for production deployment
- You need to test the production build specifically
- You're debugging build-specific issues

**Why**: Running `npm run build` during active development is unnecessary and slows down the workflow. The dev server provides hot reloading and faster feedback.

## Build Error Prevention

**Critical Rule**: Write code that passes linting and type checking to avoid build failures. Always follow these guidelines:

### TypeScript ESLint Rules

**Common build-breaking rules to avoid:**

1. **@typescript-eslint/no-unused-vars** - Unused variables/imports
   ```typescript
   // BAD - Will cause build error
   import { useState } from 'react';
   const unusedVar = 'test';
   
   // GOOD - Remove unused code
   // Or prefix with underscore if intentionally unused
   const _intentionallyUnused = 'test';
   ```

2. **@typescript-eslint/no-explicit-any** - Using `any` type
   ```typescript
   // BAD - Will cause build error
   function process(data: any) { }
   
   // GOOD - Use proper types
   function process(data: unknown) { }
   function process(data: Record<string, unknown>) { }
   // Or for rest args (allowed by config)
   function process(...args: any[]) { }
   ```

3. **@typescript-eslint/no-unsafe-assignment** - Unsafe type assignments
   ```typescript
   // BAD
   const data: any = fetchData();
   const value = data.something;
   
   // GOOD
   const data = fetchData() as MyType;
   const value = data.something;
   ```

4. **@typescript-eslint/no-unsafe-member-access** - Accessing properties on `any`
   ```typescript
   // BAD
   function process(obj: any) {
     return obj.property;
   }
   
   // GOOD
   function process(obj: { property: string }) {
     return obj.property;
   }
   ```

5. **@typescript-eslint/no-unsafe-call** - Calling functions with `any` type
   ```typescript
   // BAD
   const fn: any = getSomeFunction();
   fn();
   
   // GOOD
   const fn = getSomeFunction() as () => void;
   fn();
   ```

### Best Practices

**Before writing code:**
- Use Context7 MCP to verify TypeScript ESLint rules if unsure
- Check project's `eslint.config.mjs` for specific rule configurations
- Understand which rules are set to 'error' vs 'warn'

**While writing code:**
- Always define proper TypeScript types/interfaces
- Remove unused imports and variables immediately
- Use `unknown` instead of `any` when type is truly unknown
- Prefix intentionally unused variables with underscore: `_unused`
- Use type assertions carefully: `as Type` only when necessary
- Leverage TypeScript's type inference when possible

**Common patterns to avoid:**
```typescript
// Avoid these patterns
const data: any = await fetch();
let result: any;
function handler(event: any) { }
const items: any[] = [];

// Use these instead
const data: unknown = await fetch();
const data = await fetch() as MyType;
let result: MyType | undefined;
function handler(event: React.MouseEvent) { }
const items: MyType[] = [];
```

**When you must use flexible types:**
```typescript
// Use unknown and type guards
function process(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
}

// Use generic constraints
function getValue<T extends Record<string, unknown>>(obj: T, key: keyof T) {
  return obj[key];
}

// Use utility types
type Params = Record<string, string | number>;
```

**Quick check before committing:**
- No unused imports or variables
- No `any` types (except in rest parameters if needed)
- All functions have return types (or inferred correctly)
- No type assertions without good reason
- All async functions properly typed

## Task Completion Verification

**After completing any task**, you MUST provide the user by writing in md file in docs/verification-steps-docs/ folder with:

**File Naming Convention**: `[spec-name]-[task-number].md` (e.g., `generate-learning-path-uc2-1.md`, `generate-learning-path-uc2-1-1.md` for subtasks)

1. **Summary of Changes**: Brief list of what was implemented
2. **Verification Steps**: Clear, actionable steps to verify the task works correctly
3. **What to Look For**: Expected behavior and visual indicators of success
4. **How to Test**: Specific user actions to perform (e.g., "Click X button", "Navigate to Y page")

**Example Format:**
```
Task Complete: [Task Name]

Changes Made:
- Created X component
- Updated Y service
- Integrated Z feature

To Verify:
1. Start dev server: npm run dev
2. Navigate to [URL]
3. Perform [action]
4. Expected result: [what should happen]

Look for:
- [Visual indicator 1]
- [Behavior 2]
- [Data display 3]
```
