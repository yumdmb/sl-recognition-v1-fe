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
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Community Library
        </p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
          Browse Gestures
        </h1>
        <p className="mt-1.5 max-w-xl text-muted-foreground">
          Explore community-contributed sign language gestures and learn new signs
        </p>
      </div>
      
      <div className="flex gap-2">
        {isAdmin ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/gesture/manage-contributions">
              <ClipboardList className="mr-2 h-4 w-4" />
              Manage Contributions
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/gesture/view">
                <Eye className="mr-2 h-4 w-4" />
                My Contributions
              </Link>
            </Button>
            
            <Button asChild className="rounded-full">
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
