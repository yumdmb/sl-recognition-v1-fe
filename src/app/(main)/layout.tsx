'use client';
import { useAuth } from '@/context/AuthContext';
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import { useSidebar } from '@/context/SidebarContext';
import AppSidebar from "@/components/AppSidebar";
import MobileHeader from "@/components/MobileHeader";
import { Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const { state, openSidebar } = useSidebar();
  const pathname = usePathname();

  // Get page title from pathname
  const getPageTitle = (path: string): string => {
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-signlang-primary mx-auto" />
          <p className="text-gray-600">Loading...</p>
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
        <div className="flex min-h-screen w-full">
          {/* Mobile Header - Only visible on mobile */}
          {state.isMobile && (
            <MobileHeader 
              title={getPageTitle(pathname)}
              onMenuClick={openSidebar}
            />
          )}

          <AppSidebar userRole={currentUser?.role || 'non-deaf'} />

          {/* Main Content */}
          <div className="flex-1 transition-all duration-300 overflow-x-hidden">
            {/* Page Content with mobile padding for fixed header */}
            <div className={`container mx-auto px-4 py-4 md:p-6 overflow-x-hidden ${state.isMobile ? 'pt-14' : ''}`}>
              {children}
            </div>
          </div>
        </div>
      </AdminProvider>
    </LanguageProvider>
  );
}