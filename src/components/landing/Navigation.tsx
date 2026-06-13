'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, BookOpen, Users, Sparkles, LayoutDashboard } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

interface NavigationProps {
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  featuresRef: React.RefObject<HTMLDivElement>;
  howItWorksRef: React.RefObject<HTMLDivElement>;
  aslRef: React.RefObject<HTMLDivElement>;
  mslRef: React.RefObject<HTMLDivElement>;
}

const navLinkStyles = "text-gray-600 hover:text-signlang-dark transition-colors duration-200 font-medium";

export default function Navigation({ 
  isAboutOpen, 
  setIsAboutOpen, 
  scrollToSection, 
  featuresRef,
  howItWorksRef,
  aslRef, 
  mslRef 
}: NavigationProps) {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollAndClose = (ref: React.RefObject<HTMLDivElement | null>) => {
    scrollToSection(ref);
    setIsMobileMenuOpen(false);
  };

  const aboutLinks = [
    { label: 'About ASL', ref: aslRef },
    { label: 'About MSL', ref: mslRef },
  ];

  return (
    <motion.header 
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/signbridge-logo-no-word.PNG"
              alt="SignBridge Logo"
              width={40}
              height={30}
              className="object-contain"
            />
            <span className="text-2xl font-bold text-signlang-dark">SignBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleScrollAndClose(featuresRef)}
              className={`px-3 py-2 rounded-md ${navLinkStyles}`}
            >
              Features
            </button>
            <button
              onClick={() => handleScrollAndClose(howItWorksRef)}
              className={`px-3 py-2 rounded-md ${navLinkStyles}`}
            >
              How It Works
            </button>
            
            {/* About Dropdown — only ASL/MSL */}
            <div className="relative" data-about-dropdown>
              <button
                className={`flex items-center space-x-1 px-3 py-2 rounded-md ${navLinkStyles}`}
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                aria-expanded={isAboutOpen}
                aria-haspopup="true"
              >
                <span>About</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isAboutOpen && (
                  <motion.div 
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {aboutLinks.map((link) => (
                      <button
                        key={link.label}
                        onClick={() => handleScrollAndClose(link.ref)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-signlang-accent hover:text-signlang-dark transition-colors duration-200"
                      >
                        {link.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/interaction/forum" 
              className={`px-3 py-2 rounded-md ${navLinkStyles} flex items-center gap-1.5`}
            >
              <Users className="h-4 w-4" />
              Community
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button 
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image
                      src="/signbridge-logo-no-word.PNG"
                      alt="SignBridge Logo"
                      width={32}
                      height={24}
                      className="object-contain"
                    />
                    <span className="text-xl font-bold text-signlang-dark">SignBridge</span>
                  </Link>
                </div>
                
                <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                  <button
                    onClick={() => handleScrollAndClose(featuresRef)}
                    className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-signlang-accent rounded-lg transition-colors"
                  >
                    <Sparkles className="h-5 w-5 mr-3 text-signlang-primary" />
                    Features
                  </button>
                  <button
                    onClick={() => handleScrollAndClose(howItWorksRef)}
                    className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-signlang-accent rounded-lg transition-colors"
                  >
                    <BookOpen className="h-5 w-5 mr-3 text-signlang-primary" />
                    How It Works
                  </button>
                  <button
                    onClick={() => handleScrollAndClose(aslRef)}
                    className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-signlang-accent rounded-lg transition-colors"
                  >
                    <BookOpen className="h-5 w-5 mr-3 text-signlang-primary" />
                    About ASL
                  </button>
                  <button
                    onClick={() => handleScrollAndClose(mslRef)}
                    className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-signlang-accent rounded-lg transition-colors"
                  >
                    <BookOpen className="h-5 w-5 mr-3 text-signlang-primary" />
                    About MSL
                  </button>
                  <Link
                    href="/interaction/forum"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-signlang-accent rounded-lg transition-colors"
                  >
                    <Users className="h-5 w-5 mr-3 text-signlang-primary" />
                    Community Forum
                  </Link>
                </div>

                <div className="p-4 border-t border-gray-100 space-y-2">
                  {isAuthenticated ? (
                    <Button asChild className="w-full">
                      <Link href="/dashboard" className="flex items-center justify-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/auth/register">Sign Up Free</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
