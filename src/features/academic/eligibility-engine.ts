import { createClient } from '@/lib/supabase/server';

export interface EligibleCourse {
  id: string;
  name: string;
}

export interface EligibilityResult {
  canApply: boolean;
  eligibleCourses: EligibleCourse[];
  isSupply: boolean;
  supplySubjectIds?: string[];
  message: string;
}

export async function calculateStudentEligibility(studentId: string): Promise<EligibilityResult> {
  const supabase = await createClient();

  // 1. Fetch student's past exam applications and results, plus their DOB
  const { data: studentData } = await supabase
    .from('students')
    .select(`
      dob,
      exam_applications (
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
      )
    `)
    .eq('id', studentId)
    .single();

  const pastApplications = studentData?.exam_applications?.sort((a: any, b: any) => b.id - a.id) || [];
  
  // Calculate Age
  let age = 0;
  if (studentData?.dob) {
    const diff = Date.now() - new Date(studentData.dob).getTime();
    age = Math.abs(new Date(diff).getUTCFullYear() - 1970);
  }

  // 2. Fetch all active sessions and their courses WITH course names and min_age
  const { data: activeSessions } = await supabase
    .from('sessions')
    .select(`
      id,
      status,
      session_courses (
        courses (
          id,
          name,
          min_age
        )
      )
    `)
    .eq('status', 'active');

  const allActiveCourses = activeSessions?.flatMap(s => 
    s.session_courses.map((sc: any) => sc.courses)
  ) || [];

  // Filter courses by minimum age requirement
  const ageEligibleCourses = allActiveCourses.filter(c => !c.min_age || age >= c.min_age);

  // If no past applications, they are a fresh student.
  if (pastApplications.length === 0) {
    return {
      canApply: true,
      eligibleCourses: ageEligibleCourses.map(c => ({ id: c.id.toString(), name: c.name })),
      isSupply: false,
      message: 'New student. Eligible for fresh admission based on your age.'
    };
  }

  // Find the latest completed exam
  const latestApp = pastApplications[0];
  const latestResult = latestApp.results?.[0];

  // If latest exam is not yet resulted, they can't apply for anything yet
  if (!latestResult) {
    return {
      canApply: false,
      eligibleCourses: [],
      isSupply: false,
      message: 'Your previous exam results are pending. You cannot apply for a new course yet.'
    };
  }

  // If they passed, they can apply for the next level. 
  // We include all age-eligible courses for now (since we don't have strict prerequisite mappings yet)
  if (latestResult.status === 'PASS') {
    return {
      canApply: true,
      eligibleCourses: ageEligibleCourses.map(c => ({ id: c.id.toString(), name: c.name })),
      isSupply: false,
      message: 'Congratulations on passing your previous exam! Select your next course.'
    };
  }

  // If they failed or got supply
  const failedSubjects = latestApp.exam_application_subjects
    ?.filter((sub: any) => sub.status === 'FAIL')
    .map((sub: any) => sub.subject_id.toString()) || [];
    
  const supplyCourseName = allActiveCourses.find(c => c.id === latestApp.course_id)?.name || `Course ID ${latestApp.course_id}`;

  return {
    canApply: true,
    eligibleCourses: [{ id: latestApp.course_id.toString(), name: supplyCourseName + ' (Supply)' }],
    isSupply: true,
    supplySubjectIds: failedSubjects,
    message: `You have compartments in ${failedSubjects.length} subjects. You can apply for Supply Exams.`
  };
}
