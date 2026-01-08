# Testing Role-Specific Learning Path Indicators

## Overview
This guide shows you how to test the role-specific learning path feature with visual role indicators.

## 🎯 What You'll See

### Role Indicator Badges
- **Purple "Deaf" Badge**: Content specifically designed for deaf learners (visual-first)
- **Green "Non-Deaf" Badge**: Content for hearing learners (with pronunciation/context)
- **Blue "Universal" Badge**: Content suitable for all learners (usually hidden)

---

## 📍 Where to See Role Indicators

### Location 1: Dashboard - Learning Path Panel

**Path**: `/dashboard`

**Steps**:
1. Start your dev server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Sign in with your account
4. Look at the "Your Learning Path" card on the dashboard

**What to Look For**:
- Top 5 recommended learning items
- Each item shows:
  - Priority badge (red/yellow/blue)
  - Role badge (purple/green) - only if content is role-specific
  - Content title and description
  - Reason for recommendation

**Example**:
```
┌─────────────────────────────────────────────────┐
│ 📚 Your Learning Path          [Beginner]      │
├─────────────────────────────────────────────────┤
│ 📖 Visual Sign Language Basics                 │
│    [Priority 1] [Deaf]                          │
│    Learn MSL through pure visual...             │
│    Visual learning to strengthen...             │
│    [Start Learning →]                           │
├─────────────────────────────────────────────────┤
│ 📖 MSL Alphabet for Everyone                   │
│    [Priority 2]                                 │
│    Universal MSL alphabet tutorial...           │
│    [Start Learning →]                           │
└─────────────────────────────────────────────────┘
```

---

### Location 2: Proficiency Test Results Page

**Path**: `/proficiency-test/results?attemptId=<your-attempt-id>`

**Steps**:
1. Complete a proficiency test (or use existing results)
2. After test submission, you'll be redirected to results page
3. Scroll down to "Recommended Learning Path" section

**What to Look For**:
- List of 5+ recommended resources
- Each recommendation shows:
  - Content type badge (tutorial/quiz/material)
  - Role badge (Deaf/Non-Deaf) - if role-specific
  - Title, description, and reason

**Example**:
```
┌─────────────────────────────────────────────────┐
│ 📚 Recommended Learning Path                   │
├─────────────────────────────────────────────────┤
│ Based on your performance, we recommend:        │
│                                                 │
│ [tutorial] [Deaf] Visual Sign Language Basics  │
│ Learn MSL through pure visual demonstrations   │
│ Visual learning to strengthen Basic Signs      │
├─────────────────────────────────────────────────┤
│ [material] [Non-Deaf] Hearing Perspective      │
│ Guide for hearing individuals learning...      │
│ Resources with hearing perspective and context │
└─────────────────────────────────────────────────┘
```

---

### Location 3: Full Learning Path Page (if implemented)

**Path**: `/learning-path`

**Steps**:
1. From dashboard, click "View Full Learning Path"
2. See complete list of all 20 recommendations

---

## 🧪 Testing Different User Roles

### Test as Deaf User

**Setup**:
1. Sign in with a user account
2. Go to Profile settings
3. Ensure role is set to "deaf"
4. Take/retake proficiency test

**Expected Results**:
- ✅ See purple "Deaf" badges on deaf-specific content
- ✅ Deaf-specific content appears first (Priority 1-2)
- ✅ Universal content appears next (Priority 2-3)
- ✅ Non-deaf content appears last (Priority 3-4) but still accessible
- ✅ Recommendations emphasize "visual learning" and "sign language-first"

---

### Test as Non-Deaf User

**Setup**:
1. Sign in with a different user account
2. Go to Profile settings
3. Ensure role is set to "non-deaf"
4. Take/retake proficiency test

**Expected Results**:
- ✅ See green "Non-Deaf" badges on non-deaf-specific content
- ✅ Non-deaf-specific content appears first (Priority 1-2)
- ✅ Universal content appears next (Priority 2-3)
- ✅ Deaf content appears last (Priority 3-4) but still accessible
- ✅ Recommendations mention "pronunciation", "context", "hearing perspective"

---

## 🔍 Detailed Testing Checklist

### Visual Verification
- [ ] Role badges display with correct colors
  - [ ] Purple for "Deaf"
  - [ ] Green for "Non-Deaf"
  - [ ] No badge (or blue) for "Universal"
