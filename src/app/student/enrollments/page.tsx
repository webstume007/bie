import { createClient } from '@/lib/supabase/server';
import { FileX2, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function StudentEnrollmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch enrollments for this student
  const { data: enrollments, error } = await supabase
    .from('exam_applications')
    .select(`
      id,
      is_private,
      status,
      tracking_id,
      sessions ( name ),
      degrees ( name ),
      institutes ( name )
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Enrollments</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View the status of your applications and active enrollments.</p>
        </div>
        <Link href="/student/enrollments/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
            Apply for Exam
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Session</th>
                <th className="px-6 py-4">Degree</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Roll No.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {error && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                    Failed to load enrollments.
                  </td>
                </tr>
              )}

              {!error && (!enrollments || enrollments.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <FileX2 className="size-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No enrollments found</p>
                      <p className="mt-1">You haven't applied for any exams yet.</p>
                      <Link href="/student/enrollments/new">
                        <Button variant="outline" className="mt-6 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          Start New Application
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}

              {!error && enrollments?.map((enrollment: any) => {
                const sessionName = enrollment.sessions?.name || 'Unknown Session';
                const degreeName = enrollment.degrees?.name || 'Unknown Degree';
                const isRegular = !enrollment.is_private;

                return (
                  <tr key={enrollment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {sessionName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {degreeName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-900 dark:text-white font-medium">{isRegular ? 'REGULAR' : 'PRIVATE'}</span>
                        {isRegular && enrollment.institutes?.name && (
                          <span className="text-xs text-slate-500 truncate max-w-[200px]" title={enrollment.institutes.name}>
                            {enrollment.institutes.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {enrollment.tracking_id || 'Pending'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${enrollment.status === 'APPROVED' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                          enrollment.status === 'REJECTED' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}>
                        {enrollment.status === 'APPROVED' && <CheckCircle className="size-3" />}
                        {enrollment.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                        View Receipt
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
