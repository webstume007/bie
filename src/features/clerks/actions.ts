'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function createClerkAction(state: any, formData: FormData) {
  const cnic = formData.get('cnic') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  if (!cnic || !email || !password) {
    return { error: 'CNIC, Email, and Password are required' };
  }

  // We need the service role key to use the admin API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: 'Server configuration error: Missing Service Role Key for Admin operations.' };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // 1. Create the user using Admin API (does not affect current session)
  const { data: userAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      cnic,
      role: 'clerk',
      full_name: fullName,
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  revalidatePath('/backstage/clerks');
  return { success: true };
}
