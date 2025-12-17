"use client";

import React from "react";
import { Hand3D } from "./Hand3D";
import { useHandDetection } from "@/hooks/useHandDetection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { MultiHandLandmarks } from "@/types/hand";

interface HandGestureDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  onCapture3D: (landmarks: MultiHandLandmarks) => void;
}

export const HandGestureDetector: React.FC<HandGestureDetectorProps> = ({
  videoRef,
  isStreaming,
  onCapture3D,
}) => {
  const { multiHandLandmarks, isLoading } = useHandDetection(videoRef);
  const handsDetected = multiHandLandmarks?.hands.length || 0;

  const getHandLabels = () => {
    if (!multiHandLandmarks?.hands.length) return "";
    return multiHandLandmarks.hands.map((h) => h.handedness).join(", ");
  };

  const handleCapture = () => {
    if (multiHandLandmarks && multiHandLandmarks.hands.length > 0) {
      // Deep copy the landmarks to preserve the captured state
      const capturedData: MultiHandLandmarks = {
        hands: multiHandLandmarks.hands.map((hand) => ({
          landmarks: hand.landmarks.map((l) => ({ x: l.x, y: l.y, z: l.z })),
          handedness: hand.handedness,
        })),
      };
      onCapture3D(capturedData);
    }
  };

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">3D Hand Visualization</CardTitle>
            <CardDescription>
              Real-time hand tracking (up to 2 hands)
            </CardDescription>
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
              <p className="text-muted-foreground">
                Start camera to see 3D hand model
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          {isStreaming && handsDetected > 0 && (
            <p className="text-sm text-muted-foreground">
              Detected: {getHandLabels()}
            </p>
          )}
          {isStreaming && (
            <Button
              onClick={handleCapture}
              disabled={handsDetected === 0}
              className="gap-2 ml-auto"
            >
              <Camera className="h-4 w-4" />
              Capture 3D Pose
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HandGestureDetector;
