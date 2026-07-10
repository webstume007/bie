'use client';

import { useActionState, useEffect } from 'react';
import { createDegreeAction } from '@/features/academic/actions';
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

export default function NewDegreePage() {
  const [state, formAction, isPending] = useActionState(createDegreeAction, initialState);
  const router = useRouter();

  const { values, handleChange, clearDraft } = useFormDraft('new_degree_form', {
    name: '',
    level: '',
    normalFee: '',
    lateFee: '',
    doubleFee: '',
  });

  useEffect(() => {
    if (state.success) {
      clearDraft();
      router.push('/backstage/degrees');
    }
  }, [state.success, clearDraft, router]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/backstage/degrees"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Degree Program</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Define a new degree and its fee structure.</p>
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
              <Label htmlFor="name">Degree Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g. Sanviya Aama" 
                value={values.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Academic Level</Label>
              <Input 
                id="level" 
                name="level" 
                placeholder="e.g. Matric / Intermediate"
                value={values.level}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-4">Fee Structure (PKR)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="normalFee">Normal Fee</Label>
                <Input 
                  id="normalFee" 
                  name="normalFee" 
                  type="number"
                  placeholder="2500"
                  value={values.normalFee}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lateFee">Late Fee</Label>
                <Input 
                  id="lateFee" 
                  name="lateFee" 
                  type="number"
                  placeholder="3500"
                  value={values.lateFee}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doubleFee">Double Fee</Label>
                <Input 
                  id="doubleFee" 
                  name="doubleFee" 
                  type="number"
                  placeholder="5000"
                  value={values.doubleFee}
                  onChange={handleChange}
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
                  Create Degree
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
