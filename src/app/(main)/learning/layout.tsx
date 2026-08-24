'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LanguageSelector from '@/components/LanguageSelector';
import AdminModeToggle from '@/components/AdminModeToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { language } = useLanguage();

  // Parse current path to determine active tab
  const currentPath = pathname ? pathname.split('/').pop() || '' : '';

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Learn</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
              Learning hub
              <span className="ml-3 align-middle inline-block rounded-full border border-primary/25 bg-primary-soft px-2.5 py-1 align-middle text-xs font-bold tracking-normal text-primary">
                {language}
              </span>
            </h1>
            <p className="mt-1.5 text-muted-foreground">
              Tutorials, quizzes and reference materials for your level.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AdminModeToggle />
            <LanguageSelector className="w-[190px]" />
          </div>
        </div>

        <Tabs value={currentPath}>
          <TabsList className="h-11 w-full justify-start gap-1 rounded-xl bg-muted p-1 sm:w-auto">
            <TabsTrigger value="tutorials" asChild className="rounded-lg px-5 data-[state=active]:shadow-soft">
              <Link href="/learning/tutorials">Tutorials</Link>
            </TabsTrigger>
            <TabsTrigger value="quizzes" asChild className="rounded-lg px-5 data-[state=active]:shadow-soft">
              <Link href="/learning/quizzes">Quizzes</Link>
            </TabsTrigger>
            <TabsTrigger value="materials" asChild className="rounded-lg px-5 data-[state=active]:shadow-soft">
              <Link href="/learning/materials">Materials</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </div>
  );
}
