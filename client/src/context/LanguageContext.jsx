import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import { SUPPORTED_LANGUAGES } from '../constants/navigation';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('agrinova_language') || i18n.language || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const setLanguage = (langCode) => {
    const exists = SUPPORTED_LANGUAGES.some((l) => l.code === langCode);
    if (exists) {
      setCurrentLanguage(langCode);
      i18n.changeLanguage(langCode);
      try {
        localStorage.setItem('agrinova_language', langCode);
      } catch {
        // storage disabled
      }
    }
  };

  const selectedLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        selectedLangObj,
        supportedLanguages: SUPPORTED_LANGUAGES,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
