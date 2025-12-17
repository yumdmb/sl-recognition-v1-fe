'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, ClipboardList } from 'lucide-react';
import Link from 'next/link';

interface GestureViewHeaderProps {
  userRole?: string;
  isManageView?: boolean;
}

export default function GestureViewHeader({ userRole, isManageView = false }: GestureViewHeaderProps) {
  const isAdmin = userRole === 'admin';
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {isManageView ? 'Manage Contributions' : 'My Contributions'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isManageView 
            ? 'Review and manage all community gesture contributions'
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
        
        {isAdmin && !isManageView && (
          <Button asChild variant="outline">
            <Link href="/gesture/manage-contributions">
              <ClipboardList className="mr-2 h-4 w-4" />
              Manage All
            </Link>
          </Button>
        )}
        
        {!isManageView && (
          <Button asChild>
            <Link href="/gesture/submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Gesture
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
