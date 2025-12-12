'use client'

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import ImageSlideshow from "@/components/ImageSlideshow";

interface HeroSectionProps {
  scrollToFeatures: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
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

export default function HeroSection({ scrollToFeatures }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 sm:py-28">
      <motion.div
        className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-left">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900"
            variants={itemVariants}
          >
            Master ASL and MSL with{' '}
            <span className="text-signlang-primary">AI-Powered Recognition</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-gray-600 mb-10"
            variants={itemVariants}
          >
            Bridge communication gaps with interactive tutorials, real-time gesture recognition,
            and a community-driven approach to learning American and Malaysian Sign Languages.
          </motion.p>
          <motion.div
            className="space-x-4"
            variants={itemVariants}
          >
            <Button size="lg" asChild>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/register">Get Started</Link>
              </motion.div>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={scrollToFeatures}
              asChild
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Features</span>
              </motion.div>
            </Button>
          </motion.div>
        </div>
        <motion.div 
          className="order-first md:order-last"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <ImageSlideshow />
        </motion.div>
      </motion.div>
    </section>
  );
}
