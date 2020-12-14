import React, { ReactNode, useMemo, useState, useContext } from 'react';
import { createClientStorage } from '@/utils/storage';

interface Props {
  children: ReactNode;
}

export interface Preferences {
  theme: Theme;
  accentColor: AccentColor;
  pagingDisplay: boolean;
  fixWidth: boolean;
  fontSize: number;
  lineHeight: string;
  autoFetchNextChapter: boolean;
}

export interface PreferencesActions {
  update: (payload: Partial<Preferences>) => void;
}

export const defaultPreferences: Preferences = {
  theme: 'dark',
  accentColor: 'blue',
  pagingDisplay: true,
  fixWidth: false,
  fontSize: 18,
  lineHeight: '1.5em',
  autoFetchNextChapter: true
};

export const clientPreferencesStorage = createClientStorage<Preferences>(
  'preferences',
  defaultPreferences
);

const StateContext = React.createContext<Preferences | undefined>(undefined);
const ActionContext = React.createContext<PreferencesActions | undefined>(
  undefined
);

export function useClientPreferencesState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useClientPreferencesState must be used within a ClientPreferencesProvider'
    );
  }
  return context;
}

export function useClientPreferencesActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error(
      'useClientPreferencesActions must be used within a ClientPreferencesProvider'
    );
  }
  return context;
}

export function useClientPreferences() {
  return [useClientPreferencesState(), useClientPreferencesActions()] as const;
}

export function ClientPreferencesProvider({ children }: Props) {
  const [state, setState] = useState(clientPreferencesStorage.get());
  const actions = useMemo<PreferencesActions>(
    () => ({
      update: changes =>
        setState(curr => {
          const preferences = { ...curr, ...changes };

          if (changes.theme) {
            window.__setTheme(changes.theme);
          }

          if (changes.accentColor) {
            window.__setAccentColor(changes.accentColor);
          }

          if (typeof changes.fixWidth !== 'undefined') {
            window.__setFixWidth(changes.fixWidth);
          }

          clientPreferencesStorage.save(preferences);

          return preferences;
        })
    }),
    []
  );

  return React.createElement(
    ActionContext.Provider,
    { value: actions },
    React.createElement(StateContext.Provider, { value: state }, children)
  );
}
