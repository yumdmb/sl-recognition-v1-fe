'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Sparkles, BookOpen, Users, HandHeart, Brain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    icon: Camera,
    title: 'AI Gesture Recognition',
    description: 'Upload images or use your camera to recognize ASL and MSL gestures in real-time with instant feedback.',
    href: '/gesture-recognition/upload',
  },
  {
    icon: Sparkles,
    title: '3D Avatar Generation',
    description: 'Generate lifelike 3D avatars from your sign language gestures to visualize and share signs clearly.',
    href: '/avatar/generate',
  },
  {
    icon: BookOpen,
    title: 'Structured Learning',
    description: 'Follow video tutorials, take quizzes, and download materials tailored to your proficiency level.',
    href: '/learning/materials',
  },
  {
    icon: Brain,
    title: 'Proficiency Tests & Paths',
    description: 'Assess your skills and receive AI-generated learning paths that adapt as you improve.',
    href: '/proficiency-test/select',
  },
  {
    icon: HandHeart,
    title: 'Community Contributions',
    description: 'Submit new signs, help grow the dictionary, and get your contributions reviewed by moderators.',
    href: '/gesture/submit',
  },
  {
    icon: Users,
    title: 'Forum & Chat',
    description: 'Ask questions, share experiences, and practice with fellow learners in our community spaces.',
    href: '/interaction/forum',
  },
];

const cardVariants = {
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

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

export default function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  return (
    <section ref={featuresRef} className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-signlang-dark mb-4">
            Everything You Need to Learn Sign Language
          </h2>
          <p className="text-lg text-gray-600">
            From AI-powered recognition to community-driven content, SignBridge gives you the tools 
            to learn, practice, and connect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.href} className="block h-full">
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg hover:border-signlang-primary/30 transition-all duration-200 cursor-pointer group bg-white">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-signlang-accent flex items-center justify-center mb-4 group-hover:bg-signlang-primary/10 transition-colors duration-200">
                      <feature.icon className="h-6 w-6 text-signlang-primary" />
                    </div>
                    <CardTitle className="text-xl text-signlang-dark group-hover:text-signlang-primary transition-colors duration-200">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm font-semibold text-signlang-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Try it now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
