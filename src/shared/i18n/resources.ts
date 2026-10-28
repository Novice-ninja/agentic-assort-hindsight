import enAdmin from './locales/en/admin.json';
import enCommon from './locales/en/common.json';
import enNav from './locales/en/nav.json';
import enProducts from './locales/en/products.json';
import enLocations from './locales/en/locations.json';
import enDashboard from './locales/en/dashboard.json';
import enPlanning from './locales/en/planning.json';
import enHindsight from './locales/en/hindsight.json';
import enClustering from './locales/en/clustering.json';

import esAdmin from './locales/es/admin.json';
import esCommon from './locales/es/common.json';
import esNav from './locales/es/nav.json';
import esProducts from './locales/es/products.json';
import esLocations from './locales/es/locations.json';
import esDashboard from './locales/es/dashboard.json';
import esPlanning from './locales/es/planning.json';
import esHindsight from './locales/es/hindsight.json';
import esClustering from './locales/es/clustering.json';

import arAdmin from './locales/ar/admin.json';
import arCommon from './locales/ar/common.json';
import arNav from './locales/ar/nav.json';
import arProducts from './locales/ar/products.json';
import arLocations from './locales/ar/locations.json';
import arDashboard from './locales/ar/dashboard.json';
import arPlanning from './locales/ar/planning.json';
import arHindsight from './locales/ar/hindsight.json';
import arClustering from './locales/ar/clustering.json';

export type LocaleDirection = 'ltr' | 'rtl';

export interface SupportedLocale {
  code: string;
  dir: LocaleDirection;
}

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  { code: 'en', dir: 'ltr' },
  { code: 'es', dir: 'ltr' },
  { code: 'ar', dir: 'rtl' },
];

export const FALLBACK_LOCALE = 'en';

export const namespaces = [
  'common',
  'nav',
  'products',
  'locations',
  'dashboard',
  'admin',
  'planning',
  'hindsight',
  'clustering',
] as const;

export const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    products: enProducts,
    locations: enLocations,
    dashboard: enDashboard,
    admin: enAdmin,
    planning: enPlanning,
    hindsight: enHindsight,
    clustering: enClustering,
  },
  es: {
    common: esCommon,
    nav: esNav,
    products: esProducts,
    locations: esLocations,
    dashboard: esDashboard,
    admin: esAdmin,
    planning: esPlanning,
    hindsight: esHindsight,
    clustering: esClustering,
  },
  ar: {
    common: arCommon,
    nav: arNav,
    products: arProducts,
    locations: arLocations,
    dashboard: arDashboard,
    admin: arAdmin,
    planning: arPlanning,
    hindsight: arHindsight,
    clustering: arClustering,
  },
} as const;

export function directionFor(locale: string): LocaleDirection {
  return SUPPORTED_LOCALES.find((l) => l.code === locale)?.dir ?? 'ltr';
}
