# SignBridge - Sign Language Recognition Platform

SignBridge is a comprehensive web application designed to help users learn, recognize, and contribute to sign language. The platform supports both American Sign Language (ASL) and Malaysian Sign Language (MSL) with a range of features focused on accessibility and education.

This application is developed as a Final Year Project in collaboration with Dr. Anthony Chong from The Malaysian Sign Language and Deaf Studies National Organisation (MyBIM). The project aims to bridge communication gaps and make sign language learning more accessible through modern technology.

![SignBridge Logo](/public/MyBIM-Logo-transparent-bg-300x227.png)

## 🌟 Features

### 👋 Gesture Recognition

- **Upload-based Recognition**: Upload images of sign language gestures for AI-powered recognition
- **Camera-based Recognition**: Use your device's camera for real-time sign language recognition
- **Search Functionality**: Search through a comprehensive database of recognized gestures
- **Multi-language Support**: Recognition for both ASL and MSL

### 📚 Learning Resources

- **Interactive Tutorials**: Step-by-step video tutorials with YouTube integration and progress tracking
- **Learning Materials**: Comprehensive collection of resources categorized by difficulty level with file storage
- **Interactive Quizzes**: Test your knowledge with multi-choice quizzes and progress tracking
- **Progress Tracking**: Monitor your learning journey across all modules

### 🎯 Proficiency Assessment & Learning Paths

- **Proficiency Tests**: Comprehensive assessment system to evaluate sign language skills
- **Skill Level Assignment**: Automatic proficiency level assignment based on test results
- **AI-Powered Analysis**: Performance breakdown by category with strengths and weaknesses identification
- **Personalized Learning Paths**: AI-generated recommendations for tutorials, quizzes, and materials based on test results
- **Progress Monitoring**: Track improvement over time with detailed analytics

### 👥 Community & Interaction

- **Gesture Contributions**: Submit new sign language words to expand the community database
- **Community Forum**: Interactive discussion platform for learners and educators
- **Real-time Chat**: Direct messaging system for peer-to-peer learning
- **Content Moderation**: Admin-controlled approval system for community contributions

### 👤 User Management

- **Comprehensive Profiles**: Detailed user profiles with learning progress and achievements
- **Secure Authentication**: Email-based authentication with password reset functionality
- **Role-based Access Control**: Differentiated access for deaf users, non-deaf users, and administrators
- **Profile Customization**: Personalized learning preferences and settings

### 🤖 Avatar Generation

- **3D Avatar Creation**: Generate custom 3D avatars from sign language gestures
- **Camera Integration**: Real-time gesture capture for avatar generation
- **Avatar Database**: Centralized storage and management of generated avatars
- **Admin Controls**: Administrative oversight of avatar content

### ⚙️ Administration

- **Comprehensive Admin Dashboard**: Full platform management with analytics and statistics
- **Content Management System**: Manage tutorials, materials, quizzes, and user submissions
- **User Management**: Admin tools for user oversight and role management
- **Database Administration**: Direct access to avatar and gesture databases

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript 5.x
- **UI Components**: Shadcn/ui built with Radix UI primitives
- **Styling**: Tailwind CSS 4.x
- **Animations**: Framer Motion 12.x
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React
- **Charts**: Recharts for analytics visualization

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with email verification
- **Real-time Features**: Supabase Realtime for chat and live updates
- **File Storage**: Supabase Storage for media files
- **API**: Next.js API routes with Supabase integration
- **Row Level Security**: Comprehensive RLS policies for data protection

### Development Tools

- **Package Manager**: PNPM
- **Linting**: ESLint with Next.js configuration
- **Database Migrations**: Supabase CLI
- **Development Server**: Next.js with Turbopack
- **Version Control**: Git with comprehensive .gitignore

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- PNPM (recommended) or npm
- Supabase account for database and authentication

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd signlanguage-recognition-v1-fe
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase (if not already done)
supabase init

# Start local Supabase (optional for local development)
supabase start

# Apply migrations to your Supabase project
supabase db push
```

5. Run the development server:
```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Database Setup

The project includes comprehensive database migrations in the `supabase/migrations/` directory that set up:
- User profiles and authentication
- Learning modules (tutorials, materials, quizzes)
- Gesture recognition and contributions
- Forum and chat systems
- Proficiency testing
- Avatar generation storage

Run the migrations using the Supabase CLI or apply them directly in the Supabase SQL Editor.

## 📁 Project Structure

```
src/
  ├── app/                    # Next.js app router
  │   ├── (main)/             # Main authenticated routes
  │   │   ├── admin/          # Admin-only pages
  │   │   ├── avatar/         # Avatar generation and management
  │   │   ├── dashboard/      # User dashboard
  │   │   ├── gesture/        # Gesture contribution system
  │   │   ├── gesture-recognition/  # AI-powered gesture recognition
  │   │   ├── interaction/    # Chat and forum features
  │   │   ├── learning/       # Tutorials, materials, and quizzes
  │   │   └── profile/        # User profile management
  │   ├── api/                # Next.js API routes
  │   │   ├── avatar/         # Avatar generation endpoints
  │   │   ├── gesture-recognition/  # Recognition API
  │   │   └── youtube-metadata/     # YouTube integration
  │   ├── auth/               # Authentication pages
  │   └── proficiency-test/   # Skill assessment system
  ├── components/             # React components
  │   ├── admin/              # Admin-specific components
  │   ├── avatar/             # Avatar generation UI
  │   ├── chat/               # Real-time messaging
  │   ├── gesture/            # Gesture contribution UI
  │   ├── gesture-recognition/ # Recognition interface
  │   ├── landing/            # Landing page components
  │   ├── learning/           # Learning module UI
  │   ├── proficiency-test/   # Assessment components
  │   ├── ui/                 # Reusable Shadcn/ui components
  │   └── user/               # User-specific components
  ├── context/                # React context providers
  │   ├── AdminContext.tsx    # Admin state management
  │   ├── AuthContext.tsx     # Authentication state
  │   ├── LanguageContext.tsx # Language selection
  │   ├── LearningContext.tsx # Learning progress
  │   └── SidebarContext.tsx  # UI state
  ├── hooks/                  # Custom React hooks
  ├── lib/                    # Utility functions and services
  │   ├── services/           # Supabase service layer
  │   ├── supabase/           # Database utilities
  │   └── utils/              # Helper functions
  ├── types/                  # TypeScript type definitions
  └── utils/                  # Additional utilities
supabase/                     # Supabase configuration
  ├── config.toml             # Supabase project config
  └── migrations/             # Database schema migrations
```

## 🔜 Future Roadmap

- **AI Model Enhancement**: Improve gesture recognition accuracy and speed
- **Video-based Recognition**: Extend recognition to support video input
- **Mobile Application**: Develop native mobile apps for iOS and Android
- **Expanded Language Support**: Add more sign languages beyond ASL and MSL
- **Advanced Analytics**: Enhanced learning analytics and progress insights
- **Offline Capabilities**: Enable offline learning and recognition features
- **Community Features**: Enhanced social learning and collaboration tools
- **Accessibility Improvements**: Better support for users with different abilities

## 🤝 Contributing

This project is developed as a Final Year Project in collaboration with MyBIM. For contribution guidelines and development setup, please refer to the project documentation.

## 📄 License

This project is developed for educational purposes as part of a Final Year Project.

## 🙏 Acknowledgments

- **Dr. Anthony Chong** and **The Malaysian Sign Language and Deaf Studies National Organisation (MyBIM)** for their collaboration and expertise
- The deaf and hard-of-hearing community for their valuable feedback and insights
- Contributors to the open-source libraries and frameworks used in this project
