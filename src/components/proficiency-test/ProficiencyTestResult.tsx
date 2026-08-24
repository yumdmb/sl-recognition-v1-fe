'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, ArrowLeft, Sparkles } from 'lucide-react';

interface ProficiencyTestResultProps {
  score: number;
  proficiencyLevel: string;
}

const levelBlurb: Record<string, string> = {
  Beginner: 'A great place to start — we will begin with the fundamentals.',
  Intermediate: 'Nice work — you are ready for everyday conversations.',
  Advanced: 'Impressive — fluent material and nuances await you.',
};

const ProficiencyTestResult: React.FC<ProficiencyTestResultProps> = ({ score, proficiencyLevel }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-2xl items-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <Card className="overflow-hidden rounded-2xl shadow-soft">
          {/* Score hero */}
          <div className="relative overflow-hidden bg-ink px-8 py-10 text-center text-mint-soft">
            <div className="bg-dots absolute inset-0 opacity-30" aria-hidden />
            <div
              className="absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Trophy className="size-6" />
              </span>

              <div className="relative mx-auto mt-6 size-40">
                <svg viewBox="0 0 160 160" className="size-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    className="stroke-mint-soft/15"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="stroke-primary transition-[stroke-dashoffset] duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-display text-5xl font-extrabold tracking-tight text-white">
                    {score}
                    <span className="text-2xl">%</span>
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-mint-soft/60">
                    Your score
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
                  <Sparkles />
                  {proficiencyLevel} level
                </Badge>
              </div>
            </div>
          </div>

          {/* Details */}
          <CardContent className="space-y-6 p-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">Test complete!</h2>
              <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                {levelBlurb[proficiencyLevel] ||
                  'Your lessons and practice sessions are now tailored to your level.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Score
                </p>
                <p className="font-display mt-1 text-2xl font-extrabold text-primary">{score}%</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Level achieved
                </p>
                <p className="font-display mt-1 text-2xl font-extrabold">{proficiencyLevel}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/dashboard" passHref>
                <Button size="lg">
                  <ArrowLeft />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProficiencyTestResult;
