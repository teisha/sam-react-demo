import {createContext, useContext, useCallback,  useEffect,  useState } from 'react';
import { EnvironmentService } from '../services/environmentService';
import { ApplicationAlert } from '../models/alerts';

import { AlertColor } from '@mui/material';
import MessagePopup from '../components/Alerts/MessagePopup';
import React from 'react';




const AppContext = createContext<{
  config: EnvironmentService;
  loadConfig: () => Promise<void>;
  setAlert: (message: string, type: AlertColor, timeout?: number) => void;
}>({
  config: {} as EnvironmentService,
  loadConfig: async () => {},
  setAlert: (message: string, type: AlertColor, timeout?: number) => {}
});



export function AppContextProvider(props: { children: any }) {
  const [status, setStatus] = useState<string>('Loading');
  const [alert, setAlertMessage] = useState<ApplicationAlert>();
  const [config, setConfig] = useState<EnvironmentService>({} as EnvironmentService);

  const loadConfig = useCallback(async () => {
    if (config.backendUrl) {
      console.log('Already loaded');
      setStatus('Ready');
      return;
    }
    try {
      const env = new EnvironmentService()
      await env.load();
      console.log("CONFIG LOADED:: ", {env})
      setConfig(env);
      setStatus('Ready');
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Configuration Failed: ${error.message}`, error);
        setStatus(error.message);
      } else {
        setStatus('Error occurred');
      }
    }
  }, [setConfig, config])

  useEffect(() => {
    console.log ("FIRST APP CONTEXT - Load Config");
    (async () => {
      await loadConfig()
    })();
  }, []);



  const setAlert = (message: string, type: AlertColor, timeout?: number) =>{ 
    setAlertMessage(new ApplicationAlert(message, type, timeout))
  };
  const isReady = () => (status === 'Ready');



  return (
    <AppContext.Provider
      value={{
        config,
        loadConfig,
        setAlert,
      }}
    >
      {alert && <MessagePopup alert={alert} clear={() => setAlertMessage(undefined)} />}
      {!isReady() ? <p>Loading Configuration...{status}</p> : props.children}
    </AppContext.Provider>
  );
}

AppContext.displayName = "AppContext"

export const useAppContext = () => {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw new Error('useAppContext must be called within an AppContextProvider');
  }
  return appContext;
}

