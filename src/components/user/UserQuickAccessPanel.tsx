"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserQuickAccessPanelProps {
  userRole: 'non-deaf' | 'deaf';
}

export const UserQuickAccessPanel: React.FC<UserQuickAccessPanelProps> = ({ userRole }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Recognize Sign Language</h3>
        <p className="text-gray-500 mb-4">Upload images to identify signs</p>
        <Button className="w-full">Start Recognition</Button>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Continue Learning</h3>
        <p className="text-gray-500 mb-4">Resume your sign language lessons</p>
        <Button className="w-full">Go to Lessons</Button>
      </CardContent>
    </Card>
  </div>
);
