'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wallet, Database, FileCheck, GraduationCap, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ClerkShell({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const t = {
    en: {
      dashboard: 'Dashboard',
      finance: 'Finance',
      dataEntry: 'Data Entry',
      admissions: 'Admissions',
      results: 'Results',
      logout: 'Logout',
      clerkPanel: 'Clerk Portal',
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      finance: 'فنانس',
      dataEntry: 'ڈیٹا انٹری',
      admissions: 'داخلے',
      results: 'نتائج',
      logout: 'لاگ آؤٹ',
      clerkPanel: 'کلرک پورٹل',
    }
  }[language];

  const navItems = [
    { name: t.dashboard, href: '/clerk', icon: LayoutDashboard },
    { name: t.finance, href: '/clerk/finance', icon: Wallet },
    { name: t.dataEntry, href: '/clerk/data-entry', icon: Database },
    { name: t.admissions, href: '/clerk/admissions', icon: FileCheck },
    { name: t.results, href: '/clerk/results', icon: GraduationCap },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 ${language === 'ur' ? 'right-0' : 'left-0'} z-30
        w-64 bg-white dark:bg-slate-900 border-${language === 'ur' ? 'l' : 'r'} border-slate-200 dark:border-slate-800
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : (language === 'ur' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')}
        flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
            {t.clerkPanel}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isReallyActive = item.href === '/clerk' ? pathname === '/clerk' : isActive;
            
            return (
               <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isReallyActive 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' 
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`size-5 ${isReallyActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="size-5" />
            {t.logout}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Menu className="size-6" />
          </button>
          
          <div className="flex items-center gap-3 ml-2 lg:ml-0 rtl:mr-2 rtl:lg:mr-0">
            <img 
              src="/logo.webp" 
              alt="BIE" 
              className="h-9 w-auto object-contain shrink-0" 
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'logo-fallback size-9 rounded-full bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center font-bold text-xs text-indigo-700 dark:text-indigo-300 shrink-0';
                  fallback.innerText = 'BIE';
                  parent.insertBefore(fallback, e.currentTarget);
                }
              }} 
            />
            <img 
              src="/bie-logo.svg" 
              alt="BIE Title" 
              className="h-6 w-auto object-contain dark:invert" 
            />
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-4">
            <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium">
              C
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
