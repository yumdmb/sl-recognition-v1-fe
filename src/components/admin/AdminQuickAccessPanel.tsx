"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

interface QuickAccessPanelProps {
  userRole: string;
  pendingVerifications: number;
}

export const AdminQuickAccessPanel: React.FC<QuickAccessPanelProps> = ({ 
  userRole, 
  pendingVerifications 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Verify User Accounts</h3>
        <p className="text-gray-500 mb-4">
          {pendingVerifications > 0 
            ? `${pendingVerifications} user${pendingVerifications === 1 ? '' : 's'} awaiting verification`
            : 'No pending verifications'}
        </p>
        <Link href="/admin">
          <button className="bg-signlang-primary text-gray-900 px-4 py-2 rounded w-full">
            Manage Accounts
          </button>
        </Link>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Word Contributions</h3>
        <p className="text-gray-500 mb-4">Review submitted sign language words</p>
        <button className="bg-signlang-primary text-gray-900 px-4 py-2 rounded w-full">
          Review Words
        </button>
      </CardContent>
    </Card>
  </div>
);
