'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSessionAction(state: any, formData: FormData) {
  const adYear = parseInt(formData.get('adYear') as string);
  const ahYear = formData.get('ahYear') as string;
  const type = formData.get('type') as string; // 'regular' or 'supply'
  const admissionOpenDate = formData.get('admissionOpenDate') as string;

  if (isNaN(adYear) || !ahYear || !type || !admissionOpenDate) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from('sessions').insert({
    ad_year: adYear,
    ah_year: ahYear,
    type,
    admission_open_date: admissionOpenDate,
    is_active: true,
  }).select('id').single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/backstage/sessions');
  redirect(`/backstage/sessions/${data.id}`);
}

export async function createDegreeAction(state: any, formData: FormData) {
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

export async function addCourseToSessionAction(state: any, formData: FormData) {
  const sessionId = formData.get('sessionId') as string;
  const degreeId = parseInt(formData.get('degreeId') as string);
  const baseFee = parseFloat(formData.get('baseFee') as string);
  const singleFeeDeadline = formData.get('singleFeeDeadline') as string;
  const doubleFeeDeadline = formData.get('doubleFeeDeadline') as string;
  const tripleFeeDeadline = formData.get('tripleFeeDeadline') as string;

  if (!sessionId || isNaN(degreeId) || isNaN(baseFee) || !singleFeeDeadline || !doubleFeeDeadline || !tripleFeeDeadline) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('session_degrees').insert({
    session_id: sessionId,
    degree_id: degreeId,
    base_fee: baseFee,
    single_fee_deadline: singleFeeDeadline,
    double_fee_deadline: doubleFeeDeadline,
    triple_fee_deadline: tripleFeeDeadline,
  });

  if (error) {
    // Check for unique constraint violation
    if (error.code === '23505') {
      return { error: 'This course is already added to this session.' };
    }
    return { error: error.message };
  }

  revalidatePath(`/backstage/sessions/${sessionId}`);
  redirect(`/backstage/sessions/${sessionId}`);
}

export async function addSubjectToSessionCourseAction(state: any, formData: FormData) {
  const sessionDegreeId = formData.get('sessionDegreeId') as string;
  const sessionId = formData.get('sessionId') as string;
  const subjectId = parseInt(formData.get('subjectId') as string);
  const totalMarks = parseInt(formData.get('totalMarks') as string);
  const isCompulsory = formData.get('isCompulsory') === 'true';

  if (!sessionDegreeId || !sessionId || isNaN(subjectId) || isNaN(totalMarks)) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('session_degree_subjects').insert({
    session_degree_id: sessionDegreeId,
    subject_id: subjectId,
    total_marks: totalMarks,
    is_compulsory: isCompulsory,
  });

  if (error) {
    if (error.code === '23505') {
      return { error: 'This subject is already added to this course.' };
    }
    return { error: error.message };
  }

  revalidatePath(`/backstage/sessions/${sessionId}/course/${sessionDegreeId}`);
  redirect(`/backstage/sessions/${sessionId}/course/${sessionDegreeId}`);
}
