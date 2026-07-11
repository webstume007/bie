import { createClient } from '@/lib/supabase/server';
import { InstituteShell } from '@/components/institute/institute-shell';
import { redirect } from 'next/navigation';
import InstituteAdmissionClient from './institute-admission-client';

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
    .eq('status', 'active')
    .order('year', { ascending: false });

  // Fetch courses
  const { data: courses } = await supabase
    .from('courses')
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
      <InstituteAdmissionClient instituteId={institute.id.toString()} />
    </InstituteShell>
  );
}
