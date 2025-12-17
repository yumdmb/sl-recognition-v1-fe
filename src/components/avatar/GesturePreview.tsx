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
import { MultiHandLandmarks } from "@/types/hand";
import { Hand3D } from "./Hand3D";

interface GesturePreviewProps {
  capturedImage: string | null;
  recordedVideo: string | null;
  captured3DAvatar: MultiHandLandmarks | null;
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

const GesturePreview: React.FC<GesturePreviewProps> = ({
  capturedImage,
  recordedVideo,
  captured3DAvatar,
  isLoading,
  onReset,
  onSave,
}) => {
  const hasContent = capturedImage || recordedVideo || captured3DAvatar;

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Your captured 3D gesture avatar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {captured3DAvatar ? (
            <Hand3D multiHandLandmarks={captured3DAvatar} />
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured gesture"
              className="w-full h-full object-cover"
            />
          ) : recordedVideo ? (
            <video
              src={recordedVideo}
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No preview available - Capture a 3D pose
            </div>
          )}
        </div>
        {hasContent && (
          <div className="flex justify-between">
            <Button onClick={onReset} variant="outline">
              Reset
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save to Signbank"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GesturePreview;
