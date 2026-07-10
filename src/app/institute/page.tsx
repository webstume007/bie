import { createClient } from '@/lib/supabase/server';
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <FileText className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Enrollments</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
            <CheckCircle className="size-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Actions</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
