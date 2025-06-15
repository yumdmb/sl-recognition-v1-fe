'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Settings } from 'lucide-react';
import Link from 'next/link';

interface GestureViewHeaderProps {
  userRole?: string;
}

export default function GestureViewHeader({ userRole }: GestureViewHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Gesture Contributions</h1>
        <p className="text-muted-foreground mt-1">
          {userRole === 'admin' 
            ? 'Manage and review community gesture contributions'
            : 'View and manage your gesture contributions'
          }
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/gesture/browse">
            <Eye className="mr-2 h-4 w-4" />
            Browse Gestures
          </Link>
        </Button>
        
        <Button asChild>
          <Link href="/gesture/submit">
            <Plus className="mr-2 h-4 w-4" />
            Add Gesture
          </Link>
        </Button>
      </div>
    </div>
  );
}
