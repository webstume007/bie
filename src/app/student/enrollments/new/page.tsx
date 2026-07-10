import { createClient } from '@/lib/supabase/server';
import { EnrollmentForm } from '@/components/student/enrollment-form';
import { redirect } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function NewEnrollmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch Profile to check if it's complete
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, father_name, date_of_birth, profile_picture_url')
    .eq('id', user.id)
    .single();

  const isProfileComplete = profile && profile.full_name && profile.father_name && profile.date_of_birth && profile.profile_picture_url;

  // 2. Fetch active Sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, name, year, type')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // 3. Fetch Degrees
  const { data: degrees } = await supabase
    .from('degrees')
    .select('id, name, level')
    .order('created_at', { ascending: false });

  if (!isProfileComplete) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Application</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start a new enrollment application.</p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6 flex gap-4">
          <AlertCircle className="size-6 text-amber-600 dark:text-amber-500 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">Incomplete Profile</h3>
            <p className="text-amber-700 dark:text-amber-400 mt-1 text-sm">
              You must complete your profile with your personal details and a passport-size photograph before you can apply for an exam.
            </p>
            <div className="mt-4">
              <Link
                href="/student/profile"
                className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Go to Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Application</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select an active session and degree to apply as a Private Candidate.</p>
      </div>

      <EnrollmentForm
        sessions={sessions || []}
        degrees={degrees || []}
      />
    </div>
  );
}
