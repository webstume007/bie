import { createClient } from '@/lib/supabase/server';
import { AlertCircle, GraduationCap, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch the user_profile and student record
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('id', user.id)
    .single();

  const isProfileComplete = !!student;
  const studentName = profile?.full_name || 'Student';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {studentName}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is an overview of your academic status.</p>
      </div>

      {!isProfileComplete && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4 items-start">
            <AlertCircle className="size-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-400">Complete Your Profile</h3>
              <p className="text-amber-700 dark:text-amber-500 text-sm mt-1">You need to complete your profile information before you can apply for enrollments or exams.</p>
            </div>
          </div>
          <Link href="/student/profile" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              Complete Profile
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Enrollments</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <FileText className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Challans</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
