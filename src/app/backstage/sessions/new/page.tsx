import { createClient } from '@/lib/supabase/server';
import UnifiedSessionForm from './unified-session-form';

export const revalidate = 0;

export default async function NewSessionPage() {
  const supabase = await createClient();

  const [{ data: courses }, { data: subjects }] = await Promise.all([
    supabase.from('courses').select('id, name, base_fee').order('name'),
    supabase.from('subjects').select('id, name').order('name'),
  ]);

  return (
    <UnifiedSessionForm 
      availableCourses={courses || []} 
      availableSubjects={subjects || []} 
    />
  );
}
