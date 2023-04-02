import { DateFormat } from './DateFormat.js';
import { useContext } from 'react';
import { MainPage } from './MainPage';
import { UserContext } from './context/UserContext';
import LoginPage from './LoginPage';

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
    const [userContext] = useContext(UserContext);

    if (userContext.token) {
        return <MainPage initialDays={initialDates} />;
    }
    return <LoginPage />;
}