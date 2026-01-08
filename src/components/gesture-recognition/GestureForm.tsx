"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface Gesture {
  id?: number;
  name: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  language: 'ASL' | 'MSL';
  category_id: number | null;
}

interface GestureCategory {
  id: number;
  name: string;
}

interface GestureFormProps {
  gesture?: Gesture | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character." }),
  description: z.string().optional(),
  language: z.enum(["ASL", "MSL"]),
  category_id: z.string().refine(val => !isNaN(parseInt(val, 10)), { message: "Invalid category" }),
  file: z.any().optional(),
});

export const GestureForm: React.FC<GestureFormProps> = ({ gesture, onSuccess, onCancel }) => {
  const supabase = createClient();
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(gesture?.media_url || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: gesture?.name || "",
      description: gesture?.description || "",
      language: gesture?.language || "ASL",
      category_id: gesture?.category_id?.toString() || "",
      file: undefined,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('gesture_categories').select('id, name');
      if (error) {
        toast.error("Failed to load categories", { description: error.message });
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, [supabase]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('file', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let mediaUrl = gesture?.media_url || '';
      const file = values.file;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gestures')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('gestures').getPublicUrl(filePath);
        mediaUrl = publicUrl;
      }

      const gestureData = {
        name: values.name,
        description: values.description,
        language: values.language,
        category_id: parseInt(values.category_id, 10),
        media_url: mediaUrl,
        media_type: file?.type.startsWith('video') ? 'video' : 'image' as 'image' | 'video',
      };

      if (gesture?.id) {
        // Update
        const { error } = await supabase.from('gestures').update(gestureData).eq('id', gesture.id);
        if (error) throw error;
        toast.success("Gesture updated successfully!");
      } else {
        // Create
        const { error } = await supabase.from('gestures').insert(gestureData);
        if (error) throw error;
        toast.success("Gesture created successfully!");
      }
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error("Submission failed", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Hello" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A friendly greeting." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ASL">American (ASL)</SelectItem>
                  <SelectItem value="MSL">Malaysian (MSL)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <Label htmlFor="file">Gesture Media (Image/Video)</Label>
          <Input id="file" type="file" accept="image/*,video/*" onChange={handleFileChange} />
        </FormItem>

        {preview && (
          <div className="mt-4">
            <Label>Media Preview</Label>
            {preview.startsWith('data:video') || preview.endsWith('.mp4') ? (
              <video src={preview} controls className="w-full h-48 object-cover rounded-md" />
            ) : (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[44px]">Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-h-[44px]">
            {isSubmitting ? 'Saving...' : 'Save Gesture'}
          </Button>
        </div>
      </form>
    </Form>
  );
};