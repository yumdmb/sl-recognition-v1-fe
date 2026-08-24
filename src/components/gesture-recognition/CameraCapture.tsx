"use client";

import React, { useRef, useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  isActive: boolean;
  language?: "ASL" | "MSL"; // Add language prop
  onPhotoCapture?: (file: File, previewUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isActive,
  language = "ASL",
}) => {
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
    } catch {
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
        // Call Vercel API proxy to avoid mixed content (HTTPS→HTTP) issues
        // The proxy forwards to EC2 server-side
        const res = await fetch("/api/ml/predict", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        // Handle response - check if prediction was successful
        if (data.success && data.label) {
          setPrediction(data.label);
        } else {
          setPrediction(null); // No hand detected
        }
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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-ink shadow-lift">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="aspect-video w-full object-cover"
        />
        {/* Scanner corner brackets */}
        {isActive && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <span className="absolute left-3 top-3 size-6 rounded-tl-lg border-l-2 border-t-2 border-mint/70" />
            <span className="absolute right-3 top-3 size-6 rounded-tr-lg border-r-2 border-t-2 border-mint/70" />
            <span className="absolute bottom-3 left-3 size-6 rounded-bl-lg border-b-2 border-l-2 border-mint/70" />
            <span className="absolute bottom-3 right-3 size-6 rounded-br-lg border-b-2 border-r-2 border-mint/70" />
            <span className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-mint-soft">
              <Camera className="mr-1 inline h-3 w-3" />
              Live
            </span>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {prediction && (
        <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            Prediction
          </p>
          <p className="font-display mt-1 text-2xl font-extrabold tracking-tight">
            {prediction}
          </p>
        </div>
      )}
    </div>
  );
};
