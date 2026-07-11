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
    status: 'upcoming',
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
  admissionCloseDate: string;
  singleFeeDate: string;
  doubleFeeDate: string;
  tripleFeeDate: string;
  affiliationFee: number;
  affiliationRenewFee: number;
  courses: {
    courseName: string;
    singleFee: number;
    doubleFee: number;
    tripleFee: number;
    haveSingleFeeTillClose: boolean;
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
    admission_close_date: payload.admissionCloseDate,
    single_fee_date: payload.singleFeeDate,
    double_fee_date: payload.doubleFeeDate,
    triple_fee_date: payload.tripleFeeDate,
    status: 'upcoming',
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
      have_single_fee_till_close: course.haveSingleFeeTillClose,
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
  const prerequisiteCourseIdStr = formData.get('prerequisiteCourseId') as string;
  const prerequisiteCourseId = prerequisiteCourseIdStr ? parseInt(prerequisiteCourseIdStr) : null;

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
    prerequisite_course_id: prerequisiteCourseId,
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

export async function fetchFullSessionAction(sessionId: string) {
  const supabase = await createClient();
  
  const { data: session, error: sessionErr } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
    
  if (sessionErr || !session) return { error: 'Session not found' };

  const { data: sessionCourses, error: coursesErr } = await supabase
    .from('session_courses')
    .select(`
      id,
      single_fee,
      double_fee,
      triple_fee,
      have_single_fee_till_close,
      mandatory_electives_count,
      courses ( id, name )
    `)
    .eq('session_id', sessionId);

  const formattedCourses = [];
  if (sessionCourses) {
    for (const sc of sessionCourses) {
      const { data: subjects } = await supabase
        .from('session_course_subjects')
        .select(`
          id,
          total_marks,
          is_compulsory,
          subjects ( id, name )
        `)
        .eq('session_course_id', sc.id);

      formattedCourses.push({
        id: sc.id,
        courseId: (sc.courses as any)?.id,
        courseName: (sc.courses as any)?.name,
        singleFee: sc.single_fee,
        doubleFee: sc.double_fee,
        tripleFee: sc.triple_fee,
        haveSingleFeeTillClose: sc.have_single_fee_till_close,
        mandatoryCount: sc.mandatory_electives_count,
        subjects: subjects?.map(sub => ({
          id: sub.id,
          subjectId: (sub.subjects as any)?.id,
          subjectName: (sub.subjects as any)?.name,
          totalMarks: sub.total_marks,
          isCompulsory: sub.is_compulsory
        })) || []
      });
    }
  }

  return { 
    success: true, 
    data: {
      ...session,
      affiliationFee: session.affiliation_fee,
      affiliationRenewFee: session.affiliation_renew_fee,
      courses: formattedCourses
    }
  };
}

export async function updateFullSessionAction(payload: {
  id: string;
  adYear: number;
  ahYear: string;
  type: string;
  admissionOpenDate: string;
  admissionCloseDate: string;
  singleFeeDate: string;
  doubleFeeDate: string;
  tripleFeeDate: string;
  affiliationFee: number;
  affiliationRenewFee: number;
  courses: {
    id?: number;
    courseName: string;
    singleFee: number;
    doubleFee: number;
    tripleFee: number;
    haveSingleFeeTillClose: boolean;
    mandatoryCount: number;
    subjects: {
      id?: number;
      subjectName: string;
      totalMarks: number;
      isCompulsory: boolean;
    }[];
  }[];
}) {
  const supabase = await createClient();

  // 1. Update Session
  const { error: sessionError } = await supabase.from('sessions').update({
    ad_year: payload.adYear,
    ah_year: payload.ahYear,
    type: payload.type,
    admission_open_date: payload.admissionOpenDate,
    admission_close_date: payload.admissionCloseDate,
    single_fee_date: payload.singleFeeDate,
    double_fee_date: payload.doubleFeeDate,
    triple_fee_date: payload.tripleFeeDate,
    affiliation_fee: payload.affiliationFee,
    affiliation_renew_fee: payload.affiliationRenewFee,
  }).eq('id', payload.id);

  if (sessionError) return { error: 'Failed to update session: ' + sessionError.message };

  // 2. Cleanup removed courses
  const currentCourseIds = payload.courses.filter(c => c.id).map(c => c.id);
  if (currentCourseIds.length > 0) {
    await supabase.from('session_courses').delete().eq('session_id', payload.id).not('id', 'in', `(${currentCourseIds.join(',')})`);
  } else {
    await supabase.from('session_courses').delete().eq('session_id', payload.id);
  }

  for (const course of payload.courses) {
    let courseId: number;
    const { data: existingCourse } = await supabase.from('courses').select('id').ilike('name', course.courseName).maybeSingle();
    
    if (existingCourse) {
      courseId = existingCourse.id;
    } else {
      const { data: newCourse, error: createCourseErr } = await supabase.from('courses').insert({ name: course.courseName, base_fee: 0 }).select('id').single();
      if (createCourseErr) continue;
      courseId = newCourse.id;
    }

    let sessionCourseId: number;
    if (course.id) {
      // Update existing
      await supabase.from('session_courses').update({
        course_id: courseId, // Ensure linked course is updated if name changed
        single_fee: course.singleFee,
        double_fee: course.doubleFee,
        triple_fee: course.tripleFee,
        have_single_fee_till_close: course.haveSingleFeeTillClose,
        mandatory_electives_count: course.mandatoryCount,
      }).eq('id', course.id);
      sessionCourseId = course.id;

      // Cleanup removed subjects for existing course
      const currentSubIds = course.subjects?.filter(s => s.id).map(s => s.id) || [];
      if (currentSubIds.length > 0) {
        await supabase.from('session_course_subjects').delete().eq('session_course_id', sessionCourseId).not('id', 'in', `(${currentSubIds.join(',')})`);
      } else {
        await supabase.from('session_course_subjects').delete().eq('session_course_id', sessionCourseId);
      }

    } else {
      // Insert new
      const { data: newSc } = await supabase.from('session_courses').insert({
        session_id: payload.id,
        course_id: courseId,
        single_fee: course.singleFee,
        double_fee: course.doubleFee,
        triple_fee: course.tripleFee,
        have_single_fee_till_close: course.haveSingleFeeTillClose,
        mandatory_electives_count: course.mandatoryCount,
      }).select('id').single();
      if (!newSc) continue;
      sessionCourseId = newSc.id;
    }

    if (course.subjects && course.subjects.length > 0) {
      for (const sub of course.subjects) {
        let subjectId: number;
        const { data: existingSub } = await supabase.from('subjects').select('id').ilike('name', sub.subjectName).maybeSingle();
        if (existingSub) {
          subjectId = existingSub.id;
        } else {
          const { data: newSub } = await supabase.from('subjects').insert({ name: sub.subjectName }).select('id').single();
          if (!newSub) continue;
          subjectId = newSub.id;
        }

        if (sub.id) {
          await supabase.from('session_course_subjects').update({
            subject_id: subjectId, // Ensure linked subject is updated if name changed
            total_marks: sub.totalMarks,
            is_compulsory: sub.isCompulsory,
          }).eq('id', sub.id);
        } else {
          await supabase.from('session_course_subjects').insert({
            session_course_id: sessionCourseId,
            subject_id: subjectId,
            total_marks: sub.totalMarks,
            is_compulsory: sub.isCompulsory,
          });
        }
      }
    }
  }

  revalidatePath('/backstage/sessions');
  return { success: true };
}


export async function saveMarksAction(payload: {
  applicationId: number;
  marks: { subjectId: number; marksObtained: number }[];
}) {
  const supabase = await createClient();

  for (const mark of payload.marks) {
    const { error } = await supabase
      .from('exam_application_subjects')
      .update({ marks_obtained: mark.marksObtained, status: 'GRADED' })
      .match({ application_id: payload.applicationId, subject_id: mark.subjectId });
    
    if (error) {
      console.error('Failed to save marks:', error);
      return { success: false, error: 'Failed to save marks' };
    }
  }

  revalidatePath('/teacher/marks');
  return { success: true };
}

export async function updateSessionStatusAction(sessionId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('sessions').update({ status }).eq('id', sessionId);
  if (error) return { error: error.message };
  revalidatePath('/backstage/sessions');
  return { success: true };
}

export async function lockSessionAction(sessionId: string, email: string, password: string) {
  const supabase = await createClient();
  
  // Verify credentials
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: 'Invalid admin credentials' };
  }

  const { error } = await supabase.from('sessions').update({ is_locked: true }).eq('id', sessionId);
  if (error) return { error: error.message };
  
  revalidatePath('/backstage/sessions');
  return { success: true };
}

