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

export async function approveAdmissionAction(applicationId: string, examCenterId: string) {
  // Use our server client for regular authenticated requests
  const { createClient: createServerClient } = await import('@/lib/supabase/server');
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Generate a random roll number for now (in production, use sequence or format like YEAR-DEGREE-XXXX)
  const rollNo = `2026-SAN-${Math.floor(10000 + Math.random() * 90000)}`;

  const { error } = await supabase
    .from('exam_applications')
    .update({ 
      status: 'APPROVED',
      exam_center_id: examCenterId,
      assigned_roll_no: rollNo
    })
    .eq('id', applicationId);

  if (error) return { error: error.message };

  revalidatePath('/clerk/admissions');
  return { success: true };
}

export async function updateEnrollmentDataAction(applicationId: string, data: { full_name: string; father_name: string }) {
  const { createClient: createServerClient } = await import('@/lib/supabase/server');
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Fetch application to know if it's private or institute
  const { data: app, error: fetchErr } = await supabase
    .from('exam_applications')
    .select('is_private, student_id, institute_student_id')
    .eq('id', applicationId)
    .single();

  if (fetchErr || !app) return { error: 'Application not found' };

  let updateErr;
  
  if (app.is_private && app.student_id) {
    const { error } = await supabase
      .from('students')
      .update({ full_name: data.full_name, father_name: data.father_name })
      .eq('id', app.student_id);
    updateErr = error;
  } else if (!app.is_private && app.institute_student_id) {
    const { error } = await supabase
      .from('institute_students')
      .update({ full_name: data.full_name, father_name: data.father_name })
      .eq('id', app.institute_student_id);
    updateErr = error;
  }

  if (updateErr) return { error: updateErr.message };

  revalidatePath('/clerk/data-entry');
  return { success: true };
}
