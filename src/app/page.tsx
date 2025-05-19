'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, BookOpen, Users, ChevronDown, MessageCircle, Building, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ImageSlideshow from "@/components/ImageSlideshow";

export default function LandingPage() {
  const features = [
    {
      icon: <Camera className="h-10 w-10 text-signlang-primary mb-4" />,
      title: 'Gesture Recognition',
      description: 'Upload images or use your camera to recognize sign language gestures in real-time.',
    },
    {
      icon: <BookOpen className="h-10 w-10 text-signlang-primary mb-4" />,
      title: 'Learning Resources',
      description: 'Access comprehensive tutorials, materials, and track your learning progress.',
    },
    {
      icon: <Users className="h-10 w-10 text-signlang-primary mb-4" />,
      title: 'Word Contributions',
      description: 'Submit and explore sign language words from different regions and cultures.',
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "ASL Student",
      content: "SignBridge has transformed my learning experience. The AI recognition feature helps me practice with confidence!",
      avatar: "/avatars/avatar1.png"
    },
    {
      name: "David Chen",
      role: "Sign Language Interpreter",
      content: "As a professional interpreter, I'm impressed by the accuracy and comprehensive nature of the platform.",
      avatar: "/avatars/avatar2.png"
    },
    {
      name: "Maria Rodriguez",
      role: "Parent",
      content: "My child and I are learning ASL together through SignBridge. It's intuitive and engaging!",
      avatar: "/avatars/avatar3.png"
    }
  ];

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

  return (
    <div className="flex flex-col min-h-screen bg-signlang-background text-foreground">
      {/* Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
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
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Button variant="ghost" className="hover:bg-signlang-primary hover:text-gray-900" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-signlang-primary text-gray-900 hover:bg-signlang-primary/90" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-white py-20 sm:py-28">
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
                Learn Sign Language Easily
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl text-gray-600 mb-10"
                variants={itemVariants}
              >
                Our platform helps you learn, practice, and recognize sign language gestures
                with advanced AI technology.
              </motion.p>
              <motion.div
                className="space-x-4"
                variants={itemVariants}
              >
                <Button size="lg" className="bg-signlang-primary text-gray-900 hover:bg-signlang-primary/90" asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/register">Get Started</Link>
                  </motion.div>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="hover:bg-signlang-primary hover:text-gray-900"
                >
                  Explore Features
                </Button>
              </motion.div>
            </div>
            <div className="order-first md:order-last">
              <ImageSlideshow />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div className="ml-4">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SignBridge</h3>
              <p className="text-gray-400">
                Empowering communication through sign language learning and recognition.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/learn" className="text-gray-400 hover:text-white">Learn</Link></li>
                <li><Link href="/practice" className="text-gray-400 hover:text-white">Practice</Link></li>
                <li><Link href="/community" className="text-gray-400 hover:text-white">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SignBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
