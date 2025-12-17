"use client";

import React, { useEffect } from "react";
import { Hand3D } from "./Hand3D";
import { useHandDetection } from "@/hooks/useHandDetection";
import {
  useAvatar3DRecording,
  RecordingDuration,
} from "@/hooks/useAvatar3DRecording";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video, Square, Camera } from "lucide-react";
import { Avatar3DRecording } from "@/types/hand";

interface HandGestureDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  onRecordingComplete: (recording: Avatar3DRecording) => void;
  onCapturePose: (landmarks: Avatar3DRecording) => void;
}

export const HandGestureDetector: React.FC<HandGestureDetectorProps> = ({
  videoRef,
  isStreaming,
  onRecordingComplete,
  onCapturePose,
}) => {
  const { multiHandLandmarks, isLoading } = useHandDetection(videoRef);
  const {
    isRecording,
    recordedAvatar,
    countdown,
    elapsedTime,
    startRecording,
    stopRecording,
    resetRecording,
    updateLandmarks,
  } = useAvatar3DRecording();

  const [selectedDuration, setSelectedDuration] =
    React.useState<RecordingDuration>(3);

  const handsDetected = multiHandLandmarks?.hands.length || 0;

  // Update landmarks for recording
  useEffect(() => {
    updateLandmarks(multiHandLandmarks);
  }, [multiHandLandmarks, updateLandmarks]);

  // Notify parent when recording is complete
  useEffect(() => {
    if (recordedAvatar && recordedAvatar.frames.length > 0) {
      onRecordingComplete(recordedAvatar);
    }
  }, [recordedAvatar, onRecordingComplete]);

  const getHandLabels = () => {
    if (!multiHandLandmarks?.hands.length) return "";
    return multiHandLandmarks.hands.map((h) => h.handedness).join(", ");
  };

  const handleStartRecording = () => {
    resetRecording();
    startRecording(selectedDuration);
  };

  const handleCapturePose = () => {
    if (multiHandLandmarks && multiHandLandmarks.hands.length > 0) {
      // Create a single-frame recording for the captured pose
      const capturedPose: Avatar3DRecording = {
        frames: [
          {
            timestamp: 0,
            landmarks: {
              hands: multiHandLandmarks.hands.map((hand) => ({
                landmarks: hand.landmarks.map((l) => ({
                  x: l.x,
                  y: l.y,
                  z: l.z,
                })),
                handedness: hand.handedness,
              })),
            },
          },
        ],
        duration: 0,
        startTime: Date.now(),
      };
      onCapturePose(capturedPose);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>3D Avatar Generator</CardTitle>
            <CardDescription>
              Real-time hand tracking and 3D visualization
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isLoading && (
              <Badge variant="secondary" className="animate-pulse">
                Loading model...
              </Badge>
            )}
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                REC {countdown !== null ? `${countdown}s` : `${(elapsedTime / 1000).toFixed(1)}s`}
              </Badge>
            )}
            {!isLoading && isStreaming && !isRecording && (
              <Badge variant={handsDetected > 0 ? "default" : "outline"}>
                {handsDetected}/2 hands detected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main 3D Visualization - Large */}
        <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
          {isStreaming ? (
            <Hand3D multiHandLandmarks={multiHandLandmarks} enableControls={false} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Start camera to see 3D hand model
              </p>
            </div>
          )}
        </div>

        {/* Recording controls */}
        <div className="flex items-center justify-between mt-4 gap-2">
          <div className="flex items-center gap-2">
            {isStreaming && handsDetected > 0 && !isRecording && (
              <p className="text-sm text-muted-foreground">
                Detected: {getHandLabels()}
              </p>
            )}
            {isRecording && (
              <p className="text-sm text-destructive font-medium">
                Recording in progress...
              </p>
            )}
          </div>

          {isStreaming && (
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <>
                  {/* Capture single pose button */}
                  <Button
                    onClick={handleCapturePose}
                    disabled={handsDetected === 0}
                    variant="outline"
                    className="gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Capture Pose
                  </Button>

                  {/* Recording controls */}
                  <div className="flex items-center gap-2 border-l pl-2 ml-2">
                    <Select
                      value={String(selectedDuration)}
                      onValueChange={(v) =>
                        setSelectedDuration(
                          v === "manual" ? "manual" : (Number(v) as 3 | 5 | 10)
                        )
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 seconds</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleStartRecording}
                      disabled={handsDetected === 0}
                      className="gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Record
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  className="gap-2"
                  size="lg"
                >
                  <Square className="h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HandGestureDetector;
