import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeColors = Readonly<{
  canvas: string;
  paper: string;
  raisedPaper: string;
  checkboxPaper: string;
  ink: string;
  inverseInk: string;
  inkPressed: string;
  blueInk: string;
  blueInkDark: string;
  redInk: string;
  redInkPressed: string;
  redInkDark: string;
  filingError: string;
  approvalGreen: string;
  mutedInk: string;
  rule: string;
  marginRule: string;
  secondaryPressed: string;
  providerBackground: string;
  providerPressed: string;
  providerInk: string;
  providerDisabledBackground: string;
  providerDisabledBorder: string;
  providerDisabledInk: string;
  scrim: string;
}>;

export type ThinkSoTheme = Readonly<{
  name: 'light' | 'dark';
  dark: boolean;
  colors: ThemeColors;
}>;

export const lightTheme: ThinkSoTheme = {
  name: 'light',
  dark: false,
  colors: {
    canvas: '#e6e3db',
    paper: '#f4f2ec',
    raisedPaper: '#fdfcf8',
    checkboxPaper: '#fffdf7',
    ink: '#14171f',
    inverseInk: '#f4f2ec',
    inkPressed: '#202437',
    blueInk: '#2438c9',
    blueInkDark: '#1b2a8f',
    redInk: '#b0442f',
    redInkPressed: '#9e3c2a',
    redInkDark: '#8f3423',
    filingError: '#f4ccd4',
    approvalGreen: '#2f9e52',
    mutedInk: 'rgba(20,23,31,0.62)',
    rule: 'rgba(20,23,31,0.28)',
    marginRule: 'rgba(186,96,86,0.5)',
    secondaryPressed: '#ecebf2',
    providerBackground: '#000000',
    providerPressed: '#1a1a1a',
    providerInk: '#ffffff',
    providerDisabledBackground: 'rgba(20,23,31,0.07)',
    providerDisabledBorder: 'rgba(20,23,31,0.22)',
    providerDisabledInk: 'rgba(20,23,31,0.4)',
    scrim: 'rgba(20,23,31,0.35)',
  },
};

export const darkTheme: ThinkSoTheme = {
  name: 'dark',
  dark: true,
  colors: {
    canvas: '#101014',
    paper: '#18181d',
    raisedPaper: '#232329',
    checkboxPaper: '#292930',
    ink: '#f1eee6',
    inverseInk: '#18181d',
    inkPressed: '#d9d5cc',
    blueInk: '#8798ff',
    blueInkDark: '#aab5ff',
    redInk: '#ff856f',
    redInkPressed: '#e76f5b',
    redInkDark: '#ffad9e',
    filingError: '#512d36',
    approvalGreen: '#70d58c',
    mutedInk: 'rgba(241,238,230,0.66)',
    rule: 'rgba(241,238,230,0.25)',
    marginRule: 'rgba(255,133,111,0.48)',
    secondaryPressed: '#30303a',
    providerBackground: '#f4f4f4',
    providerPressed: '#dddddd',
    providerInk: '#111111',
    providerDisabledBackground: 'rgba(241,238,230,0.08)',
    providerDisabledBorder: 'rgba(241,238,230,0.24)',
    providerDisabledInk: 'rgba(241,238,230,0.42)',
    scrim: 'rgba(0,0,0,0.62)',
  },
};

export type ThemeMode = 'system' | 'light' | 'dark';

const ThemeContext = createContext<ThinkSoTheme>(lightTheme);

export function ThinkSoThemeProvider({
  children,
  mode = 'system',
}: {
  children: ReactNode;
  mode?: ThemeMode;
}) {
  const systemScheme = useColorScheme();
  const theme = useMemo(
    () =>
      mode === 'dark' || (mode === 'system' && systemScheme === 'dark') ? darkTheme : lightTheme,
    [mode, systemScheme],
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useThinkSoTheme(): ThinkSoTheme {
  return useContext(ThemeContext);
}
