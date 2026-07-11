import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';

export const revalidate = 0;

export default async function TeacherClassesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role_id, roles(name)')
    .eq('id', user.id)
    .single();

  const roleName = (profile?.roles as any)?.name;
  if (roleName !== 'teacher' && roleName !== 'super_admin') {
    redirect('/dashboard');
  }

  // Fetch teacher's institute to get classes/enrollments
  const { data: staffData } = await supabase
    .from('institute_staff')
    .select('institute_id')
    .eq('user_id', user.id)
    .single();

  let enrollments = [];
  if (staffData?.institute_id) {
    const { data } = await supabase
      .from('exam_applications')
      .select(`
        id,
        tracking_id,
        status,
        courses ( name ),
        institute_students ( full_name, father_name )
      `)
      .eq('institute_id', staffData.institute_id)
      .eq('status', 'APPROVED')
      .limit(50);
    
    if (data) enrollments = data;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">My Classes</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">View students enrolled in your institute.</p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <Users className="size-10 opacity-20 mx-auto mb-2" />
                    No students assigned to your classes.
                  </td>
                </tr>
              ) : (
                enrollments.map((app: any) => (
                  <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900 dark:text-white">{app.institute_students?.full_name}</div>
                      <div className="text-xs text-neutral-500">{app.institute_students?.father_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-900 dark:text-white">{app.courses?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-700 font-medium">View Profile</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
