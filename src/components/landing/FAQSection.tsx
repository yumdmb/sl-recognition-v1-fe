'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { MessageCircleQuestion } from "lucide-react";

interface FAQSectionProps {
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const faqs = [
  {
    question: "What is SignBridge and who is it for?",
    answer:
      "SignBridge is a platform that helps people learn and practise sign language with AI. It combines gesture recognition, structured tutorials, quizzes, and a community-driven sign dictionary — with a focus on Bahasa Isyarat Malaysia (BIM) and American Sign Language (ASL). Ideal for deaf and hard-of-hearing individuals, hearing learners, parents, educators, and interpreters.",
  },
  {
    question: "How does the gesture recognition work?",
    answer:
      "Our recognition system uses computer vision to analyse hand shapes and movements. Upload a photo or use your camera in real time, and the model names the gesture with a confidence score — so you get instant feedback while practising. You can also enable your camera to perform a sign live.",
  },
  {
    question: "Is SignBridge suitable for complete beginners?",
    answer:
      "Yes. Start with the proficiency test so we can place you at the right level, then follow the tutorials and quizzes. Everything is self-paced, and the community forum is there when you get stuck. New users receive a personalized learning path matched to their progress.",
  },
  {
    question: "What are 3D sign avatars used for?",
    answer:
      "3D avatars let you visualize a sign from multiple angles. You can generate an avatar from your own gesture recording or view avatars created by the community to understand hand positioning more clearly.",
  },
  {
    question: "Can I contribute signs from my region?",
    answer:
      "Absolutely. The Gesture Contributions module lets anyone submit new signs with images or video. Registered users can submit gesture images, recordings, or 3D avatar entries. Submissions are reviewed by moderators before being published to keep the dictionary accurate and reliable.",
  },
  {
    question: "Is my camera data stored or shared?",
    answer:
      "Images captured for gesture recognition are processed for recognition only and are not used for advertising. Please see our Privacy Policy for full details on data handling.",
  },
  {
    question: "Does SignBridge work on mobile devices?",
    answer:
      "Yes. SignBridge is built as a responsive web application, so you can learn and practice on phones, tablets, and desktops.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "No — SignBridge is completely free. It began as a university research project to make sign-language education more accessible in Malaysia.",
  },
];

export default function FAQSection({ sectionRef }: FAQSectionProps) {
  return (
    <section ref={sectionRef} className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <MessageCircleQuestion className="size-6" />
          </span>
          <h2 className="font-display mt-5 text-3xl font-extrabold sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Everything you might want to know before creating an account. Still
            curious? Register and try it — it takes less than a minute.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="border-border">
                <AccordionTrigger className="text-left text-[15px] font-semibold hover:text-primary hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
