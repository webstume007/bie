import { createClient } from '@/lib/supabase/server';
import { AdmissionWizard } from '@/components/admission-wizard';
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
        <div className="p-4 bg-amber-50 text-amber-800 rounded">
          You must set your CNIC in your profile before applying.
        </div>
      </div>
    );
  }

  // 2. Fetch all student details via CNIC Engine
  const studentData = await fetchStudentByCnicAction(profile.cnic);

  // 3. Fetch Active Sessions
  const { data: activeSessions } = await supabase
    .from('sessions')
    .select('id, title, type, ad_year, ah_year')
    .eq('status', 'active');

  const mappedSessions = activeSessions?.map((s: any) => ({
    id: s.id,
    name: s.title || `${s.ad_year} / ${s.ah_year} AH (${s.type})`
  })) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exam Application</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete the 5-step application process. 
          As a private student, your application will be routed to the selected institute for attestation.
        </p>
      </div>

      <AdmissionWizard 
        initialData={studentData} 
        activeSessions={mappedSessions}
        isPrivate={true} 
      />
    </div>
  );
}
