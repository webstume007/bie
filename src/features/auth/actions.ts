'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const cnic = formData.get('cnic') as string;
  const password = formData.get('password') as string;

  if (!cnic || !password) {
    return { error: 'CNIC and password are required' };
  }

  const supabase = await createClient();

  // 1. Get email associated with the CNIC via the RPC function
  const { data: email, error: rpcError } = await supabase.rpc('get_email_by_cnic', { p_cnic: cnic });

  if (rpcError || !email) {
    return { error: 'Invalid CNIC or user does not exist' };
  }

  // 2. Sign in using the resolved email
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email as string,
    password,
  });

  if (signInError) {
    return { error: signInError.message };
  }

  // 3. Find the user's role to redirect them
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('roles(name)')
      .eq('id', user.id)
      .single();

    const rolesData = profile?.roles as any;
    const roleName = Array.isArray(rolesData) ? rolesData[0]?.name : rolesData?.name;

    if (roleName === 'super_admin') return redirect('/backstage');
    if (roleName === 'clerk') return redirect('/clerk');
    if (roleName === 'institute') return redirect('/institute');
    if (roleName === 'student') return redirect('/student');
  }

  redirect('/');
}

export async function signupAction(formData: FormData) {
  const cnic = formData.get('cnic') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string; // 'student' or 'institute'

  if (!cnic || !email || !password || !role) {
    return { error: 'All fields are required' };
  }

  if (role !== 'student') {
    return { error: 'Invalid role selection' };
  }

  const supabase = await createClient();

  // Sign up the user. The database trigger will automatically insert into user_profiles
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        cnic,
        role,
        // Optional: full_name can be passed here if collected
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to student dashboard after successful signup
  redirect('/student');
}

export async function resetPasswordAction(formData: FormData) {
  const cnic = formData.get('cnic') as string;

  if (!cnic) {
    return { error: 'CNIC is required' };
  }

  const supabase = await createClient();

  // 1. Verify if the CNIC belongs to an allowed role (NOT a clerk or super_admin)
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, roles(name)')
    .eq('cnic', cnic)
    .single();

  if (profileError || !profile) {
    return { error: 'No account found with this CNIC' };
  }

  const rolesData = profile?.roles as any;
  const roleName = Array.isArray(rolesData) ? rolesData[0]?.name : rolesData?.name;
  
  if (roleName === 'clerk' || roleName === 'super_admin') {
    return { error: 'Password reset is not permitted for staff accounts. Contact Super Admin.' };
  }

  // 2. Get email associated with the CNIC via the RPC function
  const { data: email, error: rpcError } = await supabase.rpc('get_email_by_cnic', { p_cnic: cnic });

  if (rpcError || !email) {
    return { error: 'Unable to process reset request.' };
  }

  // 3. Send password reset email
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email as string, {
    // You would typically redirect to a specific reset page here
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password/update`,
  });

  if (resetError) {
    return { error: resetError.message };
  }

  // Mask the email for the success message (e.g., test@gmail.com -> t***@gmail.com)
  const [localPart, domain] = (email as string).split('@');
  const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 1);
  const maskedEmail = `${maskedLocal}@${domain}`;

  return { success: `Password reset link sent to ${maskedEmail}` };
}
