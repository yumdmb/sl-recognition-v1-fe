'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HandMetal } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const leftPanelVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const rightPanelVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delay: 0.2
    }
  }
};

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const handIconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: [0.1, 0.15, 0.12][i % 3],
    transition: {
      duration: 0.4,
      delay: 0.3 + i * 0.08,
      ease: 'backOut'
    }
  })
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const handPositions = [
    { className: 'top-10 left-10', size: 60, opacity: 'opacity-10' },
    { className: 'top-20 right-16', size: 80, opacity: 'opacity-15' },
    { className: 'top-40 left-32', size: 50, opacity: 'opacity-10' },
    { className: 'top-60 right-40', size: 70, opacity: 'opacity-[0.12]' },
    { className: 'bottom-40 left-20', size: 65, opacity: 'opacity-15' },
    { className: 'bottom-60 right-24', size: 55, opacity: 'opacity-10' },
    { className: 'bottom-20 left-40', size: 75, opacity: 'opacity-[0.12]' },
    { className: 'top-32 left-60', size: 45, opacity: 'opacity-10' },
    { className: 'bottom-32 right-60', size: 85, opacity: 'opacity-15' },
    { className: 'top-72 right-12', size: 60, opacity: 'opacity-10' },
    { className: 'bottom-72 left-16', size: 70, opacity: 'opacity-[0.12]' },
    { className: 'top-96 left-48', size: 50, opacity: 'opacity-10' },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Subtle decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl" 
          style={{ backgroundColor: 'rgba(123, 220, 181, 0.1)' }}
          animate={floatAnimation}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl" 
          style={{ backgroundColor: 'rgba(123, 220, 181, 0.1)' }}
          animate={{
            ...floatAnimation,
            transition: { ...floatAnimation.transition, delay: 1.5 }
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding & Info */}
        <motion.div 
          className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3d6b5f 0%, #5a9a8a 50%, #7BDCB5 100%)' }}
          variants={leftPanelVariants}
        >
          {/* Dispersed HandMetal icons throughout background */}
          {handPositions.map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos.className} ${pos.opacity}`}
              custom={i}
              variants={handIconVariants}
            >
              <HandMetal size={pos.size} />
            </motion.div>
          ))}

          {/* Logo at top */}
          <motion.div 
            className="absolute top-8 left-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/signbridge-logo-no-word.PNG"
                alt="SignBridge Logo"
                width={40}
                height={30}
                className="object-contain brightness-0 invert"
              />
              <span className="text-xl font-bold">SignBridge</span>
            </Link>
          </motion.div>

          {/* Centered welcome message */}
          <motion.div 
            className="text-center z-10"
            variants={textVariants}
          >
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Welcome to <span style={{ color: '#c8f7e8' }}>SignBridge</span>
            </motion.h1>
            <motion.p 
              className="text-xl" 
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Your journey to meaningful communication starts here
            </motion.p>
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="absolute bottom-8 left-8 text-sm" 
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            © 2025 SignBridge
          </motion.div>
        </motion.div>

        {/* Right side - Auth form */}
        <motion.div 
          className="flex-1 flex items-center justify-center p-4 sm:p-8"
          variants={rightPanelVariants}
        >
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <motion.div 
              className="lg:hidden mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="inline-flex items-center space-x-2">
                <Image
                  src="/signbridge-logo-no-word.PNG"
                  alt="SignBridge Logo"
                  width={48}
                  height={36}
                  className="object-contain"
                />
                <span className="text-2xl font-bold text-gray-900">SignBridge</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
