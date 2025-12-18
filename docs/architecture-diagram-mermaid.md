# SignBridge System Architecture - Mermaid Diagrams

## 1. High-Level System Architecture

```mermaid
flowchart TB
    subgraph CLIENT["👤 Client Layer"]
        Browser["Web Browser<br/>(Desktop/Mobile)"]
        Camera["Camera/Webcam"]
        FileSystem["File System"]
    end

    subgraph FRONTEND["⚛️ Frontend - Next.js 15"]
        subgraph PAGES["Pages"]
            Landing["Landing Page"]
            Dashboard["Dashboard"]
            Learning["Learning Platform"]
            GestureRec["Gesture Recognition"]
            Avatar["3D Avatar"]
            Forum["Forum"]
            Chat["Chat"]
            Profile["Profile"]
            Admin["Admin Panel"]
        end
        
        subgraph UI["UI Components"]
            ShadcnUI["Shadcn/UI"]
            RadixUI["Radix Primitives"]
            ThreeJS["Three.js / R3F"]
            Recharts["Recharts"]
        end
        
        subgraph STATE["State Management"]
            AuthCtx["AuthContext"]
            SidebarCtx["SidebarContext"]
            LangCtx["LanguageContext"]
            HandCtx["HandDetectionContext"]
            AdminCtx["AdminContext"]
        end
        
        subgraph SERVICES["Service Layer"]
            UserSvc["userService"]
            TutorialSvc["tutorialService"]
            QuizSvc["quizService"]
            ForumSvc["forumService"]
            ChatSvc["chatService"]
            AvatarSvc["signAvatarService"]
            LearningPathSvc["learningPathService"]
        end
        
        Middleware["Middleware<br/>(Auth + RBAC)"]
        APIRoutes["API Routes"]
    end

    subgraph SUPABASE["🗄️ Supabase (BaaS)"]
        PostgreSQL[("PostgreSQL<br/>Database")]
        Auth["Auth Service<br/>(GoTrue)"]
        Storage["Storage<br/>(S3-like)"]
        Realtime["Realtime<br/>(WebSocket)"]
        RLS["Row Level<br/>Security"]
    end

    subgraph EXTERNAL["🌐 External Services"]
        subgraph ML["ML Backend (External Repo)"]
            WSServer["WebSocket Server"]
            MediaPipeML["MediaPipe"]
            MLModel["ML Model<br/>(Sign Classification)"]
        end
        Vercel["Vercel<br/>(Hosting)"]
        YouTube["YouTube API"]
        Email["Email Service"]
    end

    Browser --> FRONTEND
    Camera --> HandCtx
    FileSystem --> FRONTEND
    
    PAGES --> UI
    PAGES --> STATE
    STATE --> SERVICES
    SERVICES --> Middleware
    Middleware --> APIRoutes
    
    APIRoutes --> SUPABASE
    SERVICES --> PostgreSQL
    SERVICES --> Auth
    SERVICES --> Storage
    ChatSvc --> Realtime
    
    HandCtx -.->|WebSocket| WSServer
    WSServer --> MediaPipeML
    MediaPipeML --> MLModel
    MLModel -.->|Recognition Result| HandCtx
    
    FRONTEND --> Vercel
    TutorialSvc --> YouTube
    SERVICES --> Email
    
    PostgreSQL --> RLS
```

## 2. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant M as Middleware
    participant A as Supabase Auth
    participant DB as PostgreSQL

    U->>F: Enter credentials
    F->>A: signInWithPassword()
    A->>A: Validate credentials
    
    alt Valid Credentials
        A->>A: Generate JWT Token
        A->>F: Return session + JWT
        F->>F: Store in cookies
        F->>M: Request protected route
        M->>M: Validate JWT
        M->>M: Extract user_role from JWT
        M->>DB: Fetch user_profiles
        DB->>M: Return profile
        M->>F: Allow access
        F->>U: Show protected content
    else Invalid Credentials
        A->>F: Return error
        F->>U: Show error message
    end
