'use client'

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Search,
  BookOpen,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

type Props = {
  userRole: 'admin' | 'non-deaf' | 'deaf'
}

const AppSidebar: React.FC<Props> = ({ userRole }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (href: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const getMenuItems = (userRole: 'admin' | 'non-deaf' | 'deaf') => {
    const baseItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        title: 'Gesture Recognition',
        href: '/gesture-recognition',
        icon: Search,
        subItems: [
          { title: 'Upload Image → Get Word', href: '/gesture-recognition/upload' },
          { title: 'Search Word → View Gesture Image', href: '/gesture-recognition/search' }
        ]
      },
      {
        title: 'Avatar Generation',
        href: '/avatar',
        icon: User,
        subItems: [
          { title: 'Generate', href: '/avatar/generate' },
          { title: userRole === 'admin' ? 'Avatar Database' : 'My Avatar', href: userRole === 'admin' ? '/avatar/admin-database' : '/avatar/my-avatars' }
        ]
      },
      {
        title: 'Learning',
        href: '/learning',
        icon: BookOpen,
        subItems: [
          { title: 'Tutorials', href: '/learning/tutorials' },
          { title: 'Quizzes', href: '/learning/quizzes' },
          { title: 'Materials', href: '/learning/materials' }
        ]
      },
      {
        title: 'Word Contributions',
        href: '/word',
        icon: BookOpen,
        subItems: [
          { title: 'Submit New Word', href: '/word/submit' },
          { title: userRole === 'admin' ? 'All Submissions' : 'View Own Submissions', href: '/word/view' }
        ]
      },
      {
        title: 'Profile',
        href: '/profile',
        icon: User,
      }
    ];

    if (userRole === 'admin') {
      baseItems.push({
        title: 'Admin Settings',
        href: '/admin',
        icon: Settings,
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems(userRole);

  const handleLogout = () => {
    logout();
    toast.success("Logged Out", {
      description: "You have been logged out successfully"
    });
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
          {/* Toggle Button */}
          <div className="h-[65px] flex items-center justify-center border-b border-gray-200">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center w-full p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors mx-4"
              aria-label={state.isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {state.isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.href}>
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => item.subItems ? toggleItem(item.href) : handleNavigation(item.href)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {state.isOpen && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.subItems && (
                        expandedItems[item.href] ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </div>
                {state.isOpen && item.subItems && expandedItems[item.href] && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <div
                        key={subItem.href}
                        onClick={() => handleNavigation(subItem.href)}
                        className={`block px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                          pathname === subItem.href
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {subItem.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAuthenticated && currentUser && state.isOpen && (
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {currentUser.email}
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