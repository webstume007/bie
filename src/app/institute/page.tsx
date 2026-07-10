import { createClient } from '@/lib/supabase/server';
import { InstituteDashboardUI } from '@/components/institute/InstituteDashboardUI';

export default async function InstituteDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real scenario, we would fetch actual stats based on the institute's ID
  // For now, we'll just display a welcome message and placeholder stats.
  
  let instituteName = 'Institute';
  if (user) {
    const { data: institute } = await supabase
      .from('institutes')
      .select('name')
      .eq('head_user_id', user.id)
      .single();
    
    if (institute) {
      instituteName = institute.name;
    }
  }

  return (
    <InstituteDashboardUI instituteName={instituteName} />
  );
}
