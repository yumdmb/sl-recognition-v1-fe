"use client";

import { useEffect, useRef, useState } from "react";
import { MultiHandLandmarks } from "@/types/hand";
import { useHandDetectionContext } from "@/context/HandDetectionContext";

export const useHandDetection = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const [multiHandLandmarks, setMultiHandLandmarks] = useState<MultiHandLandmarks | null>(null);
  const { handLandmarker, isLoading } = useHandDetectionContext();
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastDetectionTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!handLandmarker || !videoRef.current || isLoading) {
      console.log("🔍 Hand detection not ready:", { 
        hasLandmarker: !!handLandmarker, 
        hasVideo: !!videoRef.current, 
        isLoading 
      });
      return;
    }

    let frameCount = 0;
    const detectHands = () => {
      if (!videoRef.current || !handLandmarker) return;

      const video = videoRef.current;

      // Log video state periodically for debugging
      if (frameCount % 300 === 0) {
        console.log("📹 Video state:", {
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          paused: video.paused,
          srcObject: !!video.srcObject
        });
      }
      frameCount++;

      // Check if video is ready and has valid dimensions
      if (video.readyState >= video.HAVE_CURRENT_DATA && 
          video.videoWidth > 0 && 
          video.videoHeight > 0) {
        
        const currentTime = performance.now();
        
        // Ensure we're not calling detectForVideo with the same or earlier timestamp
        // MediaPipe requires strictly increasing timestamps
        if (currentTime > lastDetectionTimeRef.current) {
          try {
            const results = handLandmarker.detectForVideo(video, currentTime);
            lastDetectionTimeRef.current = currentTime;

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
          } catch (error) {
            // Log detection errors but don't crash the loop
            console.warn("Hand detection error:", error);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectHands);
    };

    // Small delay to ensure video stream is fully initialized
    // This helps with Chrome's stricter timing requirements
    const timeoutId = setTimeout(() => {
      console.log(" Starting hand detection loop...");
      detectHands();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoRef, isLoading, handLandmarker]);

  return { multiHandLandmarks, isLoading };
};
