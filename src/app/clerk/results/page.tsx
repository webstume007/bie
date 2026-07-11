import { createClient } from '@/lib/supabase/server';
import { ClerkShell } from '@/components/clerk/clerk-shell';
import { redirect } from 'next/navigation';
import ResultsProcessingTable from './results-processing-table';

export const revalidate = 0;

export default async function ClerkResultsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role_id, roles(name)')
    .eq('id', user.id)
    .single();

  const roleName = (profile?.roles as any)?.name;
  if (roleName !== 'clerk' && roleName !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch approved enrollments for result processing
  const { data: enrollments } = await supabase
    .from('exam_applications')
    .select(`
      id,
      tracking_id,
      assigned_roll_no,
      is_private,
      sessions ( name, year ),
      courses ( name ),
      students ( full_name, father_name ),
      institute_students ( full_name, father_name ),
      institutes ( name )
    `)
    .eq('status', 'APPROVED')
    .order('assigned_roll_no', { ascending: true })
    .limit(100);

  return (
    <ClerkShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Result Processing</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Manage and process exam marks for approved students.</p>
        </div>

        <ResultsProcessingTable enrollments={enrollments || []} />
      </div>
    </ClerkShell>
  );
}
