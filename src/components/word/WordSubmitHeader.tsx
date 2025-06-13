'use client'

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload } from 'lucide-react';

const WordSubmitHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center">
        <Upload className="mr-2 h-5 w-5" /> Contribute New Gesture
      </CardTitle>
      <CardDescription>
        Submit a new  gesture to our database
      </CardDescription>
    </CardHeader>
  );
};

export default WordSubmitHeader;
