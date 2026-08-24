'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import { useSidebar } from '@/context/SidebarContext';
import { LearningProvider } from "@/context/LearningContext";
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { Hand, Loader2 } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/gesture-recognition/upload': 'Recognise a Gesture',
  '/gesture-recognition/search': 'Word → Gesture Lookup',
  '/avatar/generate': 'Generate Avatar',
  '/avatar/my-avatars': 'My Avatars',
  '/avatar/admin-database': 'Avatar Database',
  '/learning/tutorials': 'Tutorials',
  '/learning/quizzes': 'Quizzes',
  '/learning/materials': 'Materials',
  '/interaction/chat': 'Personal Chat',
  '/interaction/forum': 'Forum',
  '/gesture/submit': 'Submit a Gesture',
  '/gesture/browse': 'Browse Gestures',
  '/gesture/view': 'Submissions',
  '/gesture/debug': 'Gesture Debug',
  '/profile': 'Profile',
  '/admin': 'Admin Settings',
};

function TopBar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  let title = pageTitles[pathname];
  if (!title) {
    // Quiz detail / edit pages
    if (pathname.startsWith('/learning/quizzes')) title = 'Quizzes';
    else title = 'SignBridge';
  }

  const roleLabel =
    userRole === 'admin' ? 'Administrator' : userRole === 'deaf' ? 'Deaf member' : 'Hearing learner';
  const roleTone =
    userRole === 'admin'
      ? 'border-sun/30 bg-sun/10 text-sun'
      : userRole === 'deaf'
        ? 'border-primary/25 bg-primary-soft text-primary'
        : 'border-sky/25 bg-sky/10 text-sky';

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center border-b border-border px-5 sm:px-8">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="font-display truncate text-lg font-bold tracking-tight">{title}</h1>
        </div>
        {userRole && (
          <span className={`hidden shrink-0 rounded-full border px-3 py-1 text-xs font-semibold sm:inline-block ${roleTone}`}>
            {roleLabel}
          </span>
        )}
      </div>
    </header>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const { state, openSidebar } = useSidebar();
  const pathname = usePathname();

  // Get page title from pathname (used for MobileHeader fallback)
  const getPageTitle = (path: string): string => {
    // Prefer curated pageTitles map, fallback to kebab-case conversion for dynamic routes
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith('/learning/quizzes')) return 'Quizzes';
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'SignBridge';
    
    const lastSegment = segments[segments.length - 1];
    // Convert kebab-case to Title Case
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Show loading spinner while checking authentication
  // Note: Middleware handles redirects, this is just for UX during hydration
  if (isLoading) {
    return (
      <div className="bg-grid flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-5">
          <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-ink text-mint shadow-lift">
            <Hand className="size-6 animate-pulse" />
          </span>
          <div className="space-y-2">
            <p className="font-display text-sm font-semibold">Loading SignBridge…</p>
            <div className="mx-auto h-1 w-24 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-full animate-pulse rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading (middleware will redirect)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-signlang-primary mx-auto" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <AdminProvider>
        <div className="flex min-h-screen w-full bg-background">
          {/* Mobile Header - Only visible on mobile */}
          {state.isMobile && (
            <MobileHeader 
              title={getPageTitle(pathname)}
              onMenuClick={openSidebar}
            />
          )}

          <AppSidebar userRole={currentUser?.role || 'non-deaf'} />

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar userRole={currentUser?.role || 'non-deaf'} />

            <main className={`mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 overflow-x-hidden ${state.isMobile ? 'pt-14' : ''}`}>
              {children}
            </main>
          </div>
        </div>
      </AdminProvider>
    </LanguageProvider>
  );
}
