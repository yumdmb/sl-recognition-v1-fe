"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileCheck } from "lucide-react";

interface AdminStatsProps {
  totalUsers: number;
  pendingVerifications: number;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ 
  totalUsers, 
  pendingVerifications 
}) => {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: <Users className="h-5 w-5" />,
      change: "+12% from last month",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Pending Verifications",
      value: pendingVerifications.toString(),
      icon: <FileCheck className="h-5 w-5" />,
      change: pendingVerifications > 0 ? "Requires attention" : "All verified",
      color: pendingVerifications > 0 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
