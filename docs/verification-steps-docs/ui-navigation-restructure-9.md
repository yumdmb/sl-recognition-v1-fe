✅ Task Complete: Implement Unread Message Indicators

## Changes Made

### 9.1 Add unread count tracking to ChatService
- Added `UnreadCount` interface to track unread messages per chat
- Implemented `getUnreadCounts(userId)` method to fetch unread message counts for all user's chats
- Implemented `subscribeToUnreadCounts(userId, callback)` for real-time unread count updates
- Method queries messages and message_status tables to calculate unread counts efficiently

### 9.2 Create unread indicator badge component
- Created `UnreadBadge` component with red background styling
- Badge displays count (or "99+" for counts over 99)
- Badge automatically hides when count is 0
- Integrated UnreadBadge into ChatList component next to chat timestamps

### 9.3 Implement mark as read on chat open
- Updated ChatLayout to track unread counts in state
- Added `loadUnreadCounts()` function to fetch initial unread counts
- Subscribed to real-time unread count changes on component mount
- Modified `markMessagesAsRead()` to update unread count state to 0 after marking messages as read
- Passed unread counts to ChatList component for display

## To Verify

1. Start the development server:
   ```
   npm run dev
   ```

2. Navigate to the Chat page: http://localhost:3000/interaction/chat

3. Test unread message indicators:
   - Open the chat page with User A
   - Have User B send a message to User A
   - Verify that User A sees a red badge with the unread count next to User B's chat
   - Click on User B's chat to open it
   - Verify that the red badge disappears (count becomes 0)

4. Test multiple unread messages:
   - Have User B send multiple messages while User A is not viewing the chat
   - Verify the badge shows the correct count (e.g., "3" for 3 unread messages)
   - Verify counts over 99 display as "99+"

5. Test real-time updates:
   - Keep User A's chat page open
   - Have User B send a new message
   - Verify the unread badge appears/updates immediately without page refresh

## Look for

- **Red badge indicator**: Should appear next to chat names when there are unread messages
- **Correct count**: Badge should show the exact number of unread messages (or "99+" for large counts)
- **Badge disappears**: When opening a chat, the badge should disappear as messages are marked as read
- **Real-time updates**: Badge should update immediately when new messages arrive
- **No badge for own messages**: Sending your own messages should not create an unread badge for yourself

## Expected Behavior

- Unread badges only appear for messages from other users
- Opening a chat automatically marks all messages as read and removes the badge
- The badge updates in real-time as new messages arrive
- Multiple chats can have unread badges simultaneously
- The unread count persists across page refreshes until messages are read

## Requirements Validated

- **Requirement 5.2**: Unread message indicators display correctly
- **Requirement 5.3**: Messages are marked as read when chat is opened
