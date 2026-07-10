import { createClient } from '@/lib/supabase/server';
import { Search, Users, FileX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0; // Ensure fresh data on load

export default async function InstituteStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // First, get the institute ID for this user
  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  let enrollments: any[] = [];
  
  if (institute) {
    // Fetch students enrolled with this institute
    const { data: fetchEnrollments } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrollment_type,
        status,
        assigned_roll_no,
        students (
          id,
          father_name,
          b_form_cnic,
          gender,
          user_profiles (
            full_name
          )
        )
      `)
      .eq('institute_id', institute.id);
      
    if (fetchEnrollments) {
      enrollments = fetchEnrollments;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registered Students</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View all students enrolled under your institute.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Register New Student
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, B-Form, or Roll No..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Father's Name</th>
                <th className="px-6 py-4">B-Form / CNIC</th>
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <FileX2 className="size-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No students found</p>
                      <p className="mt-1">You haven't registered any students for upcoming sessions yet.</p>
                      <Button variant="outline" className="mt-4">
                        Register Student
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {enrollments.map((enrollment: any) => {
                const student = enrollment.students;
                const profile = student?.user_profiles;
                const studentName = profile?.full_name || 'Unknown';
                
                return (
                  <tr key={enrollment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {studentName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {student?.father_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                      {student?.b_form_cnic}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {enrollment.assigned_roll_no || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 
                        enrollment.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 
                        'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400'
                      }`}>
                        {enrollment.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