- [ ] Badges are properly sized and positioned
- [ ] Text is readable on all badge colors
- [ ] Badges appear next to priority badges

### Content Filtering
- [ ] Deaf users see deaf-specific content prioritized
- [ ] Non-deaf users see non-deaf-specific content prioritized
- [ ] Universal content appears for all users
- [ ] Cross-role content is still accessible (not hidden)

### Priority Ordering
- [ ] Role-specific content has lower priority numbers (1-2)
- [ ] Universal content has medium priority (2-3)
- [ ] Other-role content has higher priority numbers (3-4)
- [ ] Content is sorted by priority correctly

### Recommendation Reasons
- [ ] Deaf users see reasons like "Visual learning to strengthen..."
- [ ] Non-deaf users see reasons like "Comparative learning to strengthen..."
- [ ] Reasons mention appropriate learning styles

---

## 🐛 Troubleshooting

### No Role Badges Showing
**Problem**: All content shows without role badges

**Solutions**:
1. Check if test data was inserted: Run query in Supabase SQL Editor
   ```sql
   SELECT title, recommended_for_role FROM tutorials;
   ```
2. Verify migration was applied:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'tutorials' AND column_name = 'recommended_for_role';
   ```
3. Clear browser cache and reload
4. Check browser console for errors

### Wrong Role Badges
**Problem**: Seeing wrong color badges or wrong content

**Solutions**:
1. Verify your user profile role:
   ```sql
   SELECT id, name, role FROM user_profiles WHERE id = '<your-user-id>';
   ```
2. Check if you completed a proficiency test
3. Regenerate learning path by retaking test

### No Recommendations
**Problem**: "No recommendations available"

**Solutions**:
1. Ensure you've completed a proficiency test
2. Check if test data exists in database
3. Verify your proficiency level is set
4. Check browser console for API errors

---

## 📊 Sample Test Data

The following test content has been added to your database:

### Tutorials
1. **Visual Sign Language Basics** (deaf) - Beginner
2. **MSL with Pronunciation Guide** (non-deaf) - Beginner
3. **MSL Alphabet for Everyone** (all) - Beginner

### Materials
1. **Deaf Community Cultural Guide** (deaf) - Beginner
2. **Hearing Perspective Guide** (non-deaf) - Beginner
3. **MSL Dictionary** (all) - Beginner

### Quizzes
1. **Visual Recognition Quiz** (deaf)
2. **Sign and Pronunciation Quiz** (non-deaf)
3. **MSL Basics Quiz** (all)

---

## 🎬 Quick Start Testing

**Fastest way to see role indicators**:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser**: `http://localhost:3000`

3. **Sign in** with existing account

4. **Go to Dashboard**: Look at "Your Learning Path" panel

5. **If no recommendations**:
   - Click "Take Proficiency Test"
   - Complete the test
   - View results page
   - Return to dashboard

6. **Verify role badges**:
   - Purple badges = Deaf-specific content
   - Green badges = Non-Deaf-specific content
   - No badge = Universal content

---

## 📸 Screenshots Reference

### Dashboard Learning Path Panel
- Shows top 5 recommendations
- Role badges next to priority badges
- "Start Learning" buttons

### Test Results Page
- Full list of recommendations
- Detailed performance breakdown
- Role-specific content highlighted

### Expected Badge Colors
- **Priority 1**: Red background
- **Priority 2**: Yellow background
- **Priority 3**: Blue background
- **Deaf Role**: Purple background
- **Non-Deaf Role**: Green background
- **Universal**: Blue background (usually hidden)

---

## ✅ Success Criteria

You've successfully verified the feature when:

1. ✅ Role badges display correctly on dashboard
2. ✅ Role badges display correctly on results page
3. ✅ Content is filtered by user role
4. ✅ Content is prioritized correctly (role-specific first)
5. ✅ Cross-role content is still accessible
6. ✅ Recommendation reasons match user role
7. ✅ Badge colors are correct and readable
8. ✅ No console errors or warnings

---

## 🔗 Related Files

- **Recommendation Engine**: `src/lib/services/recommendationEngine.ts`
- **Dashboard Panel**: `src/components/user/LearningPathPanel.tsx`
- **Results Page**: `src/app/proficiency-test/results/page.tsx`
- **Migration**: `supabase/migrations/20251116132018_add_recommended_for_role_to_content.sql`
- **Database Types**: `src/types/database.types.ts`
