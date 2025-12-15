"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { Upload, Database, Search, BookOpen } from 'lucide-react';

interface QuickAccessPanelProps {
  userRole: string;
}

export const AdminQuickAccessPanel: React.FC<QuickAccessPanelProps> = ({
  userRole,
}) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Quick Access</h3>
      <div className="space-y-4">
        <Link href="/gesture/manage-contributions">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <Upload className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Manage Submissions</p>
              <p className="text-sm text-muted-foreground">Review and approve gesture contributions.</p>
            </div>
          </div>
        </Link>
        <Link href="/avatar/admin-database">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <Database className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Avatar Database</p>
              <p className="text-sm text-muted-foreground">Manage the avatar assets and animations.</p>
            </div>
          </div>
        </Link>
        <Link href="/gesture-recognition/search">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <Search className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Add New Gesture</p>
              <p className="text-sm text-muted-foreground">Search for a word to add a new gesture.</p>
            </div>
          </div>
        </Link>
        <Link href="/learning/tutorials">
          <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105">
            <BookOpen className="h-6 w-6 mr-4 text-signlang-primary" />
            <div>
              <p className="font-semibold">Manage Learning</p>
              <p className="text-sm text-muted-foreground">Create and edit learning materials and tutorials.</p>
            </div>
          </div>
        </Link>
      </div>
    </CardContent>
  </Card>
);
