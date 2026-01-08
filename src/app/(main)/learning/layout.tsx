'use client'

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
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col space-y-4 md:space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Learning {language}</h1>
          <div className="flex items-center space-x-4">
            <AdminModeToggle />
            <LanguageSelector className="w-[300px]" />
          </div>
        </div>
        
        <Tabs value={currentPath} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tutorials" asChild>
              <Link href="/learning/tutorials">Tutorials</Link>
            </TabsTrigger>
            <TabsTrigger value="quizzes" asChild>
              <Link href="/learning/quizzes">Quizzes</Link>
            </TabsTrigger>
            <TabsTrigger value="materials" asChild>
              <Link href="/learning/materials">Materials</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {children}
      </div>
    </div>
  );
} 