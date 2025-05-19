'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  BookOpen,
  Upload,
  User,
  Settings,
  LogIn,
  LogOut
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type Props = {
  userRole: 'admin' | 'user' | 'deaf'
}

const AppSidebar: React.FC<Props> = ({ userRole }) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  const getMenuItems = (userRole: 'admin' | 'user' | 'deaf') => {
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
          { title: 'Generate', href: '/avatar/generate-avatar' },
          { title: userRole === 'admin' ? 'Avatar Database' : 'My Avatar', href: userRole === 'admin' ? '/avatar/admin-database' : '/avatar/signbank' }
        ]
      },
      {
        title: 'Learning',
        href: '/learning',
        icon: BookOpen,
        subItems: [
          { title: 'Tutorials', href: '/learning/tutorials' },
          { title: 'Quizzes', href: '/learning/quiz' },
          { title: 'Download Materials', href: '/learning/materials' }
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

    // Add admin settings if user is admin
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
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged Out", {
      description: "You have been logged out successfully"
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center p-4 space-y-2 border-b">
        <div className="w-full flex justify-center">
          <img
            src="/MyBIM-Logo-transparent-bg-300x227.png"
            alt="MyBIM Logo"
            className="h-[90px] w-auto object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-center">SignBridge</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {isAuthenticated ? (
                menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {!item.subItems ? (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleExpand(item.title)}
                          tooltip={item.title}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronIcon
                            className="ml-auto h-4 w-4"
                            expanded={expandedItems.includes(item.title)}
                          />
                        </SidebarMenuButton>

                        {expandedItems.includes(item.title) && item.subItems && (
                          <SidebarMenu>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuItem key={subItem.href}>
                                <SidebarMenuButton
                                  asChild
                                  size="sm"
                                  isActive={isActive(subItem.href)}
                                >
                                  <Link href={subItem.href}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        )}
                      </>
                    )}
                  </SidebarMenuItem>
                ))
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/auth/login')}
                      tooltip="Login"
                    >
                      <Link href="/auth/login">
                        <LogIn />
                        <span>Login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/auth/register')}
                      tooltip="Register"
                    >
                      <Link href="/auth/register">
                        <User />
                        <span>Register</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 mb-2">
          SignBridge © elvis-eisraq
        </div>
        {isAuthenticated ? (
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium truncate">{currentUser?.name}</div>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm bg-signlang-primary text-gray-900 py-2 px-3 rounded-md w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {state === "collapsed" ? "" : "Logout"}
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className="flex items-center text-sm bg-signlang-primary text-gray-900 py-2 px-3 rounded-md w-full">
            <LogIn className="h-4 w-4 mr-2" />
            {state === "collapsed" ? "" : "Login / Register"}
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

const ChevronIcon: React.FC<{ className?: string, expanded: boolean }> = ({
  className, expanded
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s'
      }}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
};

export default AppSidebar; 