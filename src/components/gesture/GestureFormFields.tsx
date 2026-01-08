'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GestureCategory } from '@/types/gestureContributions';

interface GestureFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  language: 'ASL' | 'MSL';
  setLanguage: (value: 'ASL' | 'MSL') => void;
  mediaType: 'image' | 'video';
  setMediaType: (value: 'image' | 'video') => void;
  categoryId?: number | null;
  setCategoryId?: (value: number | null) => void;
  categories?: GestureCategory[];
}

export default function GestureFormFields({
  title,
  setTitle,
  description,
  setDescription,
  language,
  setLanguage,
  mediaType,
  setMediaType,
  categoryId,
  setCategoryId,
  categories = []
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
        <RadioGroup value={language} onValueChange={setLanguage} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 min-h-[44px] p-2 rounded-md hover:bg-muted cursor-pointer">
            <RadioGroupItem value="ASL" id="asl" className="min-h-[24px] min-w-[24px]" />
            <Label htmlFor="asl" className="cursor-pointer text-base">ASL (American Sign Language)</Label>
          </div>
          <div className="flex items-center space-x-3 min-h-[44px] p-2 rounded-md hover:bg-muted cursor-pointer">
            <RadioGroupItem value="MSL" id="msl" className="min-h-[24px] min-w-[24px]" />
            <Label htmlFor="msl" className="cursor-pointer text-base">MSL (Malaysian Sign Language)</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Media Type */}
      <div className="space-y-2">
        <Label>Media Type *</Label>
        <RadioGroup value={mediaType} onValueChange={setMediaType} className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 min-h-[44px] p-2 rounded-md hover:bg-muted cursor-pointer">
            <RadioGroupItem value="image" id="image" className="min-h-[24px] min-w-[24px]" />
            <Label htmlFor="image" className="cursor-pointer text-base">Image</Label>
          </div>
          <div className="flex items-center space-x-3 min-h-[44px] p-2 rounded-md hover:bg-muted cursor-pointer">
            <RadioGroupItem value="video" id="video" className="min-h-[24px] min-w-[24px]" />
            <Label htmlFor="video" className="cursor-pointer text-base">Video</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Category */}
      {setCategoryId && categories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={categoryId?.toString() || ''} 
            onValueChange={(val) => setCategoryId(val ? parseInt(val, 10) : null)}
          >
            <SelectTrigger id="category" className="min-h-[44px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.icon && <span className="mr-2">{cat.icon}</span>}
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
