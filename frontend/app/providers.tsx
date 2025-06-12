'use client';

import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Tailwind blue-600
    },
    secondary: {
      main: '#7c3aed', // Tailwind purple-600
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#2563eb',
        },
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 