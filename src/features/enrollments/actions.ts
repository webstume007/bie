'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitEnrollmentAction(formData: FormData) {
  const sessionId = formData.get('sessionId') as string;
  const degreeId = formData.get('degreeId') as string;
  const isPrivate = formData.get('isPrivate') === 'true'; // Regular student will be submitted by Institute in next phase

  if (!sessionId || !degreeId) {
    return { error: 'Please select a session and degree.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // 1. Verify student profile completion
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, father_name, date_of_birth, profile_picture_url')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.full_name || !profile.father_name || !profile.date_of_birth || !profile.profile_picture_url) {
    return { error: 'Profile incomplete. Please complete your profile with picture and details before applying.' };
  }

  // 2. Generate Tracking ID (e.g. BIE-YY-XXXXX)
  const year = new Date().getFullYear().toString().slice(-2);
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  const trackingId = `BIE-${year}-${randomStr}`;

  // 3. Insert Application
  const { error: insertError } = await supabase.from('exam_applications').insert({
    student_id: user.id,
    session_id: sessionId,
    degree_id: degreeId,
    is_private: isPrivate,
    tracking_id: trackingId,
    status: 'SUBMITTED', // Or DRAFT if we implement save-and-resume
    draft_data: {},
  });

  if (insertError) {
    if (insertError.code === '23505') { // Unique violation
      return { error: 'You have already applied for this session and degree.' };
    }
    return { error: insertError.message };
  }

  revalidatePath('/student/enrollments');
  return { success: true, trackingId };
}
