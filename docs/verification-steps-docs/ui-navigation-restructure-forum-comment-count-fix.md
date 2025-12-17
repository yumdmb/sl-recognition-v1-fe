# ✅ Bug Fix: Forum Comment Count & Like Count Issues

## Issue 1: Comment Count Shows 0 Initially
Forum posts showed "0 comments" initially, but the correct count appeared only after expanding the comment section.

## Issue 2: Like Count Shows 0 Initially
Comment likes showed 0 initially, but the correct count appeared only after clicking the like button.

## Root Causes
1. Comment count was calculated from `postComments[post.id]` state, which is only populated when the user expands a post's comment section.
2. Like state in `CommentThread` was initialized from `likeData` prop using `useState`, but `useState` only uses the initial value once - subsequent prop changes weren't reflected.

## Changes Made

### 1. Updated ForumPost Type (`src/lib/services/forumService.ts`)
- Added `comment_count?: number` field to the `ForumPost` type

### 2. Updated getPosts() Method (`src/lib/services/forumService.ts`)
- Added query to fetch comment counts for all posts in a single batch query
- Built a `commentCountMap` to efficiently map post IDs to their comment counts
- Included `comment_count` in the returned post objects

### 3. Updated Forum Page (`src/app/(main)/interaction/forum/page.tsx`)
- Changed comment count logic to use `post.comment_count` from API initially
- Only uses local count from `postComments` state after comments have been loaded

### 4. Updated CommentThread Component (`src/components/forum/CommentThread.tsx`)
- Added `useEffect` to sync like state when `likeData` prop changes
- This ensures likes are displayed correctly after the batch like query completes

## To Verify

1. Start dev server: `npm run dev`
2. Navigate to Forum page: http://localhost:3000/interaction/forum
3. Expand a post's comment section

## Expected Behavior
- Posts should show the correct comment count immediately on page load
- Comments should show the correct like count immediately when expanded
- Like button should show red heart if user has already liked

## Look For
- Comment counts displayed correctly without needing to expand comments
- Like counts displayed correctly without needing to click the like button
- Red heart icon for comments the user has already liked
