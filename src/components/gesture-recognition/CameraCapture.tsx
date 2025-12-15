"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  isActive: boolean;
  language: "ASL" | "MSL"; // Add language prop
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ isActive, language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      toast.error("Camera Error", {
        description: "Unable to access camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const sendFrameToServer = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");
      formData.append("language", language); // Add language to formData

      try {
        const res = await fetch("http://localhost:8000/predict-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setPrediction(`${data.label} (${(data.confidence * 100).toFixed(1)}%)`);
      } catch (error) {
        console.error("Error sending frame:", error);
        // Optionally, provide user feedback here via toast or by setting an error state
        // toast.error("Prediction Error", { description: "Could not get prediction from server." });
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      startCamera();
      // Clear previous prediction when camera starts/restarts
      setPrediction(null);

      interval = setInterval(() => {
        sendFrameToServer();
      }, 300); // Consider making interval configurable or adjusting based on performance
    } else {
      stopCamera();
      setPrediction(null); // Clear prediction when camera stops
    }

    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, [isActive, language]); // Add language to dependency array to re-setup if it changes

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-lg border border-gray-200"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {prediction && (
        <div className="text-base md:text-lg lg:text-xl text-green-600 font-bold text-center p-3 md:p-4 bg-green-50 rounded-lg">
          Prediction: {prediction}
        </div>
      )}
    </div>
  );
};
