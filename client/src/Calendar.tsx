import { useEffect, useState } from 'react';
import { getCalendarDaysArray } from './CalendarDay';
import { Row, Navbar, Nav, Container } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DateFormat } from './DateFormat.js';

import { getOffers, setOfferedDays } from './offers';
import { getRequestedDaysForUser, setRequestedDays } from './requests';
import { Offer, OfferedDays, RequestedDays } from './types';
import { AvailableDays } from './types';
import { SetDaysFunction } from './types';

// const users = { Matt: '63b06817440bc7f56bf2f574', Gooby: '63b06817440bc7f56bf2f576' };
const users = { Matt: '63b8985155030c7a71481c51', Gooby: '63b8985155030c7a71481c53' };

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
 */
function getAvailableDaysArray(
    daysState: DateFormat[],
    user: string,
    offers: Offer[]
): AvailableDays {
    const otherOffers = offers
        .filter((data) => data.user._id !== user)
        .map((data) => {
            return {
                date: new DateFormat(data.date).getDateStr(),
                _id: data._id,
                user: data.user,
            };
        });
    const otherOfferDates = otherOffers.map((offer) => offer.date);
    return daysState.map((day) => {
        if (otherOfferDates.includes(day.getDateStr())) {
            return otherOffers.filter((_, index) => day.getDateStr() === otherOfferDates[index]);
        } else {
            return [];
        }
    });
}

/**
 * Function that sets days Array to previous/next set of days
 */
function setNewDays(daysState: DateFormat[], setDays: SetDaysFunction, operator: string) {
    const newDays = [];
    for (let day of daysState) {
        const newDay = new DateFormat(day);
        if (operator === '+') {
            newDay.setDate(day.getDate() + daysState.length);
        } else if (operator === '-') {
            newDay.setDate(day.getDate() - daysState.length);
        } else {
            throw new Error('Invalid operator given to setNewDays');
        }
        newDays.push(newDay);
    }
    setDays(newDays);
}

export function Calendar({ initialDays }) {
    const [userName, setUser] = useState('Matt');
    const [days, setDays] = useState<DateFormat[]>(initialDays);
    const [offeredDays, setOffered] = useState<OfferedDays>(days.map(() => null));
    const [availability, setAvailability] = useState<AvailableDays>(days.map(() => []));
    const [requestedDays, setRequested] = useState<RequestedDays>(days.map(() => null));

    useEffect(() => {
        async function func() {
            // TODO: consider splitting this into two useEffects, one for offeredDays & available,
            // and one for requestedDays.
            const offers = await getOffers(days);
            const userRequests = await getRequestedDaysForUser(days, users[userName]);
            setAvailability(getAvailableDaysArray(days, users[userName], offers));
            setOfferedDays(days, users[userName], setOffered, offers);
            setRequestedDays(days, setRequested, userRequests);
        }
        func();
    }, [days, userName]);

    console.log('offeredDays', offeredDays);
    console.log('requestedDays', requestedDays);

    const calendarDays = getCalendarDaysArray(
        days,
        users[userName],
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
                        <LoginNavDropdown currentUser={userName} setUser={setUser} />
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
