'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface TutorialEmptyStateProps {
  language: string;
}

const TutorialEmptyState: React.FC<TutorialEmptyStateProps> = ({ language }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">No {language} tutorials found for this level.</p>
      </CardContent>
    </Card>
  );
};

export default TutorialEmptyState;
