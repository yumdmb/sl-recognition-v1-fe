# Sign Language Recognition Project Database Models

This document provides an overview of all database models used in the Sign Language Recognition project. The information was retrieved directly from the Supabase database.

## Table of Contents

- [User Profiles](#user-profiles)
- [Tutorials](#tutorials)
- [Tutorial Progress](#tutorial-progress)
- [Materials](#materials)
- [Quiz Sets](#quiz-sets)
- [Quiz Questions](#quiz-questions)
- [Quiz Progress](#quiz-progress)
- [Chats](#chats)
- [Chat Participants](#chat-participants)
- [Messages](#messages)
- [Message Status](#message-status)
- [Forum Posts](#forum-posts)
- [Forum Comments](#forum-comments)
- [Gestures](#gestures)
- [Gesture Categories](#gesture-categories)
- [Gesture Contributions](#gesture-contributions)
- [Proficiency Tests](#proficiency-tests)
- [Proficiency Test Questions](#proficiency-test-questions)
- [Proficiency Test Question Choices](#proficiency-test-question-choices)
- [Proficiency Test Attempts](#proficiency-test-attempts)
- [Proficiency Test Attempt Answers](#proficiency-test-attempt-answers)

## User Profiles

Stores user profile information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | | Primary key, linked to auth.users |
| name | text | false | | User's full name |
| email | text | false | | User's email address |
| role | text | false | 'non-deaf' | User role (admin, deaf, non-deaf) |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |
| proficiency_level | proficiency_level | true | | User's proficiency level (Beginner, Intermediate, Advanced) |

## Tutorials

Stores tutorial content for learning sign language.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| title | text | false | | Tutorial title |
| description | text | false | | Tutorial description |
| thumbnail_url | text | true | | URL to tutorial thumbnail image |
| video_url | text | false | | URL to tutorial video |
| level | text | false | | Difficulty level (beginner, intermediate, advanced) |
| language | text | false | | Sign language type (ASL, MSL) |
| recommended_for_role | text | true | 'all' | Target audience: deaf (visual learning), non-deaf (comparative learning), or all (universal content) |
| created_by | uuid | true | | Reference to creator user |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Tutorial Progress

Tracks user progress through tutorials.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | | Reference to user_profiles.id |
| tutorial_id | uuid | false | | Reference to tutorials.id |
| status | text | false | | Progress status |
| last_watched_at | timestamptz | true | now() | Last watched timestamp |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Materials

Stores downloadable learning materials.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| title | text | false | | Material title |
| description | text | false | | Material description |
| type | text | false | | Material type |
| file_size | bigint | true | | File size in bytes |
| download_url | text | false | | URL to download the material |
| level | text | false | | Difficulty level (beginner, intermediate, advanced) |
| language | text | false | | Sign language type (ASL, MSL) |
| recommended_for_role | text | true | 'all' | Target audience: deaf (visual learning), non-deaf (comparative learning), or all (universal content) |
| created_by | uuid | true | | Reference to creator user |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |
| file_path | text | true | | Path to the file in storage |

## Quiz Sets

Groups of quiz questions for testing knowledge.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| title | text | false | | Quiz set title |
| description | text | false | | Quiz set description |
| language | text | false | | Sign language type (ASL, MSL) |
| recommended_for_role | text | true | 'all' | Target audience: deaf (visual learning), non-deaf (comparative learning), or all (universal content) |
| created_by | uuid | true | | Reference to creator user |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Quiz Questions

Individual quiz questions within quiz sets.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| quiz_set_id | uuid | false | | Reference to quiz_sets.id |
| question_text | text | false | | The question text |
| question_type | text | false | | Type of question |
| options | jsonb | true | | Answer options in JSON format |
| correct_answer | text | false | | The correct answer |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Quiz Progress

Tracks user progress through quizzes.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | | Reference to user_profiles.id |
| quiz_set_id | uuid | false | | Reference to quiz_sets.id |
| score | integer | true | | User's score on the quiz |
| completed | boolean | false | false | Whether the quiz is completed |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Chats

Stores chat conversations.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| name | text | true | | Chat name |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Chat Participants

Links users to chat conversations they're part of.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| chat_id | uuid | false | | Reference to chats.id |
| user_id | uuid | false | | Reference to user_profiles.id |
| created_at | timestamptz | true | now() | Creation timestamp |

## Messages

Stores individual chat messages.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| chat_id | uuid | false | | Reference to chats.id |
| sender_id | uuid | false | | Reference to user_profiles.id |
| content | text | false | | Message content |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Message Status

Tracks message read status for each user.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| message_id | uuid | false | | Reference to messages.id |
| user_id | uuid | false | | Reference to user_profiles.id |
| read | boolean | false | false | Whether the message has been read |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Forum Posts

Stores forum discussion posts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| title | text | false | | Post title |
| content | text | false | | Post content |
| author_id | uuid | false | | Reference to user_profiles.id |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Forum Comments

Stores comments on forum posts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| post_id | uuid | false | | Reference to forum_posts.id |
| content | text | false | | Comment content |
| author_id | uuid | false | | Reference to user_profiles.id |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Gestures

Stores sign language gestures.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| word | text | false | | The word the gesture represents |
| description | text | true | | Description of the gesture |
| video_url | text | true | | URL to demonstration video |
| language | text | false | | Sign language type (ASL, MSL) |
| category_id | uuid | true | | Reference to gesture_categories.id |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Gesture Categories

Categories for organizing gestures.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| name | text | false | | Category name |
| description | text | true | | Category description |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Gesture Contributions

User-submitted gesture contributions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| word | text | false | | The word the gesture represents |
| description | text | true | | Description of the gesture |
| video_url | text | false | | URL to demonstration video |
| language | text | false | | Sign language type (ASL, MSL) |
| submitted_by | uuid | false | | Reference to user_profiles.id |
| status | text | false | 'pending' | Review status (pending, approved, rejected) |
| reviewed_by | uuid | true | | Reference to reviewer user_profiles.id |
| reviewed_at | timestamptz | true | | Review timestamp |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Proficiency Tests

Tests to evaluate sign language proficiency.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| title | text | false | | Test title |
| description | text | false | | Test description |
| language | text | false | | Sign language type (ASL, MSL) |
| level | text | false | | Difficulty level (beginner, intermediate, advanced) |
| passing_score | integer | false | | Minimum score to pass |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Proficiency Test Questions

Questions for proficiency tests.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| test_id | uuid | false | | Reference to proficiency_tests.id |
| question_text | text | false | | The question text |
| video_url | text | true | | URL to question video |
| points | integer | false | 1 | Points awarded for correct answer |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Proficiency Test Question Choices

Multiple choice options for test questions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| question_id | uuid | false | | Reference to proficiency_test_questions.id |
| choice_text | text | false | | The choice text |
| is_correct | boolean | false | false | Whether this is the correct answer |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Proficiency Test Attempts

Records of user attempts at proficiency tests.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| user_id | uuid | false | | Reference to user_profiles.id |
| test_id | uuid | false | | Reference to proficiency_tests.id |
| score | integer | true | | User's score on the test |
| passed | boolean | true | | Whether the user passed |
| started_at | timestamptz | false | now() | When the attempt started |
| completed_at | timestamptz | true | | When the attempt was completed |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |

## Proficiency Test Attempt Answers

User answers for test questions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | false | gen_random_uuid() | Primary key |
| attempt_id | uuid | false | | Reference to proficiency_test_attempts.id |
| question_id | uuid | false | | Reference to proficiency_test_questions.id |
| selected_choice_id | uuid | true | | Reference to proficiency_test_question_choices.id |
| is_correct | boolean | true | | Whether the answer was correct |
| created_at | timestamptz | true | now() | Creation timestamp |
| updated_at | timestamptz | true | now() | Last update timestamp |