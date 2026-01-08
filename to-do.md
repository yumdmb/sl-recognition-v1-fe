as user , at /gesture-recognition/search/ is what we called Gesture Dictionary, 

It is a separated module from Gesture Contributions at /gesture/browse/



- so now i want to make it something connected to each other. For now both are using different database table i guess?

- At Gesture Dictionary, it admin itself that can add the data

- At Gesture Contributions. it is contribution-based, where user contribute then admin do approval, after approval then it appear at /gesture/browse/



//give me your thought how do i connect this to each other. i need to edit the db table for Gesture Contributions? because in Gesture Dictionary i has like categories, etc , analyze thoroughly the different, and give me your thought

Updated Flow: User Assigns Category

┌─────────────────────────────────────────────────────────────────────────────┐
│                              UPDATED FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USER SUBMITS CONTRIBUTION (/gesture/submit)                              │
│     • Fill: title, description, language, category, media                    │
│     • User selects category from dropdown                                    │
│     • Status: 'pending'                                                      │
│                                                                              │
│  2. ADMIN REVIEWS (/gesture/manage-contributions)                            │
│     • See pending contributions with user-assigned category                  │
│     • Can EDIT category if user assigned wrong one                           │
│     • Approve → status = 'approved'                                          │
│     • Reject → status = 'rejected' + reason                                  │
│                                                                              │
│  3. APPROVED GESTURES IN DICTIONARY (/gesture-recognition/search)            │
│     • All approved gestures (contributions + admin-added)                    │
│     • Search by text, browse by category                                     │
│                                                                              │
│  4. ADMIN DIRECT ADD (/gesture-recognition/search)                           │
│     • Add New Gesture button                                                 │
│     • Direct insert: status='approved', source='admin'                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


Implementation Plan
1. Database Migration
Add category_id and source columns to gesture_contributions
2. Update Submit Form (/gesture/submit)
Add category dropdown for users
3. Update Admin Review (/gesture/manage-contributions)
Show current category
Allow admin to edit category before approving
4. Update Gesture Dictionary (/gesture-recognition/search)
Query gesture_contributions WHERE status = 'approved'
Admin "Add New Gesture" inserts into gesture_contributions
5. Remove/Redirect /gesture/browse
Redirect to dictionary
Ready to implement? I'll start with the migration.