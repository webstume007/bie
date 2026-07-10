import { createClient } from '@/lib/supabase/server';
import { ClerkShell } from '@/components/clerk/clerk-shell';
import { redirect } from 'next/navigation';
import AdmissionsQueueTable from './admissions-queue-table';

export const revalidate = 0;

export default async function ClerkAdmissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role_id, roles(name)')
    .eq('id', user.id)
    .single();

  if (profile?.roles?.name !== 'clerk' && profile?.roles?.name !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch applications ready for admission approval (FEE_VERIFIED)
  const { data: applications } = await supabase
    .from('exam_applications')
    .select(`
      id,
      tracking_id,
      created_at,
      is_private,
      sessions ( name, year ),
      degrees ( name ),
      students ( full_name, father_name, b_form_cnic ),
      institute_students ( full_name, father_name ),
      institutes ( name )
    `)
    .eq('status', 'FEE_VERIFIED')
    .order('created_at', { ascending: true });

  // Fetch Exam Centers for dropdown
  const { data: centers } = await supabase
    .from('exam_centers')
    .select('id, name, location, capacity')
    .order('name');

  return (
    <ClerkShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Admissions Verification</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Review fee-verified applications, assign centers, and generate roll number slips.</p>
        </div>

        <AdmissionsQueueTable applications={applications || []} centers={centers || []} />
      </div>
    </ClerkShell>
  );
}
