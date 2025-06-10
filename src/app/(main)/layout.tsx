'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from "@/context/SidebarContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import AppSidebar from "@/components/AppSidebar";
import { Loader2 } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
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

  // If not authenticated, show nothing during redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <LanguageProvider>
        <AdminProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar userRole={currentUser?.role || 'non-deaf'} />

            {/* Main Content */}
            <div className="flex-1 transition-all duration-300">
              {/* Top Bar */}
              <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-30 h-[65px] flex items-center">
                <div className="container mx-auto">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/MyBIM-Logo-transparent-bg-300x227.png" 
                      alt="MyBIM Logo" 
                      className="h-10 w-auto"
                    />
                    <h1 className="text-2xl font-bold">SignBridge</h1>
                    {currentUser && (
                      <span className="ml-4 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                        {currentUser.role === 'admin' ? 'Admin' :
                          currentUser.role === 'deaf' ? 'Deaf Person' : 'Non-Deaf Person'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Page Content */}
              <div className="container mx-auto p-6">
                {children}
              </div>
            </div>
          </div>
        </AdminProvider>
      </LanguageProvider>
    </SidebarProvider>
  );
}