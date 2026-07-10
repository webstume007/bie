import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { ChallanSection } from '@/components/student/challan-section';
import { CheckCircle2, FileText, CalendarClock } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function EnrollmentDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch Application
  const { data: app, error } = await supabase
    .from('exam_applications')
    .select(`
      *,
      sessions ( id, name, year, type, normal_fee_date, late_fee_date, double_fee_date ),
      degrees ( id, name, level, base_fee, late_fee, double_fee ),
      institutes ( name )
    `)
    .eq('id', params.id)
    .eq('student_id', user.id)
    .single();

  if (error || !app) {
    return notFound();
  }

  // 2. Fetch linked Challan if exists
  const { data: challanLink } = await supabase
    .from('challan_enrollments')
    .select(`
      challans ( id, psid, amount, status, receipt_url, created_at )
    `)
    .eq('enrollment_id', app.id)
    .single();

  const challan = challanLink?.challans;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/student/enrollments" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              ← Back to Enrollments
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{app.tracking_id}</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Application Details</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            app.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' :
            app.status === 'FEE_VERIFIED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
            app.status === 'CHALLAN_GENERATED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400' :
            'bg-neutral-100 text-neutral-800 dark:bg-neutral-500/10 dark:text-neutral-300'
          }`}>
            {app.status === 'APPROVED' && <CheckCircle2 className="size-4" />}
            {app.status.replace('_', ' ')}
          </span>
          {app.status === 'APPROVED' && (
            <Link href={`/student/enrollments/${app.id}/slip`}>
              <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-950 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Download Slip
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-3 text-sm font-medium">
            <CalendarClock className="size-4" />
            Session Details
          </div>
          <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {app.sessions.name} ({app.sessions.year})
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 capitalize mt-1">
            {app.sessions.type} Examination
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-3 text-sm font-medium">
            <FileText className="size-4" />
            Program Details
          </div>
          <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {app.degrees.name}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Level: {app.degrees.level} • {app.is_private ? 'Private Candidate' : `Regular (${app.institutes?.name})`}
          </div>
        </div>
      </div>

      {/* Finance Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Fee & Payment</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Manage your examination fee payment and receipt upload.</p>
        </div>
        
        <ChallanSection 
          application={app} 
          challan={challan} 
        />
      </div>
    </div>
  );
}
