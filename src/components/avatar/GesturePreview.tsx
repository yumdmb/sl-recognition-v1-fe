'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GesturePreviewProps {
  capturedImage: string | null;
  recordedVideo: string | null;
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

const GesturePreview: React.FC<GesturePreviewProps> = ({
  capturedImage,
  recordedVideo,
  isLoading,
  onReset,
  onSave
}) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Your captured gesture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {capturedImage ? (
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
              No preview available
            </div>
          )}
        </div>
        {capturedImage || recordedVideo ? (
          <div className="flex justify-between">
            <Button onClick={onReset} variant="outline">
              Reset
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save to Signbank"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default GesturePreview;
