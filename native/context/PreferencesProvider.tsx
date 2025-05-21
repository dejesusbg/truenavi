import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getPreferences, PreferencesProps, PreferencesResponse } from '~/services';

export interface PreferencesContextType {
  preferences: PreferencesProps | null;
  loadPreferences: () => Promise<any>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: null,
  loadPreferences: async () => Promise.resolve(),
});

/**
 * Provides the Preferences context to its child components.
 *
 * This provider is responsible for loading and storing user preferences,
 * making them accessible throughout the component tree via the PreferencesContext.
 * It fetches preferences asynchronously on mount and exposes both the current preferences
 * and a function to reload them.
 *
 * @param children - The React node(s) that will have access to the preferences context.
 * @returns A context provider wrapping the given children.
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesProps | null>(null);

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
