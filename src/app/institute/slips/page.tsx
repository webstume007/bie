import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RollNoSlip } from '@/components/RollNoSlip';

export const revalidate = 0;

export default async function InstituteBulkSlipsPage() {
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
      *,
      sessions ( name, year ),
      degrees ( name ),
      institute_students ( full_name, father_name, profile_picture_url ),
      exam_centers ( name, location ),
      institutes ( name )
    `)
    .eq('institute_id', institute.id)
    .eq('status', 'APPROVED')
    .order('assigned_roll_no', { ascending: true });

  if (!applications || applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
        <div className="bg-white p-8 rounded-xl max-w-md text-center shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No Approved Applications</h2>
          <p className="text-neutral-600">Your institute currently has no approved applications with assigned roll numbers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4 print:p-0 print:bg-white space-y-12 print:space-y-0">
      <div className="max-w-3xl mx-auto text-right print:hidden">
        <button 
          onClick={() => window.print()}
          className="px-6 py-2 bg-indigo-600 text-neutral-950 rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
        >
          Print All Slips ({applications.length})
        </button>
      </div>

      {applications.map((app, i) => (
        <div key={app.id} className="print:break-after-page last:print:break-after-auto">
          <RollNoSlip application={app} />
        </div>
      ))}
    </div>
  );
}
