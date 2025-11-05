# Design Document: Recognize Word Through Gesture

## Overview

The Recognize Word Through Gesture system provides real-time AI-powered sign language recognition through webcam capture. Built with Next.js 15, MediaPipe for hand tracking, and a custom recognition API, the system enables users to practice sign language gestures and receive immediate feedback with confidence scores. The feature supports both ASL and MSL with camera-based and file upload input methods.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Recognition Page  │  Camera Component  │  Results Display  │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Custom Hooks Layer                         │
├─────────────────────────────────────────────────────────────┤
│  useCamera  │  useGestureRecognition  │  useMediaUpload    │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js API)                    │
├─────────────────────────────────────────────────────────────┤
│  /api/gesture-recognition/recognize                          │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              AI Recognition Service (External)               │
├─────────────────────────────────────────────────────────────┤
│  MediaPipe Hand Tracking  │  Custom ML Model  │  TensorFlow │
└─────────────────────────────────────────────────────────────┘
```

### Recognition Flow

```
User Selects Language → Start Camera → Camera Permission →
Camera Feed Active → User Performs Gesture → Capture Image →
Send to API → AI Processing → Return Prediction + Confidence →
Display Results → Allow Next Capture
```

## Components and Interfaces

### 1. Gesture Recognition Page

#### Recognition Page (`/(main)/gesture-recognition/page.tsx`)
- **Purpose**: Main page for gesture recognition feature
- **Components**:
  - Language selector dropdown
  - Camera/Upload toggle
  - Camera component or file upload area
  - Recognition results display
  - Recognition history panel
- **State Management**: Local state + LanguageContext
- **API Integration**: Recognition API endpoint

### 2. Camera Component

#### CameraCapture (`/components/gesture-recognition/CameraCapture.tsx`)
- **Purpose**: Handle webcam access and video feed display
- **Components**:
  - Video element for camera feed
  - Start/Stop camera buttons
  - Capture button
  - Camera status indicator
  - Canvas for image capture
- **Props**:
  ```typescript
  interface CameraCaptureProps {
    onCapture: (imageData: string) => void;
    isActive: boolean;
    onError: (error: CameraError) => void;
  }
  ```
- **Custom Hook**: useCamera for camera management
- **Features**:
  - Request camera permission
  - Initialize MediaStream
  - Capture still frame
  - Release camera resources

### 3. File Upload Component

#### ImageUpload (`/components/gesture-recognition/ImageUpload.tsx`)
- **Purpose**: Allow users to upload gesture images
- **Components**:
  - File input with drag-and-drop
  - Image preview
  - File validation feedback
  - Upload button
- **Props**:
  ```typescript
  interface ImageUploadProps {
    onUpload: (imageData: string) => void;
    acceptedFormats: string[];
    maxSize: number;
  }
  ```
- **Features**:
  - Drag and drop support
  - File type validation
  - File size validation
  - Image preview before recognition

### 4. Recognition Results Component

#### RecognitionResults (`/components/gesture-recognition/RecognitionResults.tsx`)
- **Purpose**: Display recognition prediction and confidence score
- **Components**:
  - Predicted word display
  - Confidence score with visual indicator
  - Confidence level badge (high/medium/low)
  - Try again button
  - Captured image preview
- **Props**:
  ```typescript
  interface RecognitionResultsProps {
    prediction: string;
    confidence: number;
    capturedImage: string;
    timestamp: string;
  }
  ```
- **Features**:
  - Color-coded confidence levels
  - Animated result display
  - Feedback suggestions based on confidence

### 5. Recognition History Component

#### RecognitionHistory (`/components/gesture-recognition/RecognitionHistory.tsx`)
- **Purpose**: Display list of recent recognition attempts
- **Components**:
  - Scrollable list of results
  - Each item shows word, confidence, timestamp
  - Clear history button
  - Export history option
- **Props**:
  ```typescript
  interface RecognitionHistoryProps {
    history: RecognitionResult[];
    onClear: () => void;
  }
  ```
- **Features**:
  - Display up to 10 recent results
  - Timestamp formatting
  - Visual confidence indicators

### 6. Custom Hooks

#### useCamera Hook
```typescript
interface UseCameraReturn {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  isActive: boolean;
  error: CameraError | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
}

