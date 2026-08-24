'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthShell from '@/components/auth/AuthShell';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error("Reset failed", { description: "Please enter your email address." });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email", { description: "Please enter a valid email address." });
      setIsLoading(false);
      return;
    }

    try {
      const success = await resetPassword(email);
      if (success) {
        setEmailSent(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  if (emailSent) {
    return (
      <AuthShell
        title="Check your email"
        description={<>We've sent a password reset link to <strong className="text-foreground">{email}</strong></>}
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              Back to login
            </Link>
          </p>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-2xl border border-primary/25 bg-primary-soft p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <MailCheck className="size-5" />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Didn't receive the email? Check your spam folder, or try again with a
              different address.
            </p>
          </div>
          <Button onClick={handleBackToLogin} size="lg" className="w-full">
            <ArrowLeft />
            Back to login
          </Button>
          <Button
            onClick={() => {
              setEmailSent(false);
              setEmail('');
            }}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Try a different email
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset it."
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
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Sending reset email…
            </>
          ) : (
            <>
              <Mail />
              Send reset email
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
