'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'non-deaf' | 'deaf'>('non-deaf');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic form validation
    if (!name || !email || !password) {
      toast.error("Registration failed", {
        description: "All fields are required."
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Registration failed", {
        description: "Passwords don't match."
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(name, email, password, role);
      if (success) {
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error) {
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-signlang-accent">Create Account</CardTitle>
            <CardDescription>
              Sign up for a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your.email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="new-password"
                  type="password" 
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirm-password"
                  type="password" 
                  autoComplete="new-password"
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup 
                  defaultValue="non-deaf"
                  className="flex space-x-4"
                  onValueChange={(value) => setRole(value as 'non-deaf' | 'deaf')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-deaf" id="non-deaf" />
                    <Label htmlFor="non-deaf">Non-Deaf Person</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deaf" id="deaf" />
                    <Label htmlFor="deaf">Deaf Person</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </span>
                )}
              </Button>
              
              <div className="text-xs text-gray-500 mt-4">
                <p>
                  By registering, you agree to our Terms of Service and Privacy Policy.
                </p>
                <p className="mt-2">
                  Note: After registration, your account will need to be verified by an administrator before you can log in.
                </p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-signlang-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 