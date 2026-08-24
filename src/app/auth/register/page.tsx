'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2, UserPlus, Ear, EarOff, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthShell from '@/components/auth/AuthShell';
import { validatePassword, isPasswordValid } from '@/lib/utils';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'non-deaf' | 'deaf'>('non-deaf');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  // Memoized password validation
  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const passwordIsValid = useMemo(() => isPasswordValid(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password) {
      toast.error("Registration failed", { description: "All fields are required." });
      setIsLoading(false);
      return;
    }

    // Password strength validation
    if (!passwordIsValid) {
      toast.error("Registration failed", {
        description: "Password does not meet the requirements."
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Registration failed", { description: "Passwords don't match." });
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(name, email, password, role);
      if (success) {
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch {
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      description="Join a community learning sign language together — free, forever."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Aisyah Rahman"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat it"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Password requirements checklist */}
        {password.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Password requirements:</p>
            <div className="grid grid-cols-1 gap-1.5">
              <div className="flex items-center gap-2">
                {passwordValidation.minLength ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordValidation.hasUppercase ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                  At least 1 uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordValidation.hasLowercase ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                  At least 1 lowercase letter (a-z)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordValidation.hasDigit ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs ${passwordValidation.hasDigit ? 'text-green-600' : 'text-muted-foreground'}`}>
                  At least 1 digit (0-9)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordValidation.hasSymbol ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <X className="h-3.5 w-3.5 text-destructive" />
                )}
                <span className={`text-xs ${passwordValidation.hasSymbol ? 'text-green-600' : 'text-muted-foreground'}`}>
                  At least 1 symbol (!@#$%^&amp;*...)
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          <Label>I am…</Label>
          <RadioGroup
            defaultValue="non-deaf"
            className="grid grid-cols-2 gap-3"
            onValueChange={(value) => setRole(value as 'non-deaf' | 'deaf')}
          >
            {[
              { value: 'non-deaf', id: 'non-deaf', label: 'Hearing learner', desc: 'I want to learn sign language', icon: Ear },
              { value: 'deaf', id: 'deaf', label: 'Deaf member', desc: 'Sign language is my language', icon: EarOff },
            ].map((opt) => (
              <Label
                key={opt.id}
                htmlFor={opt.id}
                className="flex cursor-pointer flex-col items-start gap-2.5 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:bg-accent has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary-soft"
              >
                <RadioGroupItem value={opt.value} id={opt.id} className="absolute" />
                <opt.icon className="size-4.5 text-primary" />
                <span>
                  <span className="block text-sm font-semibold">{opt.label}</span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{opt.desc}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              <UserPlus />
              Create account
            </>
          )}
        </Button>

        <p className="text-xs leading-relaxed text-muted-foreground">
          After registering, please check your email to verify your account.
        </p>
        <p className="text-xs text-muted-foreground text-center">
          By registering, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
