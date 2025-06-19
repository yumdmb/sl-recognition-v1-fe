"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Ear, EarOff } from "lucide-react";

interface AdminStatsProps {
  totalUsers: number;
  deafUsers: number;
  nonDeafUsers: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  totalUsers,
  deafUsers,
  nonDeafUsers,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">User Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-700">
              <Ear className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{deafUsers}</p>
              <p className="text-sm font-medium text-muted-foreground">Deaf Users</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-pink-100 text-pink-700">
              <EarOff className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{nonDeafUsers}</p>
              <p className="text-sm font-medium text-muted-foreground">Non-Deaf Users</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
