'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
      className="size-9 rounded-full bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 transition-colors text-xs font-bold"
      title={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
    >
      {language === 'en' ? 'UR' : 'EN'}
    </button>
  );
}
