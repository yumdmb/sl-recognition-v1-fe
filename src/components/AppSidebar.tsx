'use client'

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Search,
  BookOpen,
  User,
  Menu,
  X,
  MessageCircle,
  Users,
  HandHeart,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { Toaster } from '@/components/ui/sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: ('admin' | 'deaf' | 'non-deaf')[];
}

type Props = {
  userRole: 'admin' | 'non-deaf' | 'deaf'
}

const AppSidebar: React.FC<Props> = ({ userRole }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const getMenuItems = (userRole: 'admin' | 'non-deaf' | 'deaf'): MenuItem[] => {
    const allItems: MenuItem[] = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: 'Gesture Recognition',
        href: '/gesture-recognition/upload',
        icon: Search,
      },
      {
        title: 'Gesture Dictionary',
        href: '/gesture-recognition/search',
        icon: BookOpen,
      },
      {
        title: userRole === 'admin' ? 'Manage Contributions' : 'My Contributions',
        href: userRole === 'admin' ? '/gesture/manage-contributions' : '/gesture/view',
        icon: HandHeart,
        roles: undefined, // Show to all roles
      },
      {
        title: '3D Avatar Generation',
        href: '/avatar/generate',
        icon: Sparkles,
      },
      {
        title: 'Learning Materials',
        href: '/learning/materials',
        icon: BookOpen,
      },
      {
        title: 'Forum',
        href: '/interaction/forum',
        icon: Users,
      },
      {
        title: 'Chat',
        href: '/interaction/chat',
        icon: MessageCircle,
      },
      {
        title: 'Profile',
        href: '/profile',
        icon: User,
      }
    ];

    // Filter items based on role if roles array is defined
    return allItems.filter(item => {
      if (!item.roles) return true; // Show to all if roles not specified
      return item.roles.includes(userRole);
    });
  };

  const menuItems = getMenuItems(userRole);
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push('/auth/login');
    }
  };

  return (
    <>
      <Toaster />
      <nav 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          state.isOpen ? 'w-64' : 'w-20'
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle Section */}
          <div className="h-[80px] flex items-center justify-between px-4 border-b border-gray-200">
            {state.isOpen ? (
              <>
                {/* Logo when sidebar is open */}
                <div className="flex items-center gap-2">
                  <Image
                    src="/signbridge-logo-no-word.PNG"
                    alt="SignBridge Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <span className="text-lg font-semibold text-gray-900">SignBridge</span>
                </div>
                {/* Toggle button on the right when open */}
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                {/* Centered logo when sidebar is collapsed */}
                <button
                  onClick={toggleSidebar}
                  className="flex flex-col items-center justify-center w-full gap-1 p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label="Expand sidebar"
                >
                  <Image
                    src="/signbridge-logo-no-word.PNG"
                    alt="SignBridge Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                  <Menu className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div
                key={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {state.isOpen && (
                  <span className="flex-1">{item.title}</span>
                )}
              </div>
            ))}
          </div>
          {isAuthenticated && currentUser && state.isOpen && (
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={currentUser.profile_picture_url || undefined} alt={currentUser.name} />
                  <AvatarFallback>
                    {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Add a spacer div to prevent content from being hidden under the sidebar */}
      <div 
        className={`transition-all duration-300 ${
          state.isOpen ? 'ml-64' : 'ml-20'
        }`}
      />
    </>
  );
};

export default AppSidebar; 