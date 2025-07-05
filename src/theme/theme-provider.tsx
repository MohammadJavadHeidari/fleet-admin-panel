import type { ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles';

import { useEffect } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

import rtlPlugin from '@mui/stylis-plugin-rtl';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { createTheme } from './create-theme';

import type {} from './extend-theme-types';
import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export type ThemeProviderProps = Partial<MuiThemeProviderProps> & {
  themeOverrides?: ThemeOptions;
};

const cacheRtl = createCache({
  key: 'rtl',
  prepend: true,
  stylisPlugins: [rtlPlugin],
});

export function ThemeProvider({ themeOverrides, children, ...other }: ThemeProviderProps) {
  const theme = createTheme({ themeOverrides });

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
  }, []);

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...other}>
      <CssBaseline />
      <CacheProvider value={cacheRtl}>{children}</CacheProvider>
    </ThemeVarsProvider>
  );
}
