'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SignBridge?",
    answer: "SignBridge is an innovative platform designed to help people learn and practice sign language using AI technology. It offers features like gesture recognition, comprehensive learning resources, and a community-driven word database."
  },
  {
    question: "How does the gesture recognition work?",
    answer: "Our gesture recognition system uses advanced AI and computer vision technology to analyze hand movements and gestures in real-time. You can either upload images or use your camera to practice and receive instant feedback."
  },
  {
    question: "Is SignBridge suitable for beginners?",
    answer: "Yes! SignBridge is designed for users of all levels. We offer structured tutorials, practice materials, and an intuitive learning path that helps beginners build a strong foundation in sign language."
  }
];

export default function FAQSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
