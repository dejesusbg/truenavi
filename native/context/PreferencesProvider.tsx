import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  defaultPreferences,
  getPreferences,
  PreferencesProps,
  PreferencesResponse,
} from '~/services/preferences';

export interface PreferencesContextType {
  preferences: PreferencesProps;
  loadPreferences: () => Promise<any>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  loadPreferences: async () => Promise.resolve(),
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesProps>(defaultPreferences);

  const loadPreferences = async (): Promise<PreferencesResponse> => {
    const res = await getPreferences();
    if (res.success && res.data) setPreferences(res.data);
    return res;
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, loadPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export default function usePreferencesContext(): PreferencesContextType {
  return useContext(PreferencesContext);
}