function useCamera(): UseCameraReturn {
  // Camera initialization logic
  // MediaStream management
  // Image capture from video feed
  // Error handling
}
```

#### useGestureRecognition Hook
```typescript
interface UseGestureRecognitionReturn {
  recognize: (imageData: string, language: string) => Promise<RecognitionResult>;
  isRecognizing: boolean;
  error: RecognitionError | null;
  history: RecognitionResult[];
  clearHistory: () => void;
}

function useGestureRecognition(): UseGestureRecognitionReturn {
  // API call to recognition endpoint
  // Result processing
  // History management
  // Error handling
}
```

## Data Models

### Recognition Models

```typescript
interface RecognitionResult {
  id: string;
  predictedWord: string;
  confidence: number;
  language: 'ASL' | 'MSL';
  capturedImage: string;
  timestamp: string;
  processingTime: number;
}

interface RecognitionRequest {
  image: string; // Base64 encoded image
  language: 'ASL' | 'MSL';
  userId?: string;
}

interface RecognitionResponse {
  success: boolean;
  prediction: string;
  confidence: number;
  alternatives?: Array<{
    word: string;
    confidence: number;
  }>;
  processingTime: number;
  error?: string;
}

interface CameraError {
  type: 'permission_denied' | 'not_found' | 'in_use' | 'unknown';
  message: string;
  troubleshooting: string[];
}

interface RecognitionError {
  type: 'no_gesture' | 'unrecognized' | 'service_error' | 'network_error';
  message: string;
  retryable: boolean;
}
```

## API Design

### Recognition API Endpoint

**Endpoint**: `POST /api/gesture-recognition/recognize`

**Request Body**:
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "language": "ASL",
  "userId": "uuid-string"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "prediction": "hello",
  "confidence": 0.92,
  "alternatives": [
    { "word": "hi", "confidence": 0.78 },
    { "word": "hey", "confidence": 0.65 }
  ],
  "processingTime": 1234
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "no_gesture_detected",
  "message": "No hand gesture detected in the image",
  "retryable": true
}
```

### API Implementation

```typescript
// /api/gesture-recognition/recognize/route.ts
export async function POST(request: Request) {
  try {
    const { image, language, userId } = await request.json();
    
    // Validate input
    if (!image || !language) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process image with AI model
    const result = await recognizeGesture(image, language);
    
    // Log recognition attempt (optional)
    if (userId) {
      await logRecognitionAttempt(userId, result);
    }
    
    return NextResponse.json({
      success: true,
      prediction: result.word,
      confidence: result.confidence,
      alternatives: result.alternatives,
      processingTime: result.processingTime
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Recognition failed', message: error.message },
      { status: 500 }
    );
  }
}
```

## AI Recognition Integration

### Recognition Service

```typescript
// /lib/services/recognitionService.ts
interface RecognitionServiceResult {
  word: string;
  confidence: number;
  alternatives: Array<{ word: string; confidence: number }>;
  processingTime: number;
}

async function recognizeGesture(
  imageData: string,
  language: 'ASL' | 'MSL'
): Promise<RecognitionServiceResult> {
  const startTime = Date.now();
  
  // 1. Preprocess image
  const processedImage = await preprocessImage(imageData);
  
  // 2. Extract hand landmarks using MediaPipe
  const landmarks = await extractHandLandmarks(processedImage);
  
  if (!landmarks) {
    throw new Error('no_gesture_detected');
  }
  
  // 3. Run through ML model
  const predictions = await runMLModel(landmarks, language);
  
  // 4. Get top prediction and alternatives
  const topPrediction = predictions[0];
  const alternatives = predictions.slice(1, 4);
  
  const processingTime = Date.now() - startTime;
  
  return {
    word: topPrediction.word,
    confidence: topPrediction.confidence,
    alternatives,
    processingTime
  };
}
```

