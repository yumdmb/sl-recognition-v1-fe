'use client'

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
  onSave: (updates: { name: string; email: string }) => Promise<void>;
}

export function EditProfileDialog({ 
  open, 
  onOpenChange, 
  currentUser,
  onSave 
}: EditProfileDialogProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // Sync form state with currentUser when dialog opens or currentUser changes
  useEffect(() => {
    if (open) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setErrors({});
    }
  }, [open, currentUser.name, currentUser.email]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ name: name.trim(), email: email.trim() });
      onOpenChange(false);
      // Reset form
      setName(currentUser.name);
      setEmail(currentUser.email);
      setErrors({});
    } catch (error) {
      console.error('Error saving profile:', error);
      // Keep the dialog open so user can see the error and try again
      // The error toast is shown by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(currentUser.name);
    setEmail(currentUser.email);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="profileName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                Full Name
              </label>
              <Input
                id="profileName"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                className={errors.name ? 'border-red-500' : ''}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="profileEmail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                Email
              </label>
              <Input
                id="profileEmail"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className={errors.email ? 'border-red-500' : ''}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error email-note" : "email-note"}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500">{errors.email}</p>
              )}
              <p id="email-note" className="text-xs text-gray-500">
                Note: Changing your email will require verification
              </p>
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-medium leading-none">
                Account Type
              </div>
              <div 
                className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-gray-50"
                role="status"
                aria-label="Account Type"
                aria-describedby="role-note"
              >
                <span className="capitalize">{currentUser.role}</span>
              </div>
              <p id="role-note" className="text-xs text-gray-500">
                Account type cannot be changed
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
