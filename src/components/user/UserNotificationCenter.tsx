"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserNotificationCenterProps {}

export const UserNotificationCenter: React.FC<UserNotificationCenterProps> = () => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
      <div className="space-y-4">
        <div className="flex gap-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <div className="text-green-500">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Achievement Unlocked!</p>
            <p className="text-sm text-gray-500">You&apos;ve completed your first tutorial</p>
          </div>
        </div>
        <div className="flex gap-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <div className="text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">New Learning Material</p>
            <p className="text-sm text-gray-500">Check out the new tutorial on greetings</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
