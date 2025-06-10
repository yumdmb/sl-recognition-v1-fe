'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'An error occurred during authentication');
          toast.error('Authentication failed', {
            description: errorDescription || error
          });
          return;
        }

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            setStatus('error');
            setMessage(exchangeError.message);
            toast.error('Authentication failed', {
              description: exchangeError.message
            });
            return;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Email verified successfully! You can now log in.');
            toast.success('Email verified', {
              description: 'Your email has been verified successfully!'
            });
            
            // Redirect to dashboard if user is already logged in, otherwise to login
            setTimeout(() => {
              if (data.session.user) {
                router.push('/dashboard');
              } else {
                router.push('/auth/login');
              }
            }, 2000);
            return;
          }
        }

        // If no code or error, check if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred');
        toast.error('Authentication failed', {
          description: 'An unexpected error occurred'
        });
      }
    };

    handleAuthCallback();
  }, [searchParams, router, supabase.auth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-signlang-accent">
              {status === 'loading' && 'Verifying Email'}
              {status === 'success' && 'Email Verified'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Please wait while we verify your email...'}
              {status === 'success' && 'Your email has been successfully verified!'}
              {status === 'error' && 'There was an issue verifying your email.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === 'loading' && (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-signlang-primary" />
              </div>
            )}
            
            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-sm text-gray-600">{message}</p>
                <p className="text-xs text-gray-500">Redirecting you to the dashboard...</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <p className="text-sm text-red-600">{message}</p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/auth/login">Go to Login</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/register">Register Again</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}