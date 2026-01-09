'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Check, X } from 'lucide-react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import { validatePassword, isPasswordValid } from '@/lib/utils';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        
        // First, check if we have hash parameters from the email link
        if (typeof window !== 'undefined') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          console.log('Hash params:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });

          if (type === 'recovery' && accessToken && refreshToken) {
            console.log('Setting session with tokens from hash...');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (!error && data.session) {
              console.log('Session set successfully');
              setIsValidSession(true);
              setIsValidating(false);
              // Clean up the URL
              window.history.replaceState({}, document.title, window.location.pathname);
              return;
            } else {
              console.error('Error setting session:', error);
            }
          }
        }

        // Fallback: check existing session (this works after page reload)
        console.log('Checking existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
        }
        
        if (session?.user) {
          console.log('Found existing session');
          setIsValidSession(true);
          setIsValidating(false);
          return;
        }        // If no valid session found after reasonable time, show error
        console.log('No valid session found, retry count:', retryCount);
        
        // Retry up to 3 times with increasing delays
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          const retryDelay = (retryCount + 1) * 1000; // 1s, 2s, 3s
          console.log(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            checkSession();
          }, retryDelay);
          return;
        }
        
        // After 3 retries, show error
        setIsValidating(false);
        toast.error('Invalid reset link', {
          description: 'This password reset link is invalid or has expired. Please request a new one.'
        });
        setTimeout(() => router.push('/auth/login'), 3000);
        
      } catch (error) {
        console.error('Error in checkSession:', error);
        setIsValidating(false);
        toast.error('Session validation failed', {
          description: 'An error occurred while validating your reset link.'
        });
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    // Give the page a moment to load, then check session
    const timer = setTimeout(checkSession, 1000);
    return () => clearTimeout(timer);
  }, [router, supabase.auth, retryCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!password || !confirmPassword) {
      toast.error('Password reset failed', {
        description: 'Please fill in all fields.'
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password reset failed', {
        description: 'Passwords do not match.'
      });
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error('Password reset failed', {
        description: 'Password must be at least 8 characters with uppercase, lowercase, digit, and symbol.'
      });
      setIsLoading(false);
      return;
    }    try {
      console.log('Updating password...');
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error('Password reset failed', {
          description: error.message
        });
      } else {
        console.log('Password updated successfully');
        toast.success('Password updated successfully', {
          description: 'Your password has been updated. Redirecting to login...'
        });
        
        // Add a small delay to show the success message, then sign out and redirect
        setTimeout(async () => {
          try {
            await supabase.auth.signOut();
            router.push('/auth/login');
          } catch (signOutError) {
            console.error('Sign out error:', signOutError);
            // Even if sign out fails, redirect to login
            router.push('/auth/login');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Password reset failed', {
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (isValidating) {
    return (
      <AuthLayout>
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-signlang-primary"></div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Validating Reset Link</CardTitle>
            <CardDescription>
              Please wait while we validate your password reset link...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-2 pb-6">
            <p className="text-sm text-gray-600">This usually takes just a few seconds...</p>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  if (!isValidSession) {
    return (
      <AuthLayout>
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 pb-6">
            <p className="text-sm text-gray-600">
              Please request a new password reset link from the login page.
            </p>
            <Button 
              onClick={() => router.push('/auth/login')} 
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="shadow-lg border border-gray-100">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required 
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>

              {/* Password requirements checklist */}
              {password.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    <div className="flex items-center gap-2">
                      {validatePassword(password).minLength ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className={`text-xs ${validatePassword(password).minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validatePassword(password).hasUppercase ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className={`text-xs ${validatePassword(password).hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        At least 1 uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validatePassword(password).hasLowercase ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className={`text-xs ${validatePassword(password).hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        At least 1 lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validatePassword(password).hasDigit ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className={`text-xs ${validatePassword(password).hasDigit ? 'text-green-600' : 'text-gray-500'}`}>
                        At least 1 digit (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {validatePassword(password).hasSymbol ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span className={`text-xs ${validatePassword(password).hasSymbol ? 'text-green-600' : 'text-gray-500'}`}>
                        At least 1 symbol (!@#$%^&amp;*...)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required 
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating Password...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update Password
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardContent className="pt-4">
          <div className="text-center">
            <Link href="/auth/login" className="text-sm text-signlang-primary hover:underline">
              Remember your password? Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}