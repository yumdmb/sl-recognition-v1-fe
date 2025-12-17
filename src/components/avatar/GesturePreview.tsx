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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recorded Gesture Preview</CardTitle>
            <CardDescription>
              Review and save your recorded 3D gesture
            </CardDescription>
          </div>
          {hasContent && (
            <Badge variant="secondary">
              {recorded3DAvatar.frames.length <= 1
                ? "Static Pose"
                : `${recorded3DAvatar.frames.length} frames • ${(recorded3DAvatar.duration / 1000).toFixed(1)}s`}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {hasContent ? (
            <Avatar3DPlayer recording={recorded3DAvatar} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No recording yet - Record a 3D gesture above
            </div>
          )}
        </div>
        {hasContent && (
          <div className="flex justify-between">
            <Button onClick={onReset} variant="outline">
              Discard & Reset
            </Button>
            <Button onClick={onSave} disabled={isLoading} size="lg">
              {isLoading ? "Saving..." : "Save to Signbank"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GesturePreview;
