'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface AvatarPageHeaderProps {
  userRole?: string;
}

const AvatarPageHeader: React.FC<AvatarPageHeaderProps> = ({ userRole }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Avatar Generation</h1>
        <p className="text-muted-foreground text-sm md:text-base">Generate 3D avatars from your sign language gestures</p>
      </div>
      <Button 
        onClick={() => router.push(userRole === 'admin' ? '/avatar/admin-database' : '/avatar/my-avatars')}
        variant="outline"
        className="gap-2 w-full md:w-auto"
        size="sm"
      >
        <Save className="h-4 w-4" />
        <span className="truncate">{userRole === 'admin' ? 'View Avatar Database' : 'View My Avatar'}</span>
      </Button>
    </div>
  );
};

export default AvatarPageHeader;
