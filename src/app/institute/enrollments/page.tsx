import { createClient } from '@/lib/supabase/server';
import { InstituteShell } from '@/components/institute/institute-shell';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function InstituteEnrollmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) redirect('/institute');

  const { data: enrollments } = await supabase
    .from('exam_applications')
    .select(`
      id,
      tracking_id,
      status,
      created_at,
      sessions ( name, year ),
      degrees ( name ),
      institute_students ( full_name, father_name )
    `)
    .eq('institute_id', institute.id)
    .order('created_at', { ascending: false });

  return (
    <InstituteShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Active Enrollments</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Track and manage your students' exam applications.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/institute/actions">
              <Button variant="outline">Pending Actions</Button>
            </Link>
            <Link href="/institute/enrollments/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950">
                <Plus className="size-4 mr-2" />
                Bulk Enroll
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Tracking ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Session & Degree</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {!enrollments || enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <FileText className="size-12 mb-3 opacity-20" />
                        <p className="text-base font-medium text-neutral-900 dark:text-white">No enrollments yet</p>
                        <p className="mt-1">Use the Bulk Enroll feature to register your students.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((app: any) => (
                    <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium">{app.tracking_id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">{app.institute_students?.full_name}</div>
                        <div className="text-xs text-neutral-500">{app.institute_students?.father_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-900 dark:text-white">{app.sessions?.name} {app.sessions?.year}</div>
                        <div className="text-xs text-neutral-500">{app.degrees?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${app.status === 'SUBMITTED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                          ${app.status === 'CHALLAN_GENERATED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                          ${app.status === 'FEE_VERIFIED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </InstituteShell>
  );
}
