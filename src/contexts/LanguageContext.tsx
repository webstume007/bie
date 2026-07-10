'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check local storage for saved language preference on mount
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ur')) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    // Update local storage and document dir attribute
    localStorage.setItem('app_language', language);
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Toggle a class on the body for language-specific styling (like fonts)
    if (language === 'ur') {
      document.documentElement.classList.add('font-urdu');
    } else {
      document.documentElement.classList.remove('font-urdu');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