### MediaPipe Integration

```typescript
// /lib/ai/mediapipe.ts
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let handLandmarker: HandLandmarker;

async function initializeMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
  );
  
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: '/models/hand_landmarker.task',
      delegate: 'GPU'
    },
    numHands: 2,
    runningMode: 'IMAGE'
  });
}

async function extractHandLandmarks(imageData: string) {
  if (!handLandmarker) {
    await initializeMediaPipe();
  }
  
  const image = await loadImage(imageData);
  const result = handLandmarker.detect(image);
  
  if (result.landmarks.length === 0) {
    return null;
  }
  
  return result.landmarks[0]; // Return first hand detected
}
```

## Error Handling

### Camera Errors

| Error Type | User Message | Troubleshooting Steps |
|------------|--------------|----------------------|
| permission_denied | "Camera access denied. Please grant permission to use your camera." | 1. Click camera icon in address bar<br>2. Select "Allow"<br>3. Refresh page |
| not_found | "No camera detected. Please connect a webcam." | 1. Check camera connection<br>2. Try different USB port<br>3. Restart browser |
| in_use | "Camera is being used by another application." | 1. Close other apps using camera<br>2. Restart browser<br>3. Try again |
| unknown | "Unable to access camera. Please try again." | 1. Refresh page<br>2. Restart browser<br>3. Check system settings |

### Recognition Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| no_gesture | "No hand gesture detected. Please ensure your hand is visible." | Show tips for proper hand positioning |
| unrecognized | "Gesture not recognized. Try again or check the gesture guide." | Link to gesture dictionary |
| service_error | "Recognition service unavailable. Please try again later." | Retry button, check status page |
| network_error | "Connection error. Please check your internet." | Retry button, offline indicator |

## Performance Optimization

### Image Processing

```typescript
// Optimize image before sending to API
function optimizeImage(imageData: string): string {
  const img = new Image();
  img.src = imageData;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Resize to optimal dimensions (640x480)
  canvas.width = 640;
  canvas.height = 480;
  
  ctx.drawImage(img, 0, 0, 640, 480);
  
  // Compress to JPEG with 80% quality
  return canvas.toDataURL('image/jpeg', 0.8);
}
```

### Caching Strategy

- Cache MediaPipe model after first load
- Cache language-specific ML models
- Store recognition history in sessionStorage
- Preload common gesture predictions

### Performance Targets

- Camera initialization: < 3 seconds
- Image capture: < 1 second
- Recognition processing: < 5 seconds
- UI response time: < 100ms

## Security Considerations

### Privacy

- Never store captured images without user consent
- Process images client-side when possible
- Clear camera feed when page is closed
- Provide option to disable recognition history

### Data Protection

- Validate all image uploads (type, size, content)
- Sanitize file names and metadata
- Rate limit API requests (10 per minute per user)
- Implement CORS restrictions on API endpoints

## Testing Strategy

### Unit Tests
- Test camera initialization and cleanup
- Test image capture from video feed
- Test file upload validation
- Test confidence score calculation
- Test error handling for various scenarios

### Integration Tests
- Test complete recognition flow (camera to results)
- Test language switching during recognition
- Test recognition history management
- Test API endpoint with various inputs

### E2E Tests
- User starts camera and captures gesture
- User uploads image file for recognition
- Recognition results display correctly
- Multiple gestures recognized in one session
- Error messages display appropriately

## Future Enhancements

1. **Real-time Recognition**: Continuous recognition without capture button
2. **Video Recognition**: Recognize gestures from video sequences
3. **Multi-hand Recognition**: Recognize two-handed signs
4. **Gesture Feedback**: Visual overlay showing hand landmarks
5. **Practice Mode**: Guided practice with target gestures
6. **Offline Mode**: Client-side recognition with TensorFlow.js
7. **Voice Output**: Speak recognized words aloud
8. **Gesture Recording**: Save and replay gesture attempts
