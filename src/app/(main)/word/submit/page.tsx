'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Camera, Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";

// Function to create a local word submission storage
const getWordSubmissions = (): WordSubmission[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wordSubmissions');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveWordSubmission = (submission: WordSubmission) => {
  if (typeof window !== 'undefined') {
    const existing = getWordSubmissions();
    localStorage.setItem('wordSubmissions', JSON.stringify([...existing, submission]));
  }
};

export interface WordSubmission {
  id: string;
  word: string;
  description: string;
  language: 'ASL' | 'MSL';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  submittedBy: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

export default function WordSubmit() {
  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<'ASL' | 'MSL'>('MSL');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const router = useRouter();
  const { currentUser } = useAuth();

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Stop the camera when component unmounts
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: mediaType === 'video'
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error("Camera Error", {
        description: "Failed to access camera. Please check permissions."
      });
    }
  };

  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(videoRef.current.srcObject as MediaStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setMediaFile(new File([blob], 'recording.webm', { type: 'video/webm' }));
        setPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          setMediaFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }));
          setPreviewUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg');
      if (videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!mediaFile) {
      toast.error("Media required", {
        description: `Please upload or capture ${mediaType === 'image' ? 'an image' : 'a video'} of the sign language gesture`
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const newSubmission: WordSubmission = {
        id: crypto.randomUUID(),
        word,
        description,
        language,
        mediaType,
        mediaUrl: previewUrl,
        submittedBy: {
          id: currentUser?.id || '',
          name: currentUser?.name || '',
        },
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      saveWordSubmission(newSubmission);

      toast.success("Word submitted", {
        description: "Your sign language gesture has been submitted for verification."
      });

      setWord('');
      setDescription('');
      setMediaFile(null);
      setPreviewUrl('');

      router.push('/word/view');
    } catch (error) {
      toast.error("Error", {
        description: "Failed to submit the word. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Submit New Sign Language Word</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="mr-2 h-5 w-5" /> Contribute Word
          </CardTitle>
          <CardDescription>
            Submit a new sign language word to our database
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="word">Word or Phrase</Label>
              <Input
                id="word"
                placeholder="Enter the word or phrase"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sign Language</Label>
              <RadioGroup
                value={language}
                onValueChange={(value: 'ASL' | 'MSL') => setLanguage(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="MSL" id="msl" />
                  <Label htmlFor="msl">Malaysian Sign Language (MSL)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ASL" id="asl" />
                  <Label htmlFor="asl">American Sign Language (ASL)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the sign language gesture"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Media Type</Label>
              <RadioGroup
                value={mediaType}
                onValueChange={(value: 'image' | 'video') => setMediaType(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="capture">Capture {mediaType === 'image' ? 'Image' : 'Video'}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="media">Upload {mediaType === 'image' ? 'Image' : 'Video'}</Label>
                    <Input
                      id="media"
                      type="file"
                      accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileChange}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="capture" className="space-y-4">
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                      />
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      {!isRecording ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={startCamera}
                            className="flex items-center"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Start Camera
                          </Button>
                          {mediaType === 'image' ? (
                            <Button
                              type="button"
                              onClick={captureImage}
                              className="flex items-center"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Capture Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={startRecording}
                              className="flex items-center"
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Start Recording
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={stopRecording}
                          className="flex items-center"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Stop Recording
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {previewUrl && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2">
                    {mediaType === 'image' ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg"
                      />
                    ) : (
                      <video
                        src={previewUrl}
                        controls
                        className="max-w-full h-auto rounded-lg"
                      />
                    )}
                  </div>
                </div>
              )}
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