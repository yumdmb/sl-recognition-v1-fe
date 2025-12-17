✅ Task Complete: 10.1 Implement message send error handling

## Changes Made

### 1. Enhanced MessageInput Component (`src/components/chat/MessageInput.tsx`)
- Added comprehensive error handling with specific error messages
- Implemented retry mechanism for failed messages
- Added visual indicator for failed messages with retry button
- Created `FailedMessage` interface to track failed message state
- Added `getErrorMessage()` helper to provide user-friendly error messages
- Implemented `handleRetry()` function to retry sending failed messages

### 2. Enhanced ChatService (`src/lib/services/chatService.ts`)
- Improved error messages in `sendMessage()` method with specific error codes
- Added file size validation (10MB max) in `uploadFile()` method
- Enhanced error handling for storage and network errors
- Provided more descriptive error messages based on error types

## Key Features Implemented

### Error Handling
- **Network Errors**: Detects network/fetch errors and displays appropriate message
- **Permission Errors**: Identifies unauthorized/permission errors
- **Storage Errors**: Handles file upload errors with size validation
- **Generic Errors**: Provides fallback error messages for unexpected errors

### Retry Mechanism
- **Toast Notification**: Error toasts include a "Retry" button
- **Visual Indicator**: Failed messages show in a red-bordered box above the input
- **Retry Button**: Dedicated retry button in the failed message indicator
- **State Management**: Stores failed message content and type for retry
- **Success Feedback**: Shows success toast when retry succeeds

### User Experience
- **Clear Error Messages**: User-friendly error descriptions
- **Multiple Retry Options**: Retry via toast action or dedicated button
- **Loading States**: Shows spinner during retry attempts
- **Message Preservation**: Failed text messages remain in the input for editing

## Verification Steps

### Test 1: Network Error Simulation
1. Start the dev server: `npm run dev`
2. Navigate to the Chat page
3. Open browser DevTools → Network tab
4. Set network to "Offline"
5. Try to send a message
6. **Expected Result**: 
   - Error toast appears with "Network error. Please check your connection and try again."
   - Failed message indicator appears above input with retry button
   - Message content is preserved

### Test 2: Retry Functionality
1. With network still offline, click the "Retry" button in the toast or the indicator
2. **Expected Result**: Shows same error (network still offline)
3. Set network back to "Online"
4. Click "Retry" again
5. **Expected Result**:
   - Message sends successfully
   - Success toast appears: "Message sent successfully"
   - Failed message indicator disappears
   - Message appears in chat

### Test 3: File Upload Error
1. Ensure network is online
2. Try to upload a very large file (>10MB)
3. **Expected Result**:
   - Error toast: "File is too large. Maximum size is 10MB."
   - Failed message indicator shows with file name
   - Retry button available

### Test 4: File Upload Retry
1. After file upload fails, select a smaller file
2. The failed indicator should still show the previous failed file
3. Click "Retry" button
4. **Expected Result**:
   - Original failed file is retried (not the newly selected one)
   - If you want to send a different file, you need to clear the error first

### Test 5: Multiple Error Scenarios
1. Send a message with network offline → See error
2. Go online and retry → Success
3. Upload large file → See error
4. Try to retry → See error again (file still too large)
5. **Expected Result**: Each error type shows appropriate message

## Visual Indicators to Look For

### Failed Message Indicator
- Red-bordered box above the message input
- Alert circle icon (red)
- "Failed to send" heading
- Message content or file name displayed
- "Retry" button with refresh icon

### Toast Notifications
- **Error Toast**: Red/destructive color with error message and "Retry" action
- **Success Toast**: Green color with "Message sent successfully" or "File uploaded successfully"

### Loading States
- Spinner icon in send button during sending
- Spinner in retry button during retry attempt
- Input and buttons disabled during operations

## Error Messages Reference

| Error Type | Message |
|------------|---------|
| Network Error | "Network error. Please check your connection and try again." |
| Permission Error | "You don't have permission to send messages in this chat." |
| Storage Error | "Failed to upload file. The file might be too large." |
| File Size Error | "File is too large. Maximum size is 10MB." |
| Invalid Chat/User | "Invalid chat or user. Please refresh and try again." |
| Generic Error | "Failed to send message. Please try again." or "An unexpected error occurred. Please try again." |

## Requirements Validated

✅ **Requirement 5.4**: WHEN a message fails to send THEN the SignBridge System SHALL display an error notification and allow the user to retry sending

### Acceptance Criteria Met:
1. ✅ Try-catch blocks around message send operations
2. ✅ Error toast displayed when send fails
3. ✅ Retry button for failed messages (both in toast and dedicated indicator)
4. ✅ User-friendly error messages based on error type
5. ✅ Failed message state preserved for retry
6. ✅ Success feedback on successful retry

## Notes

- The retry mechanism preserves the exact message/file that failed
- Users can retry multiple times if needed
- Error messages are specific and actionable
- The implementation handles both text messages and file uploads
- File size validation prevents large uploads before attempting
- Network errors are detected and handled gracefully