```

## 3. Gesture Recognition Flow

```mermaid
flowchart LR
    subgraph CLIENT["Client Browser"]
        Camera["📷 Camera Feed"]
        MediaPipeClient["MediaPipe<br/>(Client-side)"]
        HandLandmarks["Hand Landmarks<br/>(21 points × 2 hands)"]
        Preview["3D Avatar<br/>Preview"]
    end

    subgraph WEBSOCKET["WebSocket Connection"]
        WS["Real-time<br/>Bidirectional"]
    end

    subgraph ML_BACKEND["ML Backend Server (External)"]
        MediaPipeServer["MediaPipe<br/>Hand Landmarker"]
        FeatureExtract["Feature<br/>Extraction"]
        MLModel["Trained ML Model<br/>(ASL/MSL)"]
        Result["Recognition<br/>Result"]
    end

    subgraph OUTPUT["Output"]
        SignWord["Detected Sign"]
        Confidence["Confidence %"]
    end

    Camera --> MediaPipeClient
    MediaPipeClient --> HandLandmarks
    HandLandmarks --> Preview
    HandLandmarks --> WS
    WS --> MediaPipeServer
    MediaPipeServer --> FeatureExtract
    FeatureExtract --> MLModel
    MLModel --> Result
    Result --> WS
    WS --> SignWord
    WS --> Confidence
