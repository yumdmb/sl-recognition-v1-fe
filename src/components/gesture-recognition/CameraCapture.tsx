"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  isActive: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ isActive }) => {
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

      try {
        const res = await fetch("http://localhost:8000/predict-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        setPrediction(`${data.label} (${(data.confidence * 100).toFixed(1)}%)`);
      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      startCamera();

      interval = setInterval(() => {
        sendFrameToServer();
      }, 300);
    } else {
      stopCamera();
    }

    return () => {
      clearInterval(interval);
      stopCamera();
    };
  }, [isActive]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg border border-gray-200"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {prediction && (
        <div className="text-xl text-green-600 font-bold text-center">
          Prediction: {prediction}
        </div>
      )}
      <Button onClick={stopCamera} className="w-full">
        <Camera className="mr-2 h-4 w-4" /> Stop Camera
      </Button>
    </div>
  );
};
