'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSessionAction(formData: FormData) {
  const name = formData.get('name') as string;
  const year = parseInt(formData.get('year') as string);
  const type = formData.get('type') as string; // 'regular' or 'supply'
  const enrollmentStartDate = formData.get('enrollmentStartDate') as string;
  const normalFeeDeadline = formData.get('normalFeeDeadline') as string;
  const lateFeeDeadline = formData.get('lateFeeDeadline') as string;
  const doubleFeeDeadline = formData.get('doubleFeeDeadline') as string;

  if (!name || !year || !type || !enrollmentStartDate || !normalFeeDeadline || !lateFeeDeadline || !doubleFeeDeadline) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('sessions').insert({
    name,
    year,
    type,
    enrollment_start_date: enrollmentStartDate,
    normal_fee_deadline: normalFeeDeadline,
    late_fee_deadline: lateFeeDeadline,
    double_fee_deadline: doubleFeeDeadline,
    is_active: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/backstage/sessions');
  return { success: true };
}

export async function createDegreeAction(formData: FormData) {
  const name = formData.get('name') as string;
  const level = formData.get('level') as string;
  const normalFee = parseInt(formData.get('normalFee') as string);
  const lateFee = parseInt(formData.get('lateFee') as string);
  const doubleFee = parseInt(formData.get('doubleFee') as string);

  if (!name || !level || isNaN(normalFee) || isNaN(lateFee) || isNaN(doubleFee)) {
    return { error: 'All fields are required and fees must be valid numbers' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('degrees').insert({
    name,
    level,
    normal_fee: normalFee,
    late_fee: lateFee,
    double_fee: doubleFee,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/backstage/degrees');
  return { success: true };
}
