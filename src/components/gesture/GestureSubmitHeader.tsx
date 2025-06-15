'use client'

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HandHeart } from 'lucide-react';

export default function GestureSubmitHeader() {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex justify-center mb-4">
        <HandHeart className="h-12 w-12 text-blue-600" />
      </div>
      <CardTitle className="text-2xl font-bold">
        Contribute a Gesture
      </CardTitle>
      <CardDescription className="text-lg">
        Share your sign language knowledge with the community by contributing gestures, words, or phrases.
      </CardDescription>
    </CardHeader>
  );
}
