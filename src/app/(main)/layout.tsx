'use client';
import { useAuth } from '@/context/AuthContext';
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import AppSidebar from "@/components/AppSidebar";
import { Loader2 } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

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
          <AppSidebar userRole={currentUser?.role || 'non-deaf'} />

          {/* Main Content */}
          <div className="flex-1 transition-all duration-300">
            {/* Page Content */}
            <div className="container mx-auto p-6">
              {children}
            </div>
          </div>
        </div>
      </AdminProvider>
    </LanguageProvider>
  );
}