# Execute Comprehensive Seed Data

## Overview
This document provides instructions for executing the comprehensive learning content seed data.

## Total Content
- **198 learning items** across MSL and ASL
- **66 Tutorials** (33 MSL + 33 ASL)
- **66 Materials** (33 MSL + 33 ASL)  
- **66 Quiz Sets** (33 MSL + 33 ASL)

## Execution Method

### Option 1: Using Supabase SQL Editor (Recommended)
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the entire content from `scripts/seed-comprehensive-learning-content.sql`
4. Paste into SQL Editor
5. Click "Run" to execute

### Option 2: Using Supabase CLI
```bash
npx supabase db execute --file scripts/seed-comprehensive-learning-content.sql
```

### Option 3: Using MCP (Automated - In Progress)
The data is being inserted in batches via MCP to avoid timeouts.

## Verification

After execution, verify the data was inserted:

```sql
-- Check tutorials count
SELECT language, level, recommended_for_role, COUNT(*) 
FROM tutorials 
GROUP BY language, level, recommended_for_role 
ORDER BY language, level, recommended_for_role;

-- Check materials count
SELECT language, level, recommended_for_role, COUNT(*) 
FROM materials 
GROUP BY language, level, recommended_for_role 
ORDER BY language, level, recommended_for_role;

-- Check quiz sets count
SELECT language, recommended_for_role, COUNT(*) 
FROM quiz_sets 
GROUP BY language, recommended_for_role 
ORDER BY language, recommended_for_role;

-- Total count
SELECT 
  (SELECT COUNT(*) FROM tutorials) as tutorials,
  (SELECT COUNT(*) FROM materials) as materials,
  (SELECT COUNT(*) FROM quiz_sets) as quiz_sets;
```

## Expected Results

### Tutorials by Language and Role
| Language | Level | Role | Count |
|----------|-------|------|-------|
| MSL | Beginner | deaf | 5 |
| MSL | Beginner | non-deaf | 5 |
| MSL | Beginner | all | 3 |
| MSL | Intermediate | deaf | 4 |
| MSL | Intermediate | non-deaf | 4 |
| MSL | Intermediate | all | 2 |
| MSL | Advanced | deaf | 3 |
| MSL | Advanced | non-deaf | 3 |
| MSL | Advanced | all | 2 |
| ASL | Beginner | deaf | 5 |
| ASL | Beginner | non-deaf | 5 |
| ASL | Beginner | all | 3 |
| ASL | Intermediate | deaf | 4 |
| ASL | Intermediate | non-deaf | 4 |
| ASL | Intermediate | all | 2 |
| ASL | Advanced | deaf | 3 |
| ASL | Advanced | non-deaf | 3 |
| ASL | Advanced | all | 2 |

**Total Tutorials: 66**

### Materials by Language and Role
Same distribution as tutorials: **66 total**

### Quiz Sets by Language and Role
Same distribution as tutorials: **66 total**

## Troubleshooting

### Duplicate Key Errors
If you see duplicate key errors, some content may already exist. You can either:
1. Clear existing test data first (see commented DELETE statements in SQL file)
2. Ignore the errors (data won't be duplicated)

### Timeout Errors
If the query times out:
1. Execute in smaller batches (by language, then by level)
2. Use the Supabase SQL Editor instead of CLI
3. Increase timeout settings in your Supabase project

### Permission Errors
Ensure you have proper permissions to insert data into these tables.

## Next Steps

After successful execution:
1. Test the learning path feature
2. Verify role indicators display correctly
3. Check that content is filtered by user role
4. Confirm recommendations are generated properly
