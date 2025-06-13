'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Plus } from 'lucide-react';
import Link from 'next/link';

export default function GestureBrowseHeader() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Gestures</h1>
        <p className="text-muted-foreground mt-1">
          Explore community-contributed sign language gestures and learn new signs
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/gesture/view">
            <Eye className="mr-2 h-4 w-4" />
            My Contributions
          </Link>
        </Button>
        
        <Button asChild>
          <Link href="/gesture/submit">
            <Plus className="mr-2 h-4 w-4" />
            Contribute Gesture
          </Link>
        </Button>
      </div>
    </div>
  );
}
