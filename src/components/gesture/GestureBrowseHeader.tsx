'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Plus, ClipboardList } from 'lucide-react';
import Link from 'next/link';

interface GestureBrowseHeaderProps {
  userRole?: 'admin' | 'deaf' | 'non-deaf';
}

export default function GestureBrowseHeader({ userRole }: GestureBrowseHeaderProps) {
  const isAdmin = userRole === 'admin';
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Browse Gestures</h1>
        <p className="text-muted-foreground mt-1">
          Explore community-contributed sign language gestures and learn new signs
        </p>
      </div>
      
      <div className="flex gap-2">
        {isAdmin ? (
          <Button asChild variant="outline">
            <Link href="/gesture/manage-contributions">
              <ClipboardList className="mr-2 h-4 w-4" />
              Manage Contributions
            </Link>
          </Button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
