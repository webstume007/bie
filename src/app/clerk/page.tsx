'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Wallet, Database, FileCheck, GraduationCap, ArrowRight, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function ClerkDashboard() {
  const { language } = useLanguage();

  const t = {
    en: {
      welcome: 'Welcome back',
      overview: 'Here is an overview of your assigned modules.',
      finance: 'Finance & Fee Verification',
      financeDesc: 'Verify bank challans and payments.',
      dataEntry: 'Data Entry',
      dataEntryDesc: 'Bulk data entry and corrections.',
      admissions: 'Admissions Verification',
      admissionsDesc: 'Verify student forms and documents.',
      results: 'Result Processing',
      resultsDesc: 'Process and manage exam results.',
      accessText: 'Access Module',
    },
    ur: {
      welcome: 'خوش آمدید',
      overview: 'آپ کے تفویض کردہ ماڈیولز کا جائزہ یہ ہے۔',
      finance: 'فنانس اور فیس کی تصدیق',
      financeDesc: 'بینک چالان اور ادائیگیوں کی تصدیق کریں۔',
      dataEntry: 'ڈیٹا انٹری',
      dataEntryDesc: 'بلک ڈیٹا انٹری اور اصلاحات۔',
      admissions: 'داخلہ کی تصدیق',
      admissionsDesc: 'طلباء کے فارم اور دستاویزات کی تصدیق کریں۔',
      results: 'نتائج کی کارروائی',
      resultsDesc: 'امتحانی نتائج کی کارروائی اور انتظام کریں۔',
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
        
        {/* Finance Card */}
        <Link href="/clerk/finance" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-emerald-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 self-start">
            <Wallet className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.finance}
          </h3>
          <p className="z-10 text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">
            {t.financeDesc}
          </p>
          <div className="z-10 mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Data Entry Card */}
        <Link href="/clerk/data-entry" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 self-start">
            <Database className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.dataEntry}
          </h3>
          <p className="z-10 text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">
            {t.dataEntryDesc}
          </p>
          <div className="z-10 mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Admissions Card */}
        <Link href="/clerk/admissions" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 self-start">
            <FileCheck className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.admissions}
          </h3>
          <p className="z-10 text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">
            {t.admissionsDesc}
          </p>
          <div className="z-10 mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Results Card */}
        <Link href="/clerk/results" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-purple-100 dark:border-purple-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-purple-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 self-start">
            <GraduationCap className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white">
            {t.results}
          </h3>
          <p className="z-10 text-sm text-slate-500 dark:text-slate-400 mt-2 flex-grow">
            {t.resultsDesc}
          </p>
          <div className="z-10 mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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
                <LogOut className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Other Portals' : 'دیگر پورٹلز'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {language === 'en' ? 'Return to main landing page.' : 'مین پیج پر واپس جائیں۔'}
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
