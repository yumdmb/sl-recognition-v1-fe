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
      <CardHeader>
        <CardTitle>Save Gesture</CardTitle>
        <CardDescription>Provide details about your sign language gesture</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="Enter gesture name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={(value: "ASL" | "MSL") => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">American Sign Language (ASL)</SelectItem>
                <SelectItem value="MSL">Malaysian Sign Language (MSL)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={signDescription}
              onChange={(e) => setSignDescription(e.target.value)}
              placeholder="Enter gesture description"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}