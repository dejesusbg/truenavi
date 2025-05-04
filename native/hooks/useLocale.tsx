import { createContext, useState, useEffect, useContext, ProviderProps } from 'react';
import { getPreferences } from '~/services/preferences';
import { defaultLocale, Locale } from '~/utils/text';

interface LocaleContextType {
  locale: Locale;
  updateLocale: () => void;
}

const defaultLocaleContext = { locale: defaultLocale, updateLocale: () => {} };
const LocaleContext = createContext<LocaleContextType>(defaultLocaleContext);

export function LocaleProvider({ value, children }: ProviderProps<Locale>) {
  const [locale, setLocale] = useState<Locale>(value);

  const updateLocale = async () => {
    const res = await getPreferences();
    if (!res.success) return;
    setLocale(res.data?.spanish ? 'es-ES' : 'en-EN');
  };

  useEffect(() => {
    updateLocale();
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, updateLocale }}>{children}</LocaleContext.Provider>
  );
}

export default function useLocale() {
  return useContext(LocaleContext);
}
