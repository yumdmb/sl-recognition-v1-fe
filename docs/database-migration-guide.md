# Database Migration Guide

> **✅ Verified**: This guide has been verified against the latest official Supabase documentation (January 2025) and follows current best practices. See [migration-guide-verification.md](./migration-guide-verification.md) for details.

## Overview

This guide explains how to create and manage database schema changes using Supabase migrations. Migrations are SQL files that track all changes to your database schema, making it easy to version control, share, and deploy database changes.

## Why Use Migrations?

✅ **Version Control** - Track all database changes in Git  
✅ **Reproducible** - Anyone can recreate your database schema  
✅ **Rollback** - Can undo changes if needed  
✅ **Team Collaboration** - Everyone gets the same schema  
✅ **CI/CD Ready** - Automated deployments  
✅ **Documentation** - Migration files document your schema evolution

## Prerequisites

- Supabase CLI installed (`npm install --save-dev supabase`)
- Docker Desktop running (for local development)
- Local Supabase initialized (`npx supabase init`) and started (`npx supabase start`)
- Project linked to remote (optional): `npx supabase link --project-ref <project-id>`

## Environment Setup

### Understanding `.env.local` Keys

**Important**: Your `.env.local` file controls which database your **Next.js app** connects to, but **NOT** which database the Supabase CLI commands use.

#### For Local Development (Recommended)

Keep your `.env.local` pointing to **local Supabase** during development:

```env
# .env.local - Use LOCAL keys for development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get local keys:**

1. Start local Supabase:
   ```bash
   npx supabase start
   ```

2. The output will show your local keys:
   ```
   API URL: http://127.0.0.1:54321
   Anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service Role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Or check anytime with:
   ```bash
   npx supabase status
   ```

#### CLI Commands vs .env.local

**Key Point**: You do **NOT** need to change `.env.local` to push migrations to remote!

| What | Uses | Needs Remote Keys? |
|------|------|-------------------|
| `npm run dev` | `.env.local` | Only if you want app to connect to remote |
| `npx supabase db push` | CLI project link | ❌ No - uses `npx supabase link` |
| `npx supabase db pull` | CLI project link | ❌ No - uses `npx supabase link` |
| `npx supabase migration list` | CLI project link | ❌ No - uses `npx supabase link` |

**How it works:**
- When you run `npx supabase link --project-ref <project-id>`, the CLI stores your remote credentials in `.supabase/` folder
- All CLI commands (`db push`, `db pull`, etc.) use these stored credentials
- Your `.env.local` only affects your Next.js application

#### When to Use Remote Keys

Only change `.env.local` to remote keys when you want your **Next.js app** to connect to the remote database:

```env
# .env.local - Use REMOTE keys (only when testing against production)
NEXT_PUBLIC_SUPABASE_URL=https://bqzbddrrnohiymbauslp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**When to do this:**
- Testing against production data
- Debugging production issues
- Final verification before deployment

**⚠️ Warning**: Be careful when connecting your app to remote database during development - you might accidentally modify production data!

## Creating New Database Tables

### Workflow 1: Create Migration File Manually (Recommended)

This is the best approach for production-ready code with proper version control.

#### Step 1: Create Migration File

```bash
npx supabase migration new create_notifications_table
```

This creates a new file: `supabase/migrations/TIMESTAMP_create_notifications_table.sql`

#### Step 2: Write Your SQL

Edit the generated migration file:

```sql
-- supabase/migrations/20250616000001_create_notifications_table.sql

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS Policy: Users can update their own notifications
CREATE POLICY "Users can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS Policy: System can insert notifications
CREATE POLICY "System can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON public.notifications(read) WHERE read = false;

-- Add comment for documentation
COMMENT ON TABLE public.notifications IS 'Stores user notifications for in-app messaging';
```

#### Step 3: Test Locally

```bash
# Apply migration to local database
npx supabase db reset

