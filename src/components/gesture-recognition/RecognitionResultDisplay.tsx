"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Image as ImageIcon } from 'lucide-react';

interface RecognitionResult {
  word: string;
  confidence: number;
  imageUrl: string;
}

interface RecognitionResultDisplayProps {
  isLoading: boolean;
  result: RecognitionResult | null;
  language: "ASL" | "MSL";
  onTryAgain: () => void;
}

export const RecognitionResultDisplay: React.FC<RecognitionResultDisplayProps> = ({
  isLoading,
  result,
  language,
  onTryAgain
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-r-transparent mb-4"></div>
        <p className="text-gray-500">Processing your gesture...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-primary mb-2">
            {result.word}
          </p>
          <p className="text-sm text-gray-500">
            in {language} Sign Language
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm text-gray-500">
              {Math.round(result.confidence * 100)}%
            </span>
          </div>
          <Progress 
            value={result.confidence * 100} 
            className="h-2"
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Preview</h4>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50">
            <img
              src={result.imageUrl}
              alt="Recognized gesture"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <Button 
          className="w-full"
          onClick={onTryAgain}
        >
          Try Another Gesture
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-500">
        Upload or capture a gesture image to see the recognition result
      </p>
    </div>
  );
};
