4.2 System Design 

4.2.1 Use Case Diagram 

The SignBridge system is a Sign Language Recognition System designed to enable communication and learning for both deaf and hearing individuals. The Use Case Diagram illustrates its core functionalities, primarily revolving around gesture recognition and a comprehensive learning platform. Key actors include Users (Deaf and Normal Persons), a MyBIM Admin, and an assisting AI Engine. The system's use cases cover essential features such as recognizing gestures (UC4), generating personalized learning paths (UC2), providing and managing educational materials (UC8, UC9), and facilitating user contributions (UC6). This design highlights a user-centric approach, aiming to create an interactive and robust platform for sign language interaction and education.

4.2.2 Use Case Description 

## UC1 - Manage Account

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Manage Account |
| Use Case ID | UC1 |
| Description | This use case describes how a user can register, log in, edit their profile, change their password, and log out of the system. |
| Actor(s) | User |
| Triggering Event | User wishes to interact with their account (e.g., register, log in, edit profile, log out). |
| Pre-condition | None for registration. For login and profile management, the system must be operational. |
| Post-condition | User is registered, logged in, profile updated, password changed, or logged out, depending on the specific flow. |
| Flow of Events | **1. User attempts to register:**<br>1.1. User clicks the "Register" button.<br>1.2. The system prompts for user credentials.<br>1.3. User enters credentials.<br>1.4. The system validates credentials.<br>1.5. If valid, the System sends an authentication link via email.<br>1.6. The system displays the "Account has registered" message.<br><br>**2. User attempts to Log In:**<br>2.1. User clicks the "Login" button.<br>2.2. User enters credentials.<br>2.3. The system validates credentials.<br>2.4. If valid, the System displays a "Login Success message" and navigates to the Dashboard.<br><br>**3. User attempts to Edit Profile:**<br>3.1. From the Dashboard, the User selects the "Edit Profile" action.<br>3.2. The user navigates to the Profile page.<br>3.3. The system displays Profile details.<br>3.4. User edits profile details.<br>3.5. User saves profile details.<br><br>**4. User attempts to Change Password:**<br>4.1. During the "Edit Profile" flow, the User selects the "change password" action.<br>4.2. The system prompts for a new password.<br>4.3. User enters new password.<br>4.4. The system saves the new password.<br>4.5. The system displays "update password success message".<br><br>**5. User attempts to Log Out:**<br>5.1. User clicks the "Log out" button. |
| Exception Flow | **@1.4** If the user enters invalid credentials during registration:<br>1.4.1 The system identifies that the credentials do not meet requirements (e.g., password too short, invalid email format) or the chosen username/email is already in use.<br>1.4.2 The system does not create the account, and the registration process terminates.<br><br>**@2.3** If the user enters an incorrect username or password during login:<br>2.3.1 The system displays an error message (e.g., "Invalid username or password. Please try again.").<br>2.3.2 The user remains on the login screen.<br>2.3.3 The user is prompted to re-enter credentials.<br><br>**@4.4** If the new password does not meet complexity rules or is the same as the existing password:<br>4.4.1 The system identifies that the new password does not meet defined complexity rules or is identical to the current password.<br>4.4.2 The system displays an error message specific to the issue (e.g., "Password does not meet complexity requirements," or "New password cannot be the same as the old password.").<br>4.4.3 The user's password remains unchanged. |

**Table 4.2.2.1: Use case description for UC-1 Manage Account**

---

## UC2 - Generate Learning Path

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Generate Learning Path |
| Use Case ID | UC2 |
| Description | This use case allows a user to take a proficiency test to assess their current knowledge. Based on the results, the system assigns a proficiency level which will be used to generate a personalized learning path. The path is intended to dynamically adapt based on the user's ongoing progress. |
| Actor(s) | User (deaf, non-deaf) |
| Triggering Event | User opts to take the proficiency test, either from an initial prompt on the dashboard or by navigating to the test selection page. |
| Pre-condition | The user must be logged in. |
| Post-condition | The user is assigned a proficiency level (beginner, intermediate, advanced). This level is stored in the user's profile and a personalized learning path is generated. |
| Flow of Events | 1. The user is prompted to take a proficiency test.<br>2. The user accepts and is directed to the test selection page.<br>3. The user selects a proficiency test to begin.<br>4. The system presents a series of questions one by one.<br>5. The user provides an answer for each question.<br>6. After the final question, the user submits the test.<br>7. The system calculates the user's score and determines their proficiency level.<br>8. The system displays the final score and the assigned proficiency level to the user.<br>9. The system generates a personalized learning path based on the user's proficiency level and role (deaf/non-deaf).<br>10. The system will dynamically update this learning path as the user completes more tutorials and quizzes (UC10). |
| Alternative Flow | **@Step 2:** If the user declines the initial prompt:<br>2.1 The user can navigate to their Profile page later.<br>2.2 The user will find a "Take Test" button to start the assessment.<br>2.3 The systems proceeds to Step 3. |
| Exception Flow | **@Step 4:** If the system fails to load questions:<br>4.1 The system will display an error message.<br>4.2 The system will prompt the user to the Home page. |

