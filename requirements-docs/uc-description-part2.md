## UC6 - Contribute New Gesture

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Contribute new gesture |
| Use Case ID | UC6 |
| Description | This use case describes how a user can contribute a new sign language gesture to the system. The user can choose to capture the gesture using a webcam or upload a file. The submitted gesture undergoes an administrative review process, and the user can later view the final submission status (In Progress, Approved, or Rejected). |
| Actor(s) | User, Admin (secondary actor) |
| Triggering Event | User wishes to contribute a new sign language gesture. |
| Pre-condition | The user must be logged into the system. The system must be operational. If capturing via webcam, a functional webcam must be connected and accessible. |
| Post-condition | The new gesture submission status is "Approved," "Rejected," or "In Progress," and the user has viewed the status. If approved, the gesture is saved in the database. |
| Flow of Events | 1. The User fills in the Contribute Gesture field (e.g., gesture name, description).<br>2. The User decides whether to Capture Image or Upload File:<br>    **If Capture Image:**<br>    2a. The User clicks the "Capture Image" tab.<br>    2b. The System displays a webcam feed.<br>    2c. The User performs the gesture and clicks the "Capture" button to capture the image.<br>    2d. Go to step 3.<br>    **If Upload File:**<br>    2e. The User clicks the "Upload File" tab.<br>    2f. The User uploads the gesture file from their device.<br>    2g. Go to step 3.<br>3. The User clicks "Submit Gesture".<br>4. The System updates the submission status to "In Progress".<br>5. The Admin reviews the New Gesture submission.<br>6. The Admin makes a decision regarding the submission:<br>    **If Approved:**<br>    6a. The System saves the New Gesture in the database.<br>    6b. The System updates the submission status to "Approved".<br>    6c. Go to step 7.<br>    **If Rejected (Alternative Flow):**<br>    6d. The System updates the submission status to "Rejected".<br>    6e. Go to step 7.<br>7. The User views the New Gesture submission status. |
| Alternative Flow | **@6** When the Admin rejected the submission:<br>6.1 The System updates the submission status to "Rejected" (step 6d in Flow of Events).<br>6.3 The User views this "Rejected" status in step 7. |
| Exception Flow | **@3** If the User clicks "Submit Gesture" without filling in all required fields:<br>3.1 The System displays a validation error message, prompting the User to complete all necessary information (e.g., "Please fill in all required fields").<br>3.2 The submission is not processed.<br><br>**@2b** If the System fails to display a webcam feed, or **@2c** if the System is unable to capture the image:<br>2.1 The System displays an error message (e.g., "Webcam not accessible," "Failed to capture image").<br>2.2 The User cannot proceed with image capture, and the process stalls at this point.<br><br>**@2f** If the User's file upload fails:<br>3.1 The System encounters issues such as an invalid file format, exceeding file size limits, or network problems.<br>3.2 The System displays an error message (e.g., "File upload failed. Please check file size/format and network connection.").<br>3.3 The file is not processed for submission. |

**Table 4.2.2.6: Use case description for UC-6 Contribute New Gesture**

---

## UC7 - Generate Avatar

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Generate Avatar |
| Use Case ID | UC7 |
| Description | This use case allows users to create and submit a new sign language avatar by capturing an image or recording a video of a gesture. The user provides details such as the sign word and language. The submission is then reviewed by an admin. Users can view the status of their submissions. |
| Actor(s) | User (deaf, non-deaf), Admin |
| Triggering Event | User navigates to the "Generate Avatar" page. |
| Pre-condition | The user must be logged into the system. |
| Post-condition | A new avatar submission is created with a "Pending" status. The user can view their submission in their profile. The admin can see the new submission in the admin database. |
| Flow of Events | 1. The user navigates to the "Generate Avatar" page.<br>2. The user chooses to either capture a live image or record a video of a gesture.<br>3. The system displays a live preview of the camera.<br>4. The user captures the image or records the video.<br>5. The system displays the captured image or video for preview.<br>6. The user can choose to retake the capture or proceed.<br>7. The user enters the sign word, description, and selects the language.<br>8. The user submits the avatar.<br>9. The system saves the avatar with a "Pending" status and redirects the user to their "My Avatars" page.<br>10. The user can view their submitted avatar and its status.<br><br>**Admin Flow**<br>11. The admin navigates to the "Avatar Database" page.<br>12. The admin can view all submitted avatars.<br>13. The admin reviews a pending avatar.<br>14. The admin can approve or reject the avatar.<br>15. The system updates the avatar's status accordingly. |
| Alternative Flow | **@Step 6:** If the user chooses to retake the capture:<br>6.1 The system returns to the live camera preview (Step 3). |
| Exception Flow | - |

