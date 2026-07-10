import { createClient } from '@/lib/supabase/server';
import { InstituteShell } from '@/components/institute/institute-shell';
import { redirect } from 'next/navigation';
import PendingActionsTable from './pending-actions-table';

export const revalidate = 0;

export default async function InstituteActionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) redirect('/institute');

  // Fetch pending applications (SUBMITTED but no challan yet)
  const { data: pendingApps } = await supabase
    .from('exam_applications')
    .select(`
      id,
      tracking_id,
      created_at,
      sessions ( name, year ),
      degrees ( name, base_fee ),
      institute_students ( full_name, father_name )
    `)
    .eq('institute_id', institute.id)
    .eq('status', 'SUBMITTED')
    .order('created_at', { ascending: false });

  // Fetch pending challans (UNPAID)
  const { data: pendingChallans } = await supabase
    .from('challans')
    .select(`
      id,
      psid,
      amount,
      status,
      created_at,
      challan_enrollments ( count )
    `)
    .eq('student_id', user.id)
    .eq('status', 'UNPAID')
    .order('created_at', { ascending: false });

  return (
    <InstituteShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Pending Actions</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Manage bulk challans and pending fee payments.</p>
        </div>

        <PendingActionsTable 
          pendingApps={pendingApps || []} 
          pendingChallans={pendingChallans || []} 
        />
      </div>
    </InstituteShell>
  );
}
