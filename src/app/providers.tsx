'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
