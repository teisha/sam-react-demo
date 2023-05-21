import { createContext, PropsWithChildren, useState, useReducer, useContext } from 'react';
import IAuthToken from '../models/IAuthToken';
import IUser from '../../shared/models/IUser';
import { CognitoService } from '../services/CognitoService';
import { tokenReducer, TokenActions, isTokenExpired } from './token-reducer';
import { defaultUrl } from '../models/IAuth';
import { useAppContext } from '../../contexts/appContext';

const AuthContext = createContext<{
  user: IUser | null;
  token: IAuthToken | null;
  login: (_token: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
  setUserContext: (user: IUser) => void;
  checkExpired: () => boolean;
  redirectOnLogin: string;
  setRedirectOnLogin: (url: string) => void;
}>({
  user: null,
  token: null,
  login: (_token: string): void => {},
  logout: (): void => {},
  isLoggedIn: false,
  setUserContext: (user: IUser): void => {},
  checkExpired: (): boolean => {
    return true;
  },
  redirectOnLogin: defaultUrl,
  setRedirectOnLogin: (url: string): void => {},
});



const AuthProvider: React.FC<PropsWithChildren<any>> = (props: PropsWithChildren<any>) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authTokenState, tokenDispatch] = useReducer(tokenReducer, {token: null} );
    const [user, setUser] = useState<IUser | null >(null)
    const [redirectOnLogin, setRedirectOnLogin] = useState<string>(defaultUrl)
    const appContext = useAppContext()

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const login = async (token: string) => {
        const cognito = new CognitoService(
            appContext.config.logLevel,
            appContext.config.cognitoConfig.cognito_client_id
        );
        const authToken: IAuthToken = cognito.parseIdToken(token)
        
        console.log(`CONTEXT SET FROM TOKEN STRING ${JSON.stringify(authToken)}`)
        await tokenDispatch({ type: TokenActions.LOGIN, token: authToken });
        if (!authToken.is_expired) {
            setIsLoggedIn(true);
        }
        console.log(`TOKEN In Global State: ${JSON.stringify(authTokenState)}`)
    };
    
    const checkExpired = () : boolean => { 
        let isExpired = true;
        if (authTokenState.token != null) {
            isExpired = isTokenExpired(authTokenState.token);
            tokenDispatch({ type: TokenActions.CHECK_EXPIRED });
            setIsLoggedIn(!isExpired)
            return isExpired
        }
        if (isExpired) {
            setIsLoggedIn(false)
        }
        return isExpired
    };

    const logout = () => {
        console.log('Logout')
        tokenDispatch({type: TokenActions.LOGOUT});
        setUser(null)
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token: authTokenState.token,
                login,
                logout,
                isLoggedIn,
                setUserContext: setUser,
                checkExpired,
                redirectOnLogin,
                setRedirectOnLogin
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

AuthContext.displayName = 'AuthContext';
export default AuthProvider
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be called within an AuthProvider');
  }
  return context;
};
