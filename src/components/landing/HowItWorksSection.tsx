'use client'

import { motion } from "framer-motion";
import { Hand, BookOpen, Brain, Users } from "lucide-react";

const steps = [
  {
    number: '01',
    icon: Hand,
    title: 'Choose Your Language',
    description: 'Start with American Sign Language (ASL) or Malaysian Sign Language (MSL) and set your learning goals.'
  },
  {
    number: '02',
    icon: BookOpen,
    title: 'Learn & Practice',
    description: 'Watch tutorials, take quizzes, and use your camera to practice signs with instant AI feedback.'
  },
  {
    number: '03',
    icon: Brain,
    title: 'Test & Improve',
    description: 'Take proficiency tests to identify strengths and get a personalized learning path that grows with you.'
  },
  {
    number: '04',
    icon: Users,
    title: 'Connect & Contribute',
    description: 'Join forum discussions, chat with peers, and contribute new signs to help the community grow.'
  }
];

export default function HowItWorksSection({ howItWorksRef }: { howItWorksRef: React.RefObject<HTMLDivElement> }) {
  return (
    <section ref={howItWorksRef} className="py-20 bg-signlang-accent/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-signlang-dark mb-4">
            How SignBridge Works
          </h2>
          <p className="text-lg text-gray-600">
            A simple, four-step journey from your first sign to confident communication.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-6 h-full shadow-sm border border-gray-100 relative z-10">
                <span className="text-5xl font-bold text-signlang-primary/20 absolute top-4 right-4">
                  {step.number}
                </span>
                <div className="w-12 h-12 rounded-xl bg-signlang-accent flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-signlang-primary" />
                </div>
                <h3 className="text-xl font-bold text-signlang-dark mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-signlang-primary/30 z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
