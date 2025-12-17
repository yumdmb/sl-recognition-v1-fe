"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SaveFormProps {
  signName: string;
  setSignName: (name: string) => void;
  signDescription: string;
  setSignDescription: (description: string) => void;
  language: "ASL" | "MSL" | "";
  setLanguage: (language: "ASL" | "MSL") => void;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveForm({
  signName,
  setSignName,
  signDescription,
  setSignDescription,
  language,
  setLanguage,
  isLoading,
  onSave,
  onCancel
}: SaveFormProps) {
  return (
    <Card>
      <CardHeader className="px-3 md:px-6">
        <CardTitle className="text-lg md:text-xl">Save Gesture</CardTitle>
        <CardDescription className="text-xs md:text-sm">Provide details about your sign language gesture</CardDescription>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm">Name</Label>
            <Input
              id="name"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="Enter gesture name"
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language" className="text-sm">Language</Label>
            <Select value={language} onValueChange={(value: "ASL" | "MSL") => setLanguage(value)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm">Description (Optional)</Label>
            <Textarea
              id="description"
              value={signDescription}
              onChange={(e) => setSignDescription(e.target.value)}
              placeholder="Enter gesture description"
              className="min-h-20 md:min-h-24"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-2 md:gap-4 pt-2">
            <Button onClick={onCancel} variant="outline" className="w-full md:w-auto order-2 md:order-1">
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isLoading} className="w-full md:w-auto order-1 md:order-2">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}