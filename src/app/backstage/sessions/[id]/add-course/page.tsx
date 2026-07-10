'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { addCourseToSessionAction } from '@/features/academic/actions';

const initialState: any = {
  error: '',
  success: false,
};

export default function AddCourseToSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addCourseToSessionAction, initialState);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/backstage/sessions/${params.id}`}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Course to Session</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure fee and deadlines for this course.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form action={formAction} className="p-6 space-y-6">
          <input type="hidden" name="sessionId" value={params.id} />
          
          {state?.error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="courseId">Course (Course) ID</Label>
              <Input 
                id="courseId" 
                name="courseId" 
                type="number"
                placeholder="Enter the ID of the course" 
                required 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="baseFee">Base Admission Fee (Rs.)</Label>
              <Input 
                id="baseFee" 
                name="baseFee" 
                type="number"
                required 
              />
            </div>

            <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Fee Deadlines</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="singleFeeDeadline">Single Fee Deadline</Label>
              <Input 
                id="singleFeeDeadline" 
                name="singleFeeDeadline" 
                type="date" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doubleFeeDeadline">Double Fee Deadline</Label>
              <Input 
                id="doubleFeeDeadline" 
                name="doubleFeeDeadline" 
                type="date" 
                required 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tripleFeeDeadline">Triple Fee Deadline</Label>
              <Input 
                id="tripleFeeDeadline" 
                name="tripleFeeDeadline" 
                type="date" 
                required 
              />
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="size-4" /> Save Course
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