export async function fetchStudentByCnicAction(cnic: string) {
  const supabase = await createClient();
  const { data: userProfile, error: profileError } = await supabase.from('user_profiles').select('*').eq('cnic', cnic).single();
  if (profileError || !userProfile) return { found: false };
  const { data: studentRecord } = await supabase.from('students').select('*').eq('id', userProfile.id).single();
  const { calculateStudentEligibility } = await import('./eligibility-engine');
  const eligibility = await calculateStudentEligibility(userProfile.id);
  return { found: true, userProfile, studentRecord, eligibility };
}


export async function processAdmissionAction(payload: any) {
  const supabase = await createClient();
  try {
    let studentId = payload.studentId;
    if (!studentId) return { error: 'Creating new students without an auth account is not fully implemented yet.' };
    const { error: studentError } = await supabase.from('students').upsert({ id: studentId, father_name: payload.fatherName, name_urdu: payload.nameUrdu, father_name_urdu: payload.fatherNameUrdu, dob: payload.dob, gender: payload.gender, b_form_cnic: payload.cnic, email: payload.email, mobile_number: payload.mobile, whatsapp_number: payload.whatsapp, permanent_address: payload.permanentAddress, current_institute_name: payload.currentInstituteName, institute_address: payload.instituteAddress, near_examination_center: payload.nearExamCenter });
    if (studentError) throw new Error('Failed to update student profile: ' + studentError.message);
    const { data: appData, error: appError } = await supabase.from('exam_applications').insert({ student_id: studentId, session_id: payload.sessionId, course_id: payload.courseId, institute_id: payload.instituteId || null, enrollment_type: payload.isPrivate ? 'PRIVATE' : 'REGULAR', status: 'SUBMITTED', attestation_status: payload.isPrivate ? 'pending' : 'not_required' }).select('id').single();
    if (appError) throw new Error('Failed to create application: ' + appError.message);
    if (payload.subjectIds && payload.subjectIds.length > 0) {
      const subjectInserts = payload.subjectIds.map((subId: string) => ({ enrollment_id: appData.id, subject_id: parseInt(subId) }));
      const { error: subError } = await supabase.from('exam_application_subjects').insert(subjectInserts);
      if (subError) throw new Error('Failed to add subjects: ' + subError.message);
    }
    return { success: true, applicationId: appData.id };
  } catch (error: any) {
    return { error: error.message };
  }
}

