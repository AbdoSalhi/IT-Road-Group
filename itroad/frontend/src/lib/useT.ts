import { useLang } from './i18n';
import { translations, type TranslationData } from './translations';

export function useT(): TranslationData {
  const { lang } = useLang();
  return translations[lang];
}
