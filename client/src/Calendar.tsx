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
import { MailDropdown, UserIcon } from './Notification';

// const users = { Matt: '63b06817440bc7f56bf2f574', Gooby: '63b06817440bc7f56bf2f576' };
const users = { Matt: '63b8985155030c7a71481c51', Gooby: '63b8985155030c7a71481c53' };

function LoginNavDropdown({ currentUser, setUser }) {
    return (
        <NavDropdown title={UserIcon()} id='user-toggle'>
            <NavDropdown.Item onClick={() => setUser('Matt')}>Toggle to Matt</NavDropdown.Item>
            <NavDropdown.Item onClick={() => setUser('Gooby')}>Toggle to Gooby</NavDropdown.Item>
        </NavDropdown>
    );
}

function NavigationArrows({ days, setDays }) {
    return (
        <Row className='justify-content-end'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='2em'
                height='2em'
                fill='currentColor'
                className='hvr-grow'
                viewBox='0 0 16 16'
                onClick={() => setNewDays(days, setDays, '-')}
            >
                <path
                    fillRule='evenodd'
                    d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'
                />
            </svg>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='2em'
                height='2em'
                fill='currentColor'
                className='hvr-grow'
                viewBox='0 0 16 16'
                onClick={() => setNewDays(days, setDays, '+')}
            >
                <path
                    fillRule='evenodd'
                    d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                />
            </svg>
            {/* <div className='hvr-grow arrow' onClick={() => setNewDays(days, setDays, '-')}>
                &#8592;
            </div>
            <div className='hvr-grow arrow' onClick={() => setNewDays(days, setDays, '+')}>
                &#8594;
            </div> */}
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
    const user = users[userName];

    const calendarDays = getCalendarDaysArray(
        days,
        user,
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
                        <Row>
                            <MailDropdown userId={user} />
                        </Row>
                        <Row>
                            <LoginNavDropdown currentUser={userName} setUser={setUser} />
                        </Row>
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
