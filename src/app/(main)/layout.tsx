'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import SidebarOpenButton from '@/components/SidebarOpenButton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing during redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SidebarOpenButton />
        <AppSidebar userRole={currentUser?.role || 'user'} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="container mx-auto">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">SignBridge</h1>
                {currentUser && (
                  <span className="ml-4 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {currentUser.role === 'admin' ? 'Admin' :
                      currentUser.role === 'deaf' ? 'Deaf Person' : 'User'}
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
    </SidebarProvider>
  );
} 