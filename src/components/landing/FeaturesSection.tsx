'use client';

import { motion } from "framer-motion";
import {
  Camera,
  BookOpen,
  Users,
  Bot,
  MessagesSquare,
  PersonStanding,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.07 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  return (
    <section ref={featuresRef} className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <div className="max-w-2xl">
          <motion.p
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-xs font-bold uppercase tracking-[0.18em] text-primary"
          >
            Everything in one place
          </motion.p>
          <motion.h2
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="font-display mt-3 text-balance text-3xl font-extrabold sm:text-4xl"
          >
            Learn, practise, and get recognised — in one loop
          </motion.h2>
          <motion.p
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            className="mt-4 text-lg text-muted-foreground"
          >
            A complete toolkit for learners and the Deaf community, built around how
            sign language is actually used.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Large: recognition */}
          <motion.div
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
            className="card-lift group relative overflow-hidden rounded-3xl border border-border bg-ink p-7 text-mint-soft sm:col-span-2 lg:row-span-2"
          >
            <div className="bg-dots absolute inset-0 opacity-40" />
            <div className="absolute -bottom-24 -right-24 size-64 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Camera className="size-5.5" />
              </span>
              <h3 className="font-display mt-5 text-2xl font-bold text-white">
                Real-time gesture recognition
              </h3>
              <p className="mt-3 max-w-sm leading-relaxed text-mint-soft/70">
                Point your camera at a sign — or upload a photo — and our AI names the
                gesture in milliseconds. Perfect for solo practice when no partner is
                around.
              </p>

              {/* Fake recognition readout */}
              <div className="mt-8 space-y-2.5">
                {[
                  { word: "Hello", conf: "98%" },
                  { word: "Terima kasih", conf: "94%" },
                  { word: "Kawan", conf: "91%" },
                ].map((r) => (
                  <div
                    key={r.word}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
                  >
                    <span className="text-sm font-medium text-white">{r.word}</span>
                    <span className="flex items-center gap-2 text-xs text-mint-soft/60">
                      <span className="h-1 w-20 overflow-hidden rounded-full bg-white/10">
                        <span
                          className="block h-full rounded-full bg-primary"
                          style={{ width: r.conf }}
                        />
                      </span>
                      {r.conf}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Learning */}
          <motion.div
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
            className="card-lift rounded-3xl border border-border bg-card p-7 shadow-soft"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary">
              <BookOpen className="size-5.5" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">Guided lessons</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Tutorials, materials and quizzes with progress tracking from first sign
              to fluent conversation.
            </p>
          </motion.div>

          {/* Avatar */}
          <motion.div
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}
            className="card-lift rounded-3xl border border-border bg-card p-7 shadow-soft"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-sky/10 text-sky">
              <PersonStanding className="size-5.5" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">Signing avatars</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Generate a virtual signer that demonstrates any word in the dictionary,
              frame by frame.
            </p>
          </motion.div>

          {/* Community */}
          <motion.div
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={5}
            className="card-lift rounded-3xl border border-border bg-card p-7 shadow-soft"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-coral/10 text-coral">
              <Users className="size-5.5" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">Community dictionary</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Contribute regional signs, browse submissions, and help the BIM
              dictionary grow.
            </p>
          </motion.div>

          {/* Chat */}
          <motion.div
            variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6}
            className="card-lift rounded-3xl border border-border bg-card p-7 shadow-soft"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-sun/10 text-sun">
              <MessagesSquare className="size-5.5" />
            </span>
            <h3 className="font-display mt-5 text-lg font-bold">Chat &amp; forum</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ask an AI assistant or swap tips with learners across the community.
            </p>
          </motion.div>
        </div>

        {/* How it works */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { n: "01", t: "Take the proficiency test", d: "A quick check places you at the right starting level." },
            { n: "02", t: "Learn with lessons & quizzes", d: "Short tutorials and spaced quizzes lock in each sign." },
            { n: "03", t: "Practise with live recognition", d: "Sign at your camera and get instant feedback." },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="relative"
            >
              <span className="font-display text-sm font-bold text-primary">{step.n}</span>
              <h4 className="font-display mt-2 text-lg font-bold">{step.t}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              {i < 2 && (
                <ArrowRight className="absolute -right-4 top-1 hidden size-4 text-border sm:block" aria-hidden />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
          className="mt-14 flex justify-center"
        >
          <Button size="lg" variant="outline" className="group rounded-full" asChild>
            <Link href="/auth/register">
              Create your free account
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
