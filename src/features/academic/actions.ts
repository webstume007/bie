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

export async function createFullSessionAction(payload: {
  adYear: number;
  ahYear: string;
  type: string;
  admissionOpenDate: string;
  singleFeeDate: string;
  doubleFeeDate: string;
  tripleFeeDate: string;
  courses: {
    courseName: string;
    singleFee: number;
    doubleFee: number;
    tripleFee: number;
    mandatoryCount: number;
    subjects: {
      subjectName: string;
      totalMarks: number;
      isCompulsory: boolean;
    }[];
  }[];
}) {
  const supabase = await createClient();

  // 1. Insert Session
  const { data: sessionData, error: sessionError } = await supabase.from('sessions').insert({
    ad_year: payload.adYear,
    ah_year: payload.ahYear,
    type: payload.type,
    admission_open_date: payload.admissionOpenDate,
    single_fee_date: payload.singleFeeDate,
    double_fee_date: payload.doubleFeeDate,
    triple_fee_date: payload.tripleFeeDate,
    is_active: true,
  }).select('id').single();

  if (sessionError) {
    return { error: 'Failed to create session: ' + sessionError.message };
  }

  const sessionId = sessionData.id;

  // 2. Loop through courses
  for (const course of payload.courses) {
    // 2a. Lookup or insert course
    let courseId: number;
    const { data: existingCourse } = await supabase.from('courses').select('id').ilike('name', course.courseName).maybeSingle();
    
    if (existingCourse) {
      courseId = existingCourse.id;
    } else {
      const { data: newCourse, error: createCourseErr } = await supabase.from('courses').insert({
        name: course.courseName,
        base_fee: 0,
      }).select('id').single();
      if (createCourseErr) return { error: 'Failed to create course: ' + createCourseErr.message };
      courseId = newCourse.id;
    }

    // 2b. Insert session course
    const { data: sessionCourseData, error: courseError } = await supabase.from('session_courses').insert({
      session_id: sessionId,
      course_id: courseId,
      single_fee: course.singleFee,
      double_fee: course.doubleFee,
      triple_fee: course.tripleFee,
      mandatory_electives_count: course.mandatoryCount,
    }).select('id').single();

    if (courseError) {
      return { error: 'Failed to link course: ' + courseError.message };
    }

    const sessionCourseId = sessionCourseData.id;

    // 3. Loop through subjects for this course
    if (course.subjects && course.subjects.length > 0) {
      for (const sub of course.subjects) {
        // 3a. Lookup or insert subject
        let subjectId: number;
        const { data: existingSub } = await supabase.from('subjects').select('id').ilike('name', sub.subjectName).maybeSingle();

        if (existingSub) {
          subjectId = existingSub.id;
        } else {
          const { data: newSub, error: createSubErr } = await supabase.from('subjects').insert({
            name: sub.subjectName,
          }).select('id').single();
          if (createSubErr) return { error: 'Failed to create subject: ' + createSubErr.message };
          subjectId = newSub.id;
        }

        // 3b. Insert session course subject
        const { error: subjectError } = await supabase.from('session_course_subjects').insert({
          session_course_id: sessionCourseId,
          subject_id: subjectId,
          total_marks: sub.totalMarks,
          is_compulsory: sub.isCompulsory,
        });

        if (subjectError) {
          return { error: 'Failed to add subject: ' + subjectError.message };
        }
      }
    }
  }

  revalidatePath('/backstage/sessions');
  return { success: true };
}

export async function deleteSessionAction(sessionId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/backstage/sessions');
  return { success: true };
}

export async function createCourseAction(state: any, formData: FormData) {
  const name = formData.get('name') as string;
  const level = formData.get('level') as string;
  const normalFee = parseInt(formData.get('normalFee') as string);
  const lateFee = parseInt(formData.get('lateFee') as string);
  const doubleFee = parseInt(formData.get('doubleFee') as string);

  if (!name || !level || isNaN(normalFee) || isNaN(lateFee) || isNaN(doubleFee)) {
    return { error: 'All fields are required and fees must be valid numbers' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('courses').insert({
    name,
    level,
    normal_fee: normalFee,
    late_fee: lateFee,
    double_fee: doubleFee,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/backstage/courses');
  return { success: true };
}

export async function addCourseToSessionAction(state: any, formData: FormData) {
  const sessionId = formData.get('sessionId') as string;
  const courseId = parseInt(formData.get('courseId') as string);
  const baseFee = parseFloat(formData.get('baseFee') as string);
  const singleFeeDeadline = formData.get('singleFeeDeadline') as string;
  const doubleFeeDeadline = formData.get('doubleFeeDeadline') as string;
  const tripleFeeDeadline = formData.get('tripleFeeDeadline') as string;

  if (!sessionId || isNaN(courseId) || isNaN(baseFee) || !singleFeeDeadline || !doubleFeeDeadline || !tripleFeeDeadline) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('session_courses').insert({
    session_id: sessionId,
    course_id: courseId,
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
  const sessionCourseId = formData.get('sessionCourseId') as string;
  const sessionId = formData.get('sessionId') as string;
  const subjectId = parseInt(formData.get('subjectId') as string);
  const totalMarks = parseInt(formData.get('totalMarks') as string);
  const isCompulsory = formData.get('isCompulsory') === 'true';

  if (!sessionCourseId || !sessionId || isNaN(subjectId) || isNaN(totalMarks)) {
    return { error: 'All fields are required' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('session_course_subjects').insert({
    session_course_id: sessionCourseId,
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

  revalidatePath(`/backstage/sessions/${sessionId}/course/${sessionCourseId}`);
  redirect(`/backstage/sessions/${sessionId}/course/${sessionCourseId}`);
}
