import { CssBaseline, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { purple, brown } from '@mui/material/colors';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import AuthProvider from './Auth/contexts/authContext';
import { AppContextProvider } from './contexts/appContext';
import { router } from './routes/routes';
import React from 'react';
import MessagePopup from './components/Alerts/MessagePopup';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: purple[400],
        light: purple[100],
        dark: purple[800],
        contrastText: brown[900],
      },
      secondary: {
        main: brown[500],
        light: brown[100],
        dark: brown[900],
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
