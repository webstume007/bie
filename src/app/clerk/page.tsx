'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, Database, FileCheck, GraduationCap } from 'lucide-react';

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
    }
  }[language];

  const modules = [
    { title: t.finance, description: t.financeDesc, icon: Wallet, color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/50' },
    { title: t.dataEntry, description: t.dataEntryDesc, icon: Database, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50' },
    { title: t.admissions, description: t.admissionsDesc, icon: FileCheck, color: 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/50' },
    { title: t.results, description: t.resultsDesc, icon: GraduationCap, color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t.welcome}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t.overview}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className={`p-3 rounded-xl ${mod.color}`}>
                <mod.icon className="size-6" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-2">{mod.title}</CardTitle>
              <CardDescription>{mod.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
