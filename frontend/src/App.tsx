import { CssBaseline, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { deepPurple, teal } from '@mui/material/colors';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import AuthProvider from './Auth/contexts/authContext';
import { AppContextProvider } from './contexts/appContext';
import { router } from './routes/routes';
import React from 'react';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: deepPurple[400],
        light: deepPurple[200],
        dark: deepPurple[800],
        contrastText: '#000',
      },
      secondary: {
        main: teal[500],
        light: teal[300],
        dark: teal[800],
        contrastText: '#000',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContextProvider>
        <AuthProvider>
          <RouterProvider router={router} fallbackElement={<LinearProgress />} />
        </AuthProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default App;
