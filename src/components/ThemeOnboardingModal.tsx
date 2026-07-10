'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export function ThemeOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  
  // Local state for the modal selections
  const [selectedLang, setSelectedLang] = useState<'en' | 'ur'>('en');
  const [selectedTheme, setSelectedTheme] = useState<string>('light');

  useEffect(() => {
    // Give providers a tiny bit of time to mount to avoid hydration mismatch flashes
    setTimeout(() => {
      const hasCompleted = localStorage.getItem('hasCompletedOnboarding');
      if (!hasCompleted) {
        setIsOpen(true);
        // Pre-select based on current defaults
        setSelectedLang(language as 'en' | 'ur');
        setSelectedTheme(theme === 'system' ? 'light' : (theme || 'light'));
      }
    }, 100);
  }, [language, theme]);

  if (!isOpen) return null;

  const handleSave = () => {
    setLanguage(selectedLang);
    setTheme(selectedTheme);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card text-card-foreground p-8 rounded-[2rem] shadow-2xl max-w-md w-full mx-4 border border-border animate-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome to BIE</h2>
        <p className="text-muted-foreground text-center mb-8">Let's personalize your portal experience.</p>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Select Language / زبان</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedLang('en')}
                className={`py-3 px-4 rounded-2xl border-2 transition-all font-medium ${selectedLang === 'en' ? 'border-primary bg-primary/10 text-primary scale-100' : 'border-border hover:border-primary/50 scale-95 opacity-80'}`}
              >
                English
              </button>
              <button
                onClick={() => setSelectedLang('ur')}
                className={`py-3 px-4 rounded-2xl border-2 transition-all font-urdu text-lg ${selectedLang === 'ur' ? 'border-primary bg-primary/10 text-primary scale-100' : 'border-border hover:border-primary/50 scale-95 opacity-80'}`}
              >
                اردو
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Select Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedTheme('light')}
                className={`flex flex-col items-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all ${selectedTheme === 'light' ? 'border-primary bg-primary/10 text-primary scale-100' : 'border-border hover:border-primary/50 scale-95 opacity-80'}`}
              >
                <div className="size-10 rounded-full bg-slate-100 border border-slate-200 shadow-sm" />
                <span className="font-medium">Light</span>
              </button>
              <button
                onClick={() => setSelectedTheme('dark')}
                className={`flex flex-col items-center gap-2 py-4 px-4 rounded-2xl border-2 transition-all ${selectedTheme === 'dark' ? 'border-primary bg-primary/10 text-primary scale-100' : 'border-border hover:border-primary/50 scale-95 opacity-80'}`}
              >
                <div className="size-10 rounded-full bg-slate-900 border border-slate-700 shadow-inner" />
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </div>

          <Button 
            className="w-full h-14 mt-4 text-lg font-semibold rounded-2xl hover-lift bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" 
            onClick={handleSave}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
