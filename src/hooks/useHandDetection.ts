"use client";

import { useEffect, useRef, useState } from "react";
import { MultiHandLandmarks } from "@/types/hand";
import { useHandDetectionContext } from "@/context/HandDetectionContext";

export const useHandDetection = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const [multiHandLandmarks, setMultiHandLandmarks] = useState<MultiHandLandmarks | null>(null);
  const { handLandmarker, isLoading } = useHandDetectionContext();
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!handLandmarker || !videoRef.current || isLoading) return;

    const detectHands = () => {
      if (!videoRef.current || !handLandmarker) return;

      const video = videoRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const startTimeMs = performance.now();
        const results = handLandmarker.detectForVideo(video, startTimeMs);

        if (results.landmarks && results.landmarks.length > 0) {
          const hands = results.landmarks.map((landmarks, index) => ({
            landmarks: landmarks.map((landmark) => ({
              x: landmark.x,
              y: landmark.y,
              z: landmark.z,
            })),
            handedness: results.handednesses?.[index]?.[0]?.categoryName || "Unknown",
          }));
          setMultiHandLandmarks({ hands });
        } else {
          setMultiHandLandmarks(null);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectHands);
    };

    detectHands();

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoRef, isLoading, handLandmarker]);

  return { multiHandLandmarks, isLoading };
};
