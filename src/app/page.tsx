'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { 
  GraduationCap, 
  FileText, 
  Building2, 
  UserCircle, 
  CreditCard, 
  CalendarDays, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      heroTitle: 'Welcome to the Board of Islamic Education',
      heroDesc: 'Empowering minds with knowledge, integrity, and excellence. Access all your educational resources in one place.',
      applyAdmission: 'Apply for Admission',
      results: 'Results',
      instituteLogin: 'Institute Login',
      studentLogin: 'Student Login',
      fees: 'Fee Structure',
      schedules: 'Schedules',
      portalAccess: 'Portal Access',
    },
    ur: {
      heroTitle: 'بورڈ آف اسلامک ایجوکیشن میں خوش آمدید',
      heroDesc: 'علم، دیانت اور فضیلت کے ساتھ ذہنوں کو بااختیار بنانا۔ اپنے تمام تعلیمی وسائل تک ایک ہی جگہ رسائی حاصل کریں۔',
      applyAdmission: 'داخلے کے لیے اپلائی کریں',
      results: 'نتائج',
      instituteLogin: 'انسٹیٹیوٹ لاگ ان',
      studentLogin: 'طالب علم لاگ ان',
      fees: 'فیس کی تفصیلات',
      schedules: 'شیڈول',
      portalAccess: 'پورٹل تک رسائی',
    }
  }[language];

  const quickLinks = [
    {
      name: t.applyAdmission,
      icon: GraduationCap,
      href: '/login', // Adjust to actual signup/admission route when ready
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      hoverColor: 'hover:bg-blue-500/20',
      border: 'border-blue-200 dark:border-blue-900/50',
    },
    {
      name: t.results,
      icon: FileText,
      href: '#', // Placeholder
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      hoverColor: 'hover:bg-emerald-500/20',
      border: 'border-emerald-200 dark:border-emerald-900/50',
    },
    {
      name: t.instituteLogin,
      icon: Building2,
      href: '/login',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      hoverColor: 'hover:bg-indigo-500/20',
      border: 'border-indigo-200 dark:border-indigo-900/50',
    },
    {
      name: t.studentLogin,
      icon: UserCircle,
      href: '/login',
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      hoverColor: 'hover:bg-violet-500/20',
      border: 'border-violet-200 dark:border-violet-900/50',
    },
    {
      name: t.fees,
      icon: CreditCard,
      href: '#', // Placeholder
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      hoverColor: 'hover:bg-amber-500/20',
      border: 'border-amber-200 dark:border-amber-900/50',
    },
    {
      name: t.schedules,
      icon: CalendarDays,
      href: '#', // Placeholder
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      hoverColor: 'hover:bg-rose-500/20',
      border: 'border-rose-200 dark:border-rose-900/50',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/10 blur-3xl opacity-50 animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200/40 to-cyan-200/40 dark:from-blue-900/20 dark:to-cyan-900/10 blur-3xl opacity-50" />
      </div>

      {/* Header */}
      <header className="h-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-30 sticky top-0 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center gap-3 rtl:mr-2 rtl:lg:mr-0 hover:opacity-80 transition-opacity">
          <img 
            src="/logo.webp" 
            alt="BIE" 
            className="h-12 w-auto object-contain shrink-0 bg-white rounded-full p-0.5 shadow-sm animate-breadcrumb-pulse" 
          />
          <img 
            src="/bie-logo.svg" 
            alt="BIE Title" 
            className="h-8 w-auto object-contain dark:brightness-0 dark:invert brightness-0" 
          />
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link 
            href="/login" 
            className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover-lift"
          >
            <UserCircle className="size-4" />
            <span>{t.portalAccess}</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 z-10 flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 shadow-sm text-indigo-600 dark:text-indigo-400">
            <BookOpen className="size-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t.heroDesc}
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`group flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-[2rem] border ${link.border} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
              >
                {/* Decorative background glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${link.color.replace('text-', 'bg-').split(' ')[0]} blur-2xl z-0`} />
                
                <div className={`z-10 p-4 rounded-2xl mb-4 transition-colors duration-300 ${link.color} ${link.hoverColor}`}>
                  <Icon className="size-8" />
                </div>
                <h3 className="z-10 text-xl font-bold text-slate-900 dark:text-white text-center">
                  {link.name}
                </h3>
                <div className="z-10 mt-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span>{language === 'en' ? 'Access' : 'رسائی حاصل کریں'}</span>
                  <ArrowRight className="size-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-sm text-slate-500 dark:text-slate-400 z-10 border-t border-slate-200 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} Board of Islamic Education. {language === 'en' ? 'All rights reserved.' : 'جملہ حقوق محفوظ ہیں۔'}</p>
      </footer>
    </div>
  );
}