**Table 4.2.2.7: Use case description for UC-7 Generate Avatar**

---

## UC8 - Browse Education Materials

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Browse Education Materials |
| Use Case ID | UC8 |
| Description | This use case allows the user to browse educational resources on the platform, including tutorials, quizzes, and downloadable materials. The system provides categorized lists for each type and allows users to interact with them to track learning progress. |
| Actor(s) | User |
| Triggering Event | User navigates to the "Learning Materials" section on the platform. |
| Pre-condition | The user is logged into the platform and has access to the Learning Materials module. |
| Post-condition | The user's tutorial and quiz status may be updated; the user may download materials for offline use. |
| Flow of Events | 1. The system displays the list of available tutorials.<br>2. The user clicks the play button on a selected tutorial.<br>3. The system displays the current tutorial status.<br>4. The user optionally changes the tutorial completion status.<br>5. The system updates the tutorial status accordingly.<br>6. The system displays the list of available quizzes.<br>7. The user answers the quiz.<br>8. The system displays the quiz status and overall result.<br>9. The system updates the user's quiz status.<br>10. The system displays the list of downloadable materials.<br>11. The user clicks the download button to obtain a selected material. |
| Alternative Flow | **@Step 4:** If the user chooses not to update the tutorial status after watching:<br>4.1 The system skips Step 5 and proceeds Step 6.<br><br>**@Step 7:** If the user chooses to skip the quiz:<br>7.1 The system bypasses Steps 8 and 9 and proceeds directly to Step 10. |
| Exception Flow | - |

**Table 4.2.2.8: Use case description for UC-8 Browse Education Materials**

---

## UC9 - Manage Education Materials

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Manage Learning Materials |
| Use Case ID | UC9 |
| Description | This use case allows an admin to manage all learning materials on the platform, including tutorials, quizzes and downloadable materials.. The admin can add, edit, and delete tutorial content, materials and quiz sets, as well as manage the individual questions within each quiz. |
| Actor(s) | Admin |
| Triggering Event | Admin navigates to the "Tutorials" or "Quizzes" or "Materials" section of the application. |
| Pre-condition | The user must be logged in as an admin. |
| Post-condition | The learning materials (tutorials, quizzes and downloadable materials) on the platform are updated. |
| Flow of Events | 1. The admin navigates to the "Tutorials" page.<br>2. The system displays a list of existing tutorials.<br>3. The admin can choose to add a new tutorial, or edit or delete an existing one.<br>4. To add or edit, a dialog appears where the admin can input/update the tutorial's title, description, video URL, and level.<br>5. The admin saves the changes.<br>6. The admin can navigate to other learning material sections. |
| Alternative Flow | **@Step 6:** If the admin navigates to the "Quizzes" page:<br>6.1 The system displays a list of existing quiz sets.<br>6.2 The admin can add, edit, or delete a quiz set.<br>6.3 To add or edit a quiz set, a dialog appears for the title and description.<br>6.4 The admin can also choose to edit the questions for a specific quiz set.<br>6.5 On the "Edit Questions" page, the admin can add, edit, or delete individual questions.<br>6.6 To add or edit a question, a dialog appears where the admin can input the question text, multiple-choice options, select the correct answer, and provide an explanation.<br>6.7 The admin saves the changes.<br><br>**@Step 6:** If the admin navigates to the "Materials" page:<br>6.1 The system displays a list of existing downloadable materials.<br>6.2 The admin can choose to add a new material, or edit or delete an existing one.<br>6.3 To add or edit, a dialog appears where the admin can input/update the material's title, description, level, and upload a file.<br>6.4 The admin saves the changes. |
| Exception Flow | - |

