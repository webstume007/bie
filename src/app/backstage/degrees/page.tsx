import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function DegreesPage() {
  const supabase = await createClient();
  
  const { data: degrees, error } = await supabase
    .from('degrees')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Degrees & Programs</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage offered programs and their base fee structures.</p>
        </div>
        <Link href="/backstage/degrees/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950 flex items-center gap-2">
            <Plus className="size-4" />
            Add Degree
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Degree Name</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Normal Fee</th>
                <th className="px-6 py-4 text-right">Late Fee</th>
                <th className="px-6 py-4 text-right">Double Fee</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {error && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                    Failed to load degrees.
                  </td>
                </tr>
              )}
              
              {!error && degrees?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <BookOpen className="size-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No degrees configured</p>
                      <p className="mt-1">Create a degree program to accept enrollments.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!error && degrees?.map((degree) => (
                <tr key={degree.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {degree.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {degree.level || '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                    Rs. {degree.normal_fee}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                    Rs. {degree.late_fee}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                    Rs. {degree.double_fee}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
