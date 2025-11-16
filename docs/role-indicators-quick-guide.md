# Role Indicators - Quick Visual Guide

## 🎨 Badge Color Reference

| Role | Badge Color | Text | When Shown |
|------|-------------|------|------------|
| **Deaf** | 🟣 Purple (`bg-purple-100 text-purple-800`) | "Deaf" | Content for deaf learners |
| **Non-Deaf** | 🟢 Green (`bg-green-100 text-green-800`) | "Non-Deaf" | Content for hearing learners |
| **Universal** | 🔵 Blue (`bg-blue-100 text-blue-800`) | "Universal" | Hidden (content for all) |

---

## 📍 Quick Navigation

### See Role Indicators in 3 Steps:

```
1. npm run dev
   ↓
2. http://localhost:3000/dashboard
   ↓
3. Look at "Your Learning Path" panel
```

---

## 🎯 What You'll See

### Dashboard Example:

```
┌──────────────────────────────────────────────────────┐
│ 📚 Your Learning Path              [Beginner]        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 📖 Visual Sign Language Basics                      │
│    [Priority 1] [Deaf] ← Purple badge here!         │
│    Learn MSL through pure visual demonstrations     │
│    Visual learning to strengthen Basic Signs        │
│    [Start Learning →]                                │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 📖 MSL with Pronunciation Guide                     │
│    [Priority 2] [Non-Deaf] ← Green badge here!      │
│    Learn MSL with detailed pronunciation...         │
│    Comparative learning to strengthen...            │
│    [Start Learning →]                                │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 📖 MSL Alphabet for Everyone                        │
│    [Priority 2] ← No role badge (universal)         │
│    Universal MSL alphabet tutorial...               │
│    [Start Learning →]                                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔍 Where to Look

### Location 1: Dashboard
- **URL**: `http://localhost:3000/dashboard`
- **Component**: "Your Learning Path" card
- **Shows**: Top 5 recommendations with role badges

### Location 2: Test Results
- **URL**: `http://localhost:3000/proficiency-test/results?attemptId=xxx`
- **Section**: "Recommended Learning Path"
- **Shows**: Full recommendations list with role badges

---

## ✅ Quick Verification

Check these 3 things:

1. **Badge Colors**
   - [ ] Purple for deaf content
   - [ ] Green for non-deaf content
   - [ ] No badge for universal content

2. **Content Priority**
   - [ ] Your role's content appears first
   - [ ] Universal content appears next
   - [ ] Other role's content appears last

3. **Recommendation Text**
   - [ ] Deaf users see "visual learning"
   - [ ] Non-deaf users see "comparative learning"
   - [ ] Reasons match your role

---

## 🚀 Fastest Test

**30-Second Test**:

1. Open: `http://localhost:3000/dashboard`
2. Look at: "Your Learning Path" panel
3. See: Purple or Green badges next to content

**If no recommendations**:
- Click "Take Proficiency Test"
- Complete test
- Return to dashboard

---

## 🎨 Visual Badge Examples

### Deaf User Sees:
```
[Priority 1] [Deaf]     ← Purple badge
[Priority 2]            ← No badge (universal)
[Priority 3] [Non-Deaf] ← Green badge (still accessible)
```

### Non-Deaf User Sees:
```
[Priority 1] [Non-Deaf] ← Green badge
[Priority 2]            ← No badge (universal)
[Priority 3] [Deaf]     ← Purple badge (still accessible)
```

---

## 📱 Mobile View

Role badges stack vertically on small screens:
```
Title
[Priority 1]
[Deaf]
Description
```

---

## 🐛 Not Seeing Badges?

**Quick Fixes**:

1. **Refresh page**: `Ctrl+R` or `Cmd+R`
2. **Clear cache**: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. **Check role**: Profile → Settings → Role should be "deaf" or "non-deaf"
4. **Take test**: Need proficiency test results to see recommendations

---

## 💡 Pro Tips

- **Role badges only show for role-specific content** (not for "all")
- **All content is accessible** regardless of role
- **Priority determines order**, not visibility
- **Cross-role content helps learning** from different perspectives

---

## 📊 Test Data Available

Sample content added to database:

| Content | Role | Level |
|---------|------|-------|
| Visual Sign Language Basics | Deaf | Beginner |
| MSL with Pronunciation Guide | Non-Deaf | Beginner |
| MSL Alphabet for Everyone | All | Beginner |
| Deaf Community Cultural Guide | Deaf | Beginner |
| Hearing Perspective Guide | Non-Deaf | Beginner |
| MSL Dictionary | All | Beginner |

---

## ✨ Success!

You'll know it's working when you see:
- 🟣 Purple "Deaf" badges on some content
- 🟢 Green "Non-Deaf" badges on other content
- Content ordered by your role preference
- Clear visual distinction between content types
