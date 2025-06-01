"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, AlertCircle } from 'lucide-react';
import { LanguageSelector } from '@/components/gesture-recognition/LanguageSelector';
import { UploadTabs } from '@/components/gesture-recognition/UploadTabs';
import { UploadButton } from '@/components/gesture-recognition/UploadButton';
import { RecognitionResultDisplay } from '@/components/gesture-recognition/RecognitionResultDisplay';

interface RecognitionResult {
  word: string;
  confidence: number;
  imageUrl: string;
}

const GestureRecognitionUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [language, setLanguage] = useState<"ASL" | "MSL">("ASL");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRecognitionResult(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRecognitionResult(null);
  };

  const handlePhotoCapture = (file: File, newPreviewUrl: string) => {
    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
    setRecognitionResult(null);
    setActiveTab("upload");
  };

  const handleTryAgain = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRecognitionResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) {
      toast.error("No file selected", {
        description: "Please select an image to upload"
      });
      return;
    }

    setIsLoading(true);
    setRecognitionResult(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock recognition results
      const mockResults = {
        ASL: [
          { word: "Hello", confidence: 0.95 },
          { word: "Thank you", confidence: 0.88 },
          { word: "Please", confidence: 0.92 },
          { word: "Goodbye", confidence: 0.85 },
          { word: "Yes", confidence: 0.97 },
          { word: "No", confidence: 0.94 }
        ],
        MSL: [
          { word: "Selamat", confidence: 0.93 },
          { word: "Terima kasih", confidence: 0.89 },
          { word: "Sila", confidence: 0.91 },
          { word: "Selamat tinggal", confidence: 0.86 },
          { word: "Ya", confidence: 0.96 },
          { word: "Tidak", confidence: 0.95 }
        ]
      };

      // Randomly select a result from the mock data
      const results = mockResults[language];
      const randomResult = results[Math.floor(Math.random() * results.length)];

      // Create mock response
      const mockResponse = {
        word: randomResult.word,
        confidence: randomResult.confidence,
        imageUrl: previewUrl // previewUrl is guaranteed to be string here due to the check above
      };

      setRecognitionResult(mockResponse);
      toast.success("Recognition complete", {
        description: `The gesture has been recognized successfully in ${language}.`
      });

      /* 
      // TODO: Uncomment this section to use the actual API instead of mock data
      // API Implementation
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
      setRecognitionResult(data);
      toast.success("Recognition complete", {
        description: `The gesture has been recognized successfully in ${language}.`
      });
      */

    } catch (error) {
      toast.error("Recognition failed", {
        description: "Unable to recognize the gesture. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <LanguageSelector
              language={language}
              onLanguageChange={setLanguage}
            />
            
            <UploadTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              previewUrl={previewUrl}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              onPhotoCapture={handlePhotoCapture}
            />
            
            <UploadButton
              isLoading={isLoading}
              hasFile={!!selectedFile}
              onUpload={handleUpload}
            />
          </CardContent>
        </Card>

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
            <RecognitionResultDisplay
              isLoading={isLoading}
              result={recognitionResult}
              language={language}
              onTryAgain={handleTryAgain}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GestureRecognitionUpload;
