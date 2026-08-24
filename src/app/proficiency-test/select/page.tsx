'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAllProficiencyTests } from '@/lib/services/proficiencyTestService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Timer, ListChecks, Award, Sprout, Zap, Flame, ArrowRight, ClipboardCheck } from 'lucide-react';
import type { Database } from '@/types/database';
import { cn } from '@/lib/utils';

type ProficiencyTest = Database['public']['Tables']['proficiency_tests']['Row'];

const levelTheme = {
  Beginner: {
    icon: Sprout,
    tile: 'bg-primary-soft text-primary',
    blurb: 'Covers the essentials — perfect if you are just getting started.',
  },
  Intermediate: {
    icon: Zap,
    tile: 'bg-sun/10 text-sun',
    blurb: 'Builds on the basics with everyday vocabulary and phrasing.',
  },
  Advanced: {
    icon: Flame,
    tile: 'bg-coral/10 text-coral',
    blurb: 'A challenge for confident signers ready for fluent conversation.',
  },
} as const;

const getLevelForTest = (title: string): keyof typeof levelTheme => {
  const t = title.toLowerCase();
  if (t.includes('advanc')) return 'Advanced';
  if (t.includes('intermedi')) return 'Intermediate';
  return 'Beginner';
};

const heroStats = [
  { icon: Timer, label: 'Time', value: '10–15 min' },
  { icon: ListChecks, label: 'Format', value: 'Multiple choice' },
  { icon: Award, label: 'Result', value: 'Your level' },
];

const SelectProficiencyTestPage = () => {
  const router = useRouter();
  const [tests, setTests] = useState<ProficiencyTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const availableTests = await getAllProficiencyTests();
        setTests(availableTests);
      } catch (err) {
        setError('Failed to load available tests. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl py-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-9 w-2/3 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <Skeleton className="mt-8 h-48 w-full rounded-3xl" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Alert variant="destructive" className="max-w-lg rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Assessment</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Proficiency Test</h1>
          <p className="mt-1.5 max-w-xl text-muted-foreground">
            Find out where you stand. Pick a level, answer a short set of questions, and we will place
            you on the right learning path.
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          Back to dashboard
        </Button>
      </div>

      {/* Hero card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-8 overflow-hidden rounded-3xl bg-ink p-8 text-mint-soft shadow-lift"
      >
        <div className="bg-dots absolute inset-0 opacity-30" aria-hidden />
        <div
          className="absolute -top-20 right-0 size-64 rounded-full bg-primary/20 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
            <ClipboardCheck className="size-5" />
          </span>
          <h2 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-white">
            How the test works
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mint-soft/70">
            Answer every question honestly — there is no pass or fail. Your results set your starting
            level and shape the lessons SignBridge recommends for you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl border border-mint-soft/10 bg-primary/5 px-4 py-3"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
                  <stat.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mint-soft/60">
                    {stat.label}
                  </p>
                  <p className="text-sm font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Level options */}
      {tests.length > 0 ? (
        <div className="mt-10">
          <h3 className="font-display text-lg font-bold">Choose your starting level</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Not sure? Start lower — you can always re-take the test later.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test, i) => {
              const level = getLevelForTest(test.title);
              const theme = levelTheme[level];
              const isSelected = selectedTestId === test.id;

              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card
                    onClick={() => setSelectedTestId(test.id)}
                    className={cn(
                      'card-lift h-full cursor-pointer gap-0 border-2 p-5 transition-colors',
                      isSelected ? 'border-primary bg-primary-soft' : 'border-border bg-card'
                    )}
                  >
                    <CardContent className="flex h-full flex-col gap-4 p-0">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn('grid size-10 place-items-center rounded-xl', theme.tile)}>
                          <theme.icon className="size-5" />
                        </span>
                        <span
                          className={cn(
                            'mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
                            isSelected ? 'border-primary' : 'border-border'
                          )}
                        >
                          <span
                            className={cn(
                              'size-2.5 rounded-full bg-primary transition-opacity',
                              isSelected ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-display text-lg font-bold leading-snug">{test.title}</h4>
                          <Badge variant="outline" className="border-border/60 text-muted-foreground">
                            {level}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {test.description || theme.blurb}
                        </p>
                      </div>

                      <div className="mt-auto pt-2">
                        <Button
                          className="w-full"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => router.push(`/proficiency-test/${test.id}`)}
                        >
                          Start Test
                          <ArrowRight />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <ClipboardCheck className="size-6" />
          </span>
          <h3 className="font-display mt-5 text-lg font-bold">No tests available yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Proficiency tests are on their way. Check back soon to discover your level.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => router.push('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectProficiencyTestPage;
