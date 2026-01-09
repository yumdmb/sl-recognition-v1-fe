# Proficiency Test Bug Fixes

## Overview

This document summarizes the bug fixes applied to the proficiency test system on January 9, 2026.

---

## Bug #1: 120% Score Issue

### Symptoms

- Test scores sometimes exceeded 100% (e.g., 120%)
- Occurred randomly, especially after network issues or retries

### Root Cause

The `submitAnswer` function used `INSERT` instead of `UPSERT`, causing duplicate answer records when:

- User clicked "Finish Test" multiple times
- Network errors triggered automatic retries
- Page was refreshed during submission

**Example:**

```
Test has 10 questions
User gets 6 correct
Network error → automatic retry
Result: 12 answer rows (6+6 correct) / 10 questions = 120%
```

### Solution

1. **Database Constraint** (`20260109090720_add_unique_constraint_attempt_answers.sql`):

   ```sql
   ALTER TABLE proficiency_test_attempt_answers
   ADD CONSTRAINT unique_attempt_question
   UNIQUE (attempt_id, question_id);
   ```

2. **Service Layer** (`proficiencyTestService.ts`):
   - Changed `INSERT` to `UPSERT` with `onConflict: 'attempt_id,question_id'`
   - Operations are now idempotent (safe to retry)

### Files Changed

- `supabase/migrations/20260109090720_add_unique_constraint_attempt_answers.sql`
- `src/lib/services/proficiencyTestService.ts` - `submitAnswer` function

---

## Bug #2: Duplicate Incomplete Test Attempts

### Symptoms

- History page showed many "Incomplete" entries for the same test
- New incomplete attempt created on every page refresh

### Root Cause

The `createTestAttempt` function always created a new attempt without checking for existing incomplete ones:

- Page refresh → new incomplete attempt
- Network retry → new incomplete attempt
- Navigating back to test → new incomplete attempt

### Solution

1. **Service Layer** (`proficiencyTestService.ts`):

   - Modified `createTestAttempt` to check for existing incomplete attempts first
   - Reuses incomplete attempt if one exists for the user+test combination
   - Only creates new attempt if no incomplete one found

2. **Database Cleanup** (`20260109093710_cleanup_duplicate_incomplete_attempts.sql`):
   - Removed existing duplicate incomplete attempts
   - Kept only the most recent incomplete attempt per user+test

### Files Changed

- `supabase/migrations/20260109093710_cleanup_duplicate_incomplete_attempts.sql`
- `src/lib/services/proficiencyTestService.ts` - `createTestAttempt` function

---

## Technical Patterns Applied

| Pattern                  | Description                                    | Benefit             |
| ------------------------ | ---------------------------------------------- | ------------------- |
| **Idempotency**          | Operations can be safely retried               | Network resilience  |
| **Database Constraints** | Unique constraint on (attempt_id, question_id) | Data integrity      |
| **Upsert**               | Insert or update existing record               | Prevents duplicates |
| **Defense in Depth**     | Multiple layers of protection                  | Robust system       |

---

## Before & After Comparison

### Score Calculation

| Scenario            | Before          | After      |
| ------------------- | --------------- | ---------- |
| Normal submission   | ✅ Correct      | ✅ Correct |
| Network retry       | ❌ 120%+ scores | ✅ Correct |
| Double-click finish | ❌ 200% scores  | ✅ Correct |

### Test Attempts

| Scenario      | Before          | After              |
| ------------- | --------------- | ------------------ |
| Start test    | New attempt     | New attempt        |
| Page refresh  | ❌ New attempt  | ✅ Reuses existing |
| Navigate back | ❌ New attempt  | ✅ Reuses existing |
| Complete test | Marked complete | Marked complete    |

---

## Related Migrations

1. `20260109090720_add_unique_constraint_attempt_answers.sql` - Unique constraint
2. `20260109093710_cleanup_duplicate_incomplete_attempts.sql` - Data cleanup
