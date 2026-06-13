'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SignBridge and who is it for?",
    answer: "SignBridge is a sign language learning platform for deaf and hard-of-hearing individuals, hearing learners, parents, educators, and interpreters. It supports both American Sign Language (ASL) and Malaysian Sign Language (MSL)."
  },
  {
    question: "How does AI gesture recognition work?",
    answer: "You can upload an image or enable your camera to perform a sign. Our system analyzes hand shape, movement, and position, then returns the most likely word match along with confidence scores."
  },
  {
    question: "Is SignBridge suitable for beginners?",
    answer: "Yes. New users can take a proficiency test to assess their level, then receive a personalized learning path with tutorials, quizzes, and materials matched to their progress."
  },
  {
    question: "What are 3D sign avatars used for?",
    answer: "3D avatars let you visualize a sign from multiple angles. You can generate an avatar from your own gesture recording or view avatars created by the community to understand hand positioning more clearly."
  },
  {
    question: "Can I contribute new signs to the dictionary?",
    answer: "Yes. Registered users can submit gesture images, recordings, or 3D avatar entries. Submissions are reviewed by moderators before being published to keep the dictionary accurate and reliable."
  },
  {
    question: "Is my camera data stored or shared?",
    answer: "Images captured for gesture recognition are processed for recognition only and are not used for advertising. Please see our Privacy Policy for full details on data handling."
  },
  {
    question: "Does SignBridge work on mobile devices?",
    answer: "Yes. SignBridge is built as a responsive web application, so you can learn and practice on phones, tablets, and desktops."
  }
];

export default function FAQSection() {
  return (
    <section className="py-20 bg-signlang-accent/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-signlang-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know before starting your sign language journey.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="border-b border-gray-100 last:border-0 px-4">
                <AccordionTrigger className="text-left text-signlang-dark hover:text-signlang-primary transition-colors duration-200 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-5">
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
