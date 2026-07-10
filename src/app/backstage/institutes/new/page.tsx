'use client';

import { useState } from 'react';
import { createInstituteAction } from '@/features/institutes/actions';
import { useFormDraft } from '@/hooks/useFormDraft';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const initialFormValues = {
  instituteName: '',
  affiliationNo: '',
  address: '',
  headName: '',
  cnic: '',
  email: '',
  password: '',
};

export default function NewInstitutePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { values, handleChange, clearDraft, isDirty } = useFormDraft(
    'new_institute',
    initialFormValues
  );

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createInstituteAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      clearDraft(); // Success! Remove draft
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/backstage/institutes" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="size-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Register New Institute</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create an institutional account and generate login credentials.</p>
          </div>
        </div>
        {isDirty && (
          <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full font-medium animate-pulse">
            Unsaved Draft
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Institute Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instituteName">Institute Name</Label>
                <Input 
                  id="instituteName" 
                  name="instituteName" 
                  value={values.instituteName} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliationNo">Affiliation Number</Label>
                <Input 
                  id="affiliationNo" 
                  name="affiliationNo" 
                  value={values.affiliationNo} 
                  onChange={handleChange}
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={values.address} 
                onChange={handleChange}
                required 
                className="h-10 rounded-xl focus-ring-glow" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Head/Principal Details (Login Credentials)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headName">Head/Principal Name</Label>
                <Input 
                  id="headName" 
                  name="headName" 
                  value={values.headName} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC Number</Label>
                <Input 
                  id="cnic" 
                  name="cnic" 
                  value={values.cnic} 
                  onChange={handleChange}
                  placeholder="XXXXX-XXXXXXX-X" 
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={values.email} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="text" 
                  value={values.password} 
                  onChange={handleChange}
                  required 
                  className="h-10 rounded-xl focus-ring-glow" 
                />
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-500 font-medium p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/50">{error}</div>}

          <div className="flex justify-end pt-4">
            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-neutral-950 w-full sm:w-auto px-8 rounded-xl hover-lift" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Institute'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
