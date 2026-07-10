'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateStudentProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated.' };
  }

  const fullName = formData.get('fullName') as string;
  const fatherName = formData.get('fatherName') as string;
  const dob = formData.get('dob') as string;
  const gender = formData.get('gender') as string;
  const bFormCnic = formData.get('bFormCnic') as string;
  const address = formData.get('address') as string;
  const contactNumber = formData.get('contactNumber') as string;

  if (!fullName || !fatherName || !dob || !gender || !bFormCnic || !address) {
    return { error: 'Please fill in all required fields.' };
  }

  // 1. Update user_profiles
  const { error: profileError } = await supabase
    .from('user_profiles')
    .update({ 
      full_name: fullName,
      contact_number: contactNumber || null
    })
    .eq('id', user.id);

  if (profileError) {
    return { error: 'Failed to update user profile.' };
  }

  // 2. Upsert student record
  const { error: studentError } = await supabase
    .from('students')
    .upsert({
      id: user.id,
      father_name: fatherName,
      dob,
      gender,
      b_form_cnic: bFormCnic,
      permanent_address: address,
    }, { onConflict: 'id' });

  if (studentError) {
    return { error: 'Failed to save student details. Please ensure B-Form/CNIC is unique.' };
  }

  revalidatePath('/student/profile');
  revalidatePath('/student');
  return { success: 'Profile updated successfully.' };
}
