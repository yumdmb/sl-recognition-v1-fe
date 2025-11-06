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
- ❌ Make schema changes directly in remote Studio
- ❌ Skip local testing
- ❌ Modify applied migrations
- ❌ Push without generating types
- ❌ Change `.env.local` to push migrations (CLI uses project link!)

**Environment:**
```env
# .env.local - Keep LOCAL keys during development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from_npx_supabase_status>
```

Get keys: `npx supabase status` → Copy "API URL" and "Publishable key"

**Key Point**: CLI commands (`db push`, `db pull`) use `npx supabase link` credentials, NOT `.env.local`!
