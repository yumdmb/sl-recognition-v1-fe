# SignBridge - Sign Language Recognition Platform

SignBridge is a comprehensive web application designed to help users learn, recognize, and contribute to sign language. The platform supports both American Sign Language (ASL) and Malaysian Sign Language (MSL) with a range of features focused on accessibility and education.

This application is developed as a Final Year Project in collaboration with Dr. Anthony Chong from The Malaysian Sign Language and Deaf Studies National Organisation (MyBIM). The project aims to bridge communication gaps and make sign language learning more accessible through modern technology.

![SignBridge Logo](/public/MyBIM-Logo-transparent-bg-300x227.png)

## 🌟 Features

### 👋 Gesture Recognition

- **Upload-based Recognition**: Upload images of sign language gestures for AI-powered recognition
- **Camera-based Recognition**: Use your device's camera for real-time sign language recognition
- **Search Functionality**: Search through a database of recognized gestures

### 📚 Learning Resources

- **Tutorials**: Step-by-step guides on learning sign language
- **Learning Materials**: Comprehensive collection of resources categorized by difficulty level
- **Interactive Quizzes**: Test your knowledge with interactive quizzes

### 👥 Community Contributions

- **Word Submission**: Submit new sign language words to expand the database
- **Word Browsing**: Explore signs submitted by the community

### 👤 User Management

- **User Profiles**: Customize your profile and track learning progress
- **Authentication System**: Secure login and registration
- **Role-based Access**: Different roles for deaf users, non-deaf users, and administrators

### 🤖 Avatar Generation

- **Custom Avatars**: Generate custom avatars for sign language demonstrations
- **Avatar Management**: Save and manage your created avatars

### ⚙️ Administration

- **Admin Dashboard**: Comprehensive dashboard for platform management
- **Content Management**: Manage learning materials and user submissions

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15.x
- **UI Components**: Shadcn built with Radix
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Notifications**: Sonner toast notifications

### Backend (Work in Progress)

- **API Routes**: Next.js API routes (placeholder implementations)
- **Authentication**: Next Auth (to be fully implemented)
- **Database**: TBD
- **AI Model**: To be implemented for gesture recognition/avatar rendering

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://your-repository-url/signlanguage-recognition.git
cd signlanguage-recognition-migrated
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
src/
  ├── app/                    # Next.js app router
  │   ├── (main)/             # Main authenticated routes
  │   │   ├── dashboard/      # User dashboard
  │   │   ├── gesture-recognition/  # Sign language recognition features
  │   │   ├── learning/       # Learning resources
  │   │   ├── profile/        # User profile
  │   │   └── word/           # Word submission and browsing
  │   ├── api/                # API endpoints (in development)
  │   └── auth/               # Authentication pages
  ├── components/             # React components
  │   ├── ui/                 # Reusable UI components
  │   └── ...                 # Application-specific components
  ├── context/                # React context providers
  ├── data/                   # Data services and mock data
  ├── hooks/                  # Custom hooks
  └── lib/                    # Utility functions
```

## 🔜 Future Roadmap

- **Backend Implementation**: Complete API routes and database integration
- **AI Model Optimization**: Improve sign language recognition accuracy
- **Video-based Recognition**: Add support for video recognition
- **Expanded Language Support**: Add more sign languages beyond ASL and MSL
- **Avatar Rendering**: Add fully working Avatar Rendering
