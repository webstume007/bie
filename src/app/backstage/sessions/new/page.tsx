'use client';

import { useActionState, useEffect } from 'react';
import { createSessionAction } from '@/features/academic/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useFormDraft } from '@/hooks/useFormDraft';
import { useRouter } from 'next/navigation';

const initialState: any = {
  error: '',
  success: false,
};

export default function NewSessionPage() {
  const [state, formAction, isPending] = useActionState(createSessionAction, initialState);
  const router = useRouter();

  const { values, handleChange, clearDraft } = useFormDraft('new_session_form', {
    name: '',
    year: new Date().getFullYear().toString(),
    type: 'regular',
    adDate: '',
    islamicDate: '',
    admissionOpenDate: '',
  });

  useEffect(() => {
    if (state.success && state.sessionId) {
      clearDraft();
      router.push(`/backstage/sessions/${state.sessionId}`);
    }
  }, [state.success, state.sessionId, clearDraft, router]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/backstage/sessions"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Academic Session</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Step 1: Define basic session parameters.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form action={formAction} className="p-6 space-y-6">
          {state?.error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Session Title</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Annual 2026" 
                value={values.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year" 
                name="year" 
                type="number"
                value={values.year}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="type">Session Type</Label>
              <select
                id="type"
                name="type"
                value={values.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              >
                <option value="regular">Regular</option>
                <option value="supply">Supplementary</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Important Dates</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adDate">AD Date (Gregorian)</Label>
              <Input 
                id="adDate" 
                name="adDate" 
                type="date" 
                value={values.adDate}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="islamicDate">Islamic Year (e.g. 1448)</Label>
              <Input 
                id="islamicDate" 
                name="islamicDate" 
                type="text" 
                placeholder="1448"
                maxLength={4}
                value={values.islamicDate}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="admissionOpenDate">Admission Open Date</Label>
              <Input 
                id="admissionOpenDate" 
                name="admissionOpenDate" 
                type="date" 
                value={values.admissionOpenDate}
                onChange={handleChange}
                required 
              />
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px]"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Continue to Courses <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
