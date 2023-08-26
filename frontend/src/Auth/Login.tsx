import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/appContext';
import { useAuthContext } from './contexts/authContext';

import IUser from '../shared/models/IUser';
import { CognitoService } from './services/CognitoService';

import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLogger } from '../services/loggingService';
import UserService from '../services/UserService';
import IAuthToken from './models/IAuthToken';
import LoginIcon from '@mui/icons-material/Login';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import React from 'react';

const Login = () => {
  console.log('Login through Cognito');
  const navigate = useNavigate();
  const appContext = useAppContext();
  const context = useAuthContext();
  const logger = getLogger('Login', appContext.config.logLevel);
  const cognito = new CognitoService(
    appContext.config.logLevel,
    appContext.config.cognitoConfig.cognito_client_id,
  );

  // if not cognitoService .isloggeedIn, then call cognitoService.redirectToLogin

  // otherwise, user is logged in, so go to landing page
  // const initialValues: LoginInputs = { email: '', password: '', };

  const [error, setError] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState<IUser | null>(null);

  console.log('LOGIN PAGE', appContext.config);

  const handleSubmit = async (e: any): Promise<void> => {
    try {
      const url = cognito.getRedirectToSignInUrl(appContext.config.cognitoConfig);
      logger.debug('Go to URL:: ' + url);
      window.location.href = url;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const goHome = () => {
    navigate('/index', { replace: true });
  };

  useEffect(() => {
    console.log(`Check token in localstorage: ${cognito.isUserSignedIn()}`);
    const authToken = cognito.getAuthToken();
    if (authToken && typeof authToken !== 'undefined' && authToken !== null) {
      const token = cognito.parseIdToken(authToken);
      console.log(`CALL LOGIN = SET CONTEXT ${JSON.stringify(token.cognito_username)}`);

      (async function () {
        console.log('CALL CONTEXT - SET TOKEN TO GLOBALSTATE');
        context.login(cognito.getAuthToken()!);
        console.log(`After context: ${JSON.stringify(context.token)}`);
      })();
      console.log(`Check login: ${JSON.stringify(token)}`);
    }
  }, []);

  useEffect(() => {
    (async function () {
      if (context.isLoggedIn) {
        const token: IAuthToken = context.token!;
        const username = token.cognito_username;

        console.log('TOKEN IS VALID; GETTING USER INFO FOR ' + username);
        let user: IUser = {} as IUser;
        try {
          const userService: UserService = new UserService(appContext.config.backendUrl);
          user = await userService.getUserData(username || '', token.rawtoken);
          console.log(`SET CONTEXT USER: ${JSON.stringify(user)}`);
          await context.setUserContext(user);
          setUserLoggedIn(user);
        } catch (error) {
          console.error('Could not set user');
          console.error(error);
        }
        navigate(context.redirectOnLogin, { replace: true });
      }
      console.log(`Check login state: ${JSON.stringify(context.token)}`);
    })();
  }, [context.isLoggedIn]);

  // need ability to create user:
  return (
    <Box sx={{ p: 1 }}>
      {error ? <p>Error: {error}</p> : null}

      <p>
        {context.isLoggedIn ? (
          <>
            <Button variant='contained' color='success' size='small'>
              <LoginIcon /> Yes
            </Button>
          </>
        ) : (
          <Button variant='contained' color='error' size='small'>
            <LockPersonIcon /> No
          </Button>
        )}
      </p>
      <p>
        {userLoggedIn ? (
          <Typography>Registered login to: {userLoggedIn.firstname}</Typography>
        ) : (
          <Typography>User is Not Logged In</Typography>
        )}
      </p>

      {/* Option for Signup - use AdminCreateUser or SignUp action from aws-sdk */}
      {/* Makes sure emails are lowercased */}
      {/* https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html */}
      {/* https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_SignUp.html
       */}
      {userLoggedIn ? (
        <>
          <h1> {userLoggedIn.firstname || userLoggedIn.username} IS LOGGED IN </h1>
          <Button variant='contained' onClick={goHome}>
            Home
          </Button>
        </>
      ) : (
        <>
          <Button variant='outlined' size='large' onClick={handleSubmit}>
            Click HERE to Log In
          </Button>
        </>
      )}
    </Box>
  );
};

export default Login;
