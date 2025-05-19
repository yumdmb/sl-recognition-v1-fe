'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, BookOpen, Users, ChevronDown, MessageCircle, Building, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import ImageSlideshow from "@/components/ImageSlideshow";
import { useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const aslRef = useRef<HTMLDivElement>(null);
  const mslRef = useRef<HTMLDivElement>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setIsAboutOpen(false);
    }
  };

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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-signlang-background text-foreground">
      {/* Header */}
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

      {/* Hero Section */}
      <main className="flex-grow">
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
                Learn Sign Language{' '}
                <span className="text-signlang-primary">Easily</span>
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

        {/* Features Section */}
        <section ref={featuresRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-signlang-primary/5 to-transparent"
            style={{
              y: useTransform(scrollYProgress, [0, 1], [0, -100])
            }}
          />
          <div className="container mx-auto px-4 relative">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              What Our Users Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="pt-6">
                      <motion.div 
                        className="flex items-center mb-4"
                        whileHover={{ scale: 1.02 }}
                      >
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
                      </motion.div>
                      <p className="text-gray-600">{testimonial.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About ASL Section */}
        <section ref={aslRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">About American Sign Language (ASL)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What is ASL?</h3>
                <p className="text-gray-600 mb-4">
                  American Sign Language (ASL) is a complete, natural language that has the same linguistic properties as spoken languages. It is expressed by movements of the hands and face, and is the primary language of many North Americans who are deaf and hard of hearing.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-6 w-6 text-signlang-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Rich History</h4>
                      <p className="text-gray-600">ASL has its own grammar and structure, distinct from English.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MessageCircle className="h-6 w-6 text-signlang-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Visual Communication</h4>
                      <p className="text-gray-600">Uses hand shapes, movements, facial expressions, and body language.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-6 w-6 text-signlang-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Cultural Significance</h4>
                      <p className="text-gray-600">Central to Deaf culture and community in North America.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px]">
                <Image
                  src="/family-talking.png"
                  alt="ASL Illustration"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About MSL Section */}
        <section ref={mslRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">About Malaysian Sign Language (MSL)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="order-2 md:order-1 relative h-[400px]">
                <Image
                  src="/group-of-people.png"
                  alt="MSL Illustration"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-xl font-semibold mb-4">What is MSL?</h3>
                <p className="text-gray-600 mb-4">
                  Malaysian Sign Language (MSL), or Bahasa Isyarat Malaysia (BIM), is the primary sign language used by the deaf community in Malaysia. It is a visual language that incorporates elements of Malaysian culture and local linguistic features.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-6 w-6 text-signlang-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Local Development</h4>
                      <p className="text-gray-600">Evolved to meet the needs of Malaysia's diverse communities.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MessageCircle className="h-6 w-6 text-signlang-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Unique Features</h4>
                      <p className="text-gray-600">Incorporates elements from Malaysian culture and languages.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-6 w-6 text-signlang-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-semibold">Growing Recognition</h4>
                      <p className="text-gray-600">Increasingly recognized and supported in Malaysian society.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is SignBridge?</AccordionTrigger>
                  <AccordionContent>
                    SignBridge is an innovative platform designed to help people learn and practice sign language using AI technology. It offers features like gesture recognition, comprehensive learning resources, and a community-driven word database.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does the gesture recognition work?</AccordionTrigger>
                  <AccordionContent>
                    Our gesture recognition system uses advanced AI and computer vision technology to analyze hand movements and gestures in real-time. You can either upload images or use your camera to practice and receive instant feedback.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is SignBridge suitable for beginners?</AccordionTrigger>
                  <AccordionContent>
                    Yes! SignBridge is designed for users of all levels. We offer structured tutorials, practice materials, and an intuitive learning path that helps beginners build a strong foundation in sign language.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                <li><Link href="/auth/login" className="text-gray-400 hover:text-white">Login</Link></li>
                <li><Link href="/auth/register" className="text-gray-400 hover:text-white">Sign Up</Link></li>
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
