import React, { useEffect, useState } from 'react';

import { useContext } from 'react';
import { CognitoService } from './services/CognitoService';
// import ICognitoConfig from '../models/ICognitoConfig';
import { useAuthContext } from './contexts/authContext';

import { useNavigate } from 'react-router-dom';
import  UserService  from '../services/UserService';

import { defaultUrl } from './models/IAuth';
import { useAppContext } from '../contexts/appContext';
import { UserType } from '../shared/schema/user.schema';

// the purpose of this page is to capture the return from Cognito and set tokens
const Auth: React.FC<{}> = ()  => {
    const [userLoggedIn, setUserLoggedIn] = useState<string |  null>(null)
    const context = useAuthContext()
    const navigate = useNavigate();
    const appContext = useAppContext();
    const cognito: CognitoService = new CognitoService(
        appContext.config.logLevel, 
        appContext.config.cognitoConfig.cognito_client_id
    );    


    
    useEffect( () => {
        console.log("WINDOW", window?.location );
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let [baseurl, ...rest] = window.location.href.split('#')
        const router_query = rest.join('#').split('&')
        let id_token: string = router_query[0].split('=')[1] as string
        const state: string = router_query.find(rec => rec.includes('state='))?.split('=')[1] as string 
        if (!id_token) {
            id_token = cognito.getAuthToken() ?? ""
        }
        // const { id_token, access_token, expires_in , token_type } = router.query
        console.log(`VALIDATE TOKEN: ${id_token}`);
        if (!id_token || id_token === "" ) {
            console.log("No token found - go to login page.")
            navigate('/login');
        } else {
            (async (): Promise<void> => {
                const token = cognito.parseIdToken(id_token);
                if (
                  //should also validate state from URL
                  cognito.validateToken(id_token, state, appContext.config.cognitoConfig.cognito_state) &&
                  !token.is_expired
                ) {
                  cognito.setAuthToken(id_token); //sets in localstorage
                  context.login(id_token);
                  console.log(`Set ${token.cognito_username} ${JSON.stringify(context.user)}`);

                  // TODO 
                  let user: UserType = {} as UserType;
                  try {
                      const userService: UserService = new UserService(appContext.config.backendUrl);
                      user = await userService.getUserData(token.cognito_username!, token.rawtoken)
                      console.log(`SET USER TO CONTEXT FROM AUTH: ${JSON.stringify(user)}`)
                      await context.setUserContext(user)
                  } catch (error) {
                      console.error('Could not set user');
                      console.error(error)
                  }

                  if (user && user.username) {
                      await setUserLoggedIn(user.firstname ?? user.username );
                  }
                  console.log('AUTH - TOKEN SET IN CONTEXT: ', context.token);
                  if (context.redirectOnLogin && context.redirectOnLogin !== defaultUrl) {
                    const redirectTo = context.redirectOnLogin;
                    console.log('REDIRECT: ' + context.redirectOnLogin);
                    context.setRedirectOnLogin(defaultUrl);
                    navigate(redirectTo, { replace: true });
                  } else {
                    console.log('REDIRECT to userhome');
                    navigate(defaultUrl, { replace: true });
                  }
                } else {
                  navigate('/login');
                }
            }) ()
        }
    }, [])
    
    
    
    // http://localhost:4000/auth#id_token=eyJraWQiOiJSeGJkYjkyd0dFVTB4SFhVUFl4TVo3K3NtVVRJM1FvR2hYaWc1WkM4aEVFPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiLXJ4REFQN0VDa0xQNURzd0c4dVJzZyIsInN1YiI6ImY5Y2RlZTdjLWE1OGUtNDllYy04MTE1LTY5ODA4Y2NlOWM1MSIsImF1ZCI6IjdwMWcyaG81ZXNsbTJ2ZWE3amY4bzhmMmFvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiMjM3OWNiYTEtYzA1MS00MzA4LWJmZjQtZmQ0NTZjNDY0ZmVlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDY1MDc3NTAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzg5azA2bENTQSIsImNvZ25pdG86dXNlcm5hbWUiOiJsYWltYUIiLCJleHAiOjE2MDY1MTEzNTAsImlhdCI6MTYwNjUwNzc1MCwiZW1haWwiOiJhaHNpZXQ0QHlhaG9vLmNvbSJ9.smtwylDq3PHFvC7KtOHkZ8TnnKI8lkhcffuoB2lTIhks4GxtG0syk52vkw7WR7tLTyWTDmpNTHJrb113aXFauHE2yhZMUxTwNFlWHjCMW6_lguT6F10b84JL-SgI1cGXSJzLShdHgewFPSmsvbyeXnDK18xREfHL1geizBxQT_NJGmD4KUn2DXn83C1t0sdfjY27q5F0FFb_binbPHX73UUZ-_i6Btv6oLqNFFBBAm8xyw4eAD1uuEMXyav4aDO1Q5WlBR4c2ToG6fSo7OSKGJeCe96MxdrjAsvT2Rfv_wKAfldZcwUhF9WZGo-DNJaE-Hi5mYzAVJTM_-ph9OzGQg&access_token=eyJraWQiOiJlZWVicWR3RDJBUUlZK0VFYnJVZFg2MUdzZVlHXC91Smdwd1JEM001Rlc5az0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmOWNkZWU3Yy1hNThlLTQ5ZWMtODExNS02OTgwOGNjZTljNTEiLCJldmVudF9pZCI6IjIzNzljYmExLWMwNTEtNDMwOC1iZmY0LWZkNDU2YzQ2NGZlZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2MDY1MDc3NTAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzg5azA2bENTQSIsImV4cCI6MTYwNjUxMTM1MCwiaWF0IjoxNjA2NTA3NzUwLCJ2ZXJzaW9uIjoyLCJqdGkiOiJmOThlMGQxYy00MmIwLTRjNDItODhiNC05ZWY5YWI5ZmJhYmEiLCJjbGllbnRfaWQiOiI3cDFnMmhvNWVzbG0ydmVhN2pmOG84ZjJhbyIsInVzZXJuYW1lIjoibGFpbWFCIn0.GM-heLcwtOm4uYxfLY-cWQd94TMfmwoV-MLGk_pagfZbFMyJuC3DsInIkKv5Z949YAbht_RfRBbYBTJ5M5tQ8fb1KDnNZWPBmzp7jk5ZU17PaIzvP7BXgxqhkUGhkQEqG5jnC9hdpxI9zNS_c2JVGLtGtSmUblTjBzo4LT0ijfuay9ZVKkmXvGbXvRD4tpg7V7DtBv0zlnLvohhvTKJ1lrnythpNkZMU-l5_bPbuY4SEXFrkHduscdmAK4ZMFd1ur9LA8X8-Rgp0SUDuzF-zN5F55rk6xC_CpjYgVo95M2txrTLObdqFrqJ9Q0hoejbtUymyLbEucjjed8GlfMmelg&expires_in=3600&token_type=Bearer
    // access_token=eyJraWQiOiJlZWVicWR3RDJBUUlZK0VFYnJVZFg2MUdzZVlHXC91Smdwd1JEM001Rlc5az0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmOWNkZWU3Yy1hNThlLTQ5ZWMtODExNS02OTgwOGNjZTljNTEiLCJldmVudF9pZCI6IjIzNzljYmExLWMwNTEtNDMwOC1iZmY0LWZkNDU2YzQ2NGZlZSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE2MDY1MDc3NTAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xXzg5azA2bENTQSIsImV4cCI6MTYwNjUxMTM1MCwiaWF0IjoxNjA2NTA3NzUwLCJ2ZXJzaW9uIjoyLCJqdGkiOiJmOThlMGQxYy00MmIwLTRjNDItODhiNC05ZWY5YWI5ZmJhYmEiLCJjbGllbnRfaWQiOiI3cDFnMmhvNWVzbG0ydmVhN2pmOG84ZjJhbyIsInVzZXJuYW1lIjoibGFpbWFCIn0.GM-heLcwtOm4uYxfLY-cWQd94TMfmwoV-MLGk_pagfZbFMyJuC3DsInIkKv5Z949YAbht_RfRBbYBTJ5M5tQ8fb1KDnNZWPBmzp7jk5ZU17PaIzvP7BXgxqhkUGhkQEqG5jnC9hdpxI9zNS_c2JVGLtGtSmUblTjBzo4LT0ijfuay9ZVKkmXvGbXvRD4tpg7V7DtBv0zlnLvohhvTKJ1lrnythpNkZMU-l5_bPbuY4SEXFrkHduscdmAK4ZMFd1ur9LA8X8-Rgp0SUDuzF-zN5F55rk6xC_CpjYgVo95M2txrTLObdqFrqJ9Q0hoejbtUymyLbEucjjed8GlfMmelg&
    // expires_in=3600&
    // token_type=Bearer


    //if user is logged in and has no userdata, then take them to the profile page to 
    // finish creating the user...?
    return (
        <>
            {   !userLoggedIn  ?  
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>    :
                <> 
                    <h1> Hi {userLoggedIn} ! </h1>
                    <p> Thank you for logging in.  You will be redirected shortly.  Please wait.</p>
                </>
            }
        </>
    )
}

export default Auth;