'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ScanFace,
  Search,
  PersonStanding,
  BookOpen,
  GraduationCap,
  FolderOpen,
  MessageCircle,
  MessagesSquare,
  HandHeart,
  PlusCircle,
  LayoutGrid,
  ClipboardList,
  User,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Hand,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';
import { Toaster } from '@/components/ui/sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type Props = {
  userRole: 'admin' | 'non-deaf' | 'deaf';
};

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: { title: string; href: string; icon?: LucideIcon }[];
};

export function getNavGroups(userRole: 'admin' | 'non-deaf' | 'deaf') {
  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: 'Overview',
      items: [{ title: 'Dashboard', href: '/dashboard', icon: Home }],
    },
    {
      label: 'Recognise',
      items: [
        {
          title: 'Gesture Recognition',
          href: '/gesture-recognition',
          icon: ScanFace,
          subItems: [
            { title: 'Recognise a Gesture', href: '/gesture-recognition/upload' },
            { title: 'Word → Gesture Lookup', href: '/gesture-recognition/search' },
          ],
        },
        {
          title: 'Signing Avatars',
          href: '/avatar',
          icon: PersonStanding,
          subItems: [
            { title: 'Generate Avatar', href: '/avatar/generate' },
            {
              title: userRole === 'admin' ? 'Avatar Database' : 'My Avatars',
              href: userRole === 'admin' ? '/avatar/admin-database' : '/avatar/my-avatars',
            },
          ],
        },
      ],
    },
    {
      label: 'Learn',
      items: [
        {
          title: 'Learning Hub',
          href: '/learning',
          icon: BookOpen,
          subItems: [
            { title: 'Tutorials', href: '/learning/tutorials', icon: GraduationCap },
            { title: 'Quizzes', href: '/learning/quizzes', icon: ClipboardList },
            { title: 'Materials', href: '/learning/materials', icon: FolderOpen },
          ],
        },
      ],
    },
    {
      label: 'Community',
      items: [
        {
          title: 'Interaction',
          href: '/interaction',
          icon: MessageCircle,
          subItems: [
            { title: 'Personal Chat', href: '/interaction/chat' },
            { title: 'Forum', href: '/interaction/forum', icon: MessagesSquare },
          ],
        },
        {
          title: 'Gesture Contributions',
          href: '/gesture',
          icon: HandHeart,
          subItems: [
            { title: 'Submit a Gesture', href: '/gesture/submit', icon: PlusCircle },
            { title: 'Browse Gestures', href: '/gesture/browse', icon: LayoutGrid },
            {
              title: userRole === 'admin' ? 'Manage Submissions' : 'My Submissions',
              href: '/gesture/view',
            },
          ],
        },
      ],
    },
    {
      label: 'Account',
      items: [
        { title: 'Profile', href: '/profile', icon: User },
        ...(userRole === 'admin'
          ? [{ title: 'Admin Settings', href: '/admin', icon: Settings }]
          : []),
      ],
    },
  ];
  return groups;
}

