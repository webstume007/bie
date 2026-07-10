import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Users, FileText, CheckCircle } from 'lucide-react';

export default async function InstituteDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // In a real scenario, we would fetch actual stats based on the institute's ID
  // For now, we'll just display a welcome message and placeholder stats.
  
  let instituteName = 'Institute';
  if (user) {
    const { data: institute } = await supabase
      .from('institutes')
      .select('name')
      .eq('head_user_id', user.id)
      .single();
    
    if (institute) {
      instituteName = institute.name;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome, {instituteName}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is an overview of your institute's current status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/institute/students" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
            <Users className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Total Students</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">0</p>
          </div>
        </Link>
        
        <Link href="/institute/enrollments" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
            <FileText className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Active Enrollments</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">0</p>
          </div>
        </Link>
        
        <Link href="/institute/actions" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors">
            <CheckCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Pending Actions</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">0</p>
          </div>
        </Link>

        <Link href="/institute/slips" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
            <FileText className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Roll Number Slips</h3>
            <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">--</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
