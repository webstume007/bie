'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  AlertCircle, 
  GraduationCap, 
  FileText, 
  UserCircle,
  LogOut,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

interface StudentDashboardUIProps {
  isProfileComplete: boolean;
  studentName: string;
}

export function StudentDashboardUI({ isProfileComplete, studentName }: StudentDashboardUIProps) {
  const { language } = useLanguage();

  const t = {
    en: {
      welcome: `Welcome, ${studentName}`,
      overview: 'Here is an overview of your academic status.',
      completeProfileTitle: 'Complete Your Profile',
      completeProfileDesc: 'You need to complete your profile information before you can apply for enrollments or exams.',
      completeProfileBtn: 'Complete Profile',
      activeEnrollments: 'Active Enrollments',
      pendingChallans: 'Pending Challans',
      myProfile: 'My Profile',
      applyAdmission: 'Apply for Admission',
      accessText: 'Access',
    },
    ur: {
      welcome: `خوش آمدید، ${studentName}`,
      overview: 'یہاں آپ کی تعلیمی حیثیت کا جائزہ ہے۔',
      completeProfileTitle: 'اپنی پروفائل مکمل کریں',
      completeProfileDesc: 'داخلے یا امتحانات کے لیے اپلائی کرنے سے پہلے آپ کو اپنی پروفائل کی معلومات مکمل کرنی ہوں گی۔',
      completeProfileBtn: 'پروفائل مکمل کریں',
      activeEnrollments: 'فعال اندراجات',
      pendingChallans: 'زیر التوا چالان',
      myProfile: 'میری پروفائل',
      applyAdmission: 'داخلے کے لیے اپلائی کریں',
      accessText: 'رسائی حاصل کریں',
    }
  }[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t.welcome}</h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">{t.overview}</p>
      </div>

      {!isProfileComplete && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between shadow-sm">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-2xl shrink-0">
              <AlertCircle className="size-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300">{t.completeProfileTitle}</h3>
              <p className="text-amber-700 dark:text-amber-400/80 text-sm mt-1 max-w-xl leading-relaxed">{t.completeProfileDesc}</p>
            </div>
          </div>
          <Link href="/student/profile" className="shrink-0 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover-lift">
              {t.completeProfileBtn}
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Profile Card */}
        <Link href="/student/profile" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-indigo-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 self-start">
            <UserCircle className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white mt-auto">
            {t.myProfile}
          </h3>
          <div className="z-10 mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Enrollments Card */}
        <Link href="/student/enrollments" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-blue-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 self-start">
            <GraduationCap className="size-8" />
          </div>
          <div className="z-10 flex justify-between items-end mt-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.activeEnrollments}
            </h3>
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">0</span>
          </div>
        </Link>

        {/* New Admission Card */}
        <Link href="/student/enrollments/new" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-emerald-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 self-start">
            <LayoutDashboard className="size-8" />
          </div>
          <h3 className="z-10 text-lg font-bold text-slate-900 dark:text-white mt-auto">
            {t.applyAdmission}
          </h3>
          <div className="z-10 mt-3 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <span>{t.accessText}</span>
            <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </Link>

        {/* Challans Card */}
        <Link href="/student/enrollments" className="group flex flex-col p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-rose-100 dark:border-rose-900/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-rose-500/10 blur-2xl z-0" />
          <div className="z-10 p-4 rounded-2xl mb-4 bg-rose-500/10 text-rose-600 dark:text-rose-400 self-start">
            <FileText className="size-8" />
          </div>
          <div className="z-10 flex justify-between items-end mt-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.pendingChallans}
            </h3>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">0</span>
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
                  {language === 'en' ? 'Return to main landing page to access Institute or Clerk portals.' : 'انسٹیٹیوٹ یا کلرک پورٹلز تک رسائی کے لیے مین پیج پر واپس جائیں۔'}
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