const AppSidebar: React.FC<Props> = ({ userRole }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, toggleSidebar, closeSidebar } = useSidebar();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const groups = React.useMemo(() => getNavGroups(userRole), [userRole]);

  const isActive = (href: string) =>
    href === '/dashboard' || href === '/profile' || href === '/admin'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/');

  React.useEffect(() => {
    setExpandedItems((prev) => {
      const next = { ...prev };
      groups.forEach((g) =>
        g.items.forEach((item) => {
          if (item.subItems && (pathname === item.href || pathname.startsWith(item.href + '/'))) {
            next[item.href] = true;
          }
        })
      );
      return next;
    });
  }, [pathname, groups]);

  const initials = (currentUser?.name || 'U')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    if (state.isMobile) closeSidebar();
    const success = await logout();
    // origin had redirect handling, botanical just calls logout()
    // support both: if logout returns boolean, redirect, else rely on finally clear
    if (success === true) {
      router.push('/auth/login');
    } else if (success === false) {
      // already handled toast, still ensure close
    } else {
      // void logout (botanical) clears state via finally; push to login
      router.push('/auth/login');
    }
  };

  const handleNavigation = (href: string) => {
    if (state.isMobile) {
      closeSidebar();
    }
    router.push(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const hasSubs = !!item.subItems;
    const active = isActive(item.href);
    const open = !!expandedItems[item.href] && state.isOpen;

    if (hasSubs) {
      return (
        <li>
          <button
            onClick={() => {
              if (!state.isOpen) {
                toggleSidebar();
                handleNavigation(item.subItems![0].href);
              } else {
                setExpandedItems((prev) => ({ ...prev, [item.href]: !prev[item.href] }));
              }
            }}
            aria-expanded={open}
            className={cn(
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-accent text-white'
                : 'text-sidebar-foreground/75 hover:bg-white/5 hover:text-white',
              !state.isOpen && 'justify-center px-0'
            )}
            title={!state.isOpen ? item.title : undefined}
          >
            <item.icon className="size-4.5 shrink-0" strokeWidth={active ? 2.2 : 2} />
            {state.isOpen && (
              <>
                <span className="flex-1 truncate text-left">{item.title}</span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-sidebar-foreground/50 transition-transform duration-200',
                    open && 'rotate-180'
                  )}
                />
              </>
            )}
          </button>
          {state.isOpen && (
            <ul
              className={cn(
                'grid overflow-hidden transition-all duration-300',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <li className="min-h-0">
                <ul className="mt-1 space-y-0.5 border-l border-white/10 pl-3.5 ml-5">
                  {item.subItems!.map((sub) => {
                    const subActive = pathname === sub.href;
                    return (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          onClick={() => {
                            if (state.isMobile) closeSidebar();
                          }}
                          className={cn(
                            'relative block rounded-lg px-3 py-2 text-[13px] transition-colors',
                            subActive
                              ? 'font-semibold text-primary'
                              : 'text-sidebar-foreground/65 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute -left-[15px] top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full transition-opacity',
                              subActive ? 'bg-primary opacity-100' : 'opacity-0'
                            )}
                          />
                          {sub.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          )}
        </li>
      );
    }

    return (
      <li>
        <Link
          href={item.href}
          onClick={() => {
            if (state.isMobile) closeSidebar();
          }}
          className={cn(
            'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            active
              ? 'bg-sidebar-accent text-white'
              : 'text-sidebar-foreground/75 hover:bg-white/5 hover:text-white',
            !state.isOpen && 'justify-center px-0'
          )}
          title={!state.isOpen ? item.title : undefined}
        >
          <item.icon className="size-4.5 shrink-0" strokeWidth={active ? 2.2 : 2} />
          {state.isOpen && <span className="truncate">{item.title}</span>}
          {active && (
            <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-primary" />
          )}
        </Link>
      </li>
    );
  };

  const SidebarNavContent = () => (
    <>
      {/* Brand */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-white/10 px-4',
          !state.isOpen && !state.isMobile && 'justify-center px-0'
        )}
      >
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5" onClick={() => state.isMobile && closeSidebar()}>
          {state.isMobile ? (
            <span className="flex items-center gap-2">
              <Image
                src="/signbridge-logo-no-word.PNG"
                alt="SignBridge Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <span className="font-display text-lg font-bold text-white">
                Sign<span className="text-primary">Bridge</span>
              </span>
            </span>
          ) : (
            <>
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-sidebar-primary-foreground">
                <Hand className="size-4.5" strokeWidth={2.2} />
              </span>
              {state.isOpen && (
                <span className="font-display truncate text-[17px] font-bold text-white">
                  Sign<span className="text-primary">Bridge</span>
                </span>
              )}
            </>
          )}
        </Link>
        {state.isOpen && !state.isMobile && (
          <button
            onClick={toggleSidebar}
            className="ml-auto grid size-8 shrink-0 place-items-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
        {!state.isOpen && !state.isMobile && (
          <button
            onClick={toggleSidebar}
            className="mx-auto mb-2 grid size-9 place-items-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        )}
        {groups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            {state.isOpen && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/40">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="shrink-0 border-t border-white/10 p-3">
        {isAuthenticated && currentUser ? (
          <div
            className={cn(
              'flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5',
              !state.isOpen && !state.isMobile && 'justify-center'
            )}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={currentUser.profile_picture_url || undefined} alt={currentUser.name} />
              <AvatarFallback className="font-display bg-primary/20 text-sm font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            {state.isOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] capitalize text-sidebar-foreground/50">
                    {currentUser.role === 'admin'
                      ? 'Administrator'
                      : currentUser.role === 'deaf'
                        ? 'Deaf member'
                        : 'Hearing learner'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-destructive/15 hover:text-red-300"
                  aria-label="Log out"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <>
      <Toaster />
      {state.isMobile ? (
        <Sheet open={state.isOpen} onOpenChange={(open) => { if (!open) closeSidebar(); }}>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground border-sidebar-border flex flex-col">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex h-full flex-col">
              <SidebarNavContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <nav
            className={cn(
              'fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300',
              state.isOpen ? 'w-[272px]' : 'w-[76px]'
            )}
          >
            <SidebarNavContent />
          </nav>
          <div
            className={cn(
              'shrink-0 transition-[width] duration-300',
              state.isOpen ? 'w-[272px]' : 'w-[76px]'
            )}
          />
        </>
      )}
    </>
  );
};

export default AppSidebar;
