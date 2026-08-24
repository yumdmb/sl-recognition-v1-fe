"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  language: "ASL" | "MSL";
  onLanguageChange: (language: "ASL" | "MSL") => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="language" className="flex items-center gap-1.5">
        <Languages className="size-3.5 text-primary" />
        Sign Language
      </Label>
      <Select
        value={language}
        onValueChange={onLanguageChange}
      >
        <SelectTrigger id="language" className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ASL">American (ASL)</SelectItem>
          <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
