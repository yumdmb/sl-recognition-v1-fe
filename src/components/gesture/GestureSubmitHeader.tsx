'use client'

import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HandHeart } from 'lucide-react';

export default function GestureSubmitHeader() {
  return (
    <CardHeader className="items-center pb-6 text-center">
      <div className="mx-auto mb-4 flex size-full justify-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <HandHeart className="size-6" />
        </span>
      </div>
      <CardTitle className="font-display text-2xl font-extrabold tracking-tight">
        Contribute a Gesture
      </CardTitle>
      <CardDescription className="mt-1.5 max-w-md">
        Share your sign language knowledge with the community by contributing gestures, words, or phrases.
      </CardDescription>
    </CardHeader>
  );
}
