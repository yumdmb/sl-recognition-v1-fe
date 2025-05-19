"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Camera, AlertCircle, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const GestureRecognitionUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRecognitionResult(null);
    }
  };

  const handleClickFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select an image to upload"
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('language', language);

      const response = await fetch('/api/gesture-recognition/recognize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Recognition failed');
      }

      const data = await response.json();
      setRecognitionResult(data.word);
      toast.success("Recognition complete", {
        description: `The gesture has been recognized successfully in ${language}.`
      });
    } catch (error) {
      toast.error("Recognition failed", {
        description: "Unable to recognize the gesture. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      toast.error("Camera Error", {
        description: "Unable to access camera. Please check permissions."
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(blob));
          setRecognitionResult(null);
          stopCamera();
          setActiveTab("upload");
        }
      }, 'image/jpeg', 0.95);
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  React.useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
  }, [activeTab]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Gesture Image</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" /> Gesture Image
            </CardTitle>
            <CardDescription>
              Upload or capture a gesture image to recognize the corresponding word
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="language">Sign Language</Label>
              <Select 
                value={language} 
                onValueChange={(val: "ASL" | "MSL") => setLanguage(val)}
              >
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASL">American (ASL)</SelectItem>
                  <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" /> Camera
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    previewUrl ? 'border-gray-300' : 'border-primary'
                  }`}
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewUrl} 
                        alt="Selected gesture" 
                        className="max-h-40 max-w-full mb-4 rounded" 
                      />
                      <button 
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setRecognitionResult(null);
                        }}
                        className="text-sm text-red-500 hover:underline"
                      >
                        <X className="h-4 w-4 inline mr-1" /> Remove image
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col items-center cursor-pointer" 
                      onClick={handleClickFileInput}
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="camera">
                <div className="space-y-4">
                  <div className="relative">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      className="w-full rounded-lg border border-gray-200" 
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <Button 
                    onClick={takePhoto} 
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Take Photo
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Recognize Gesture
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {recognitionResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" /> Recognition Result
              </CardTitle>
              <CardDescription>
                The recognized word from your gesture image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary mb-4">
                  {recognitionResult}
                </p>
                <p className="text-sm text-gray-500">
                  in {language} Sign Language
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GestureRecognitionUpload; 