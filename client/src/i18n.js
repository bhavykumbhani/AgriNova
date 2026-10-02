import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAuth from './locales/en/auth.json';
import enMarketplace from './locales/en/marketplace.json';
import enHowItWorks from './locales/en/howItWorks.json';
import enAbout from './locales/en/about.json';
import enSupport from './locales/en/support.json';
import enContact from './locales/en/contact.json';
import enFaq from './locales/en/faq.json';
import enFarmingTips from './locales/en/farmingTips.json';
import enLegal from './locales/en/legal.json';
import enDashboard from './locales/en/dashboard.json';

// Hindi translations
import hiCommon from './locales/hi/common.json';
import hiHome from './locales/hi/home.json';
import hiAuth from './locales/hi/auth.json';
import hiMarketplace from './locales/hi/marketplace.json';
import hiHowItWorks from './locales/hi/howItWorks.json';
import hiAbout from './locales/hi/about.json';
import hiSupport from './locales/hi/support.json';
import hiContact from './locales/hi/contact.json';
import hiFaq from './locales/hi/faq.json';
import hiFarmingTips from './locales/hi/farmingTips.json';
import hiLegal from './locales/hi/legal.json';
import hiDashboard from './locales/hi/dashboard.json';

// Gujarati translations
import guCommon from './locales/gu/common.json';
import guHome from './locales/gu/home.json';
import guAuth from './locales/gu/auth.json';
import guMarketplace from './locales/gu/marketplace.json';
import guHowItWorks from './locales/gu/howItWorks.json';
import guAbout from './locales/gu/about.json';
import guSupport from './locales/gu/support.json';
import guContact from './locales/gu/contact.json';
import guFaq from './locales/gu/faq.json';
import guFarmingTips from './locales/gu/farmingTips.json';
import guLegal from './locales/gu/legal.json';
import guDashboard from './locales/gu/dashboard.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('agrinova_language') || 'en' : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        auth: enAuth,
        marketplace: enMarketplace,
        howItWorks: enHowItWorks,
        about: enAbout,
        support: enSupport,
        contact: enContact,
        faq: enFaq,
        farmingTips: enFarmingTips,
        legal: enLegal,
        dashboard: enDashboard,
      },
      hi: {
        common: hiCommon,
        home: hiHome,
        auth: hiAuth,
        marketplace: hiMarketplace,
        howItWorks: hiHowItWorks,
        about: hiAbout,
        support: hiSupport,
        contact: hiContact,
        faq: hiFaq,
        farmingTips: hiFarmingTips,
        legal: hiLegal,
        dashboard: hiDashboard,
      },
      gu: {
        common: guCommon,
        home: guHome,
        auth: guAuth,
        marketplace: guMarketplace,
        howItWorks: guHowItWorks,
        about: guAbout,
        support: guSupport,
        contact: guContact,
        faq: guFaq,
        farmingTips: guFarmingTips,
        legal: guLegal,
        dashboard: guDashboard,
      },
    },
    lng: savedLang,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
