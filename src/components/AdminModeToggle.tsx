'use client'

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';

export default function AdminModeToggle() {
  const { isAdmin, setIsAdmin } = useAdmin();
  const { currentUser } = useAuth();
  
  // Only show for admin users
  if (currentUser?.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="admin-mode" 
        checked={isAdmin} 
        onCheckedChange={setIsAdmin}
      />
      <Label htmlFor="admin-mode" className="cursor-pointer">
        {isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}
      </Label>
    </div>
  );
} 