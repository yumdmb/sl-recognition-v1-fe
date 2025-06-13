'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GestureFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  language: 'ASL' | 'MSL';
  setLanguage: (value: 'ASL' | 'MSL') => void;
  mediaType: 'image' | 'video';
  setMediaType: (value: 'image' | 'video') => void;
}

export default function GestureFormFields({
  title,
  setTitle,
  description,
  setDescription,
  language,
  setLanguage,
  mediaType,
  setMediaType
}: GestureFormFieldsProps) {
  return (
    <>
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter gesture title (e.g., 'Hello', 'Thank you')"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the gesture, its meaning, and any context or usage notes..."
          rows={3}
          required
        />
      </div>

      {/* Language */}
      <div className="space-y-2">
        <Label>Sign Language *</Label>
        <RadioGroup value={language} onValueChange={setLanguage} className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ASL" id="asl" />
            <Label htmlFor="asl">ASL (American Sign Language)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="MSL" id="msl" />
            <Label htmlFor="msl">MSL (Malaysian Sign Language)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Media Type */}
      <div className="space-y-2">
        <Label>Media Type *</Label>
        <RadioGroup value={mediaType} onValueChange={setMediaType} className="flex gap-6">
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
    </>
  );
}
