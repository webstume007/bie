'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Users, FileText, CheckCircle, ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function BackstageDashboard() {
  const { language } = useLanguage();

  const t = {
    en: {
      welcome: 'Dashboard Overview',
      overview: 'Welcome to the Super Admin control panel.',
      institutes: 'Institutes Management',
      institutesDesc: 'Manage and verify educational institutes.',
      students: 'Student Records',
      studentsDesc: 'Global view of all student records.',
      reports: 'System Reports',
      reportsDesc: 'View system-wide analytics and logs.',
      clerks: 'Clerk Management',
      clerksDesc: 'Assign roles and permissions to clerks.',
      accessText: 'Access Module',
    },
    ur: {
      welcome: 'ڈیش بورڈ کا جائزہ',
      overview: 'سپر ایڈمن کنٹرول پینل میں خوش آمدید۔',
      institutes: 'اداروں کا انتظام',
      institutesDesc: 'تعلیمی اداروں کا نظم اور تصدیق کریں۔',
      students: 'طلباء کا ریکارڈ',
      studentsDesc: 'تمام طلباء کے ریکارڈ کا عالمی جائزہ۔',
      reports: 'سسٹم رپورٹس',
      reportsDesc: 'سسٹم کے تجزیات اور لاگز دیکھیں۔',
      clerks: 'کلرک کا انتظام',
      clerksDesc: 'کلرکس کو کردار اور اجازتیں تفویض کریں۔',
      accessText: 'ماڈیول تک رسائی',
    }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.welcome}
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          {t.overview}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Institutes Card */}
        <Link href="/backstage/institutes" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 self-start">
            <Building2 className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.institutes}
          </h3>
        </Link>

        {/* Students Card */}
        <Link href="/backstage/users" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 self-start">
            <Users className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.students}
          </h3>
        </Link>

        {/* Clerks Card */}
        <Link href="/backstage/clerks" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-emerald-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 self-start">
            <CheckCircle className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.clerks}
          </h3>
        </Link>

        {/* Reports Card */}
        <Link href="/backstage/reports" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-amber-100 dark:border-amber-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-amber-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 self-start">
            <FileText className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.reports}
          </h3>
        </Link>
        

      </div>
    </div>
  );
}
