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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avatar Generation</h1>
        <p className="text-muted-foreground">Generate 3D avatars from your sign language gestures</p>
      </div>
      <Button 
        onClick={() => router.push(userRole === 'admin' ? '/avatar/admin-database' : '/avatar/my-avatars')}
        variant="outline"
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        {userRole === 'admin' ? 'View Avatar Database' : 'View My Avatar'}
      </Button>
    </div>
  );
};

export default AvatarPageHeader;
