"use client";

import React from "react";
import { Hand3D } from "./Hand3D";
import { useHandDetection } from "@/hooks/useHandDetection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HandGestureDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
}

export const HandGestureDetector: React.FC<HandGestureDetectorProps> = ({ 
  videoRef, 
  isStreaming 
}) => {
  const { multiHandLandmarks, isLoading } = useHandDetection(videoRef);
  const handsDetected = multiHandLandmarks?.hands.length || 0;

  // Get hand labels for display
  const getHandLabels = () => {
    if (!multiHandLandmarks?.hands.length) return "";
    return multiHandLandmarks.hands.map(h => h.handedness).join(", ");
  };

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">3D Hand Visualization</CardTitle>
            <CardDescription>Real-time hand tracking (up to 2 hands)</CardDescription>
          </div>
          <div className="flex gap-2">
            {isLoading && (
              <Badge variant="secondary" className="animate-pulse">
                Loading model...
              </Badge>
            )}
            {!isLoading && isStreaming && (
              <Badge variant={handsDetected > 0 ? "default" : "outline"}>
                {handsDetected}/2 hands
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg overflow-hidden">
          {isStreaming ? (
            <Hand3D multiHandLandmarks={multiHandLandmarks} />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
              <p className="text-muted-foreground">Start camera to see 3D hand model</p>
            </div>
          )}
        </div>
        {isStreaming && handsDetected > 0 && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Detected: {getHandLabels()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HandGestureDetector;
