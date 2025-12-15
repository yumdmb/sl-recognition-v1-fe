'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, useScroll, useTransform } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "ASL Student",
    content: "SignBridge has transformed my learning experience. The AI recognition feature helps me practice with confidence!"
  },
  {
    name: "David Chen",
    role: "Sign Language Interpreter",
    content: "As a professional interpreter, I'm impressed by the accuracy and comprehensive nature of the platform."
  },
  {
    name: "Maria Rodriguez",
    role: "Parent",
    content: "My child and I are learning ASL together through SignBridge. It's intuitive and engaging!"
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
  },
  hover: {
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export default function TestimonialsSection() {
  const { scrollYProgress } = useScroll();

  return (
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
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-signlang-primary/20 text-signlang-primary font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
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
  );
}
