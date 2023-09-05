import { Box, Button } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/appContext';
import { CognitoService } from './services/CognitoService';
import { getLogger } from '../services/loggingService';
import FormButton from '../components/Form/FormButton';

const Logout = () => {
  const navigate = useNavigate();
  const appContext = useAppContext();
  const cognito = new CognitoService(
    appContext.config.logLevel,
    appContext.config.cognitoConfig.cognito_client_id,
  );
  const logger = getLogger('Login', appContext.config.logLevel);

  const goHome = () => {
    navigate('/index', { replace: true });
  };

  const logout = async (e: any): Promise<void> => {
    try {
      const url = cognito.getLogoutUrl(appContext.config.cognitoConfig);
      logger.debug('Go to URL:: ' + url);
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        // setError(err.message);
        goHome();
      }
    }
  };

  return (
    <Box sx={{ ml: 1 }}>
      <p>Click Button to Log Out</p>
      <Link style={{ textDecoration: 'none' }} to='/home'>
        <FormButton variant='contained' onClick={logout}>
          Log Out
        </FormButton>
      </Link>
    </Box>
  );
};

export default Logout;
