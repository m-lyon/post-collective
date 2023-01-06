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
 * Requests offered days from other users from backend
 * @param {*} daysState
 * @param {*} userState
 * @param {*} offeredDays
 */
function getAvailableDays(daysState, userState, offers) {
    // offeredDays is undefined for initial state
    if (offers === undefined) {
        return daysState.map(() => ({ state: false }));
    }
    const otherOffers = offers.filter((data) => data.user._id !== users[userState]);
    const offeredStrDates = otherOffers.map((data) => new DateFormat(data.date).getDateStr());
    console.log(daysState, offeredStrDates);
    return daysState.map((day) => {
        if (offeredStrDates.includes(day.getDateStr())) {
            return {
                state: true,
                data: otherOffers.filter((_, index) => day.getDateStr() === offeredStrDates[index]),
            };
        }
        return { state: false };
    });
}

/**
 * Sets the availability state used in Calendar component
 * @param {*} daysState
 * @param {*} setAvailibility
 * @param {*} availableDays
 */
function setAvailableDaysState(daysState, userState, setAvailibility, offers) {
    setAvailibility(getAvailableDays(daysState, userState, offers));
}

async function getOffers(days) {
    const response = await axios.get('http://localhost:9000/offered', {
        params: {
            startDate: days[0].getDateStr(),
            endDate: days[days.length - 1].getDateStr(),
        },
    });
    return response.data;
}

/**
 * Sets the offeredDay state used in Calendar component.
 *     takes the offeredDays response from backend, sets an array
 *     of booleans for the days that are offered by the current user
 * @param {*} days
 * @param {*} setAvailibility
 * @param {*} availableDays
 */
function setOfferedDaysState(daysState, userState, setOffered, offers) {
    const offeredDates = offers
        .filter((data) => data.user._id === users[userState])
        .map((data) => new DateFormat(data.date).getDateStr());
    const isOfferedArray = daysState.map((day) => {
        return offeredDates.includes(day.getDateStr());
    });
    setOffered(isOfferedArray);
}

function setRequestedDaysState() {}

async function getRequestedDaysForUser(days, user) {
    const response = await axios.get('http://localhost:9000/requested', {
        params: {
            user: user._id,
            startDate: days[0].getDateStr(),
            endDate: days[days.length - 1].getDateStr(),
        },
    });
    return response.data;
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

function updateOfferedDayState(index, offeredDays, setOffered) {
    // Recommended to not mutate array for setState callback
    const oDays = offeredDays.map((d, i) => {
        if (i === index) {
            return !d;
        }
        return d;
    });
    setOffered(oDays);
}

function updateRequestedDayState(index, requestedDays, setRequested) {
    // TODO: this will not just be a boolean array.
    // Recommended to not mutate array for setState callback
    const rDays = requestedDays.map((d, i) => {
        if (i === index) {
            return !d;
        }
        return d;
    });
    setRequested(rDays);
}

function getCalendarDaysArray(
    days,
    availability,
    offeredDays,
    setOffered,
    requestedDays,
    setRequested
) {
    return days.map((day, index) => {
        // TODO:  wrap days.map in useMemo
        return (
            <CalendarDay
                day={day.getDayStr()}
                date={day.getDayMonthStr()}
                key={day.getDayMonthStr()}
                availability={availability[index]}
                toggleOffered={() => updateOfferedDayState(index, offeredDays, setOffered)}
                toggleRequested={() => updateRequestedDayState(index, requestedDays, setRequested)}
                isRequested={requestedDays[index]} // TODO: this will not just be a boolean array
            />
        );
    });
}

export function Calendar({ initialDays }) {
    const [user, setUser] = useState('Matt');
    const [days, setDays] = useState(initialDays);
    const [offeredDays, setOffered] = useState(initialDays.map(() => false));
    const [availability, setAvailibility] = useState(getAvailableDays(days));
    // TODO: requestedDays Array should be more than just array of bools,
    // should contain user & apt info etc.
    const [requestedDays, setRequested] = useState(initialDays.map(() => false));

    useEffect(() => {
        async function func() {
            // TODO: consider splitting this into two useEffects, one for offeredDays & available,
            // and one for requestedDays.
            const offers = await getOffers(days);
            const requestedDays = await getRequestedDaysForUser(days, user);
            setOfferedDaysState(days, user, setOffered, offers);
            setAvailableDaysState(days, user, setAvailibility, offers);
            setRequestedDaysState(requestedDays);
        }
        func();
    }, [days, user]);

    const calendarDays = getCalendarDaysArray(
        days,
        availability,
        offeredDays,
        setOffered,
        requestedDays,
        setRequested
    );

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
