import { createClient } from '@/lib/supabase/server';
import { ClerkShell } from '@/components/clerk/clerk-shell';
import { redirect } from 'next/navigation';
import DataEntryTable from './data-entry-table';

export const revalidate = 0;

export default async function ClerkDataEntryPage() {
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

  // Fetch recent enrollments for data correction
  const { data: enrollments } = await supabase
    .from('exam_applications')
    .select(`
      id,
      tracking_id,
      created_at,
      status,
      is_private,
      sessions ( name, year ),
      courses ( name ),
      students ( full_name, father_name, b_form_cnic ),
      institute_students ( full_name, father_name ),
      institutes ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <ClerkShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Data Entry & Corrections</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Review, correct, and update student demographic and enrollment data.</p>
        </div>

        <DataEntryTable enrollments={enrollments || []} />
      </div>
    </ClerkShell>
  );
}