**Table 4.2.2.9: Use case description for UC-9 Manage Education Materials**

---

## UC10 - Track User Learning Progress

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Track User Learning Progress |
| Use Case ID | UC10 |
| Description | This use case describes how the system tracks and displays a user's progress through the learning materials, specifically tutorials and quizzes. This information is presented to the user on their dashboard. |
| Actor(s) | User (deaf, non-deaf) |
| Triggering Event | User views their dashboard (see UC3). |
| Pre-condition | The user is logged in and has interacted with at least one tutorial or quiz. |
| Post-condition | The user is able to see an up-to-date summary of their learning progress. |
| Flow of Events | 1. The system retrieves the user's interaction data for all tutorials and quizzes.<br>2. For tutorials, the system calculates the number of started, in-progress, and completed tutorials.<br>3. The system displays the overall tutorial completion as a percentage.<br>4. For quizzes, the system calculates the overall completion percentage based on quizzes attempted.<br>5. The system also displays the score for each individual quiz set the user has attempted.<br>6. This progress information is displayed in dedicated panels on the user's dashboard. |
| Alternative Flow | - |
| Exception Flow | - |

**Table 4.2.2.10: Use case description for UC-10 Track User Learning Progress**

---

## UC11 - Access Interaction

| Attribute | Description |
|-----------|-------------|
| Use Case Name | Access Interaction |
| Use Case ID | UC11 |
| Description | This use case describes how a user interacts with the system's communication features. This includes participating in forums (viewing, adding, editing, and deleting posts, and adding comments) and engaging in personal chats (starting new chats, typing messages, adding attachments, and sending messages). |
| Actor(s) | User |
| Triggering Event | User wishes to engage in communication within the system (via forum or chat). |
| Pre-condition | The user must be logged into the system. The system must be operational. |
| Post-condition | The user has successfully interacted with the forum or chat features, posting/editing/deleting content, or sending messages, or an error message has been displayed. |
| Flow of Events | **Path A: Forum Interaction**<br>1. The User chooses "Forum".<br>2. The System displays all existing posts.<br>3. The User selects an action:<br>    **If Add New Post:**<br>    3a. The User clicks "Add New Post" button.<br>    3b. The System displays the new post form.<br>    3c. The User fills in post title and content.<br>    3d. The User clicks "Submit Post" button.<br>    3e. The System displays the created post.<br>    **If Edit Post:**<br>    3f. The User clicks "Edit" button on a post.<br>    3g. The User edits the post content.<br>    3h. The System displays the edited post.<br>    **If Delete Post:**<br>    3i. The User clicks "Delete" button on a post.<br>    3j. The System removes the deleted post from the list.<br>    **If Add Comment:**<br>    3k. The User clicks "add comment" on a post.<br>    3l. The User types the message (comment content).<br>    3m. The System displays the comment.<br><br>**Path B: Personal Chat Interaction**<br>1. The User chooses "Personal Chat".<br>2. The User clicks "New Chat" button.<br>3. The System searches for a specific user.<br>4. The System displays the chat page.<br>5. The User types a message.<br>6. The User decides on attachment:<br>    **If have attachment:**<br>    6a. The User adds an attachment.<br>    6b. Go to step 7.<br>    **If no attachment:**<br>    6c. Go to step 7.<br>7. The User clicks "Send" button.<br>8. The System displays the message in the chat page. |
| Alternative Flow | - |
| Exception Flow | - |

**Table 4.2.2.11: Use case description for UC-11 Access Interaction**
