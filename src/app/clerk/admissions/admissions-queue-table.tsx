'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileCheck, Loader2 } from 'lucide-react';
import { approveAdmissionAction } from '@/features/clerks/actions';

export default function AdmissionsQueueTable({ applications, centers }: { applications: any[], centers: any[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedCenters, setSelectedCenters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    const centerId = selectedCenters[id];
    if (!centerId) {
      setError(`Please select an Exam Center for application ${id}`);
      return;
    }

    setProcessingId(id);
    setError(null);

    const res = await approveAdmissionAction(id, centerId);
    if (res?.error) {
      setError(res.error);
    }
    
    setProcessingId(null);
  };

  return (
    <div className="space-y-4">
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
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Session & Degree</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 w-64">Assign Exam Center</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <FileCheck className="size-10 opacity-20 mx-auto mb-2" />
                    No applications pending admission verification.
                  </td>
                </tr>
              ) : (
                applications.map(app => {
                  const studentName = app.is_private ? app.students?.full_name : app.institute_students?.full_name;
                  const fatherName = app.is_private ? app.students?.father_name : app.institute_students?.father_name;
                  const typeLabel = app.is_private ? 'Private' : `Regular (${app.institutes?.name})`;

                  return (
                    <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">{studentName}</div>
                        <div className="text-xs text-neutral-500">{fatherName}</div>
                        <div className="text-xs text-neutral-400 font-mono mt-1">{app.tracking_id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-900 dark:text-white">{app.sessions?.name} {app.sessions?.year}</div>
                        <div className="text-xs text-neutral-500">{app.degrees?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                          {typeLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Select 
                          value={selectedCenters[app.id] || ''} 
                          onValueChange={(val) => setSelectedCenters({ ...selectedCenters, [app.id]: val })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Center" />
                          </SelectTrigger>
                          <SelectContent>
                            {centers.map(c => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          onClick={() => handleApprove(app.id)}
                          disabled={processingId === app.id || !selectedCenters[app.id]}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          {processingId === app.id && <Loader2 className="mr-2 size-4 animate-spin" />}
                          Approve
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
