4.1 Requirements of the System 
 
4.1.1 Functional Requirements 
 
Functional requirements define the essential capabilities and interactions that SignBridge must support to ensure its effective operation. These requirements outline the specific functionalities that the system must provide to meet the needs of its users, including frontliners and administrators. Clearly defining these requirements ensures that the system can accurately track room availability, facilitate seamless booking management, and support notification mechanisms. 

| Use Case ID | Req ID | Functional Requirements | Priority | Source |
|-------------|--------|------------------------|----------|---------|
| UC-1: Manage Account | FR-001 | The system shall allow users to register for a new account by entering their credentials (e.g., username, password, email address). | High | Core |
| | FR-002 | Upon successful validation of credentials, the system shall send an authentication link to the user's registered email address. | High | Core |
| | FR-003 | If the entered credentials for registration are invalid, the system shall display an appropriate error message. | High | Core |
| | FR-004 | The system shall store user roles (deaf, non-deaf, admin) and manage access control accordingly. | High | Core |
| | FR-005 | The system shall allow registered users to log in to their accounts. | High | Core |
| | FR-006 | The system shall prompt the user to enter their credentials (e.g., username, password) for login. | High | Core |
| | FR-007 | The system shall validate the entered credentials against existing user accounts during login. | High | Core |
| | FR-008 | Upon successful validation of credentials, the system shall display a "Login Success message" and navigate the user to the Dashboard. | High | Core |
| | FR-009 | If the entered credentials for login are invalid, the system shall display an appropriate error message. | High | Core |
| | FR-010 | The system shall allow logged-in users to navigate to their Profile page. | Medium | Core |
| | FR-011 | The system shall display the user's current Profile details on the Profile page. | Medium | Core |
| | FR-012 | The system shall allow users to edit and save their profile details. | Medium | Core |
| | FR-013 | The system shall allow users to change their account password. | High | Core |
| | FR-014 | The system shall allow logged-in users to log out of their accounts. | High | Core |
| UC-2: Generate Learning Path | FR-015 | The system shall allow users to take an initial evaluation to assess their current knowledge and goals. | High | Core |
| | FR-016 | The system shall generate a personalized learning path based on the evaluation results, user goals, and performance using AI evaluation. | High | Survey |
| | FR-017 | The system shall dynamically update the learning path based on ongoing learning progress tracked in UC10. | Medium | Survey |
| | FR-018 | The system shall generate differentiated learning paths for deaf and normal users. | Medium | Collaborator |
| UC-3: Access Dashboard | FR-019 | The system shall allow all users to access the dashboard upon login. | High | Core |
| | FR-020 | The system shall display the user's learning progress on the dashboard. | Medium | Core |
| | FR-021 | The system shall allow users to navigate from the dashboard to other page. | High | Core |
| | FR-022 | The system shall display the user's current user role (deaf/non-deaf/admin) on the dashboard. | Low | Core |
| UC-4: Recognize Word Through Gesture | FR-023 | The system shall allow user to choose the language for gesture recognition. | High | Collaborator |
| | FR-024 | The system allow user to click "Capture" button to capture real-time image. | High | Core |
| | FR-025 | The system shall capture live image of the user performing a gesture. | High | Collaborator |
| | FR-026 | The system shall display the predicted word as the result of the gesture recognition. | High | Collaborator |
| UC-5: Search Gesture Through Word | FR-027 | The system shall allow user to enter word to search the sign gesture. | High | Collaborator |
| | FR-028 | The system shall display the gesture image that matches the entered word. | High | Collaborator |
| | FR-029 | The system shall allow user to browse word by categories. | Low | Core |
| UC-6: Contribute New Gesture | FR-030 | The system shall display input fields for the user to enter a new word and its description. | High | Core |
| | FR-031 | The system shall allow the user to upload or capture a gesture image using a webcam, display a preview before submission. | High | Collaborator |
| | FR-032 | The system shall allow the user to remove and reupload the image before submission. | Medium | Core |
| | FR-033 | The system shall allow the user to view the approval status of their submitted gesture. | Medium | Core |
| | FR-034 | The system shall allow the admin to view submitted gestures and either approve or reject them. | High | Collaborator |
| UC-7: Generate Avatar | FR-035 | The system shall allow the user to choose between capturing a live image or recording a video of themselves performing a gesture. | High | Collaborator |
| | FR-036 | The system shall provide a live preview of the captured image or video before submission and allow the user to retake it if needed. | Medium | Core |
| | FR-037 | The system shall provide input fields for the user to enter the sign word, select the language, and provide a word description. | High | Core |
| | FR-038 | The system shall allow the user to submit the avatar. | High | Core |
| | FR-039 | The system shall allow the user to view the submission status of the avatar (e.g., "Pending," "Approved," "Rejected"). | Medium | Core |
| | FR-040 | The system shall allow the admin to review submitted avatars and approve or reject them. | High | Core |
| | FR-041 | The system shall allow the user to view their approved avatars in their profile or dashboard. | Medium | Collaborator |
| UC-8: Browse Education Materials | FR-042 | The system shall provide options for users to access tutorials, quizzes, and downloadable materials. | Low | Survey |
| | FR-043 | The system shall allow users to view video tutorials and mark them as completed using a "Done" button. | Medium | Core |
| | FR-044 | The system shall allow users to take quizzes related to the tutorials and display their marks upon completion. | Medium | Core |
| | FR-045 | The system shall allow users to preview downloadable materials and download them. | Medium | Core |
| UC-9: Manage Learning Materials | FR-046 | The system shall allow the admin to manage tutorial content, quiz questions, and downloadable materials (add, edit, delete). | Medium | Survey |
| UC-10: Track User Learning Progress | FR-047 | The system shall allow the user to view their learning progress in the dashboard. | Low | Survey |
| | FR-048 | The system shall track the user's tutorial and quiz progress and display it on the dashboard. | Low | Core |
| UC-11: Access Interaction | FR-049 | The system shall allow users to view, search, and select other users with online/offline status. | Low | Core |
| | FR-050 | The system shall allow users to send, edit, and delete text messages and file attachments. | Low | Survey |
| | FR-051 | The system shall allow users to create, edit, and delete forum posts with title, content and attachment. | Low | Survey |
| | FR-052 | The system shall allow users to add, reply to, edit, and delete comments on every post. | Low | Survey |

**Table 4.1.1: Functional Requirements Table**
