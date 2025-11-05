# Design Document: Contribute New Gesture

## Overview

The Contribute New Gesture system enables users to submit sign language gestures through a comprehensive form with camera capture and file upload options. Built with Next.js 15, Supabase Storage, and MediaRecorder API, the system handles image and video submissions, stores them securely, and implements an admin approval workflow. The feature integrates with the existing `useGestureContributionSubmission` hook and gesture components.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Submit Page  │  Form Fields  │  Camera/Upload  │  Preview  │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Custom Hooks Layer                         │
├─────────────────────────────────────────────────────────────┤
│  useGestureContributionSubmission (existing)                 │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Layer (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│  Supabase Storage  │  gesture_contributions table           │
└─────────────────────────────────────────────────────────────┘
```

### Submission Flow

```
User Fills Form → Select Media Type → Capture/Upload Media →
Preview Media → Validate Form → Submit → Upload to Storage →
Create DB Record (status=pending) → Success Message → Redirect
```

## Components and Interfaces (Existing Implementation)

### 1. Submit Page (`/gesture/submit/page.tsx`)
- **Status**: Already implemented
- **Components**: GestureSubmitHeader, GestureFormFields, Tabs (Upload/Capture), GestureMediaPreview
- **Hook**: useGestureContributionSubmission

### 2. Form Fields Component (`GestureFormFields.tsx`)
- **Status**: Already implemented
- **Fields**: Title, Description, Language (ASL/MSL), Media Type (Image/Video)

### 3. Camera Capture Component (`GestureCameraCapture.tsx`)
- **Status**: Already implemented
- **Features**: Start camera, capture image, record video, stop recording

### 4. File Upload Component (`GestureFileUpload.tsx`)
- **Status**: Already implemented
- **Features**: File input, type validation, preview

### 5. Media Preview Component (`GestureMediaPreview.tsx`)
- **Status**: Already implemented
- **Features**: Image/video preview, playback controls

## Data Models

```typescript
interface GestureContribution {
  id: string;
  word: string;
  description: string;
  language: 'ASL' | 'MSL';
  video_url: string; // Supabase Storage URL
  submitted_by: string; // user_id
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}
```

## Database Schema (Existing)

```sql
CREATE TABLE gesture_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ASL', 'MSL')),
  submitted_by UUID NOT NULL REFERENCES user_profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Supabase Storage Structure

```
gestures/
  ├── images/
  │   └── {user_id}/{timestamp}_{filename}.jpg
  └── videos/
      └── {user_id}/{timestamp}_{filename}.webm
```

## Admin Review System

### Admin Interface
- View all pending submissions
- Display gesture details and media
- Approve/Reject buttons
- Update status and reviewed_by fields

### RLS Policies
```sql
-- Users can view their own submissions
CREATE POLICY "Users view own submissions"
  ON gesture_contributions FOR SELECT
  USING (auth.uid() = submitted_by);

-- Admins can view all submissions
CREATE POLICY "Admins view all"
  ON gesture_contributions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Admins can update status
CREATE POLICY "Admins update status"
  ON gesture_contributions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));
```

## Error Handling

| Error Type | Message | Recovery |
|------------|---------|----------|
| Camera permission denied | "Camera access denied. Please grant permission." | Show upload option |
| File too large | "File exceeds size limit (10MB for images, 50MB for videos)" | Prompt to compress |
| Invalid file type | "Invalid file type. Please upload JPG, PNG, or GIF for images." | Show accepted formats |
| Upload failed | "Media upload failed. Please try again." | Retry button |
| Network error | "Connection error. Please check your internet." | Retry button |

## Performance Optimization

- Compress images before upload (80% quality)
- Limit video recording to 30 seconds
- Show upload progress indicator
- Cache form data in sessionStorage

## Testing Strategy

### Unit Tests
- Form validation logic
- File type validation
- Camera initialization
- Media capture

### Integration Tests
- Complete submission flow
- Admin approval workflow
- Status updates

### E2E Tests
- User submits gesture via camera
- User submits gesture via upload
- Admin approves submission
- Approved gesture appears in browse

## Future Enhancements

1. **Batch Upload**: Submit multiple gestures at once
2. **Draft Saving**: Save incomplete submissions
3. **Edit Submissions**: Edit pending submissions
4. **Rejection Reasons**: Admin provides feedback on rejections
5. **Gesture Guidelines**: In-form tips for quality submissions
