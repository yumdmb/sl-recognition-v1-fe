"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface AdminProgressChartProps {
  userRole: string;
}

export const AdminProgressChart: React.FC<AdminProgressChartProps> = ({ userRole }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">System Performance</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        [Chart would be implemented here]
      </div>
    </CardContent>
  </Card>
);
