"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { Video, BookOpen, PlusSquare } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UserQuickAccessPanelProps {}

export const UserQuickAccessPanel: React.FC<UserQuickAccessPanelProps> = () => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Quick Access</h3>
      <div className="space-y-4">
        <Link href="/gesture-recognition/upload">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <Video className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Recognize Gesture</p>
              <p className="text-sm text-muted-foreground">Translate sign language from a video or your camera.</p>
            </div>
          </div>
        </Link>
        <Link href="/learning/tutorials">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <BookOpen className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Tutorials</p>
              <p className="text-sm text-muted-foreground">Learn new signs and improve your skills.</p>
            </div>
          </div>
        </Link>
        <Link href="/gesture/submit">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <PlusSquare className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Contribute New Gesture</p>
              <p className="text-sm text-muted-foreground">Help expand our gesture library by contributing.</p>
            </div>
          </div>
        </Link>
      </div>
    </CardContent>
  </Card>
);
