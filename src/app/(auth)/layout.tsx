import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Decorative background shapes for a modern educational look */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/10 blur-3xl opacity-50" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-blue-100 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 blur-3xl opacity-50" />
      </div>
      
      {/* Auth Header */}
      <header className="h-16 w-full bg-slate-950 dark:bg-slate-900 text-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-md z-30">
        <Link href="/" className="flex items-center gap-3 rtl:mr-2 rtl:lg:mr-0 hover:opacity-80 transition-opacity">
          <img 
            src="/logo.webp" 
            alt="BIE" 
            className="h-10 w-auto object-contain shrink-0 bg-white rounded-full p-0.5" 
          />
          <img 
            src="/bie-logo.svg" 
            alt="BIE Title" 
            className="h-7 w-auto object-contain dark:brightness-0 dark:invert brightness-0 invert" 
          />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 z-10 w-full max-w-7xl mx-auto">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome to the Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Your gateway to learning and education
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-white/20 dark:border-slate-800/50 mx-2 sm:mx-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
