'use client'

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface NavigationProps {
  isAboutOpen: boolean;
  setIsAboutOpen: (open: boolean) => void;
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  aslRef: React.RefObject<HTMLDivElement>;
  mslRef: React.RefObject<HTMLDivElement>;
}

export default function Navigation({ 
  isAboutOpen, 
  setIsAboutOpen, 
  scrollToSection, 
  aslRef, 
  mslRef 
}: NavigationProps) {
  return (
    <motion.header 
      className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src="/MyBIM-Logo-transparent-bg-300x227.png"
            alt="MyBIM Logo"
            width={64}
            height={48}
            className="object-contain"
          />
          <Link href="/" className="flex items-center text-4xl font-bold text-gray-900">
            <span>SignBridge</span>
          </Link>
        </motion.div>
        <nav className="hidden md:flex space-x-6 items-center">
          <div className="relative">
            <motion.button
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>About</span>
              <ChevronDown className="h-4 w-4" />
            </motion.button>
            {isAboutOpen && (
              <motion.div 
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.button
                  onClick={() => scrollToSection(aslRef)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  whileHover={{ x: 5 }}
                >
                  ASL (American Sign Language)
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection(mslRef)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  whileHover={{ x: 5 }}
                >
                  MSL (Malaysian Sign Language)
                </motion.button>
              </motion.div>
            )}
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}
