"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface AdminActivitySummaryProps {
  userRole: string;
}

export const AdminActivitySummary: React.FC<AdminActivitySummaryProps> = ({ userRole }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-green-400 pl-4">
          <p className="font-medium">User account approved</p>
          <p className="text-sm text-gray-500">10 minutes ago</p>
        </div>
        <div className="border-l-4 border-blue-400 pl-4">
          <p className="font-medium">System backup completed</p>
          <p className="text-sm text-gray-500">2 hours ago</p>
        </div>
        <div className="border-l-4 border-purple-400 pl-4">
          <p className="font-medium">Recognition model updated</p>
          <p className="text-sm text-gray-500">Yesterday at 15:30</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
