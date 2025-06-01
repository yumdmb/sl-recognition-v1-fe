'use client'

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WordFormFieldsProps {
  word: string;
  setWord: (value: string) => void;
  language: 'ASL' | 'MSL';
  setLanguage: (value: 'ASL' | 'MSL') => void;
  description: string;
  setDescription: (value: string) => void;
  mediaType: 'image' | 'video';
  setMediaType: (value: 'image' | 'video') => void;
}

const WordFormFields: React.FC<WordFormFieldsProps> = ({
  word,
  setWord,
  language,
  setLanguage,
  description,
  setDescription,
  mediaType,
  setMediaType
}) => {
  return (
    <>
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
          onValueChange={setLanguage}
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
          onValueChange={setMediaType}
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
    </>
  );
};

export default WordFormFields;
