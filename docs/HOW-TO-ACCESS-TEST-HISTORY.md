# How to Access Test History Page

## Prerequisites
- You must be **logged in** to access the test history page
- You should have completed at least one proficiency test to see data (otherwise you'll see an empty state)

## Navigation Options

### Option 1: From Your Profile (Recommended)
1. Click on your profile icon or navigate to `/profile`
2. Scroll down to the "Proficiency Level" section
3. Click the **"View History"** button

### Option 2: From Test Results Page
1. After completing a proficiency test
2. On the results page, click **"View Test History"** button

### Option 3: Direct URL
Simply navigate to: `http://localhost:3000/proficiency-test/history`

**Note:** If you're not logged in, you'll be automatically redirected to the login page.

## What You'll See

### If You Have Test History:
- **Statistics Cards**: Total tests, average score, current level
- **Score Progression Chart**: Visual line chart showing your improvement over time
- **Test Attempts List**: Detailed list of all your test attempts with:
  - Test number
  - Test title and language
  - Date taken
  - Score and proficiency level
  - "View Details" button for each completed test

### If You Have No Test History:
- Empty state message
- "Take a Test" button to get started
- "Back to Dashboard" button

## Troubleshooting

### "User not authenticated" Error
**Solution:** Make sure you're logged in first
1. Go to http://localhost:3000/login
2. Log in with your credentials
3. Then navigate to the test history page

### Page Keeps Loading
**Solution:** Check your browser console for errors
- Make sure your dev server is running (`npm run dev`)
- Check that Supabase is properly configured
- Verify your `.env.local` has the correct Supabase credentials

### No Data Showing
**Solution:** You need to take a proficiency test first
1. Go to `/proficiency-test/select`
2. Select a test
3. Complete the test
4. Then return to the history page

## Quick Links
- Profile: `/profile`
- Take Test: `/proficiency-test/select`
- Test History: `/proficiency-test/history`
- Dashboard: `/dashboard`
