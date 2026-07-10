import { createClient } from '@/lib/supabase/server';
import { ClerkShell } from '@/components/clerk/clerk-shell';
import { redirect } from 'next/navigation';
import { Receipt, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinanceVerifyButton } from '@/components/clerk/finance-verify-button';

export const revalidate = 0;

export default async function ClerkFinancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Ideally, verify clerk has the 'finance' module permission.
  // For this demo, we'll fetch all pending challans.

  const { data: pendingChallans, error } = await supabase
    .from('challans')
    .select(`
      id,
      amount,
      psid,
      receipt_url,
      created_at,
      student:student_id ( full_name, cnic ),
      challan_enrollments!inner (
        exam_applications!inner (
          id,
          tracking_id,
          sessions ( name ),
          courses ( name )
        )
      )
    `)
    .eq('status', 'VERIFICATION_PENDING')
    .order('created_at', { ascending: true });

  return (
    <ClerkShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Finance Verification Queue</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Review manually uploaded bank receipts and verify payments.</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Tracking ID</th>
                  <th className="px-6 py-4">PSID & Amount</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Receipt</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                      Failed to load queue.
                    </td>
                  </tr>
                )}

                {!error && (!pendingChallans || pendingChallans.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400">
                        <CheckCircle className="size-12 mb-3 text-green-500 opacity-20" />
                        <p className="text-base font-medium text-neutral-900 dark:text-white">Queue Empty</p>
                        <p className="mt-1">All pending payments have been verified!</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!error && pendingChallans?.map((challan: any) => {
                  const student = challan.student;
                  const enrollment = challan.challan_enrollments?.[0]?.exam_applications;

                  return (
                    <tr key={challan.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">
                          {student?.full_name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          {student?.cnic}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                        {enrollment?.tracking_id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs">{challan.psid}</div>
                        <div className="font-medium text-neutral-900 dark:text-white mt-0.5">Rs. {challan.amount}</div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300">
                        <div className="truncate max-w-[150px]" title={enrollment?.courses?.name}>{enrollment?.courses?.name}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{enrollment?.sessions?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        {challan.receipt_url ? (
                          <a 
                            href={challan.receipt_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-medium text-xs transition-colors"
                          >
                            <Receipt className="size-3.5" />
                            View Image
                          </a>
                        ) : (
                          <span className="text-neutral-400 text-xs">No Receipt</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <FinanceVerifyButton challanId={challan.id} applicationId={enrollment?.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClerkShell>
  );
}