# This will:
# 1. Drop the local database
# 2. Recreate it
# 3. Apply all migrations in order
# 4. Run seed data (if any)
```

#### Step 4: Verify in Supabase Studio

Open http://127.0.0.1:54323 and check:
- Table structure is correct
- RLS policies are applied
- Indexes are created

#### Step 5: Test with Your App

```bash
# Start your Next.js app
# Your .env.local should be using LOCAL keys (http://127.0.0.1:54321)
npm run dev

# Test CRUD operations on the new table
```

**Note**: Keep `.env.local` pointing to local Supabase. No need to change keys for the next step!

#### Step 6: Push to Remote Database

```bash
# Push migration to remote Supabase
npx supabase db push

# This applies all unapplied migrations to your REMOTE database
# Uses credentials from `npx supabase link`, NOT from .env.local
```

**Important**: 
- ✅ Your `.env.local` stays unchanged (still using local keys)
- ✅ The CLI automatically uses your linked remote project
- ✅ No need to switch environment variables!

#### Step 7: Commit to Git

```bash
git add supabase/migrations/20250616000001_create_notifications_table.sql
git commit -m "Add notifications table with RLS policies"
git push
```

### Workflow 2: Create in Studio, Then Pull (Easier for Beginners)

This approach is faster for prototyping but requires an extra step to capture changes.

**Environment Setup**: Keep `.env.local` with **LOCAL keys** for both options below.

#### Step 1: Create Table in Supabase Studio

**Option A: Using Local Studio (Recommended)**
1. Ensure `.env.local` uses LOCAL keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<local_key_from_supabase_status>
   ```
2. Open http://127.0.0.1:54323
3. Go to "Table Editor"
4. Click "New Table"
5. Define your table structure
6. Add RLS policies in the "Authentication" section

