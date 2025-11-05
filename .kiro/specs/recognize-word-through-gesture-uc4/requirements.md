# Requirements Document: Recognize Word Through Gesture

## Introduction

The Recognize Word Through Gesture feature enables users to perform sign language gestures in front of a webcam and receive real-time AI-powered recognition results. This core functionality allows users to practice sign language, verify their gestures, and receive immediate feedback on accuracy. The system supports multiple sign languages (ASL and MSL) and provides confidence scores for predictions, helping users improve their signing skills through interactive practice.

## Glossary

- **System**: The SignBridge web application
- **User**: Any authenticated person using the gesture recognition feature
- **Gesture**: A hand movement or sign representing a word or phrase in sign language
- **Webcam**: Device camera used to capture live video feed of user performing gestures
- **Recognition**: AI-powered process of identifying the word represented by a gesture
- **Prediction**: The word result identified by the recognition system
- **Confidence Score**: Percentage indicating the AI's certainty about the prediction (0-100%)
- **Camera Feed**: Live video stream from the user's webcam
- **Capture**: Action of taking a snapshot from the camera feed for recognition
- **Language Selection**: Choice between ASL (American Sign Language) and MSL (Malaysian Sign Language)

## Requirements

### Requirement 1: Language Selection

**User Story:** As a user, I want to select the sign language I'm using, so that the system recognizes gestures in the correct language context.

#### Acceptance Criteria

1. WHEN the User navigates to the gesture recognition page, THE System SHALL display language selection options for ASL and MSL
2. WHEN the User selects a language, THE System SHALL store the selection for the current session
3. THE System SHALL default to the user's preferred language from their profile settings
4. WHEN the language is changed, THE System SHALL update the recognition model to use the selected language
5. THE System SHALL display the currently selected language prominently on the recognition interface

### Requirement 2: Camera Access and Initialization

**User Story:** As a user, I want to start my camera easily, so that I can begin practicing sign language gestures.

#### Acceptance Criteria

1. WHEN the User clicks the "Start Camera" button, THE System SHALL request permission to access the device webcam
2. WHEN camera permission is granted, THE System SHALL initialize the webcam and display the live video feed
3. WHEN the camera is active, THE System SHALL display the video feed in a preview window
4. THE System SHALL display camera status indicators (active, loading, error)
5. WHEN the camera initializes successfully, THE System SHALL enable the capture button

### Requirement 3: Gesture Capture

**User Story:** As a user performing a gesture, I want to capture my sign, so that the system can recognize what word I'm signing.

#### Acceptance Criteria

1. WHEN the camera is active, THE System SHALL display a "Capture" button
2. WHEN the User clicks the "Capture" button, THE System SHALL capture a still image from the live camera feed
3. WHEN an image is captured, THE System SHALL display the captured image in a preview area
4. THE System SHALL process the captured image for gesture recognition
5. WHEN capture is in progress, THE System SHALL display a loading indicator

### Requirement 4: Gesture Recognition and Prediction

**User Story:** As a user who captured a gesture, I want to see the recognized word, so that I know if I performed the sign correctly.

#### Acceptance Criteria

1. WHEN an image is captured, THE System SHALL send the image to the AI recognition model
2. WHEN the recognition model processes the image, THE System SHALL return the predicted word
3. WHEN a prediction is made, THE System SHALL display the predicted word to the user
4. THE System SHALL complete recognition within 5 seconds of capture
5. WHEN recognition is complete, THE System SHALL enable the capture button for another attempt

### Requirement 5: Confidence Score Display

**User Story:** As a user, I want to see how confident the system is about its prediction, so that I can gauge the accuracy of my gesture.

#### Acceptance Criteria

1. WHEN a prediction is made, THE System SHALL calculate a confidence score as a percentage
2. WHEN the confidence score is calculated, THE System SHALL display it alongside the predicted word
3. THE System SHALL use visual indicators (colors, icons) to represent confidence levels (high: >80%, medium: 50-80%, low: <50%)
4. WHEN the confidence is low, THE System SHALL suggest the user try again
5. THE System SHALL display the confidence score in an easily readable format

