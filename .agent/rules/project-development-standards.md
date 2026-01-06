---
trigger: always_on
---

## Documentation Research

**Always use Context7 MCP** to verify latest documentation before using any library, framework, or API to prevent outdated patterns.

## Database Schema Changes

**Never** make manual schema changes in remote Supabase Studio. **Always verify schema using Supabase MCP first.**

**Migration Workflow:**

1. Create: `npx supabase migration new <name>`
2. Write SQL with: IF EXISTS, RLS policies, indexes, comments, rollback docs
3. Push: `npx supabase db push`
4. Generate types: `npx supabase gen types typescript --linked > src/types/database.types.ts`
5. Test app: `npm run dev`
6. Commit both files

**SQL Template:**

```sql
-- Migration: [description]
-- Rollback: [SQL to undo]
CREATE TABLE IF NOT EXISTS public.table_name (...);
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "name" ON public.table_name FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX idx_name ON public.table_name(column);

Note: CLI uses npx supabase link credentials. Use --linked flag for type generation from remote DB.

## Development Workflow
Use npm run dev for active development. Only run npm run build for production prep or debugging build issues.

## Build Error Prevention
Write lint/type-safe code. Common errors to avoid:

no-unused-vars: Remove unused imports/variables or prefix with _ no-explicit-any: Use unknown, Record<string, unknown>, or proper types no-unsafe-assignment/member-access/call: Avoid any type operations

Best Practices:

Define proper TypeScript types/interfaces
Use unknown instead of any (except rest params)
Remove unused code immediately
Use type guards with unknown
Check ESLint config for project-specific rules

Good patterns:
const data: unknown = await fetch();
const typed = data as MyType;
function handler(event: React.MouseEvent) {}
const items: MyType[] = [];
```
