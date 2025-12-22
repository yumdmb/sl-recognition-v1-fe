# System Demonstration Script - SignBridge (3 Minutes)

**Total Duration:** 3 minutes (180 seconds)
**Speech Pace:** Moderate-fast (~150 words/minute)
**Modules Covered:** Dynamic Learning Path, Dashboard, Avatar Generation, Learning

---

## Timeline Overview

| Section | Duration | Time Stamp |
|---------|----------|------------|
| Introduction | 15 sec | 0:00 - 0:15 |
| Dashboard (FR-011, FR-012) | 25 sec | 0:15 - 0:40 |
| Dynamic Learning Path (FR-009, FR-010) | 40 sec | 0:40 - 1:20 |
| Learning Module (FR-024 to FR-029) | 50 sec | 1:20 - 2:10 |
| Avatar Generation (FR-021 to FR-023) | 40 sec | 2:10 - 2:50 |
| Closing | 10 sec | 2:50 - 3:00 |

---

## Section 1: Introduction (0:00 - 0:15)

### Script:
> "Hi, I'm [Your Name]. Today I'll demonstrate SignBridge, a sign language learning platform. I'll be showing the Dashboard, Dynamic Learning Path, Learning modules, and Avatar Generation features."

### Screen Action:
- Start at **Login page** (`/auth/login`)
- Login with your test account
- Wait for redirect to Dashboard

---

## Section 2: Dashboard (0:15 - 0:40)

**Functional Requirements:** FR-011, FR-012

### Script:
> "After logging in, users land on the Dashboard. Here we can see the learning progress - showing tutorials started, in progress, and completed. The quiz progress section displays completion percentage for each quiz set."
>
> "From the dashboard, users can quickly navigate to different sections using these quick access panels, or use the sidebar navigation."

### Screen Actions:
1. **Show Dashboard** (`/dashboard`) - pause 2 seconds
2. **Point to** Learning Progress card (Started/In Progress/Completed stats)
3. **Point to** Quiz Progress card (percentage bars)
4. **Point to** Learning Path Panel (recommendations)
5. **Click** sidebar or quick access to show navigation works

### What to Highlight:
- Learning Progress percentages
- Quiz completion bars
- Quick access navigation buttons

---

## Section 3: Dynamic Learning Path (0:40 - 1:20)

**Functional Requirements:** FR-009, FR-010

### Script:
> "For personalized learning, users first take a proficiency test. Let me show the test selection page."
>
> *[Navigate to test selection]*
>
> "Users can choose between ASL or MSL proficiency tests. Each test evaluates their current knowledge level."
>
> *[Show test results page - use existing attempt]*
>
> "After completing the test, the system analyzes performance by category, identifies strengths and weaknesses, and assigns a proficiency level - Beginner, Intermediate, or Advanced."
>
> "Based on these results, the system generates a personalized learning path. Notice the priority badges - Priority 1 items address weak areas first. The recommendations adapt based on the user's role and performance."

### Screen Actions:
1. **Navigate to** `/proficiency-test/select` - show test options
2. **Navigate to** `/proficiency-test/results?attemptId=[your-attempt-id]` (use existing completed test)
3. **Scroll to show:**
   - Score and Proficiency Level badge
   - Performance Breakdown (category bars)
   - Strengths & Weaknesses section
   - Recommended Learning Path section
4. **Go back to** Dashboard → Point to Learning Path Panel

### What to Highlight:
- Proficiency level badge (Beginner/Intermediate/Advanced)
- Category performance bars with percentages
- Priority 1, 2, 3 badges on recommendations
- "New" badge if recommendations updated

---

## Section 4: Learning Module (1:20 - 2:10)

**Functional Requirements:** FR-024 to FR-029

### Script:
> "Now let's explore the Learning section. First, Tutorials."
>
> *[Show tutorials page]*
>
> "Users can browse tutorials by language. They can start a tutorial, and mark it as complete when finished. The status updates automatically."
>
> *[Show quizzes]*
>
> "For Quizzes, users answer multiple choice questions. Upon completion, they see their score and detailed explanations for each answer."
>
> *[Show materials]*
>
> "Users can also access downloadable materials - PDFs and documents for offline study."
>
> *[Quick switch to Admin view]*
>
> "As an Admin, I can manage all learning content. Here's the admin panel where I can add, edit, or delete tutorials, quizzes, and materials. For quizzes, I can also manage individual questions and answers."

### Screen Actions:

