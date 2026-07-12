import { createClient } from '@/lib/supabase/server';
import { SinglePageAdmissionForm } from './admission-client';
import { fetchStudentByCnicAction } from '@/features/academic/actions';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function NewEnrollmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch User Profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.cnic) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded">
          You must set your CNIC in your profile before applying.
        </div>
      </div>
    );
  }

  // 2. Fetch all student details via CNIC Engine
  const studentData = await fetchStudentByCnicAction(profile.cnic);
  
  // Make sure we pass the userProfile explicitly if it isn't in studentData
  if (!studentData.userProfile) {
    studentData.userProfile = profile;
  }

  // 3. Fetch Active Sessions
  const { data: activeSessions } = await supabase
    .from('sessions')
    .select('id, title, type, ad_year, ah_year')
    .eq('status', 'active');

  const mappedSessions = activeSessions?.map((s: any) => ({
    id: s.id,
    name: s.title || `${s.ad_year} / ${s.ah_year} AH (${s.type})`
  })) || [];

  // 4. Fetch Exam Centers (Institutes where is_exam_center = true)
  const { data: examCenters } = await supabase
    .from('institutes')
    .select('id, name')
    .eq('is_exam_center', true)
    .order('name');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Application</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your personal information and complete your academic application.
        </p>
      </div>

      <SinglePageAdmissionForm 
        initialData={studentData} 
        activeSessions={mappedSessions}
        examCenters={examCenters || []}
      />
    </div>
  );
}
