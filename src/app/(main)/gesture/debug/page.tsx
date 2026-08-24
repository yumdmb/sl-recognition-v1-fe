'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@/utils/supabase/client';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Bug, UploadCloud } from 'lucide-react';

// Debug component to test media uploads to Supabase
export default function DebugMediaUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type.startsWith('image/') ? 'image' : 'video');
    }
  };

  const uploadToStorage = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const supabase = createClient();
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `debug-test/${Date.now()}.${fileExt}`;
      const filePath = `gesture-contributions/${fileName}`;

      console.log(`Uploading ${fileType} file: ${selectedFile.name} (${selectedFile.type}, ${selectedFile.size} bytes)`);

      // Step 1: Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type // Explicitly set content type
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setUploadResult({
          success: false,
          stage: 'storage upload',
          error: uploadError
        });
        toast.error(`Storage upload failed: ${uploadError.message}`);
        return;
      }

      // Step 2: Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Success!
      setUploadResult({
        success: true,
        uploadData,
        publicUrl
      });

      toast.success(`${fileType} uploaded successfully!`);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setUploadResult({
        success: false,
        stage: 'unexpected error',
        error
      });
      toast.error(`Unexpected error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Toaster />
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Internal Tool
        </p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Debug Media Upload</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 font-display">
            <span className="grid size-10 place-items-center rounded-xl bg-sun/10 text-sun">
              <Bug className="size-5" />
            </span>
            Test Media Upload to Supabase Storage
          </CardTitle>
          <CardDescription>
            Uploads a file to the media bucket and reports the raw result.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Select File</label>
            <Input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({fileType}, {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>

          <Button
            onClick={uploadToStorage}
            disabled={!selectedFile || isUploading}
            className="w-full rounded-full"
            size="lg"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Test Upload to Supabase Storage'}
          </Button>

          {uploadResult && (
            <div className="mt-4 rounded-2xl border border-border bg-muted p-4">
              <h3 className="mb-2 font-semibold">Upload Result:</h3>
              <pre className="scrollbar-thin overflow-auto rounded-xl bg-card p-3 text-xs">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
