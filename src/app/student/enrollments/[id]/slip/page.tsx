import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RollNoSlip } from '@/components/RollNoSlip';

export default async function StudentSlipPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: application } = await supabase
    .from('exam_applications')
    .select(`
      *,
      sessions ( name, year ),
      courses ( name ),
      students ( full_name, father_name, profile_image_url ),
      exam_centers ( name, location )
    `)
    .eq('id', params.id)
    .eq('student_id', user.id)
    .single();

  if (!application) redirect('/student/enrollments');

  if (application.status !== 'APPROVED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
        <div className="bg-white p-8 rounded-xl max-w-md text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Slip Not Available</h2>
          <p className="text-neutral-600">Your application has not been approved yet. Current status: {application.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4 print:p-0 print:bg-white">
      <RollNoSlip application={application} />
    </div>
  );
}
