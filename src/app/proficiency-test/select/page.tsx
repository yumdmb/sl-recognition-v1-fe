import { Suspense } from 'react';
import { getAllProficiencyTestsServer } from '@/lib/services/server/proficiencyTestService';
import LanguageSelectionClient from '@/components/proficiency-test/LanguageSelectionClient';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// This page uses cookies() via Supabase auth, so it must be dynamically rendered
export const dynamic = 'force-dynamic';

// Loading component for Suspense fallback
function LanguageSelectionLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <Skeleton className="w-16 h-16 rounded-full mb-6" />
      <Skeleton className="h-10 w-80 mb-4" />
      <Skeleton className="h-6 w-96 mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-8">
            <CardHeader className="flex items-center">
              <Skeleton className="h-16 w-16 rounded-full mb-4" />
            </CardHeader>
            <CardContent className="space-y-3 text-center">
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
              <Skeleton className="h-10 w-32 mx-auto mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Error component
function LanguageSelectionError({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

// Server Component that fetches data
async function LanguageSelectionContent() {
  try {
    const tests = await getAllProficiencyTestsServer();
    return <LanguageSelectionClient tests={tests} />;
  } catch (error) {
    console.error('Failed to load tests:', error);
    return <LanguageSelectionError message="Failed to load available tests. Please try again later." />;
  }
}

// Main page component (Server Component)
export default function SelectProficiencyTestPage() {
  return (
    <Suspense fallback={<LanguageSelectionLoading />}>
      <LanguageSelectionContent />
    </Suspense>
  );
}

