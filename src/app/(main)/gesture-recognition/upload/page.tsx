'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Image } from "lucide-react";
import { toast } from 'sonner';

export default function GestureRecognitionUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Invalid file type", {
        description: "Please upload an image file (JPG, PNG, etc.)"
      });
    }
  };

  const handleRecognize = () => {
    if (file) {
      // In a real app, we would send the file to an API for recognition
      toast.success("Processing image", {
        description: "Your image is being analyzed for sign language gestures."
      });
      // Mock a timeout to simulate processing
      setTimeout(() => {
        toast.success("Sign recognized", {
          description: "The sign in the image means 'Hello' in American Sign Language."
        });
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gesture Recognition</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" /> Upload Image
          </CardTitle>
          <CardDescription>
            Upload an image containing a sign language gesture for recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-signlang-primary bg-signlang-muted' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="flex flex-col items-center">
                  <div className="w-full max-h-96 overflow-hidden flex justify-center">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="object-contain max-h-96 rounded-lg" 
                    />
                  </div>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm font-medium">
                    Drag and drop an image here, or click to browse
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                </div>
              )}
            </div>

            {preview && (
              <Button 
                className="w-full bg-signlang-primary hover:bg-signlang-primary/90 text-gray-900" 
                onClick={handleRecognize}
              >
                <Camera className="mr-2 h-4 w-4" />
                Recognize Sign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 