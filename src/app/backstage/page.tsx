export default function BackstageDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome to the Super Admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Institutes</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">--</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">--</p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Approvals</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">--</p>
        </div>
      </div>
    </div>
  );
}
