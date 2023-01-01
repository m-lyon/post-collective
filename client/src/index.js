import React from 'react';
import ReactDOM from 'react-dom/client';
import { Calendar } from './Calendar.js';
import './calendar.css';
import { DateFormat } from './DateFormat.js';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Calendar initialDays={initialDates} />);
