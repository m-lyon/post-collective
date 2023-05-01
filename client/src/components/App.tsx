import axios from 'axios';

import { useContext, useCallback, useEffect } from 'react';
import { MainPage } from './MainPage';
import { UserContext } from '../context/UserContext';
import { LoginPage } from './LoginPage';
import { VerifyPage } from './VerifyPage';
import { ModalProviders } from '../context/ModalContext';

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
                    console.log('Something went wrong');
                }
                // call refreshToken every 5 minutes to renew the authentication token.
                setTimeout(verifyUser, 5 * 60 * 1000);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: null, details: null };
                    });
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
            return (
                <ModalProviders>
                    <MainPage />
                </ModalProviders>
            );
        } else {
            return <VerifyPage />;
        }
    }
    return <LoginPage />;
}
