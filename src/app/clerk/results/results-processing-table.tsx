'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ResultsProcessingTable({ enrollments }: { enrollments: any[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Session & Course</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    <GraduationCap className="size-10 opacity-20 mx-auto mb-2" />
                    No approved students found for result processing.
                  </td>
                </tr>
              ) : (
                enrollments.map(app => {
                  const studentName = app.is_private ? app.students?.full_name : app.institute_students?.full_name;
                  const fatherName = app.is_private ? app.students?.father_name : app.institute_students?.father_name;

                  return (
                    <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-neutral-900 dark:text-white">
                        {app.assigned_roll_no || 'Pending'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 dark:text-white">{studentName}</div>
                        <div className="text-xs text-neutral-500">{fatherName}</div>
                        <div className="text-xs text-neutral-400 mt-1">{app.is_private ? 'Private' : `Regular (${app.institutes?.name})`}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-900 dark:text-white">{app.sessions?.name} {app.sessions?.year}</div>
                        <div className="text-xs text-neutral-500">{app.courses?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/clerk/results/${app.id}`}>
                          <Button variant="outline" className="text-indigo-600 hover:text-indigo-700">
                            Process Marks <ArrowRight className="size-4 ml-2" />
                          </Button>
                        </Link>
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
