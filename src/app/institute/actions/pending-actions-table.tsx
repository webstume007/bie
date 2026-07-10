'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Loader2, Receipt, Upload } from 'lucide-react';
import { generateBulkChallanAction } from '@/features/institute/actions';

export default function PendingActionsTable({ pendingApps, pendingChallans }: { pendingApps: any[], pendingChallans: any[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleApp = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === pendingApps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingApps.map(a => a.id)));
    }
  };

  const handleGenerateChallan = async () => {
    if (selectedIds.size === 0) return;
    setIsPending(true);
    setError(null);

    const res = await generateBulkChallanAction(Array.from(selectedIds));
    if (res?.error) {
      setError(res.error);
    } else {
      setSelectedIds(new Set());
    }
    setIsPending(false);
  };

  return (
    <div className="space-y-8">
      {/* Unpaid Bulk Challans */}
      {pendingChallans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Receipt className="size-5 text-indigo-600 dark:text-indigo-400" />
            Awaiting Payment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingChallans.map((challan: any) => (
              <div key={challan.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Bulk Challan</p>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white font-mono mt-0.5">{challan.psid}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {challan.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-end border-t border-neutral-100 dark:border-neutral-800 pt-4">
                  <div>
                    <p className="text-xs text-neutral-500">Amount due</p>
                    <p className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">Rs. {challan.amount}</p>
                    <p className="text-xs text-neutral-500 mt-1">{challan.challan_enrollments?.[0]?.count || 0} Students</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" className="w-full">Print</Button>
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-neutral-950">
                      <Upload className="size-3 mr-2" /> Upload
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Enrollments */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <FileText className="size-5 text-indigo-600 dark:text-indigo-400" />
            Pending Enrollments ({pendingApps.length})
          </h3>
          <Button 
            onClick={handleGenerateChallan}
            disabled={isPending || selectedIds.size === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Generate Bulk Challan ({selectedIds.size})
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">
                    <Checkbox 
                      checked={pendingApps.length > 0 && selectedIds.size === pendingApps.length}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3">Tracking ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Session & Degree</th>
                  <th className="px-4 py-3 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {pendingApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                      No pending enrollments found. Enroll students first to generate challans.
                    </td>
                  </tr>
                ) : (
                  pendingApps.map(app => (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${selectedIds.has(app.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                      onClick={() => toggleApp(app.id)}
                    >
                      <td className="px-4 py-3 text-center">
                        <Checkbox 
                          checked={selectedIds.has(app.id)}
                          onCheckedChange={() => toggleApp(app.id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{app.tracking_id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-neutral-900 dark:text-white">{app.institute_students?.full_name}</div>
                        <div className="text-xs text-neutral-500">{app.institute_students?.father_name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-neutral-900 dark:text-white">{app.sessions?.name} {app.sessions?.year}</div>
                        <div className="text-xs text-neutral-500">{app.degrees?.name}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        Rs. {app.degrees?.base_fee}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
