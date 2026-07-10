import { createClient } from '@/lib/supabase/server';
import { InstituteShell } from '@/components/institute/institute-shell';
import { redirect } from 'next/navigation';
import BulkEnrollWizard from './bulk-enroll-wizard';

export const revalidate = 0;

export default async function InstituteBulkEnrollPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) redirect('/institute');

  // Fetch active sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('is_active', true)
    .order('year', { ascending: false });

  // Fetch degrees
  const { data: degrees } = await supabase
    .from('degrees')
    .select('*')
    .order('name');

  // Fetch roster students
  const { data: students } = await supabase
    .from('institute_students')
    .select('*')
    .eq('institute_id', institute.id)
    .order('full_name');

  return (
    <InstituteShell>
      <BulkEnrollWizard 
        sessions={sessions || []} 
        degrees={degrees || []} 
        students={students || []} 
      />
    </InstituteShell>
  );
}
