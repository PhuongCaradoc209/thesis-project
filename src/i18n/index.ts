import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

export const i18nLanguages = { en: 'EN', vi: 'VI' } as const;

export type I18nLanguage = keyof typeof i18nLanguages;
const i18nDefaultLanguage: I18nLanguage = 'en';

const i18nNamespaces = ['common'] as const;
type I18nNamespace = (typeof i18nNamespaces)[number];
export const i18nDefaultNamespace: I18nNamespace = 'common';

const getInitialLanguage = (): I18nLanguage => {
  const savedLanguage = localStorage.getItem('language') as I18nLanguage;
  if (savedLanguage && Object.keys(i18nLanguages).includes(savedLanguage)) {
    return savedLanguage;
  }
  localStorage.setItem('language', i18nDefaultLanguage); // Set to default if invalid
  return i18nDefaultLanguage;
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: getInitialLanguage(),
  fallbackLng: i18nDefaultLanguage,
  ns: i18nNamespaces,
  defaultNS: i18nDefaultNamespace,
  interpolation: {
    escapeValue: false,
  },
});

const originalChangeLanguage = i18n.changeLanguage;

i18n.changeLanguage = function (lng, callback) {
  const result = originalChangeLanguage.call(this, lng, callback);
  localStorage.setItem('language', lng ?? i18nDefaultLanguage);
  return result;
};

export default i18n;
