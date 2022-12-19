import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDay } from './CalendarDay.js';
import { Row, Navbar, Nav, Container } from 'react-bootstrap';

// TODO: make api take in dates in request
// TODO: animation for changing of days
// TODO: make top of dates a little bit gray

/**
 * Initialises the dates
 * @param {*} numDays
 * @returns
 */
function getInitialDates(numDays = 7) {
    const days = [];
    const availibility = [];
    for (let i = 0; i < numDays; i++) {
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + i);
        days.push(nextDay);
        availibility.push(false);
    }
    return [days, availibility];
}

/**
 * Function that sets days Array to previous/next set of days
 * @param {Array} days
 * @param {*} setDays
 * @param {String} operator
 */
function setNewDays(days, setDays, operator) {
    const newDays = [];
    for (let day of days) {
        const newDay = new Date(day);
        if (operator === '+') {
            newDay.setDate(day.getDate() + days.length);
        } else if (operator === '-') {
            newDay.setDate(day.getDate() - days.length);
        } else {
            throw 'Invalid operator given to setNewDays';
        }
        newDays.push(newDay);
    }
    setDays(newDays);
}

function setAvailableDays(days, setAvailibility, daysAvailable) {
    const availibility = days.map((day) => {
        return daysAvailable.includes(day.toISOString().slice(0, 10));
    });
    setAvailibility(availibility);
}

export function Calendar(props) {
    const [initialDays, initialAvailibility] = getInitialDates();

    const [days, setDays] = useState(initialDays);
    const [availibility, setAvailibility] = useState(initialAvailibility);

    useEffect(() => {
        async function getDaysAvailable() {
            try {
                const response = await axios.get('http://localhost:9000/days');
                setAvailableDays(days, setAvailibility, response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getDaysAvailable();
    }, [days]);

    const calendarDays = days.map((day, index) => {
        const dayStr = day.toDateString().slice(0, 3);
        const dateArray = day.toISOString().slice(5, 10).split('-');
        const dateStr = `${dateArray[1]}/${dateArray[0]}`;
        return (
            <CalendarDay
                day={dayStr}
                date={dateStr}
                key={dateStr}
                isAvailable={availibility[index]}
            />
        );
    });

    return (
        <>
            <Navbar bg='light'>
                <Container>
                    <Navbar.Brand href='#home'>Balmoral House Post Collective</Navbar.Brand>
                    <Nav>
                        <Nav.Link href='#login'>Login</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Container className='justify-content-center'>
                <Row className='text-center'>{calendarDays}</Row>
                <Row className='justify-content-end'>
                    <div className='hvr-grow arrow' onClick={() => setNewDays(days, setDays, '-')}>
                        &#8592;
                    </div>
                    <div className='hvr-grow arrow' onClick={() => setNewDays(days, setDays, '+')}>
                        &#8594;
                    </div>
                </Row>
            </Container>
        </>
    );
}
