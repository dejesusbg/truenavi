import { createContext, useState, useEffect, useContext, ProviderProps } from 'react';
import { emptyPreferences, getPreferences, PreferencesProps } from '~/services/preferences';
import { Locale } from '~/utils/text';

interface PreferencesContextType {
  preferences: PreferencesProps;
  setNewPreferences: () => Promise<any>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: emptyPreferences,
  setNewPreferences: async () => Promise.resolve(),
});

export function PreferencesProvider({ value, children }: ProviderProps<PreferencesProps>) {
  const [preferences, setPreferences] = useState<PreferencesProps>(value);

  const setNewPreferences = async () => {
    const res = await getPreferences();
    if (res.success && res.data) setPreferences(res.data);
    return res;
  };

  useEffect(() => {
    setNewPreferences();
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, setNewPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export default function usePreferences() {
  return useContext(PreferencesContext);
}

export function getLocale(preferences: PreferencesProps): Locale {
  return preferences.spanish ? 'es-ES' : 'en-EN';
}
