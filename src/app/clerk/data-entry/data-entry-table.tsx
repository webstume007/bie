'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Edit, Loader2 } from 'lucide-react';
import { updateEnrollmentDataAction } from '@/features/clerks/actions';

export default function DataEntryTable({ enrollments }: { enrollments: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startEditing = (app: any) => {
    setEditingId(app.id);
    const studentName = app.is_private ? app.students?.full_name : app.institute_students?.full_name;
    const fatherName = app.is_private ? app.students?.father_name : app.institute_students?.father_name;
    setFormData({
      full_name: studentName || '',
      father_name: fatherName || '',
    });
  };

  const handleUpdate = async (id: string) => {
    setProcessingId(id);
    setError(null);

    const res = await updateEnrollmentDataAction(id, formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setEditingId(null);
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
                <th className="px-6 py-4">Tracking ID</th>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <Database className="size-10 opacity-20 mx-auto mb-2" />
                    No records found.
                  </td>
                </tr>
              ) : (
                enrollments.map(app => {
                  const studentName = app.is_private ? app.students?.full_name : app.institute_students?.full_name;
                  const fatherName = app.is_private ? app.students?.father_name : app.institute_students?.father_name;
                  const isEditing = editingId === app.id;

                  return (
                    <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                        {app.tracking_id}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 text-sm border rounded"
                              value={formData.full_name}
                              onChange={e => setFormData({...formData, full_name: e.target.value})}
                              placeholder="Full Name"
                            />
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 text-sm border rounded"
                              value={formData.father_name}
                              onChange={e => setFormData({...formData, father_name: e.target.value})}
                              placeholder="Father Name"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-neutral-900 dark:text-white">{studentName}</div>
                            <div className="text-xs text-neutral-500">{fatherName}</div>
                            <div className="text-xs text-neutral-400 mt-1">{app.is_private ? 'Private' : `Regular (${app.institutes?.name})`}</div>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-900 dark:text-white">{app.sessions?.name} {app.sessions?.year}</div>
                        <div className="text-xs text-neutral-500">{app.courses?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => setEditingId(null)}
                              disabled={processingId === app.id}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleUpdate(app.id)}
                              disabled={processingId === app.id}
                              className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950"
                            >
                              {processingId === app.id && <Loader2 className="mr-2 size-4 animate-spin" />}
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={() => startEditing(app)}
                          >
                            <Edit className="size-4 mr-2" /> Edit
                          </Button>
                        )}
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
