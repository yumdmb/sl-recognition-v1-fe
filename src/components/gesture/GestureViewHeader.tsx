'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye } from 'lucide-react';
import Link from 'next/link';

interface GestureViewHeaderProps {
  userRole?: string;
  isManageView?: boolean;
}

export default function GestureViewHeader({ userRole, isManageView }: GestureViewHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {userRole === 'admin' ? 'Moderation' : 'Your Library'}
        </p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">
          Gesture Contributions
        </h1>
        <p className="mt-1.5 max-w-xl text-muted-foreground">
          {userRole === 'admin'
            ? 'Manage and review community gesture contributions'
            : 'View and manage your gesture contributions'
          }
        </p>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/gesture/browse">
            <Eye className="mr-2 h-4 w-4" />
            Browse Gestures
          </Link>
        </Button>

        <Button asChild className="rounded-full">
          <Link href="/gesture/submit">
            <Plus className="mr-2 h-4 w-4" />
            Add Gesture
          </Link>
        </Button>
      </div>
    </div>
  );
}
