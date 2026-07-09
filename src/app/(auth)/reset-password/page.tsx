'use client';

import { useState } from 'react';
import { resetPasswordAction } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await resetPasswordAction(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your CNIC to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm mb-4">
            {success}
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC</Label>
              <Input id="cnic" name="cnic" placeholder="XXXXX-XXXXXXX-X" required />
            </div>
            
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          Remember your password?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
