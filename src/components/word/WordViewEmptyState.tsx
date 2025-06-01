'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface WordViewEmptyStateProps {
  userRole?: string;
}

export default function WordViewEmptyState({ userRole }: WordViewEmptyStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Submissions Found</CardTitle>
        <CardDescription>
          {userRole === 'admin' 
            ? "There are no word submissions to review at this time."
            : "You haven't submitted any sign language words yet."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild>
          <Link href="/word/submit">Submit Your First Word</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
