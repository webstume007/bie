import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 0; // Ensure fresh data on load

export default async function InstitutesPage() {
  const supabase = await createClient();
  
  // Fetch institutes with their head user profile
  const { data: institutes, error } = await supabase
    .from('institutes')
    .select(`
      id,
      name,
      affiliation_no,
      address,
      user_profiles:head_user_id (
        full_name,
        cnic,
        is_active
      )
    `)
    .order('id', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Institutes</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage registered educational institutes and their credentials.</p>
        </div>
        <Link href="/backstage/institutes/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-neutral-950 flex items-center gap-2">
            <Plus className="size-4" />
            Add Institute
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search institutes..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Institute Name</th>
                <th className="px-6 py-4">Affiliation No.</th>
                <th className="px-6 py-4">Principal / Head</th>
                <th className="px-6 py-4">CNIC</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {error && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                    Failed to load institutes.
                  </td>
                </tr>
              )}
              
              {!error && institutes?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                      <Building2 className="size-12 mb-3 opacity-20" />
                      <p className="text-base font-medium text-slate-900 dark:text-white">No institutes found</p>
                      <p className="mt-1">Get started by creating a new institute account.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!error && institutes?.map((institute) => {
                const head = institute.user_profiles as any; // Due to array/object return based on one-to-many/one-to-one
                const headName = head?.full_name || 'N/A';
                const headCnic = head?.cnic || 'N/A';
                const isActive = head?.is_active ?? true;

                return (
                  <tr key={institute.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {institute.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {institute.affiliation_no || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {headName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {headCnic}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isActive 
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                      }`}>
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
