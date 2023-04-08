import { DateFormat } from './DateFormat';
import { useContext, useCallback, useEffect } from 'react';
import { MainPage } from './MainPage';
import { UserContext } from './context/UserContext';
import { LoginPage } from './LoginPage';
import axios from 'axios';
import { getConfig } from './utils';

function getInitialDates(numDays = 7) {
    const days = [];
    const availibility = [];
    for (let i = 0; i < numDays; i++) {
        const nextDay = new DateFormat();
        nextDay.setDate(nextDay.getDate() + i);
        days.push(nextDay);
        availibility.push(false);
    }
    return days;
}

const initialDates = getInitialDates();

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
                        return { ...oldValues, token: data.token };
                    });
                } else {
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: null };
                    });
                    console.log('Something went wrong');
                }
                // call refreshToken every 5 minutes to renew the authentication token.
                setTimeout(verifyUser, 5 * 60 * 1000);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setUserContext((oldValues) => {
                        return { ...oldValues, token: null };
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
        console.log('loading MainPage');
        return <MainPage initialDays={initialDates} />;
    }
    return <LoginPage />;
}
