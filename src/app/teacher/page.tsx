'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Users, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { language } = useLanguage();

  const t = {
    en: {
      welcome: 'Teacher Dashboard',
      overview: 'Manage your classes, attendance, and exam results.',
      classes: 'My Classes',
      classesDesc: 'View assigned classes and mark daily attendance.',
      marks: 'Marks Entry',
      marksDesc: 'Enter and submit examination results.',
    },
    ur: {
      welcome: 'ٹیچر ڈیش بورڈ',
      overview: 'اپنی کلاسز، حاضری، اور امتحانی نتائج کا انتظام کریں۔',
      classes: 'میری کلاسز',
      classesDesc: 'تفویض کردہ کلاسز دیکھیں اور روزانہ کی حاضری لگائیں۔',
      marks: 'نمبرات کا اندراج',
      marksDesc: 'امتحانی نتائج کا اندراج اور جمع کریں۔',
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Classes Card */}
        <Link href="/teacher/classes" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 self-start">
            <Users className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white mt-auto">
            {t.classes}
          </h3>
          <p className="z-10 text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t.classesDesc}
          </p>
        </Link>

        {/* Marks Entry Card */}
        <Link href="/teacher/marks" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-purple-100 dark:border-purple-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-purple-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 self-start">
            <GraduationCap className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white mt-auto">
            {t.marks}
          </h3>
          <p className="z-10 text-sm text-slate-500 dark:text-slate-400 mt-2">
            {t.marksDesc}
          </p>
        </Link>

      </div>
    </div>
  );
}
