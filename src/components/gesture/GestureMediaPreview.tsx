'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface GestureMediaPreviewProps {
  previewUrl: string | null;
  mediaType: 'image' | 'video';
  onClearMedia?: () => void;
}

export default function GestureMediaPreview({ previewUrl, mediaType, onClearMedia }: GestureMediaPreviewProps) {
  if (!previewUrl) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-foreground/80">Media Preview</Label>
        {onClearMedia && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearMedia}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retake
          </Button>
        )}
      </div>
      
      <div className="relative group overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-sm">
        {/* Blurred Background Effect */}
        <div className="absolute inset-0 z-0 opacity-20 blur-2xl scale-110">
            {mediaType === 'image' ? (
                <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            ) : (
                <video src={previewUrl} className="w-full h-full object-cover" />
            )}
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex justify-center items-center bg-background/10 backdrop-blur-[2px] p-1">
            {mediaType === 'image' ? (
            <img
                src={previewUrl}
                alt="Gesture preview"
                className="max-h-[400px] w-auto rounded-lg shadow-md"
            />
            ) : (
            <video
                src={previewUrl}
                controls
                className="max-h-[400px] w-auto rounded-lg shadow-md"
            />
            )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>{mediaType === 'image' ? 'Image captured' : 'Video recorded'}</span>
        <span className="italic">Ready to submit</span>
      </div>
    </motion.div>
  );
}
