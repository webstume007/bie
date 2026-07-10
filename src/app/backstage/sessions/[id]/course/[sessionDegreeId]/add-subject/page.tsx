'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { addSubjectToSessionCourseAction } from '@/features/academic/actions';

const initialState: any = {
  error: '',
  success: false,
};

export default function AddSubjectToCoursePage({ params }: { params: { id: string, sessionDegreeId: string } }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addSubjectToSessionCourseAction, initialState);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href={`/backstage/sessions/${params.id}/course/${params.sessionDegreeId}`}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Subject</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure subject rules for this session course.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <form action={formAction} className="p-6 space-y-6">
          <input type="hidden" name="sessionDegreeId" value={params.sessionDegreeId} />
          <input type="hidden" name="sessionId" value={params.id} />

          {state?.error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subjectId">Subject ID</Label>
              <Input 
                id="subjectId" 
                name="subjectId" 
                type="number"
                placeholder="Enter the ID of the subject" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input 
                id="totalMarks" 
                name="totalMarks" 
                type="number"
                defaultValue="100"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isCompulsory">Subject Type</Label>
              <select
                id="isCompulsory"
                name="isCompulsory"
                defaultValue="true"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              >
                <option value="true">Compulsory (Mandatory)</option>
                <option value="false">Selective (Elective)</option>
              </select>
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
                  <Save className="size-4" /> Save Subject
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
