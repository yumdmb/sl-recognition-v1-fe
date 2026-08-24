'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, PersonStanding } from "lucide-react";
import { useRouter } from "next/navigation";

interface AvatarPageHeaderProps {
  userRole?: string;
}

const AvatarPageHeader: React.FC<AvatarPageHeaderProps> = ({ userRole }) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
          <PersonStanding className="size-6" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Avatar Studio</p>
          <h1 className="font-display mt-1 text-3xl font-extrabold tracking-tight">
            Avatar Generation
          </h1>
          <p className="mt-1 text-muted-foreground">
            Generate 3D avatars from your sign language gestures
          </p>
        </div>
      </div>
      <Button
        onClick={() => router.push(userRole === 'admin' ? '/avatar/admin-database' : '/avatar/my-avatars')}
        variant="outline"
        className="gap-2 rounded-full"
      >
        <Save className="h-4 w-4" />
        <span className="truncate">{userRole === 'admin' ? 'View Avatar Database' : 'View My Avatar'}</span>
      </Button>
    </div>
  );
};

export default AvatarPageHeader;