### Requirement 6: Multiple Gesture Recognition

**User Story:** As a user practicing multiple signs, I want to perform several gestures in one session, so that I can practice efficiently without restarting the camera.

#### Acceptance Criteria

1. WHEN a recognition result is displayed, THE System SHALL keep the camera active
2. WHEN the User wants to try another gesture, THE System SHALL allow immediate capture without restarting the camera
3. THE System SHALL maintain recognition history for the current session
4. WHEN multiple gestures are recognized, THE System SHALL display a list of recent predictions
5. THE System SHALL allow the user to clear the recognition history

### Requirement 7: Camera Closure

**User Story:** As a user finished with practice, I want to close the camera, so that I can stop using my webcam and save resources.

#### Acceptance Criteria

1. WHEN the camera is active, THE System SHALL display a "Close Camera" button
2. WHEN the User clicks the "Close Camera" button, THE System SHALL stop the camera feed
3. WHEN the camera is closed, THE System SHALL release the webcam resource
4. WHEN the camera is closed, THE System SHALL disable the capture button
5. THE System SHALL clear the video preview when the camera is closed

### Requirement 8: Camera Access Error Handling

**User Story:** As a user with camera issues, I want clear error messages, so that I know what went wrong and how to fix it.

#### Acceptance Criteria

1. IF the System cannot access the webcam, THEN THE System SHALL display an error message indicating "Webcam not found" or "Unable to access webcam"
2. IF the User denies camera permission, THEN THE System SHALL display a message explaining how to grant permission
3. IF the webcam is already in use by another application, THEN THE System SHALL display an appropriate error message
4. WHEN a camera error occurs, THE System SHALL provide troubleshooting steps
5. THE System SHALL allow the user to retry camera initialization after an error

### Requirement 9: Recognition Error Handling

**User Story:** As a user, I want helpful feedback when recognition fails, so that I can understand what went wrong and try again.

#### Acceptance Criteria

1. IF the System cannot detect a valid gesture in the captured image, THEN THE System SHALL display a message "No gesture detected"
2. IF the gesture is unrecognizable, THEN THE System SHALL display "Unrecognized gesture, please try again"
3. IF the recognition service fails, THEN THE System SHALL display "Prediction service error. Please try again later."
4. WHEN recognition fails, THE System SHALL allow the user to capture another image immediately
5. THE System SHALL log recognition errors for system improvement

### Requirement 10: Alternative Input Method

**User Story:** As a user without a webcam or with camera issues, I want to upload an image file, so that I can still use gesture recognition.

#### Acceptance Criteria

1. THE System SHALL provide an "Upload Image" option alongside the camera capture
2. WHEN the User selects "Upload Image", THE System SHALL open a file picker dialog
3. WHEN the User selects an image file, THE System SHALL validate the file type (jpg, png, gif)
4. WHEN a valid image is uploaded, THE System SHALL process it for gesture recognition
5. THE System SHALL display the uploaded image in the preview area before recognition

### Requirement 11: Recognition History

**User Story:** As a user practicing multiple gestures, I want to see my recent recognition results, so that I can track my practice session.

#### Acceptance Criteria

1. THE System SHALL maintain a list of recognition results for the current session
2. WHEN a new gesture is recognized, THE System SHALL add it to the history list
3. THE System SHALL display up to 10 recent recognition results
4. WHEN displaying history, THE System SHALL show the predicted word, confidence score, and timestamp
5. THE System SHALL allow the user to clear the recognition history

### Requirement 12: Performance Requirements

**User Story:** As a user, I want fast recognition results, so that I can practice efficiently without long waits.

#### Acceptance Criteria

1. THE System SHALL complete gesture recognition within 5 seconds of capture
2. THE System SHALL initialize the camera within 3 seconds of clicking "Start Camera"
3. THE System SHALL capture an image within 1 second of clicking "Capture"
4. THE System SHALL display recognition results immediately upon receiving them from the AI model
5. THE System SHALL maintain smooth camera feed performance (minimum 15 FPS)
