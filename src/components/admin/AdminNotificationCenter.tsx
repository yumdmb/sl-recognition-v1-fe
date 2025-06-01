"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Users } from "lucide-react";

interface AdminNotificationCenterProps {
  userRole: string;
  pendingVerifications: number;
}

export const AdminNotificationCenter: React.FC<AdminNotificationCenterProps> = ({ 
  userRole, 
  pendingVerifications 
}) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
      <div className="space-y-4">
        {pendingVerifications > 0 && (
          <div className="flex gap-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
            <div className="text-amber-500">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">New account verification needed</p>
              <p className="text-sm text-gray-500">
                {pendingVerifications} new user{pendingVerifications === 1 ? '' : 's'} awaiting verification
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <div className="text-blue-500">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Word contribution submitted</p>
            <p className="text-sm text-gray-500">New sign language word awaiting approval</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
