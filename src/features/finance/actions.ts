'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { determineFeeTier, calculateFeeAmount, generatePSID } from '@/lib/finance';

export async function generateChallanAction(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // 1. Fetch Application with Session and Degree details
  const { data: app, error: appError } = await supabase
    .from('exam_applications')
    .select(`
      *,
      sessions ( normal_fee_date, late_fee_date, double_fee_date ),
      degrees ( base_fee, late_fee, double_fee )
    `)
    .eq('id', applicationId)
    .single();

  if (appError || !app) return { error: 'Application not found' };

  // 2. Check if Challan already exists (assuming 1-to-1 via challan_enrollments)
  // For simplicity here, we'll assume a direct relation or check if a challan already exists
  const { data: existing } = await supabase
    .from('challan_enrollments')
    .select('challans(*)')
    .eq('enrollment_id', applicationId)
    .single();

  if (existing) {
    return { error: 'Challan already generated for this application.' };
  }

  // Handle the different column names from what might be in DB vs our mock types
  // Note: in Sessions table earlier we used enrollmentStartDate, normalFeeDeadline etc. Let's map safely.
  const deadlines = {
    normalFeeDeadline: app.sessions.normalFeeDeadline || app.sessions.normal_fee_date,
    lateFeeDeadline: app.sessions.lateFeeDeadline || app.sessions.late_fee_date,
    doubleFeeDeadline: app.sessions.doubleFeeDeadline || app.sessions.double_fee_date,
  };

  const tier = determineFeeTier(deadlines);
  if (tier === 'CLOSED') {
    return { error: 'The deadline for generating a challan has passed.' };
  }

  // Note: in Degrees table we used normalFee, lateFee, doubleFee.
  const normalFee = app.degrees.normalFee || app.degrees.base_fee;
  const lateFee = app.degrees.lateFee || app.degrees.late_fee;
  const doubleFee = app.degrees.doubleFee || app.degrees.double_fee;

  const amount = calculateFeeAmount(tier, normalFee, lateFee, doubleFee);
  const psid = generatePSID();

  // 3. Create Challan
  const { data: challan, error: challanError } = await supabase
    .from('challans')
    .insert({
      student_id: user.id,
      amount,
      psid,
      status: 'UNPAID',
    })
    .select()
    .single();

  if (challanError) return { error: challanError.message };

  // 4. Link Challan to Application
  const { error: linkError } = await supabase
    .from('challan_enrollments')
    .insert({
      challan_id: challan.id,
      enrollment_id: applicationId,
    });

  if (linkError) return { error: linkError.message };

  // Update app status to CHALLAN_GENERATED
  await supabase.from('exam_applications').update({ status: 'CHALLAN_GENERATED' }).eq('id', applicationId);

  revalidatePath(`/student/enrollments/${applicationId}`);
  return { success: true };
}

export async function uploadReceiptAction(state: any, formData: FormData) {
  const challanId = formData.get('challanId') as string;
  const applicationId = formData.get('applicationId') as string;
  const file = formData.get('receipt') as File;

  if (!file || file.size === 0) return { error: 'Please select a file' };
  if (file.size > 500 * 1024) return { error: 'File size must be less than 500KB' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Upload to Supabase Storage
  const ext = file.name.split('.').pop();
  const filename = `${user.id}/${challanId}_${Date.now()}.${ext}`;
  
  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filename, file);

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(filename);

  // Update Challan Status
  const { error: updateError } = await supabase
    .from('challans')
    .update({ 
      receipt_url: publicUrl,
      status: 'VERIFICATION_PENDING'
    })
    .eq('id', challanId);

  if (updateError) return { error: updateError.message };

  revalidatePath(`/student/enrollments/${applicationId}`);
  return { success: true };
}

export async function verifyPaymentAction(challanId: string, applicationId: string) {
  const supabase = await createClient();
  
  // 1. Update Challan
  const { error } = await supabase
    .from('challans')
    .update({ status: 'PAID' })
    .eq('id', challanId);

  if (error) return { error: error.message };

  // 2. Update Application Status
  await supabase
    .from('exam_applications')
    .update({ status: 'FEE_VERIFIED' })
    .eq('id', applicationId);

  revalidatePath('/clerk/finance');
  return { success: true };
}
