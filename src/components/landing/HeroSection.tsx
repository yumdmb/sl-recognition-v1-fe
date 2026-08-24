'use client'

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles, ScanFace, Flame } from "lucide-react";

interface HeroSectionProps {
  scrollToFeatures: () => void;
  isAuthenticated: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stats = [
  { value: "2", label: "Sign languages" },
  { value: "AI", label: "Gesture recognition" },
  { value: "100%", label: "Free to learn" },
];

export default function HeroSection({ scrollToFeatures, isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
      {/* Backdrop */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" />
      <div className="absolute -top-32 right-[-10%] size-[560px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] size-[420px] rounded-full bg-sky/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary-soft px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Bahasa Isyarat Malaysia · BIM &amp; ASL
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display mt-6 text-balance text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[4.4rem]"
          >
            Speak with your <span className="text-gradient-mint">hands</span>.
            <br />
            Be heard by <span className="relative inline-block">everyone.
              <svg
                className="absolute -bottom-2 left-0 w-full text-primary/50"
                viewBox="0 0 220 12"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M3 9C60 3 160 3 217 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            SignBridge turns your camera into a patient sign-language tutor — learn
            Malaysian and American Sign Language through structured lessons, quizzes,
            and real-time AI gesture recognition.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {isAuthenticated ? (
              <Button size="lg" asChild className="group">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="group">
                <Link href="/auth/register">
                  Start learning free
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={scrollToFeatures} className="group">
              <Play className="text-primary" />
              See how it works
            </Button>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-12 flex divide-x divide-border"
          >
            {stats.map((s) => (
              <div key={s.label} className="pr-8 pl-8 first:pl-0 last:pr-0">
                <dt className="font-display text-2xl font-bold">{s.value}</dt>
                <dd className="mt-0.5 text-xs font-medium text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          {/* Back card */}
          <div className="absolute -right-4 -top-4 h-full w-full rotate-3 rounded-[2rem] border border-primary/20 bg-primary-soft" aria-hidden />

          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-lift">
            <Image
              src="/family-talking.png"
              alt="A family practising sign language together"
              width={1040}
              height={820}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          </div>

          {/* Floating chip: recognition */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-border px-4 py-3 shadow-lift sm:-left-8"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ScanFace className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold">“Terima kasih”</p>
              <p className="text-xs text-muted-foreground">recognised in 0.4s</p>
            </div>
          </motion.div>

          {/* Floating chip: streak */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass absolute -bottom-5 right-6 flex items-center gap-3 rounded-2xl border border-border px-4 py-3 shadow-lift"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-sun/15 text-sun">
              <Flame className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold">12-day streak</p>
              <p className="text-xs text-muted-foreground">BIM quiz champion</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
