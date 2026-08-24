'use client';

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "ASL Student",
    initials: "SJ",
    tone: "bg-primary-soft text-primary",
    content:
      "The recognition feature changed everything for me. I can practise at midnight without a partner and still know if my signs land.",
  },
  {
    name: "Aisha Rahman",
    role: "MSL Learner",
    initials: "AR",
    tone: "bg-mint/10 text-mint-deep",
    content:
      "The 3D avatar feature helped me see exactly how hand shapes should look from different angles. It made learning MSL so much clearer than photos alone.",
  },
  {
    name: "Lim Wei Jie",
    role: "Parent of a Deaf Child",
    initials: "LW",
    tone: "bg-sun/10 text-sun",
    content:
      "My child and I practice together using the camera recognition. Getting instant feedback keeps them motivated, and the learning path shows us what to focus on next.",
  },
  {
    name: "Dr. Priya Nair",
    role: "Special Education Teacher",
    initials: "PN",
    tone: "bg-sky/10 text-sky",
    content:
      "SignBridge gives my students structured tutorials, quizzes, and a safe forum to ask questions. The gesture dictionary is becoming a valuable classroom resource.",
  },
  {
    name: "Kevin Tan",
    role: "Sign Language Interpreter",
    initials: "KT",
    tone: "bg-coral/10 text-coral",
    content:
      "I use the gesture recognition tool to double-check signs, and I contribute new entries to help grow the dictionary. It is a great way to give back to the community.",
  },
  {
    name: "Maria Rodriguez",
    role: "Parent & Learner",
    initials: "MR",
    tone: "bg-coral/10 text-coral",
    content:
      "My daughter and I learn together every evening. The streaks and quizzes keep us both coming back — she's beating me.",
  },
  {
    name: "Nurul Huda",
    role: "University Student",
    initials: "NH",
    tone: "bg-primary-soft text-primary",
    content:
      "The proficiency test placed me at the right level and the AI learning path keeps me on track. I have gone from beginner to intermediate in three months.",
  },
  {
    name: "Ahmad Fauzi",
    role: "Deaf Community Advocate",
    initials: "AF",
    tone: "bg-sun/10 text-sun",
    content:
      "It is refreshing to see a platform that respects both ASL and MSL. The forum lets deaf and hearing learners connect and learn from each other.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-mint-soft sm:py-24">
      <div className="bg-dots absolute inset-0 opacity-30" aria-hidden />
      <div className="absolute -left-24 top-0 size-96 rounded-full bg-primary/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Loved by learners
          </p>
          <h2 className="font-display mt-3 text-balance text-3xl font-extrabold text-white sm:text-4xl">
            A bridge between communities
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-mint-soft/60">
            Learners, educators, and advocates are using SignBridge to build communication bridges.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="card-lift flex flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
            >
              <Quote className="size-6 text-primary/70" aria-hidden />
              <blockquote className="mt-4 flex-1 leading-relaxed text-mint-soft/90">
                “{t.content}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <span className={`font-display grid size-11 place-items-center rounded-full text-sm font-bold ${t.tone}`}>
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-mint-soft/60">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
