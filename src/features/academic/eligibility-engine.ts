import { createClient } from '@/lib/supabase/server';

export interface EligibilityResult {
  canApply: boolean;
  eligibleCourseIds: string[];
  isSupply: boolean;
  supplySubjectIds?: string[];
  message: string;
}

export async function calculateStudentEligibility(studentId: string): Promise<EligibilityResult> {
  const supabase = await createClient();

  // 1. Fetch student's past exam applications and results
  const { data: pastApplications } = await supabase
    .from('exam_applications')
    .select(`
      id,
      course_id,
      status,
      results (
        status,
        percentage
      ),
      exam_application_subjects (
        subject_id,
        status,
        marks_obtained
      )
    `)
    .eq('student_id', studentId)
    .order('id', { ascending: false });

  // 2. Fetch all active sessions and their courses
  const { data: activeSessions } = await supabase
    .from('sessions')
    .select(`
      id,
      status,
      session_courses (
        course_id
      )
    `)
    .eq('status', 'active');

  const availableCourseIds = activeSessions?.flatMap(s => 
    s.session_courses.map((sc: any) => sc.course_id.toString())
  ) || [];

  // If no past applications, they are a fresh student. They can apply to any active course (usually Part-I).
  if (!pastApplications || pastApplications.length === 0) {
    return {
      canApply: true,
      eligibleCourseIds: availableCourseIds,
      isSupply: false,
      message: 'New student. Eligible for fresh admission in any active course.'
    };
  }

  // Find the latest completed exam
  const latestApp = pastApplications[0];
  const latestResult = latestApp.results?.[0];

  // If latest exam is not yet resulted, they can't apply for anything yet (or maybe they can if it's dual enrollment, but generally no)
  if (!latestResult) {
    return {
      canApply: false,
      eligibleCourseIds: [],
      isSupply: false,
      message: 'Your previous exam results are pending. You cannot apply for a new course yet.'
    };
  }

  // If they passed, they can apply for the next level (Part-II etc). 
  // For simplicity, we just allow them to select active courses again, but ideally this would map Part-I -> Part-II.
  if (latestResult.status === 'PASS') {
    return {
      canApply: true,
      eligibleCourseIds: availableCourseIds,
      isSupply: false,
      message: 'Congratulations on passing! You are eligible to apply for the next course.'
    };
  }

  // If they failed or got supply, identify the failed subjects
  const failedSubjects = latestApp.exam_application_subjects
    ?.filter((sub: any) => sub.status === 'FAIL')
    .map((sub: any) => sub.subject_id.toString()) || [];

  return {
    canApply: true,
    eligibleCourseIds: [latestApp.course_id.toString()], // Supply is usually for the same course
    isSupply: true,
    supplySubjectIds: failedSubjects,
    message: `You have compartments in ${failedSubjects.length} subjects. You can apply for Supply Exams.`
  };
}
