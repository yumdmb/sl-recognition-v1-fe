import { Suspense } from 'react';
import { getAllProficiencyTestsServer } from '@/lib/services/server/proficiencyTestService';
import TestSelectionClient from '@/components/proficiency-test/TestSelectionClient';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// This page uses cookies() via Supabase auth, so it must be dynamically rendered
export const dynamic = 'force-dynamic';

// Loading component for Suspense fallback
function TestSelectionLoading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Select a Proficiency Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="pt-4">
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Error component
function TestSelectionError({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

// Server Component that fetches data
async function TestSelectionContent() {
  try {
    const tests = await getAllProficiencyTestsServer();
    return <TestSelectionClient tests={tests} />;
  } catch (error) {
    console.error('Failed to load tests:', error);
    return <TestSelectionError message="Failed to load available tests. Please try again later." />;
  }
}

// Main page component (Server Component)
export default function SelectProficiencyTestPage() {
  return (
    <Suspense fallback={<TestSelectionLoading />}>
      <TestSelectionContent />
    </Suspense>
  );
}
