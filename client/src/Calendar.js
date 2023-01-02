import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDay } from './CalendarDay.js';
import { Row, Navbar, Nav, Container } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DateFormat } from './DateFormat.js';

const users = { Matt: '63b06817440bc7f56bf2f574', Gooby: '63b06817440bc7f56bf2f576' };

//      - Write logic to request offered & requested data from db, populate variables
//      - Write logic to change buttons/info based on this data (e.g modal options, whether buttons are greyed out etc)

//      - Write React logic for offered date
//      - Write logic to show requested & offered for both users

// TODO: incorporate css clamp(min, vw, max) function into calendar day.
// TODO: animation for changing of days
// TODO: make top of dates a little bit gray
// TODO: make login
// TODO: messages functionality where user offering gets message of new dropoff request.
// TODO: write logic for booking

function LoginNavDropdown({ currentUser, setUser }) {
    return (
        <NavDropdown title={`User: ${currentUser}`} id='user-toggle'>
            <NavDropdown.Item onClick={() => setUser('Matt')}>Toggle to Matt</NavDropdown.Item>
            <NavDropdown.Item onClick={() => setUser('Gooby')}>Toggle to Gooby</NavDropdown.Item>
        </NavDropdown>
    );
}

function NavigationArrows({ days, setDays }) {
    return (
        <Row className='justify-content-end'>
            <div className='hvr-grow arrow' onClick={() => setNewDays(days, setDays, '-')}>
                &#8592;
            </div>
            <div className='hvr-grow arrow' onClick={() => setNewDays(days, setDays, '+')}>
                &#8594;
            </div>
        </Row>
    );
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
        const newDay = new DateFormat(day);
        if (operator === '+') {
            newDay.setDate(day.getDate() + days.length);
        } else if (operator === '-') {
            newDay.setDate(day.getDate() - days.length);
        } else {
            throw new Error('Invalid operator given to setNewDays');
        }
        newDays.push(newDay);
    }
    setDays(newDays);
}

function setAvailableDays(days, setAvailibility, offeredDates) {
    const daysAvailable = offeredDates.map((offer) => offer.date.getDateStr());
    const availibility = days.map((day) => {
        return daysAvailable.includes(day.getDateStr());
    });
    setAvailibility(availibility);
}

export function Calendar({ initialDays }) {
    const [user, setUser] = useState('Matt');
    const [days, setDays] = useState(initialDays);
    const [availibility, setAvailibility] = useState(initialDays.map(() => false));
    const [requestedDays, setDaysRequested] = useState(initialDays.map(() => false));
    const [offeredDays, setDaysOffered] = useState(initialDays.map(() => false));

    useEffect(() => {
        async function getDaysAvailable() {
            try {
                const response = await axios.get('http://localhost:9000/offered', {
                    params: {
                        startDate: days[0].getDateStr(),
                        endDate: days[days.length - 1].getDateStr(),
                    },
                });
                const availableDays = response.data
                    .filter((data) => data.user._id !== users[user])
                    .map((data) => {
                        return { date: new DateFormat(data.date), aptNum: data.user.aptNum };
                    });
                setAvailableDays(days, setAvailibility, availableDays);
            } catch (error) {
                console.error(error);
            }
        }
        getDaysAvailable();
    }, [days, user]);

    const calendarDays = days.map((day, index) => {
        // TODO:  wrap days.map in useMemo
        return (
            <CalendarDay
                day={day.getDayStr()}
                date={day.getDayMonthStr()}
                key={day.getDayMonthStr()}
                isAvailable={availibility[index]}
                toggleOffered={() => {
                    // Recommended to not mutate array for setState callback
                    const oDays = offeredDays.map((d, i) => {
                        if (i === index) {
                            return !d;
                        }
                        return d;
                    });
                    setDaysOffered(oDays);
                }}
                toggleRequested={() => {
                    // Recommended to not mutate array for setState callback
                    const rDays = requestedDays.map((d, i) => {
                        if (i === index) {
                            return !d;
                        }
                        return d;
                    });
                    setDaysRequested(rDays);
                }}
                isRequested={requestedDays[index]}
            />
        );
    });

    return (
        <>
            <Navbar bg='light'>
                <Container>
                    <Navbar.Brand href='#home'>Balmoral House Post Collective</Navbar.Brand>
                    <Nav>
                        <LoginNavDropdown currentUser={user} setUser={setUser} />
                    </Nav>
                </Container>
            </Navbar>
            <Container className='justify-content-center'>
                <Row className='text-center'>{calendarDays}</Row>
                <NavigationArrows days={days} setDays={setDays} />
            </Container>
        </>
    );
}
