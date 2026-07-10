'use client';

import { useActionState, useEffect } from 'react';
import { submitEnrollmentAction } from '@/features/enrollments/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, BookOpen, CalendarClock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const initialState = {
  error: '',
  success: false,
  trackingId: '',
};

interface Session {
  id: string;
  name: string;
  year: number;
  type: string;
}

interface Degree {
  id: string;
  name: string;
  level: string;
}

export function EnrollmentForm({ sessions, degrees }: { sessions: Session[], degrees: Degree[] }) {
  const [state, formAction, isPending] = useActionState(submitEnrollmentAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.trackingId) {
      router.push(`/student/enrollments?success=true&trackingId=${state.trackingId}`);
    }
  }, [state.success, state.trackingId, router]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <form action={formAction} className="p-6 space-y-8">
        {state?.error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm font-medium">
            {state.error}
          </div>
        )}

        <input type="hidden" name="isPrivate" value="true" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            <CalendarClock className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3>1. Academic Session</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-500">There are no active exam sessions open at this time.</p>
            ) : (
              sessions.map((session) => (
                <label 
                  key={session.id} 
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 cursor-pointer transition-colors has-[:checked]:border-indigo-600 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-500/10"
                >
                  <input 
                    type="radio" 
                    name="sessionId" 
                    value={session.id} 
                    className="mt-1 size-4 text-indigo-600 focus:ring-indigo-500" 
                    required 
                  />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {session.name} ({session.year})
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                      {session.type} Exam
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3>2. Degree Program</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {degrees.length === 0 ? (
              <p className="text-sm text-slate-500">No programs available.</p>
            ) : (
              degrees.map((degree) => (
                <label 
                  key={degree.id} 
                  className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 cursor-pointer transition-colors has-[:checked]:border-indigo-600 dark:has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-500/10"
                >
                  <input 
                    type="radio" 
                    name="degreeId" 
                    value={degree.id} 
                    className="mt-1 size-4 text-indigo-600 focus:ring-indigo-500" 
                    required 
                  />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {degree.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Level: {degree.level}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            By submitting this application, you declare that all personal information in your profile is accurate and you agree to the Board's terms and conditions for private candidates.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button 
            type="submit" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] h-11 text-base"
            disabled={isPending || sessions.length === 0 || degrees.length === 0}
          >
            {isPending ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