**Option B: Using Remote Studio (Not Recommended for Development)**
1. Keep `.env.local` with LOCAL keys (don't change it!)
2. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/<project-id>
3. Navigate to "Table Editor"
4. Create your table with columns and policies
5. Note: Changes are made directly to production database ⚠️

#### Step 2: Pull Changes into Migration File

```bash
# Pull schema changes from database
npx supabase db pull

# This creates a new migration file with your changes
# Example: supabase/migrations/20250616123456_remote_schema.sql
```

**Note**: 
- If you used **Local Studio** (Option A): Pulls from local database
- If you used **Remote Studio** (Option B): Pulls from remote database (uses CLI link, not `.env.local`)
- Your `.env.local` remains unchanged in both cases!

#### Step 3: Review and Clean Up

The generated migration file might include extra SQL. Review and clean it up:

```sql
-- Remove any unnecessary statements
-- Ensure proper formatting
-- Add comments for clarity
```

#### Step 4: Test and Commit

```bash
# Test locally
npx supabase db reset

# Commit to Git
git add supabase/migrations/
git commit -m "Add notifications table (pulled from studio)"
```

## Migration Best Practices

### 1. Use IF EXISTS/IF NOT EXISTS

Makes migrations idempotent (safe to run multiple times):

```sql
CREATE TABLE IF NOT EXISTS public.my_table (...);
DROP TABLE IF EXISTS public.old_table;
ALTER TABLE public.my_table ADD COLUMN IF NOT EXISTS new_column TEXT;
```

### 2. Always Include RLS Policies

Security should be part of your schema:

```sql
-- Enable RLS
ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "policy_name" ON public.my_table
  FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Add Indexes for Performance

```sql
-- Index foreign keys
CREATE INDEX idx_table_user_id ON public.my_table(user_id);

-- Index frequently queried columns
CREATE INDEX idx_table_status ON public.my_table(status);

-- Partial indexes for specific queries
CREATE INDEX idx_table_active ON public.my_table(status) WHERE status = 'active';
```

### 4. Use Proper Data Types

```sql
-- UUIDs for IDs
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Timestamps with timezone
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

-- Enums with CHECK constraints
status TEXT CHECK (status IN ('pending', 'approved', 'rejected'))

-- JSONB for flexible data
metadata JSONB DEFAULT '{}'::jsonb
```

### 5. Add Foreign Key Constraints

```sql
-- With cascade delete
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE

-- With set null
created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL

-- With restrict (prevent deletion)
category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT
```

### 6. One Logical Change Per Migration

```bash
# Good
npx supabase migration new add_notifications_table
npx supabase migration new add_user_preferences_table

# Bad
npx supabase migration new add_multiple_tables_and_fix_policies
```

### 7. Include Rollback Strategy

Document how to undo changes:

```sql
-- Migration: Add notifications table
-- Rollback: DROP TABLE public.notifications CASCADE;

CREATE TABLE public.notifications (...);
```

### 8. Test Migrations from Scratch

```bash
# Always test with a fresh database
npx supabase db reset

# Verify everything works
npm run dev
```

## Common Migration Patterns

### Adding a New Column

```sql
-- Add column with default value
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add column with NOT NULL (requires default or backfill)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false NOT NULL;
```

### Modifying a Column

```sql
-- Change column type
ALTER TABLE public.users
ALTER COLUMN age TYPE INTEGER USING age::INTEGER;

-- Add NOT NULL constraint
ALTER TABLE public.users
ALTER COLUMN email SET NOT NULL;

-- Remove NOT NULL constraint
ALTER TABLE public.users
ALTER COLUMN phone_number DROP NOT NULL;
```

### Renaming Tables/Columns

```sql
-- Rename table
ALTER TABLE public.old_name RENAME TO new_name;

-- Rename column
ALTER TABLE public.users
RENAME COLUMN old_column TO new_column;
```

### Creating Relationships

```sql
-- One-to-many relationship
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

-- Many-to-many relationship
CREATE TABLE public.user_roles (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

### Adding Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Creating Functions

```sql
-- Function to get user's full name
CREATE OR REPLACE FUNCTION get_user_full_name(user_id UUID)
RETURNS TEXT AS $$
  SELECT name FROM public.user_profiles WHERE id = user_id;
$$ LANGUAGE sql STABLE;
```

## Managing Migrations

### List All Migrations

```bash
# Show migration status
npx supabase migration list

# Output shows:
# - Applied migrations (✓)
# - Pending migrations (-)
```

### Apply Specific Migration

```bash
# Apply pending migrations incrementally (local only)
npx supabase migration up

# Apply all unapplied migrations to remote
npx supabase db push

# Apply with additional options
npx supabase db push --include-seed  # Also push seed data
npx supabase db push --dry-run       # Preview changes without applying
```

### Reset Database

```bash
# Drop and recreate database with all migrations
npx supabase db reset

# Reset without seed data
npx supabase db reset --no-seed
```

### Generate TypeScript Types

```bash
# Generate types from local database
npx supabase gen types typescript --local > src/types/database.types.ts

# Generate types from linked remote database
npx supabase gen types typescript --linked > src/types/database.types.ts

# Generate types for specific schemas only
npx supabase gen types typescript --local --schema public,auth > src/types/database.types.ts
```

## Complete Example: Adding a Comments Feature

Let's walk through adding a complete comments feature with proper migrations.

### Step 1: Create Migration

```bash
npx supabase migration new create_comments_feature
```

### Step 2: Write Migration SQL

```sql
-- supabase/migrations/20250616000001_create_comments_feature.sql

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view comments"
  ON public.comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get comment count for a post
CREATE OR REPLACE FUNCTION get_post_comment_count(post_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.comments WHERE post_id = $1;
$$ LANGUAGE sql STABLE;

-- Comments
COMMENT ON TABLE public.comments IS 'User comments on posts with nested reply support';
COMMENT ON COLUMN public.comments.parent_id IS 'NULL for top-level comments, references parent comment for replies';
```

### Step 3: Test Locally

```bash
npx supabase db reset
```

### Step 4: Create Service Layer

```typescript
// src/lib/services/commentService.ts
import { createClient } from '@/utils/supabase/client'

export async function getPostComments(postId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:user_profiles(name, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createComment(postId: string, content: string, parentId?: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      parent_id: parentId
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

### Step 5: Push to Remote

```bash
npx supabase db push
```

### Step 6: Commit

```bash
git add supabase/migrations/20250616000001_create_comments_feature.sql
git add src/lib/services/commentService.ts
git commit -m "Add comments feature with nested replies"
```

## Troubleshooting

### Migration Failed to Apply

```bash
# Check error message
npx supabase db reset --debug

# Common issues:
# - Syntax error in SQL
# - Missing table/column referenced
# - RLS policy conflict
# - Constraint violation
```

### Migration Applied but Not Working

```bash
# Verify migration was applied
npx supabase migration list

# Check table exists
npx supabase db diff

# Regenerate types
npx supabase gen types typescript --local > src/types/database.types.ts
```

### Need to Rollback Migration

```bash
# Manual rollback (no automatic rollback in Supabase)
# 1. Create a new migration that undoes the changes
npx supabase migration new rollback_feature_name

# 2. Write SQL to undo changes
# DROP TABLE public.my_table CASCADE;

# 3. Apply the rollback migration
npx supabase db push
```

### Conflicts Between Local and Remote

```bash
# Pull remote schema into a new migration
npx supabase db pull

# Generate diff to see what changed
npx supabase db diff -f sync_remote_changes

# Review differences before applying
npx supabase db diff --schema public

# Resolve conflicts manually by editing migration files
```

### Migration History Out of Sync

If your migration history gets out of sync (e.g., manual changes on remote):

```bash
# Check migration status
npx supabase migration list

# Repair migration history by marking as applied or reverted
npx supabase migration repair <version> --status applied
npx supabase migration repair <version> --status reverted

# Example workflow:
# 1. Remove problematic local migration
rm supabase/migrations/20230103054315_problematic.sql

# 2. Mark remote migration as reverted
npx supabase migration repair 20230103054303 --status reverted

# 3. Pull fresh schema from remote
npx supabase db pull

# 4. Verify sync
npx supabase migration list
```

## Quick Reference

### Essential Commands

```bash
# Project Setup
npx supabase init                              # Initialize Supabase in project
npx supabase login                             # Authenticate with Supabase
npx supabase link --project-ref <project-id>   # Link to remote project

# Local Development
npx supabase start                             # Start local Supabase
npx supabase stop                              # Stop local Supabase
npx supabase status                            # Check service status

# Migration Management
npx supabase migration new <name>              # Create new migration
npx supabase migration list                    # List migration status
npx supabase migration up                      # Apply pending migrations (local)
npx supabase migration repair <version> --status applied  # Fix migration history

# Database Operations
npx supabase db reset                          # Reset local DB (drop + migrate + seed)
npx supabase db reset --no-seed                # Reset without seed data
npx supabase db push                           # Push migrations to remote
npx supabase db push --dry-run                 # Preview changes
npx supabase db push --include-seed            # Push with seed data
npx supabase db pull                           # Pull schema from remote
npx supabase db diff -f <name>                 # Generate migration from diff
npx supabase db diff --schema public           # View schema differences

# Type Generation
npx supabase gen types typescript --local > src/types/database.types.ts
npx supabase gen types typescript --linked > src/types/database.types.ts
npx supabase gen types typescript --local --schema public > src/types/database.types.ts

# Testing & Inspection
npx supabase test db                           # Run database tests
npx supabase inspect db locks --linked         # Check blocking queries
npx supabase inspect db bloat --linked         # Identify bloated tables
```

### Common Workflows

```bash
# Workflow 1: Create and apply migration locally
npx supabase migration new add_feature
# Edit migration file
npx supabase db reset
npm run dev  # Test your app (uses .env.local LOCAL keys)

# Workflow 2: Push to remote
npx supabase db push  # Uses CLI link, NOT .env.local
git add supabase/migrations/
git commit -m "Add feature migration"

# Workflow 3: Pull changes from remote
npx supabase db pull  # Uses CLI link, NOT .env.local
npx supabase db reset  # Apply pulled changes locally

# Workflow 4: Generate migration from Studio changes
# Make changes in Studio (local or remote)
npx supabase db diff -f capture_studio_changes
npx supabase db reset  # Test locally
npx supabase db push   # Push to remote (uses CLI link)
```

### Environment Variables Quick Guide

```bash
# Get your local keys
npx supabase status
# Copy the "Anon key" to .env.local

# Your .env.local for development (keep this throughout development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key_from_supabase_status>

# CLI commands that DON'T use .env.local (use project link instead):
npx supabase db push      # ✅ Pushes to remote, no .env.local change needed
npx supabase db pull      # ✅ Pulls from remote, no .env.local change needed
npx supabase migration list  # ✅ Checks both local and remote

# Commands that DO use .env.local:
npm run dev               # ✅ Your Next.js app connects based on .env.local
```

## Advanced Features

### Declarative Schema Management (Alternative Approach)

Instead of writing migrations manually, you can define your schema declaratively and let Supabase generate migrations:

```bash
# 1. Create schema files in supabase/schemas/
# supabase/schemas/employees.sql
create table "employees" (
  "id" integer not null,
  "name" text,
  "age" smallint not null
);

# 2. Configure in config.toml
[db.migrations]
schema_paths = [
  "./schemas/employees.sql",
  "./schemas/*.sql"
]

# 3. Generate migration from schema changes
npx supabase db diff -f add_employee_age

# 4. Apply migration
npx supabase db reset
```

### Database Testing with pgTAP

Write and run database tests to ensure schema integrity:

```bash
# Create a new test file
npx supabase test new test_users --template pgtap

# Run all tests
npx supabase test db

# Run specific test file
npx supabase test db supabase/tests/users_test.sql

# Run tests against linked database
npx supabase test db --linked
```

Example test file:
```sql
-- supabase/tests/users_test.sql
BEGIN;
SELECT plan(3);

SELECT has_table('public', 'users');
SELECT has_column('public', 'users', 'email');
SELECT col_is_unique('public', 'users', 'email');

SELECT * FROM finish();
ROLLBACK;
```

### Performance Inspection

Monitor and optimize your database:

```bash
# Find slow queries
npx supabase inspect db outliers --linked

# Check for blocking queries
npx supabase inspect db locks --linked

# Identify bloated tables
npx supabase inspect db bloat --linked

# View table statistics
npx supabase inspect db table-stats --linked

# Check index usage
npx supabase inspect db index-stats --linked
```

### Migration Squashing

Combine multiple migrations into one for cleaner history:

```bash
# Squash all migrations
npx supabase migration squash

# Squash up to specific version
npx supabase migration squash --version 20240115120000

# Original migrations are moved to supabase/migrations/branches/
```

### Database Dumps

Export your database for backups or analysis:

```bash
# Dump entire schema
npx supabase db dump --linked -f backup.sql

# Dump data only
npx supabase db dump --linked --data-only -f data.sql

# Dump roles only
npx supabase db dump --linked --role-only -f roles.sql

# Use COPY format for large datasets (faster)
npx supabase db dump --linked --data-only --use-copy -f data_copy.sql

# Exclude specific schemas
npx supabase db dump --linked --exclude=auth.* -f schema_no_auth.sql
```

### Seeding Data

Populate your database with test data:

```sql
-- supabase/seed.sql
-- This file runs automatically on `supabase start` and `supabase db reset`

INSERT INTO public.users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');

INSERT INTO public.posts (user_id, title, content) VALUES
  ((SELECT id FROM public.users WHERE email = 'alice@example.com'), 
   'First Post', 
   'Hello World!');
```

### CI/CD Integration

Automate testing in GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Database Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - name: Start Supabase
        run: supabase start
      
      - name: Run Tests
        run: supabase test db
      
      - name: Verify Types are Up-to-Date
        run: |
          supabase gen types typescript --local > types.gen.ts
          if ! git diff --exit-code types.gen.ts; then
            echo "Types are out of sync!"
            exit 1
          fi
```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Declarative Schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Design Best Practices](https://supabase.com/docs/guides/database/database-design)
- [pgTAP Testing](https://pgtap.org/)
