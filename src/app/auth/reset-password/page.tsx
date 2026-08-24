'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Loader2, ShieldAlert, Check, X } from 'lucide-react';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
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
        // First, check if we have hash parameters from the email link
        if (typeof window !== 'undefined') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const type = hashParams.get('type');

          if (type === 'recovery' && accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (!error && data.session) {
              setIsValidSession(true);
              setIsValidating(false);
              window.history.replaceState({}, document.title, window.location.pathname);
              return;
            } else {
              console.error('Error setting session:', error);
            }
          }
        }

        // Fallback: check existing session (this works after page reload)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
        }

        if (session?.user) {
          setIsValidSession(true);
          setIsValidating(false);
          return;
        }

        // If no valid session found after reasonable time, retry up to 3 times
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
          const retryDelay = (retryCount + 1) * 1000; // 1s, 2s, 3s
          setTimeout(() => {
            checkSession();
          }, retryDelay);
          return;
        }

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

    const timer = setTimeout(checkSession, 1000);
    return () => clearTimeout(timer);
  }, [router, supabase.auth, retryCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!password || !confirmPassword) {
      toast.error('Password reset failed', { description: 'Please fill in all fields.' });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password reset failed', { description: 'Passwords do not match.' });
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      toast.error('Password reset failed', {
        description: 'Password must be at least 8 characters with uppercase, lowercase, digit, and symbol.'
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error('Password reset failed', { description: error.message });
      } else {
        toast.success('Password updated successfully', {
          description: 'Your password has been updated. Redirecting to login...'
        });

        setTimeout(async () => {
          try {
            await supabase.auth.signOut();
            router.push('/auth/login');
          } catch (signOutError) {
            console.error('Sign out error:', signOutError);
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
      <AuthShell
        title="Validating reset link"
        description="Please wait while we validate your password reset link…"
      >
        <div className="flex flex-col items-center space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">This usually takes just a few seconds…</p>
          <p className="text-xs text-muted-foreground/70">If this takes too long, try refreshing the page</p>
        </div>
      </AuthShell>
    );
  }

  if (!isValidSession) {
    return (
      <AuthShell
        title="Invalid reset link"
        description="This password reset link is invalid or has expired."
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-2xl border border-destructive/25 bg-destructive/5 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <ShieldAlert className="size-5" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Please request a new password reset link from the login page.
            </p>
          </div>
          <Button onClick={() => router.push('/auth/login')} size="lg" className="w-full">
            Back to login
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      description="Enter your new password below to secure your account."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {/* Password requirements checklist */}
          {password.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/50 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Password requirements:</p>
              <div className="grid grid-cols-1 gap-1.5">
                <div className="flex items-center gap-2">
                  {validatePassword(password).minLength ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs ${validatePassword(password).minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {validatePassword(password).hasUppercase ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs ${validatePassword(password).hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                    At least 1 uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {validatePassword(password).hasLowercase ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs ${validatePassword(password).hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                    At least 1 lowercase letter (a-z)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {validatePassword(password).hasDigit ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs ${validatePassword(password).hasDigit ? 'text-green-600' : 'text-muted-foreground'}`}>
                    At least 1 digit (0-9)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {validatePassword(password).hasSymbol ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span className={`text-xs ${validatePassword(password).hasSymbol ? 'text-green-600' : 'text-muted-foreground'}`}>
                    At least 1 symbol (!@#$%^&amp;*...)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="pr-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Updating password…
            </>
          ) : (
            <>
              <Lock />
              Update password
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