**User View:**
1. **Navigate to** `/learning/tutorials` - show tutorial list
2. **Click** on a tutorial - show detail/video
3. **Show** Start/Complete buttons
4. **Navigate to** `/learning/quizzes` - show quiz list
5. **Click** a quiz → show questions (don't need to complete, just show UI)
6. **Navigate to** `/learning/materials` - show downloadable files

**Admin View (if time permits):**
7. **Navigate to** `/admin/learning` or admin panel
8. **Show** list of tutorials/quizzes/materials
9. **Click** Edit on one item - show edit form
10. **Show** Delete button (don't actually delete)

### What to Highlight:
- Tutorial status badges (Not Started/In Progress/Completed)
- Quiz question interface with multiple choice
- Download buttons on materials
- Admin CRUD interface

---

## Section 5: Avatar Generation (2:10 - 2:50)

**Functional Requirements:** FR-021 to FR-023

### Script:
> "Finally, the Avatar Generation module. This allows users to contribute sign language gestures using 3D hand tracking."
>
> *[Show avatar generation page]*
>
> "Users can capture their hand gestures in real-time. The system uses MediaPipe to detect 21 hand landmarks and renders a 3D avatar. Users can preview the recording, retake if needed, then enter gesture details like name, language, and category before submitting."
>
> *[Show admin review page]*
>
> "Submitted avatars go to the Admin for review. Admins can view all submissions, preview the 3D recordings, and approve or reject each one. Approved avatars are added to the gesture dictionary."

### Screen Actions:

**User View:**
1. **Navigate to** `/avatar/generate`
2. **Allow camera** - show hand detection working
3. **Show** 3D avatar rendering in real-time
4. **Click** Record → show recording UI
5. **Stop recording** → show preview
6. **Show** the save form (name, language, category fields)
7. **Don't submit** - just show the form

**Admin View:**
8. **Navigate to** `/avatar/admin-database`
9. **Show** list of submissions with status badges
10. **Click** on one submission - show 3D preview
11. **Point to** Approve/Reject buttons

### What to Highlight:
- Real-time hand detection with 21 landmarks
- 3D avatar visualization
- Recording preview and retake option
- Admin approval workflow with status badges

---

## Section 6: Closing (2:50 - 3:00)

### Script:
> "That concludes my demonstration of SignBridge - covering the Dashboard, Dynamic Learning Path, Learning modules, and Avatar Generation. Thank you for watching."

### Screen Action:
- Return to Dashboard
- End recording

---

## Pre-Recording Checklist

### Test Data Setup:
- [ ] Have a user account logged in
- [ ] Complete at least one proficiency test (for results page)
- [ ] Start/complete some tutorials (for progress display)
- [ ] Complete at least one quiz (for quiz progress)
- [ ] Have some avatar submissions in different statuses (pending/approved/rejected)

### Browser Setup:
- [ ] Clear browser cache for clean UI
- [ ] Close unnecessary tabs
- [ ] Enable camera permissions for avatar page
- [ ] Use Chrome/Edge for best MediaPipe compatibility
- [ ] Set browser zoom to 100%
- [ ] Hide bookmarks bar for cleaner recording

### Recording Tips:
- [ ] Use screen recording software (OBS, Loom, or built-in)
- [ ] Record at 1080p resolution
- [ ] Test microphone audio levels
- [ ] Do a 30-second practice run first
- [ ] Keep mouse movements smooth and deliberate
- [ ] Pause briefly (1-2 sec) on important UI elements

---

## Quick Navigation URLs

| Page | URL |
|------|-----|
| Login | `/auth/login` |
| Dashboard | `/dashboard` |
| Test Selection | `/proficiency-test/select` |
| Test Results | `/proficiency-test/results?attemptId=[ID]` |
| Test History | `/proficiency-test/history` |
| Tutorials | `/learning/tutorials` |
| Quizzes | `/learning/quizzes` |
| Materials | `/learning/materials` |
| Avatar Generate | `/avatar/generate` |
| Avatar Admin | `/avatar/admin-database` |
| Admin Learning | `/admin/learning` (if exists) |

---

## Backup Plan (If Something Fails)

**If camera doesn't work:**
> "Due to technical limitations, I'll show a pre-recorded clip of the avatar generation feature."

**If page loads slowly:**
> "While this loads, the system is fetching personalized recommendations based on the user's performance data."

**If you run over time:**
- Skip the Admin view sections
- Focus on User-facing features only
- Cut the Materials section (shortest impact)

---

## Word Count Estimate

- Introduction: ~30 words
- Dashboard: ~60 words
- Learning Path: ~100 words
- Learning Module: ~120 words
- Avatar Generation: ~100 words
- Closing: ~25 words

**Total: ~435 words ÷ 150 wpm = ~2.9 minutes** ✓
