'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

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

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

export default function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  return (
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
  );
}
