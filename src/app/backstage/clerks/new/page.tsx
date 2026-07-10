'use client';

import { useActionState, useEffect } from 'react';
import { createClerkAction } from '@/features/clerks/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useFormDraft } from '@/hooks/useFormDraft';
import { useRouter } from 'next/navigation';

const initialState: any = {
  error: '',
  success: false,
};

export default function NewClerkPage() {
  const [state, formAction, isPending] = useActionState(createClerkAction, initialState);
  const router = useRouter();

  // Protect form data
  const { values, handleChange, clearDraft } = useFormDraft('new_clerk_form', {
    fullName: '',
    cnic: '',
    email: '',
  });

  useEffect(() => {
    if (state.success) {
      clearDraft();
      router.push('/backstage/clerks');
    }
  }, [state.success, clearDraft, router]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/backstage/clerks"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Register New Clerk</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new staff account with clerk access.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form action={formAction} className="p-6 space-y-6">
          {state?.error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                placeholder="e.g. Ali Ahmed" 
                value={values.fullName}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC Number</Label>
              <Input 
                id="cnic" 
                name="cnic" 
                placeholder="00000-0000000-0" 
                value={values.cnic}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="staff@board.edu.pk" 
                value={values.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="text" 
                placeholder="At least 6 characters" 
                minLength={6}
                required 
              />
              <p className="text-xs text-slate-500">The clerk can change this after logging in.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950 min-w-[140px]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Create Clerk
                </>
              )}
            </Button>
            <span className="text-xs text-slate-500">Draft saved automatically</span>
          </div>
        </form>
      </div>
    </div>
  );
}
