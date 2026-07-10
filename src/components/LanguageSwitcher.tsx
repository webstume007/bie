'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
      className="fixed bottom-6 right-6 z-50 font-medium shadow-lg rounded-full px-4"
      title={language === 'en' ? 'Switch to Urdu' : 'Switch to English'}
    >
      {language === 'en' ? 'اردو' : 'English'}
    </Button>
  );
}
