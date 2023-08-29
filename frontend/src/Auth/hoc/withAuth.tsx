

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/appContext';
import { getLogger } from '../../services/loggingService';
import { useAuthContext } from '../contexts/authContext';
import { UserType } from '../../shared/schema/user.schema';


const withAuth = (WrappedComponent: React.FunctionComponent<AuthProps> ) => {
    return (props: any) => {
        const location = useLocation();
        const navigate = useNavigate();
        const context = useAuthContext();
        const appContext = useAppContext();
        const logger = getLogger('withAuth HOC', appContext.config.logLevel);
        const [isLoggedIn, setIsLoggedIn] = useState<boolean>(context.isLoggedIn)
    
        useEffect( () => {
            logger.debug(JSON.stringify(appContext.config, null, 2))
            logger.debug("withAUTH - CHECK EXPIRED");
            (async function() {
                const currentPage = location.pathname
                context.setRedirectOnLogin(currentPage)

                const isExpired = context.checkExpired()
                if ( isExpired ) {
                    console.log("Login expired")
                    navigate( '/login' )
                } else {
                    console.log("SET LOGIN TO TRUE")
                    setIsLoggedIn(true)
                }
            }) ()
        }, []) 

        useEffect( () => {
            setIsLoggedIn(context.isLoggedIn)
        }, [context])
        


        return (
            <WrappedComponent user={context.user} isLoggedIn={isLoggedIn} {...props} />
        );
    }

}

export interface AuthProps {
    user: UserType,
    isLoggedIn: boolean
}
export default withAuth;
