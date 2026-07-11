import { createClient } from '@/lib/supabase/server';
import NewCourseClient from './new-course-client';

export const revalidate = 0;

export default async function NewCoursePage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, level')
    .order('name');

  return <NewCourseClient existingCourses={courses || []} />;
}
