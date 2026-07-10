'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, UserCircle, LogOut, Menu, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

import { useTheme } from 'next-themes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sun, Moon } from 'lucide-react';

export function StudentShell({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const t = {
    en: {
      dashboard: 'Dashboard',
      profile: 'My Profile',
      enrollments: 'Enrollments',
      results: 'Results',
      challans: 'Challans',
      logout: 'Logout',
      portalName: 'Student Portal',
    },
    ur: {
      dashboard: 'ڈیش بورڈ',
      profile: 'میری پروفائل',
      enrollments: 'داخلے',
      results: 'نتائج',
      challans: 'چالان',
      logout: 'لاگ آؤٹ',
      portalName: 'اسٹوڈنٹ پورٹل',
    }
  }[language];

  const navItems = [
    { name: t.dashboard, href: '/student', icon: LayoutDashboard },
    { name: t.enrollments, href: '/student/enrollments', icon: FileText },
    { name: t.challans, href: '/student/challans', icon: FileText },
    { name: t.results, href: '/student/results', icon: GraduationCap },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 ${language === 'ur' ? 'right-0' : 'left-0'} z-50 lg:hidden
        w-72 bg-card border-${language === 'ur' ? 'l' : 'r'} border-border
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : (language === 'ur' ? 'translate-x-full' : '-translate-x-full')}
        flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-border bg-slate-950 dark:bg-black text-white">
          <h1 className="text-xl font-bold truncate flex items-center gap-2">
            <GraduationCap className="size-6 text-primary" />
            {t.portalName}
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isReallyActive = item.href === '/student' ? pathname === '/student' : isActive;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition-all
                  ${isReallyActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-foreground hover:bg-secondary/50 hover:text-primary'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`size-5 ${isReallyActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Header */}
      <header className="h-16 bg-slate-950 dark:bg-black text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-md z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-neutral-400 hover:text-white transition-colors"
          >
            <Menu className="size-6" />
          </button>
          
          <Link href="/student" className="flex items-center gap-3 rtl:mr-2 rtl:lg:mr-0 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.webp" 
              alt="BIE" 
              className="h-10 w-auto object-contain shrink-0 bg-white rounded-full p-0.5" 
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.logo-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'logo-fallback size-10 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0';
                  fallback.innerText = 'BIE';
                  parent.insertBefore(fallback, e.currentTarget);
                }
              }} 
            />
            <img 
              src="/bie-logo.svg" 
              alt="BIE Title" 
              className="h-7 w-auto object-contain dark:brightness-0 dark:invert brightness-0 invert" 
            />
          </Link>
        </div>

        {/* Desktop Navigation (Cute Buttons) */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isReallyActive = item.href === '/student' ? pathname === '/student' : isActive;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out hover-lift
                  ${isReallyActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'}
                `}
              >
                <item.icon className="size-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="size-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
              <div className="size-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold hover:ring-2 hover:ring-white transition-all shadow-sm">
                S
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-border">
              <Link href="/student/profile">
                <DropdownMenuItem className="rounded-xl cursor-pointer flex items-center gap-2">
                  <UserCircle className="size-4 text-muted-foreground" />
                  {t.profile}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <LogOut className="size-4 mr-2" />
                {t.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 w-full">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
