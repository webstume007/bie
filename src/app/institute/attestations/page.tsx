import { createClient } from '@/lib/supabase/server';
import { InstituteShell } from '@/components/institute/institute-shell';
import { redirect } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function AttestationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: institute } = await supabase
    .from('institutes')
    .select('id')
    .eq('head_user_id', user.id)
    .single();

  if (!institute) redirect('/institute');

  const { data: applications } = await supabase
    .from('exam_applications')
    .select(`
      id,
      attestation_status,
      created_at,
      courses ( name ),
      students (
        b_form_cnic,
        father_name,
        user_profiles ( full_name )
      )
    `)
    .eq('institute_id', institute.id)
    .eq('enrollment_type', 'PRIVATE')
    .eq('attestation_status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <InstituteShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Private Student Attestations</h2>
          <p className="text-sm text-slate-500 mt-1">Review and approve applications from private students who selected your institute.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {(!applications || applications.length === 0) ? (
            <div className="p-12 text-center text-slate-500">
              No pending attestations.
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">CNIC</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {applications.map((app: any) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{app.students?.user_profiles?.full_name}</div>
                      <div className="text-slate-500 text-xs">S/O {app.students?.father_name}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{app.students?.b_form_cnic}</td>
                    <td className="px-6 py-4 text-slate-600">{app.courses?.name}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(app.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                        <CheckCircle className="size-4 mr-1" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <XCircle className="size-4 mr-1" /> Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </InstituteShell>
  );
}
