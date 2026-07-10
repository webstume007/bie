import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Search, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function SessionsPage() {
  const supabase = await createClient();
  
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Sessions</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure exam sessions and fee deadlines.</p>
        </div>
        <Link href="/backstage/sessions/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Plus className="size-4" />
            Add Session
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Session Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Normal Fee Date</th>
                <th className="px-6 py-4">Double Fee Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {error && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                    Failed to load sessions.
                  </td>
                </tr>
              )}
              
              {!error && sessions?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <CalendarClock className="size-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No sessions configured</p>
                      <p className="mt-1">Create an academic session to allow enrollments.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!error && sessions?.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {session.name} ({session.year})
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 capitalize">
                    {session.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      session.is_active 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {session.is_active ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(session.normal_fee_deadline).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(session.double_fee_deadline).toLocaleDateString()}
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
