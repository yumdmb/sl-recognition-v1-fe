'use client'

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import ImageSlideshow from "@/components/ImageSlideshow";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";

interface HeroSectionProps {
  scrollToFeatures: () => void;
  isAuthenticated: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function HeroSection({ scrollToFeatures, isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-signlang-accent/30 to-white py-16 sm:py-24 lg:py-28">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-signlang-primary/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-signlang-primary/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-left order-2 lg:order-1">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-signlang-primary/10 text-signlang-dark text-sm font-semibold mb-6"
              variants={itemVariants}
            >
              <Sparkles className="h-4 w-4 text-signlang-primary" />
              In collaboration with MyBIM
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-signlang-dark leading-tight"
              variants={itemVariants}
            >
              Bridge Every Conversation with{' '}
              <span className="text-signlang-primary">Sign Language</span>
            </motion.h1>
            
            <motion.p
              className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Learn ASL and MSL through AI-powered gesture recognition, interactive lessons, 
              3D avatar demonstrations, and a supportive community — built with the Malaysian 
              Sign Language and Deaf Studies National Organisation.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              {isAuthenticated ? (
                <Button size="lg" asChild className="group">
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="group">
                  <Link href="/auth/register" className="flex items-center justify-center gap-2">
                    Start Learning Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
              
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToFeatures}
                className="cursor-pointer"
              >
                Explore Features
              </Button>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-500"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-signlang-primary/20 border-2 border-white flex items-center justify-center text-xs font-bold text-signlang-dark"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Join learners worldwide</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>Loved by learners</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ImageSlideshow />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
