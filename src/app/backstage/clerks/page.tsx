import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0;

export default async function ClerksPage() {
  const supabase = await createClient();
  
  // Fetch clerk profiles
  const { data: clerks, error } = await supabase
    .from('user_profiles')
    .select(`
      id,
      full_name,
      cnic,
      is_active,
      roles!inner(name)
    `)
    .eq('roles.name', 'clerk')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clerks</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage board staff members and their system access.</p>
        </div>
        <Link href="/backstage/clerks/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
            <Plus className="size-4" />
            Add Clerk
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search clerks..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">CNIC</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {error && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-500">
                    Failed to load clerks.
                  </td>
                </tr>
              )}
              
              {!error && clerks?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <Users className="size-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No clerks found</p>
                      <p className="mt-1">Get started by adding a new clerk account.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!error && clerks?.map((clerk) => (
                <tr key={clerk.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {clerk.full_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {clerk.cnic}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      clerk.is_active 
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {clerk.is_active ? 'Active' : 'Disabled'}
                    </span>
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
