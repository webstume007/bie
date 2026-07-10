'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInstituteAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const cnic = formData.get('cnic') as string;
  const headName = formData.get('headName') as string;
  const instituteName = formData.get('instituteName') as string;
  const affiliationNo = formData.get('affiliationNo') as string;
  const address = formData.get('address') as string;

  if (!email || !password || !cnic || !headName || !instituteName || !address) {
    return { error: 'Please fill in all required fields.' };
  }

  const supabaseAdmin = createAdminClient();

  // 1. Create the user using the admin API
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'institute',
      cnic,
      full_name: headName,
    },
  });

  if (authError || !authData.user) {
    return { error: authError?.message || 'Failed to create user account.' };
  }

  const userId = authData.user.id;

  // 2. The trigger `handle_new_user` will have created the user_profile.
  // Wait a brief moment to ensure trigger completes, or just go ahead to insert institute.
  // Usually it is synchronous in Postgres, so we can proceed immediately.
  
  const { error: instError } = await supabaseAdmin
    .from('institutes')
    .insert({
      name: instituteName,
      affiliation_no: affiliationNo || null,
      address,
      head_user_id: userId,
    });

  if (instError) {
    // Note: If institute creation fails, we ideally should rollback the user creation.
    // Since we don't have a direct transaction across auth and public schema easily here, 
    // we delete the user as a manual rollback.
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return { error: 'Failed to create institute record. User account creation was rolled back.' };
  }

  revalidatePath('/backstage/institutes');
  redirect('/backstage/institutes');
}
