'use client'

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Languages, Image as ImageIcon, Video } from 'lucide-react';
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
        <p className="text-xs text-muted-foreground">
          Keep it short — the word or phrase this gesture represents.
        </p>
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
      <div className="space-y-2.5">
        <Label className="flex items-center gap-1.5">
          <Languages className="size-3.5 text-primary" />
          Sign Language *
        </Label>
        <RadioGroup value={language} onValueChange={setLanguage} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Label
            htmlFor="asl"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/60"
          >
            <RadioGroupItem value="ASL" id="asl" />
            <span className="text-sm font-medium">ASL <span className="font-normal text-muted-foreground">(American Sign Language)</span></span>
          </Label>
          <Label
            htmlFor="msl"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/60"
          >
            <RadioGroupItem value="MSL" id="msl" />
            <span className="text-sm font-medium">MSL <span className="font-normal text-muted-foreground">(Malaysian Sign Language)</span></span>
          </Label>
        </RadioGroup>
      </div>

      {/* Media Type */}
      <div className="space-y-2.5">
        <Label className="flex items-center gap-1.5">
          <ImageIcon className="size-3.5 text-primary" />
          Media Type *
        </Label>
        <RadioGroup value={mediaType} onValueChange={setMediaType} className="grid grid-cols-2 gap-3">
          <Label
            htmlFor="image"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/60"
          >
            <RadioGroupItem value="image" id="image" />
            <ImageIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Image</span>
          </Label>
          <Label
            htmlFor="video"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-accent/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary-soft/60"
          >
            <RadioGroupItem value="video" id="video" />
            <Video className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Video</span>
          </Label>
        </RadioGroup>
      </div>

      {/* Category - preserved from origin backend for duplicate detection / categorization */}
      {setCategoryId && categories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={categoryId?.toString() || ''} 
            onValueChange={(val) => setCategoryId(val ? parseInt(val, 10) : null)}
          >
            <SelectTrigger id="category" className="rounded-xl min-h-[44px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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
