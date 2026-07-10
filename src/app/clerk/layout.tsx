import { ClerkShell } from '@/components/clerk/clerk-shell';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verify authentication and role
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('roles(name)')
    .eq('id', user.id)
    .single();

  const rolesData = profile?.roles as any;
  const roleName = Array.isArray(rolesData) ? rolesData[0]?.name : rolesData?.name;

  if (roleName !== 'clerk') {
    redirect('/');
  }

  return <ClerkShell>{children}</ClerkShell>;
}
