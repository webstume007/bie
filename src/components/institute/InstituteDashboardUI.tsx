'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users, 
  FileText, 
  CheckCircle,
  LayoutDashboard,
  ArrowRight
} from 'lucide-react';

interface InstituteDashboardUIProps {
  instituteName: string;
}

export function InstituteDashboardUI({ instituteName }: InstituteDashboardUIProps) {
  const { language } = useLanguage();

  const t = {
    en: {
      welcome: `Welcome, ${instituteName}`,
      overview: "Here is an overview of your institute's current status.",
      totalStudents: 'Total Students',
      activeEnrollments: 'Active Enrollments',
      pendingResults: 'Pending Results',
      newAdmission: 'New Admission',
      accessText: 'Access',
      manageStudents: 'Manage Students',
      viewEnrollments: 'View Enrollments',
    },
    ur: {
      welcome: `خوش آمدید، ${instituteName}`,
      overview: 'یہاں آپ کے ادارے کی موجودہ حیثیت کا جائزہ ہے۔',
      totalStudents: 'کل طلباء',
      activeEnrollments: 'فعال اندراجات',
      pendingResults: 'زیر التوا نتائج',
      newAdmission: 'نیا داخلہ',
      accessText: 'رسائی حاصل کریں',
      manageStudents: 'طلباء کا انتظام کریں',
      viewEnrollments: 'اندراجات دیکھیں',
    }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.welcome}</h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">{t.overview}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Students Card */}
        <Link href="/institute/students" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 self-start">
            <Users className="size-8" />
          </div>
          <div className="z-10 flex justify-between items-end mt-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.totalStudents}
            </h3>
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">0</span>
          </div>
          <div className="z-10 mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>{t.manageStudents}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Enrollments Card */}
        <Link href="/institute/enrollments" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 self-start">
            <FileText className="size-8" />
          </div>
          <div className="z-10 flex justify-between items-end mt-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.activeEnrollments}
            </h3>
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">0</span>
          </div>
          <div className="z-10 mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <span>{t.viewEnrollments}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* New Admission Card */}
        <Link href="/institute/enrollments/new" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-emerald-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 self-start">
            <LayoutDashboard className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white mt-auto">
            {t.newAdmission}
          </h3>
          <div className="z-10 mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Results Card */}
        <Link href="/institute/slips" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-amber-100 dark:border-amber-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-amber-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 self-start">
            <CheckCircle className="size-8" />
          </div>
          <div className="z-10 flex justify-between items-end mt-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.pendingResults}
            </h3>
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">0</span>
          </div>
          <div className="z-10 mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>
        
        {/* Switch Portals Card */}
        <Link href="/" className="group flex flex-col p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden sm:col-span-2 lg:col-span-4 mt-4">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-slate-200/50 dark:bg-slate-800/50 blur-2xl z-0" />
          <div className="z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <LayoutDashboard className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Other Portals' : 'دیگر پورٹلز'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'en' ? 'Return to main landing page to access Student or Clerk portals.' : 'طالب علم یا کلرک پورٹلز تک رسائی کے لیے مین پیج پر واپس جائیں۔'}
                </p>
              </div>
            </div>
            <div className="z-10 flex items-center justify-center size-10 rounded-full bg-white dark:bg-slate-800 shadow-sm group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
              <ArrowRight className="size-5 rtl:rotate-180" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
