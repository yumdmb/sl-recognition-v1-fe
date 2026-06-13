'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Rahman",
    role: "MSL Learner",
    content: "The 3D avatar feature helped me see exactly how hand shapes should look from different angles. It made learning MSL so much clearer than photos alone."
  },
  {
    name: "Lim Wei Jie",
    role: "Parent of a Deaf Child",
    content: "My child and I practice together using the camera recognition. Getting instant feedback keeps them motivated, and the learning path shows us what to focus on next."
  },
  {
    name: "Dr. Priya Nair",
    role: "Special Education Teacher",
    content: "SignBridge gives my students structured tutorials, quizzes, and a safe forum to ask questions. The gesture dictionary is becoming a valuable classroom resource."
  },
  {
    name: "Kevin Tan",
    role: "Sign Language Interpreter",
    content: "I use the gesture recognition tool to double-check signs, and I contribute new entries to help grow the dictionary. It is a great way to give back to the community."
  },
  {
    name: "Nurul Huda",
    role: "University Student",
    content: "The proficiency test placed me at the right level and the AI learning path keeps me on track. I have gone from beginner to intermediate in three months."
  },
  {
    name: "Ahmad Fauzi",
    role: "Deaf Community Advocate",
    content: "It is refreshing to see a platform that respects both ASL and MSL. The forum lets deaf and hearing learners connect and learn from each other."
  }
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

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-signlang-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-signlang-dark mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-gray-600">
            Learners, educators, and advocates are using SignBridge to build communication bridges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-200 bg-white">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-signlang-primary/30 mb-4" />
                  <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
                  <div className="flex items-center">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-signlang-accent text-signlang-dark font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-semibold text-signlang-dark">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
