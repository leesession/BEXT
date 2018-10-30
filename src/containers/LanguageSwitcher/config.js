import { language } from '../../settings';

import englishLang from '../../image/flag/uk.svg';
import chineseLang from '../../image/flag/china.svg';

const config = {
  defaultLanguage: language,
  options: [
    {
      languageId: 'english',
      locale: 'en',
      text: 'English',
      icon: englishLang,
    },
    {
      languageId: 'chinese',
      locale: 'zh',
      text: 'Chinese',
      icon: chineseLang,
    },
  ],
};

export function getCurrentLanguage(lang) {
  let selecetedLanguage = config.options[0];
  config.options.forEach((languageType) => {
    if (languageType.languageId === lang) {
      selecetedLanguage = languageType;
    }
  });
  return selecetedLanguage;
}
export default config;
