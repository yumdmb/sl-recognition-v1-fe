"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar3DRecording } from "@/types/hand";
import Avatar3DPlayer from "./Avatar3DPlayer";

interface GesturePreviewProps {
  recorded3DAvatar: Avatar3DRecording | null;
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

const GesturePreview: React.FC<GesturePreviewProps> = ({
  recorded3DAvatar,
  isLoading,
  onReset,
  onSave,
}) => {
  const hasContent = recorded3DAvatar && recorded3DAvatar.frames.length > 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 px-3 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-lg md:text-xl">Recorded Gesture Preview</CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Review and submit your recorded 3D gesture
            </CardDescription>
          </div>
          {hasContent && (
            <Badge variant="secondary" className="text-xs w-fit">
              {recorded3DAvatar.frames.length <= 1
                ? "Static Pose"
                : `${recorded3DAvatar.frames.length} frames • ${(recorded3DAvatar.duration / 1000).toFixed(1)}s`}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="w-full max-w-5xl mx-auto">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
            {hasContent ? (
              <Avatar3DPlayer recording={recorded3DAvatar} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground px-4">
                <p className="text-center text-sm md:text-base">
                  No recording yet - Record a 3D gesture above
                </p>
              </div>
            )}
          </div>
        </div>
        {hasContent && (
          <div className="flex flex-col md:flex-row gap-2 md:justify-between">
            <Button onClick={onReset} variant="outline" className="w-full md:w-auto order-2 md:order-1">
              Discard & Reset
            </Button>
            <Button onClick={onSave} disabled={isLoading} size="lg" className="w-full md:w-auto order-1 md:order-2">
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GesturePreview;
