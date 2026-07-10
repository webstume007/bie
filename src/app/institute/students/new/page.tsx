'use client';

import { InstituteShell } from '@/components/institute/institute-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { addRosterStudentAction } from '@/features/institute/actions';
import { useRouter } from 'next/navigation';

export default function AddRosterStudentPage() {
  const [state, formAction, isPending] = useActionState(addRosterStudentAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/institute/students');
    }
  }, [state, router]);

  return (
    <InstituteShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/institute/students">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Add Student</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Register a new student to your institute's roster.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-sm">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer">
              <Upload className="size-8 text-neutral-400 mb-2" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Upload Photo</p>
              <p className="text-xs text-neutral-500 mt-1">JPEG or PNG, max 2MB</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="e.g. Ali Khan" required className="bg-neutral-50 dark:bg-neutral-950" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input id="fatherName" name="fatherName" placeholder="e.g. Ahmad Khan" required className="bg-neutral-50 dark:bg-neutral-950" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required className="bg-neutral-50 dark:bg-neutral-950" />
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
              <Link href="/institute/students">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Add Student
              </Button>
            </div>
          </form>
        </div>
      </div>
    </InstituteShell>
  );
}