**Table 4.2.2.2: Use case description for UC-2 Generate Learning Path**

---

## UC3 - Access Dashboard

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Access Dashboard |
| Use Case ID | UC3 |
| Description | This use case allows a logged-in user to access their personalized dashboard. The dashboard displays the user's role, offers quick access to key features, and provides an overview of their learning progress (UC10). |
| Actor(s) | User (deaf, non-deaf, admin) |
| Triggering Event | User successfully logs into the system. |
| Pre-condition | The user must have an active account and be successfully authenticated. |
| Post-condition | The user is presented with their personalized dashboard view. |
| Flow of Events | 1. The user logs into the platform.<br>2. The system identifies the user's role (deaf, non-deaf, or admin).<br>3. The system displays the dashboard corresponding to the user's role.<br>4. The dashboard displays the user's role (e.g., "Deaf Person Dashboard").<br>5. The system displays the user's learning progress on the dashboard (UC10).<br>6. The dashboard displays a "Quick Access" panel with links to other pages such as Recognize Gesture (UC4), Tutorials (UC8), and Contribute New Gesture (UC6).<br>7. The user can click on any of the quick access links to navigate to the respective pages. |
| Alternative Flow | **@Step 3:** If the user is admin:<br>3.1 The system displays the Admin Dashboard, which display number of users registered on the web and the Quick Access Panel. |
| Exception Flow | **@Step 1:** If the user's login is invalid:<br>1.1 The systems redirects user to the login page. |

**Table 4.2.2.3: Use case description for UC-3 Access Dashboard**

---

## UC4 - Recognize word through gesture

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Recognize word through gesture |
| Use Case ID | UC4 |
| Description | This use case describes how a user can utilize the system to recognize a word by performing a sign language gesture in front of a webcam, and then receive feedback on the prediction accuracy. |
| Actor(s) | User |
| Triggering Event | User wishes to recognize a word using a sign language gesture. |
| Pre-condition | The system must be operational. A functional webcam must be connected and accessible by the system. |
| Post-condition | The system has attempted to predict a word based on the user's gesture and displayed the prediction accuracy, or an error message if the process failed. |
| Flow of Events | 1. The User chooses the desired sign language (e.g., ASL, BSL).<br>2. The User clicks the "Start Camera" button.<br>3. The System opens the webcam.<br>4. The User shows a gesture in front of the webcam.<br>5. The System predicts the word based on the gesture.<br>6. The System shows the word prediction accuracy.<br>7. The User clicks the "Close Camera" button. |
| Alternative Flow | **Perform multiple gestures before closing camera:**<br>**@6** After the System shows the word prediction accuracy:<br>6.1 The User can choose to show another gesture (looping back to step 4).<br>6.2 This loop can continue until the User decides to click "Close Camera" (step 7). |
| Exception Flow | **@3** If the System is unable to open or access the webcam:<br>3.1 The System displays an error message (e.g., "Webcam not found" or "Unable to access webcam").<br>3.2 The camera remains closed, and the process cannot continue.<br><br>**@5** If the System cannot detect a valid gesture or the gesture shown is not recognizable:<br>5.1 The System displays a message indicating that no gesture was detected or that the gesture was unrecognized (e.g., "No gesture detected," "Unrecognized gesture, please try again").<br>5.2 The word prediction accuracy is not shown (or shown as 0%). The user can attempt to show a gesture again (looping back to step 4).<br><br>**@5** If an internal error occurs within the system's prediction module:<br>5.1 The System displays an error message indicating that word prediction failed (e.g., "Prediction service error. Please try again later.").<br>5.2 The word prediction accuracy is not displayed. The user cannot proceed with prediction and may need to restart the application. |

**Table 4.2.2.4: Use case description for UC-4 Recognize word through gesture**

---

## UC5 - Search gesture through word

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Search gesture through word |
| Use Case ID | UC5 |
| Description | This use case describes how a user can search for a sign language gesture within the system, either by Browse through predefined categories or by entering a specific text term. The system will then display the corresponding gesture results. |
| Actor(s) | User |
| Triggering Event | User wishes to find a sign language gesture. |
| Pre-condition | The system must be operational and contain a database of sign language gestures. |
| Post-condition | The system has displayed relevant gesture results, a "no results found" message, or an error message if the search operation failed. |
| Flow of Events | **Path A: Browse Categories**<br>1. The User chooses to "Browse Categories".<br>2. The System displays the category section.<br>3. The User selects any specific section.<br>4. The System displays the gesture result.<br><br>**Path B: Search by Text**<br>1. The User chooses to "Search by Text".<br>2. The User selects the sign language and fills in the Term field.<br>3. The User clicks the "Search" button.<br>4. The System displays the gesture result. |
| Alternative Flow | **@4** After the System attempts to display the gesture result (in either Path A or Path B):<br>4.1 If no gestures match the selected criteria (category or text term), the System displays a "No results found" message to the User.<br>4.2 The User can then choose to try a different search (looping back to the initial decision point). |
| Exception Flow | - |

**Table 4.2.2.5: Use case description for UC-5 Search gesture through word**
