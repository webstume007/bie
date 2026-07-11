import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { MarksEntryRow } from './marks-entry-row';

export const revalidate = 0;

export default async function TeacherMarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role_id, roles(name)')
    .eq('id', user.id)
    .single();

  const roleName = (profile?.roles as any)?.name;
  if (roleName !== 'teacher' && roleName !== 'super_admin') {
    redirect('/dashboard');
  }

  const { data: staffData } = await supabase
    .from('institute_staff')
    .select('institute_id')
    .eq('user_id', user.id)
    .single();

  let enrollments: any[] = [];
  if (staffData?.institute_id) {
    const { data } = await supabase
      .from('exam_applications')
      .select(`
        id,
        tracking_id,
        assigned_roll_no,
        courses ( name ),
        institute_students ( full_name ),
        exam_application_subjects (
          id,
          subject_id,
          marks_obtained,
          status,
          subjects ( name, total_marks )
        )
      `)
      .eq('institute_id', staffData.institute_id)
      .eq('status', 'APPROVED')
      .limit(50);
    
    if (data) enrollments = data;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Marks Entry</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Enter marks for your assigned students.</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Marks</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <GraduationCap className="size-10 opacity-20 mx-auto mb-2" />
                    No students pending marks entry.
                  </td>
                </tr>
              ) : (
                enrollments.map((app: any) => (
                  <MarksEntryRow key={app.id} application={app} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
