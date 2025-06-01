'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from 'lucide-react';
import WordSubmitHeader from '@/components/word/WordSubmitHeader';
import WordFormFields from '@/components/word/WordFormFields';
import FileUpload from '@/components/word/FileUpload';
import CameraCapture from '@/components/word/CameraCapture';
import MediaPreview from '@/components/word/MediaPreview';
import { useWordSubmission } from '@/hooks/useWordSubmission';

export default function WordSubmit() {
  const {
    word,
    setWord,
    description,
    setDescription,
    language,
    setLanguage,
    mediaType,
    setMediaType,
    previewUrl,
    isSubmitting,
    isRecording,
    handleFileChange,
    handleMediaCaptured,
    handleRecordingStateChange,
    handleSubmit
  } = useWordSubmission();  return (
    <div className="container max-w-2xl py-6">
      <Toaster />
      <WordSubmitHeader />
      
      <Card>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <WordFormFields
              word={word}
              setWord={setWord}
              description={description}
              setDescription={setDescription}
              language={language}
              setLanguage={setLanguage}
              mediaType={mediaType}
              setMediaType={setMediaType}
            />

            <div className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="capture">Capture {mediaType === 'image' ? 'Image' : 'Video'}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <FileUpload
                    mediaType={mediaType}
                    onFileChange={handleFileChange}
                  />
                </TabsContent>
                
                <TabsContent value="capture" className="space-y-4">
                  <CameraCapture
                    mediaType={mediaType}
                    isRecording={isRecording}
                    onMediaCaptured={handleMediaCaptured}
                    onRecordingStateChange={handleRecordingStateChange}
                  />
                </TabsContent>
              </Tabs>

              <MediaPreview
                previewUrl={previewUrl}
                mediaType={mediaType}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Word'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}