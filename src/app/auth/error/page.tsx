'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An error occurred during authentication'

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-signlang-accent">
              Authentication Failed
            </CardTitle>
            <CardDescription>
              There was an issue with authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
            <p className="text-sm text-red-600">{message}</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
