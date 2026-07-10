'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
      className="size-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xs font-bold"
      title={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
    >
      {language === 'en' ? 'UR' : 'EN'}
    </button>
  );
}
