'use client';

import { useState } from 'react';
import { createInstituteAction } from '@/features/institutes/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewInstitutePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createInstituteAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If successful, the action will redirect
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/backstage/institutes" className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Register New Institute</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create an institutional account and generate login credentials.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Institute Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instituteName">Institute Name</Label>
                <Input id="instituteName" name="instituteName" required className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliationNo">Affiliation Number</Label>
                <Input id="affiliationNo" name="affiliationNo" className="h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address</Label>
              <Input id="address" name="address" required className="h-10" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Head/Principal Details (Login Credentials)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headName">Head/Principal Name</Label>
                <Input id="headName" name="headName" required className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC Number</Label>
                <Input id="cnic" name="cnic" placeholder="XXXXX-XXXXXXX-X" required className="h-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" name="password" type="text" required className="h-10" />
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-500 font-medium p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}

          <div className="flex justify-end pt-4">
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Institute'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