```


## 4. Database Schema (ERD)

```mermaid
erDiagram
    AUTH_USERS ||--|| USER_PROFILES : "extends"
    USER_PROFILES ||--o{ TUTORIALS : "creates"
    USER_PROFILES ||--o{ TUTORIAL_PROGRESS : "tracks"
    USER_PROFILES ||--o{ QUIZ_PROGRESS : "tracks"
    USER_PROFILES ||--o{ MATERIALS : "creates"
    USER_PROFILES ||--o{ GESTURE_CONTRIBUTIONS : "submits"
    USER_PROFILES ||--o{ SIGN_AVATARS : "creates"
    USER_PROFILES ||--o{ FORUM_POSTS : "creates"
    USER_PROFILES ||--o{ FORUM_COMMENTS : "creates"
    USER_PROFILES ||--o{ MESSAGES : "sends"
    USER_PROFILES ||--o{ CHAT_PARTICIPANTS : "participates"
    
    TUTORIALS ||--o{ TUTORIAL_PROGRESS : "has"
    QUIZ_SETS ||--o{ QUIZ_QUESTIONS : "contains"
    QUIZ_SETS ||--o{ QUIZ_PROGRESS : "has"
    QUIZ_QUESTIONS ||--o{ QUIZ_ANSWERS : "has"
    
    GESTURES ||--o{ GESTURE_MEDIA : "has"
    
    FORUM_POSTS ||--o{ FORUM_COMMENTS : "has"
    FORUM_POSTS ||--o{ POST_LIKES : "has"
    FORUM_POSTS ||--o{ FORUM_ATTACHMENTS : "has"
    FORUM_COMMENTS ||--o{ COMMENT_LIKES : "has"
    FORUM_COMMENTS ||--o{ FORUM_COMMENTS : "replies_to"
    
    CHATS ||--o{ MESSAGES : "contains"
    CHATS ||--o{ CHAT_PARTICIPANTS : "has"

    USER_PROFILES {
        uuid id PK
        text name
        text email
        text role "admin|deaf|non-deaf"
        text proficiency_level
        text profile_picture_url
        timestamp created_at
    }

    TUTORIALS {
        uuid id PK
        text title
        text description
        text video_url
        text thumbnail_url
        text level
        text language "ASL|MSL"
        uuid created_by FK
    }

    TUTORIAL_PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid tutorial_id FK
        text status
        integer progress_percentage
        timestamp completed_at
    }

    QUIZ_SETS {
        uuid id PK
        text title
        text description
        text language
        uuid created_by FK
    }

    QUIZ_QUESTIONS {
        uuid id PK
        uuid quiz_set_id FK
        text question_text
        text question_type
        text media_url
    }

    QUIZ_ANSWERS {
        uuid id PK
        uuid question_id FK
        text answer_text
        boolean is_correct
    }

    QUIZ_PROGRESS {
        uuid id PK
        uuid user_id FK
        uuid quiz_set_id FK
        integer score
        integer total_questions
        timestamp last_attempted_at
    }

    MATERIALS {
        uuid id PK
        text title
        text description
        text file_url
        text file_type
        text level
        text language
        uuid created_by FK
    }

    GESTURES {
        uuid id PK
        text name
        text description
        text language
        text category
        uuid created_by FK
    }

    GESTURE_MEDIA {
        uuid id PK
        uuid gesture_id FK
        text media_type
        text url
    }

    GESTURE_CONTRIBUTIONS {
        uuid id PK
        text word
        text description
        text media_url
        text media_type
        text status "pending|approved|rejected"
        text language
        uuid user_id FK
        timestamp submitted_at
    }

    SIGN_AVATARS {
        uuid id PK
        text name
        text description
        text language
        text status "verified|unverified"
        jsonb recording_data
        integer frame_count
        integer duration_ms
        uuid user_id FK
        uuid reviewed_by FK
    }

    FORUM_POSTS {
        uuid id PK
        text title
        text content
        uuid user_id FK
        timestamp created_at
        timestamp updated_at
    }

    FORUM_COMMENTS {
        uuid id PK
        uuid post_id FK
        uuid parent_comment_id FK
        text content
        uuid user_id FK
        timestamp created_at
    }

    POST_LIKES {
        uuid id PK
        uuid post_id FK
        uuid user_id FK
        timestamp created_at
    }

    COMMENT_LIKES {
        uuid id PK
        uuid comment_id FK
        uuid user_id FK
        timestamp created_at
    }

    FORUM_ATTACHMENTS {
        uuid id PK
        uuid post_id FK
        uuid comment_id FK
        text file_url
        text file_type
        text file_name
        uuid user_id FK
    }

    CHATS {
        uuid id PK
        boolean is_group
        timestamp last_message_at
    }

    CHAT_PARTICIPANTS {
        uuid id PK
        uuid chat_id FK
        uuid user_id FK
    }

    MESSAGES {
        uuid id PK
        uuid chat_id FK
        uuid sender_id FK
        text content
        text file_url
        boolean is_edited
        timestamp created_at
    }

    PROFICIENCY_TESTS {
        uuid id PK
        text title
        text language
        jsonb questions
    }
```


## 5. Learning Path Flow

```mermaid
flowchart TD
    subgraph USER["User Journey"]
        Start["New User<br/>Registration"]
        Test["Proficiency Test"]
        Analysis["Performance<br/>Analysis"]
        Level["Level Assignment<br/>(Beginner/Intermediate/Advanced)"]
    end

    subgraph ENGINE["Recommendation Engine"]
        Fetch["Fetch Content<br/>by Level"]
        Filter["Filter by<br/>User Role"]
        Prioritize["Prioritize by<br/>Weaknesses"]
        Generate["Generate<br/>Learning Path"]
    end

    subgraph CONTENT["Learning Content"]
        Tutorials["📹 Tutorials"]
        Quizzes["📝 Quizzes"]
        Materials["📄 Materials"]
    end

    subgraph PROGRESS["Progress Tracking"]
        Track["Track<br/>Completion"]
        Adjust["Adjust<br/>Difficulty"]
        Recalc["Recalculate<br/>Recommendations"]
    end

    Start --> Test
    Test --> Analysis
    Analysis --> Level
    Level --> Fetch
    Fetch --> Filter
    Filter --> Prioritize
    Prioritize --> Generate
    Generate --> Tutorials
    Generate --> Quizzes
    Generate --> Materials
    
    Tutorials --> Track
    Quizzes --> Track
    Materials --> Track
    Track --> Adjust
    Adjust --> Recalc
    Recalc --> Generate
```

## 6. Real-time Chat Architecture

```mermaid
sequenceDiagram
    participant A as User A
    participant FA as Frontend A
    participant SB as Supabase
    participant RT as Realtime (WebSocket)
    participant DB as PostgreSQL
    participant FB as Frontend B
    participant B as User B

    A->>FA: Type message
    FA->>SB: sendMessage()
    SB->>DB: INSERT INTO messages
    DB->>RT: Postgres Changes Event
    RT->>FB: Broadcast to subscribers
    FB->>B: Display new message
    
    Note over RT: Real-time subscription<br/>on messages table
    
    B->>FB: Read message
    FB->>SB: markAsRead()
    SB->>DB: UPDATE message_status
```

## 7. Component Architecture

```mermaid
flowchart TB
    subgraph ROOT["Root Layout"]
        Providers["Context Providers"]
    end

    subgraph PROVIDERS["Provider Stack"]
        AuthProvider["AuthProvider"]
        SidebarProvider["SidebarProvider"]
        HandDetectionProvider["HandDetectionProvider"]
    end

    subgraph MAIN_LAYOUT["Main Layout (Protected)"]
        LanguageProvider["LanguageProvider"]
        AdminProvider["AdminProvider"]
        AppSidebar["AppSidebar"]
        MobileHeader["MobileHeader"]
        Content["Page Content"]
    end

    subgraph PAGES["Feature Pages"]
        DashboardPage["Dashboard"]
        LearningPage["Learning"]
        GesturePage["Gesture Recognition"]
        AvatarPage["Avatar Generation"]
        ForumPage["Forum"]
        ChatPage["Chat"]
        ProfilePage["Profile"]
        AdminPage["Admin"]
    end

    ROOT --> Providers
    Providers --> AuthProvider
    AuthProvider --> SidebarProvider
    SidebarProvider --> HandDetectionProvider
    HandDetectionProvider --> MAIN_LAYOUT
    
    MAIN_LAYOUT --> LanguageProvider
    LanguageProvider --> AdminProvider
    AdminProvider --> AppSidebar
    AdminProvider --> MobileHeader
    AdminProvider --> Content
    
    Content --> PAGES
```

## 8. Deployment Architecture

```mermaid
flowchart TB
    subgraph INTERNET["🌐 Internet"]
        Users["End Users"]
    end

    subgraph VERCEL["Vercel (Frontend Hosting)"]
        NextApp["Next.js App<br/>(SSR/SSG)"]
        EdgeMW["Edge Middleware"]
        APIRoutes["Serverless<br/>API Routes"]
    end

    subgraph SUPABASE_CLOUD["Supabase Cloud"]
        PG["PostgreSQL"]
        GoTrue["Auth (GoTrue)"]
        S3["Storage"]
        RealtimeSvc["Realtime"]
    end

    subgraph ML_SERVER["ML Backend (Separate Deployment)"]
        WSS["WebSocket Server"]
        MP["MediaPipe"]
        Model["Trained Model"]
    end

    subgraph EXTERNAL_APIS["External APIs"]
        YT["YouTube API"]
        SMTP["Email Service"]
    end

    Users --> NextApp
    NextApp --> EdgeMW
    EdgeMW --> APIRoutes
    
    APIRoutes --> PG
    APIRoutes --> GoTrue
    APIRoutes --> S3
    NextApp --> RealtimeSvc
    
    NextApp -.->|WebSocket| WSS
    WSS --> MP
    MP --> Model
    
    APIRoutes --> YT
    APIRoutes --> SMTP
```


## 9. Security & Access Control

```mermaid
flowchart LR
    subgraph REQUEST["Incoming Request"]
        Req["HTTP Request"]
    end

    subgraph MIDDLEWARE["Next.js Middleware"]
        SessionCheck["Session Check"]
        JWTValidate["JWT Validation"]
        RoleExtract["Role Extraction"]
        RouteGuard["Route Guard"]
    end

    subgraph ROUTES["Route Types"]
        Public["Public Routes<br/>/, /auth/*"]
        Protected["Protected Routes<br/>/dashboard, /learning/*"]
        AdminOnly["Admin Routes<br/>/admin, /gesture/manage-*"]
    end

    subgraph SUPABASE_RLS["Supabase RLS"]
        PolicyCheck["Policy Evaluation"]
        UserScope["user_id = auth.uid()"]
        RoleScope["role = 'admin'"]
    end

    subgraph RESPONSE["Response"]
        Allow["✅ Allow Access"]
        Redirect["🔄 Redirect to Login"]
        Deny["❌ Access Denied"]
    end

    Req --> SessionCheck
    SessionCheck -->|No Session| Public
    SessionCheck -->|Has Session| JWTValidate
    JWTValidate --> RoleExtract
    RoleExtract --> RouteGuard
    
    RouteGuard -->|Public| Public
    RouteGuard -->|Protected| Protected
    RouteGuard -->|Admin| AdminOnly
    
    Public --> Allow
    Protected -->|Authenticated| PolicyCheck
    Protected -->|Not Auth| Redirect
    AdminOnly -->|Is Admin| PolicyCheck
    AdminOnly -->|Not Admin| Deny
    
    PolicyCheck --> UserScope
    PolicyCheck --> RoleScope
    UserScope --> Allow
    RoleScope --> Allow
```

## 10. 3D Avatar Generation Flow

```mermaid
flowchart TD
    subgraph INPUT["Input"]
        Camera["📷 Camera Feed"]
        VideoStream["MediaStream API"]
    end

    subgraph DETECTION["Hand Detection (Client-side)"]
        MediaPipe["MediaPipe<br/>Tasks-Vision"]
        Landmarks["21 Landmarks<br/>per Hand"]
        Handedness["Handedness<br/>(Left/Right)"]
    end

    subgraph RENDERING["3D Rendering"]
        ThreeJS["Three.js"]
        R3F["React Three Fiber"]
        Hand3D["Hand3D Component"]
        Scene["3D Scene"]
    end

    subgraph RECORDING["Recording"]
        Frames["Capture Frames"]
        Duration["Track Duration"]
        RecordingData["Recording Data<br/>(JSON)"]
    end

    subgraph STORAGE["Storage"]
        Supabase["Supabase DB"]
        SignAvatars["sign_avatars Table"]
    end

    subgraph PLAYBACK["Playback"]
        Avatar3DPlayer["Avatar3DPlayer"]
        Animation["Animated<br/>Hand Movement"]
    end

    Camera --> VideoStream
    VideoStream --> MediaPipe
    MediaPipe --> Landmarks
    MediaPipe --> Handedness
    
    Landmarks --> Hand3D
    Handedness --> Hand3D
    Hand3D --> ThreeJS
    ThreeJS --> R3F
    R3F --> Scene
    
    Landmarks --> Frames
    Frames --> Duration
    Duration --> RecordingData
    RecordingData --> Supabase
    Supabase --> SignAvatars
    
    SignAvatars --> Avatar3DPlayer
    Avatar3DPlayer --> Animation
```

## 11. Feature Module Overview

```mermaid
mindmap
    root((SignBridge))
        Gesture Recognition
            Camera Capture
            File Upload
            WebSocket to ML
            Search Gestures
            ASL/MSL Support
        Learning Platform
            Video Tutorials
            Interactive Quizzes
            Downloadable Materials
            Progress Tracking
            AI Learning Path
            Proficiency Test
        3D Avatar
            Hand Detection
            3D Rendering
            Recording
            Playback
            Admin Verification
        Contributions
            Submit Gestures
            Image/Video Upload
            Category Tags
            Admin Review
            Duplicate Detection
        Community
            Forum Posts
            Comments & Replies
            Likes System
            File Attachments
            Real-time Chat
            Unread Tracking
        Admin Panel
            User Management
            Content Moderation
            Contribution Review
            System Config
```

---

## Usage Notes

These Mermaid diagrams can be rendered in:
- GitHub/GitLab markdown preview
- VS Code with Mermaid extension
- Notion, Obsidian, and other markdown editors
- Online at [mermaid.live](https://mermaid.live)

---

*Generated: December 2024*
*SignBridge - Sign Language Learning & Recognition Platform*
