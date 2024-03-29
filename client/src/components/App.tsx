import axios from 'axios';

import { useContext, useCallback, useEffect } from 'react';
import { MainPage } from './MainPage';
import { UserContext } from '../context/UserContext';
import { LoginPage } from './LoginPage';
import { VerifyPage } from './VerifyPage';

export function App() {
    const [userContext, setUserContext] = useContext(UserContext);

    const verifyUser = useCallback(() => {
        axios
            .post(
                `${process.env.REACT_APP_API_ENDPOINT}/users/refreshToken`,
                {},
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: data.token, details: data.user };
                    });
                } else {
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: null, details: null };
                    });
                }
                // call refreshToken every 5 minutes to renew the authentication token.
                setTimeout(verifyUser, 5 * 60 * 1000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: null, details: null };
                    });
                } else {
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: null, details: null };
                    });
                    console.log('unknown error');
                }
            });
    }, [setUserContext]);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    const syncLogout = useCallback((e) => {
        if (e.key === 'logout') {
            window.location.reload();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', syncLogout);
        return () => {
            window.removeEventListener('storage', syncLogout);
        };
    }, [syncLogout]);

    if (userContext.token) {
        if (userContext.details.isVerified) {
            return <MainPage />;
        } else {
            return <VerifyPage />;
        }
    } else if (userContext.token === null) {
        return <LoginPage />;
    } else {
        return <div></div>;
    }
}
