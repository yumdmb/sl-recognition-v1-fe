"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, Sparkles, RotateCcw } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-12 text-center">
        <span className="grid size-14 animate-pulse place-items-center rounded-2xl bg-primary-soft text-primary">
          <Sparkles className="size-6" />
        </span>
        <h3 className="font-display mt-5 text-lg font-bold">Recognising…</h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Processing your gesture, this usually takes a moment.
        </p>
        <div className="mt-6 w-full max-w-sm space-y-3">
          <Skeleton className="h-6 w-2/3 mx-auto rounded-full" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-primary-soft px-6 py-8 text-center">
          <span className="inline-grid size-10 place-items-center rounded-xl bg-card text-primary shadow-soft">
            <Sparkles className="size-5" />
          </span>
          <p className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary">
            {result.word}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            in {language} Sign Language
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Confidence</span>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-bold text-primary">
              {Math.round(result.confidence * 100)}%
            </span>
          </div>
          <Progress
            value={result.confidence * 100}
            className="h-2"
          />
        </div>

        <div className="border-t border-border pt-5">
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Preview</h4>
          <div className="relative mt-3 aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={result.imageUrl}
              alt="Recognized gesture"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <Button
          className="w-full rounded-full"
          size="lg"
          onClick={onTryAgain}
        >
          <RotateCcw className="mr-2 size-4" />
          Try Another Gesture
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <ImageIcon className="size-6" />
      </span>
      <h3 className="font-display mt-5 text-lg font-bold">No result yet</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Upload or capture a gesture image to see the recognition result
      </p>
    </div>
  );
};
