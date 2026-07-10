'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { determineFeeTier, calculateFeeAmount, generatePSID } from '@/lib/finance';

export async function addRosterStudentAction(state: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Get institute ID
  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) return { error: 'Institute profile not found' };

  const fullName = formData.get('fullName') as string;
  const fatherName = formData.get('fatherName') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  // File upload logic would go here, simulating for now

  if (!fullName || !fatherName || !dateOfBirth) {
    return { error: 'Please fill in all required fields' };
  }

  const { error } = await supabase.from('institute_students').insert({
    institute_id: institute.id,
    full_name: fullName,
    father_name: fatherName,
    date_of_birth: dateOfBirth,
  });

  if (error) return { error: error.message };

  revalidatePath('/institute/students');
  return { success: true };
}

export async function bulkEnrollAction(state: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) return { error: 'Institute profile not found' };

  const sessionId = formData.get('sessionId') as string;
  const degreeId = formData.get('degreeId') as string;
  // We expect studentIds as a comma-separated string or multiple entries
  const studentIdsStr = formData.get('studentIds') as string;

  if (!sessionId || !degreeId || !studentIdsStr) {
    return { error: 'Please select a session, degree, and at least one student.' };
  }

  const studentIds = studentIdsStr.split(',');

  // Check existing enrollments to prevent duplicates
  const { data: existing } = await supabase
    .from('exam_applications')
    .select('institute_student_id')
    .eq('session_id', sessionId)
    .eq('degree_id', degreeId)
    .in('institute_student_id', studentIds);

  const existingIds = new Set(existing?.map(e => e.institute_student_id) || []);
  const newStudentIds = studentIds.filter(id => !existingIds.has(id));

  if (newStudentIds.length === 0) {
    return { error: 'All selected students are already enrolled in this session and degree.' };
  }

  const timestamp = Date.now().toString().slice(-6);
  
  const applications = newStudentIds.map((studentId, index) => ({
    student_id: user.id, // Using institute user ID as the owner
    institute_student_id: studentId,
    session_id: sessionId,
    degree_id: degreeId,
    institute_id: institute.id,
    is_private: false,
    status: 'SUBMITTED',
    tracking_id: `BIE-REG-${timestamp}-${index + 1}`
  }));

  const { error } = await supabase.from('exam_applications').insert(applications);

  if (error) return { error: error.message };

  revalidatePath('/institute/enrollments');
  return { success: true };
}

export async function generateBulkChallanAction(applicationIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Fetch applications
  const { data: apps, error: appsError } = await supabase
    .from('exam_applications')
    .select(`
      id,
      sessions ( normal_fee_date, late_fee_date, double_fee_date ),
      degrees ( base_fee, late_fee, double_fee )
    `)
    .in('id', applicationIds);

  if (appsError || !apps || apps.length === 0) return { error: 'Applications not found' };

  let totalAmount = 0;

  for (const app of apps) {
    const session = app.sessions as any;
    const degree = app.degrees as any;

    const deadlines = {
      normalFeeDeadline: session.normal_fee_date,
      lateFeeDeadline: session.late_fee_date,
      doubleFeeDeadline: session.double_fee_date,
    };

    const tier = determineFeeTier(deadlines);
    if (tier === 'CLOSED') {
      return { error: 'One or more applications have passed the final deadline.' };
    }

    const amount = calculateFeeAmount(tier, degree.base_fee, degree.late_fee, degree.double_fee);
    totalAmount += amount;
  }

  const psid = generatePSID();

  // Create Challan
  const { data: challan, error: challanError } = await supabase
    .from('challans')
    .insert({
      student_id: user.id, // Institute user
      amount: totalAmount,
      psid,
      status: 'UNPAID',
    })
    .select()
    .single();

  if (challanError) return { error: challanError.message };

  // Link to all applications
  const challanLinks = apps.map(app => ({
    challan_id: challan.id,
    enrollment_id: app.id,
  }));

  const { error: linkError } = await supabase.from('challan_enrollments').insert(challanLinks);
  if (linkError) return { error: linkError.message };

  // Update applications status
  await supabase
    .from('exam_applications')
    .update({ status: 'CHALLAN_GENERATED' })
    .in('id', applicationIds);

  revalidatePath('/institute/actions');
  return { success: true };
}
