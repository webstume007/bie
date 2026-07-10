'use client';

import { useActionState, useEffect } from 'react';
import { createSessionAction } from '@/features/academic/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useFormDraft } from '@/hooks/useFormDraft';
import { useRouter } from 'next/navigation';

const initialState = {
  error: '',
  success: false,
};

export default function NewSessionPage() {
  const [state, formAction, isPending] = useActionState(createSessionAction, initialState);
  const router = useRouter();

  const { draft, updateDraft, clearDraft } = useFormDraft('new_session_form', {
    name: '',
    year: new Date().getFullYear().toString(),
    type: 'regular',
    enrollmentStartDate: '',
    normalFeeDeadline: '',
    lateFeeDeadline: '',
    doubleFeeDeadline: '',
  });

  useEffect(() => {
    if (state.success) {
      clearDraft();
      router.push('/backstage/sessions');
    }
  }, [state.success, clearDraft, router]);

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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define deadlines for a new enrollment session.</p>
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
              <Label htmlFor="name">Session Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Annual 2026" 
                value={draft.name}
                onChange={(e) => updateDraft({ name: e.target.value })}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year" 
                name="year" 
                type="number"
                value={draft.year}
                onChange={(e) => updateDraft({ year: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="type">Session Type</Label>
              <select
                id="type"
                name="type"
                value={draft.type}
                onChange={(e) => updateDraft({ type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              >
                <option value="regular">Regular (Annual)</option>
                <option value="supply">Supplementary</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-4">Timeline & Deadlines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentStartDate">Enrollment Opens</Label>
                <Input 
                  id="enrollmentStartDate" 
                  name="enrollmentStartDate" 
                  type="date"
                  value={draft.enrollmentStartDate}
                  onChange={(e) => updateDraft({ enrollmentStartDate: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="normalFeeDeadline">Normal Fee Deadline</Label>
                <Input 
                  id="normalFeeDeadline" 
                  name="normalFeeDeadline" 
                  type="date"
                  value={draft.normalFeeDeadline}
                  onChange={(e) => updateDraft({ normalFeeDeadline: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lateFeeDeadline">Late Fee Deadline</Label>
                <Input 
                  id="lateFeeDeadline" 
                  name="lateFeeDeadline" 
                  type="date"
                  value={draft.lateFeeDeadline}
                  onChange={(e) => updateDraft({ lateFeeDeadline: e.target.value })}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doubleFeeDeadline">Double Fee Deadline</Label>
                <Input 
                  id="doubleFeeDeadline" 
                  name="doubleFeeDeadline" 
                  type="date"
                  value={draft.doubleFeeDeadline}
                  onChange={(e) => updateDraft({ doubleFeeDeadline: e.target.value })}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]"
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
                  Create Session
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
