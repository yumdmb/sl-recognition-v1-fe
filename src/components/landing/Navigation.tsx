'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hand, Menu, X, ChevronDown, Users } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

interface NavigationProps {
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  featuresRef?: React.RefObject<HTMLDivElement | null>;
  howItWorksRef?: React.RefObject<HTMLDivElement | null>;
  aslRef: React.RefObject<HTMLDivElement>;
  mslRef: React.RefObject<HTMLDivElement>;
  faqRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Navigation({
  isAboutOpen,
  setIsAboutOpen,
  scrollToSection,
  aslRef,
  mslRef,
  featuresRef,
  howItWorksRef,
  faqRef,
}: NavigationProps) {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    scrollToSection(ref);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4">
      <div
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border px-3 pl-4 transition-all duration-300 ${
          scrolled
            ? "glass border-border shadow-soft"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-ink text-mint shadow-soft transition-transform duration-300 group-hover:rotate-6">
            <Hand className="size-4.5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Sign<span className="text-primary">Bridge</span>
          </span>
          <span className="hidden rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:inline-block">
            MyBIM
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" data-about-dropdown>
          <div className="relative">
            <button
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              aria-expanded={isAboutOpen}
            >
              Learn about
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${isAboutOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isAboutOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsAboutOpen(false)} />
                <div className="absolute left-1/2 top-full z-20 mt-2 w-60 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lift">
                  <button
                    onClick={() => goTo(aslRef)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <span className="font-medium">ASL</span>
                    <span className="block text-xs text-muted-foreground">
                      American Sign Language
                    </span>
                  </button>
                  <button
                    onClick={() => goTo(mslRef)}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <span className="font-medium">BIM / MSL</span>
                    <span className="block text-xs text-muted-foreground">
                      Bahasa Isyarat Malaysia
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => featuresRef?.current && goTo(featuresRef as React.RefObject<HTMLDivElement | null>)}
            className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Features
          </button>
          {howItWorksRef && (
            <button
              onClick={() => howItWorksRef.current && goTo(howItWorksRef as React.RefObject<HTMLDivElement | null>)}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              How it works
            </button>
          )}
          <button
            onClick={() => faqRef?.current && goTo(faqRef as React.RefObject<HTMLDivElement | null>)}
            className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            FAQ
          </button>
          <Link
            href="/interaction/forum"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Users className="size-3.5" />
            Community
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Button className="rounded-full" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="rounded-full" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button className="rounded-full" asChild>
                <Link href="/auth/register">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="grid size-9 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-card p-3 shadow-lift md:hidden">
          <button
            onClick={() => goTo(aslRef)}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
          >
            About ASL
          </button>
          <button
            onClick={() => goTo(mslRef)}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
          >
            About BIM / MSL
          </button>
          <button
            onClick={() => featuresRef?.current && goTo(featuresRef as React.RefObject<HTMLDivElement | null>)}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
          >
            Features
          </button>
          {howItWorksRef && (
            <button
              onClick={() => howItWorksRef.current && goTo(howItWorksRef as React.RefObject<HTMLDivElement | null>)}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
            >
              How it works
            </button>
          )}
          <button
            onClick={() => faqRef?.current && goTo(faqRef as React.RefObject<HTMLDivElement | null>)}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
          >
            FAQ
          </button>
          <Link
            href="/interaction/forum"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
          >
            <Users className="size-4 text-primary" />
            Community Forum
          </Link>
          <div className="mt-2 flex gap-2 border-t border-border pt-3">
            {isAuthenticated ? (
              <Button className="flex-1" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/auth/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
