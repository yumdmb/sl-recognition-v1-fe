'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface MaterialEmptyStateProps {
  language: string;
}

const MaterialEmptyState: React.FC<MaterialEmptyStateProps> = ({ language }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">No {language} learning materials available.</p>
      </CardContent>
    </Card>
  );
};

export default MaterialEmptyState;
