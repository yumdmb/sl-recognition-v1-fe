'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/database';

type ProficiencyTest = Database['public']['Tables']['proficiency_tests']['Row'];

interface TestSelectionClientProps {
  tests: ProficiencyTest[];
}

export default function TestSelectionClient({ tests }: TestSelectionClientProps) {
  const router = useRouter();

  if (tests.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Select a Proficiency Test</h1>
        <p>No proficiency tests are currently available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Select a Proficiency Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{test.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
              <Button 
                className="w-full" 
                onClick={() => router.push(`/proficiency-test/${test.id}`)}
              >
                Start Test
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
