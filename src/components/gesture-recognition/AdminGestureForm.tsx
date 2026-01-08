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
import { toast } from 'sonner';
import { GestureContribution, GestureCategory } from '@/types/gestureContributions';
import { GestureContributionService } from '@/lib/supabase/gestureContributions';

interface AdminGestureFormProps {
  gesture?: GestureContribution | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  language: z.enum(["ASL", "MSL"]),
  category_id: z.string().refine(val => !isNaN(parseInt(val, 10)), { message: "Please select a category" }),
  file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AdminGestureForm: React.FC<AdminGestureFormProps> = ({ gesture, onSuccess, onCancel }) => {
  const [categories, setCategories] = useState<GestureCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(gesture?.media_url || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gesture?.title || "",
      description: gesture?.description || "",
      language: gesture?.language || "ASL",
      category_id: gesture?.category_id?.toString() || "",
      file: undefined,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await GestureContributionService.getCategories();
      if (error) {
        toast.error("Failed to load categories");
      } else if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (gesture) {
        // Update existing - use updateCategory for now (full edit would need more service methods)
        const { error } = await GestureContributionService.updateCategory(
          gesture.id, 
          parseInt(values.category_id, 10)
        );
        if (error) throw error;
        toast.success("Gesture updated successfully!");
      } else {
        // Create new via admin direct add
        if (!values.file) {
          toast.error("Please select a media file");
          setIsSubmitting(false);
          return;
        }

        const mediaType = values.file.type.startsWith('video') ? 'video' : 'image';
        
        const { error } = await GestureContributionService.adminAddGesture({
          title: values.title,
          description: values.description,
          language: values.language,
          media_type: mediaType,
          category_id: parseInt(values.category_id, 10),
          file: values.file,
        });

        if (error) throw new Error(error.message);
        toast.success("Gesture added to dictionary!");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
                <Textarea placeholder="A friendly greeting gesture." {...field} />
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
                      {cat.icon && <span className="mr-2">{cat.icon}</span>}
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!gesture && (
          <FormItem>
            <Label htmlFor="file">Gesture Media (Image/Video) *</Label>
            <Input id="file" type="file" accept="image/*,video/*" onChange={handleFileChange} />
          </FormItem>
        )}

        {preview && (
          <div className="mt-4">
            <Label>Media Preview</Label>
            {preview.startsWith('data:video') || preview.includes('.mp4') || preview.includes('.webm') ? (
              <video src={preview} controls className="w-full h-48 object-cover rounded-md" />
            ) : (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto min-h-[44px]">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-h-[44px]">
            {isSubmitting ? 'Saving...' : gesture ? 'Update Gesture' : 'Add to Dictionary'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
