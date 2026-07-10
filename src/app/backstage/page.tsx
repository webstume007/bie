import Link from 'next/link';

export default function BackstageDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome to the Super Admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/backstage/institutes" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all block">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Total Institutes</h3>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">--</p>
        </Link>
        
        <Link href="/backstage/users" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all block">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Total Students</h3>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">--</p>
        </Link>
        
        <Link href="/backstage/reports" className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 transition-all block">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Pending Approvals</h3>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">--</p>
        </Link>
      </div>
    </div>
  );
}
