import { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDay } from './CalendarDay.js';
import { Row, Navbar, Nav, Container } from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { DateFormat } from './DateFormat.js';

// const users = { Matt: '63b06817440bc7f56bf2f574', Gooby: '63b06817440bc7f56bf2f576' };
const users = { Matt: '63b8985155030c7a71481c51', Gooby: '63b8985155030c7a71481c53' };

// TODO: NEXT - continue adding type info
// TODO: NEXT - add functionality to cancel request
// TODO: NEXT - add functionality to offer pickup

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

// TODO: refactor to remove state from AvailableDay & RequestedDay
interface User {
    _id: string;
    aptNum?: number;
}

interface Offer {
    _id: string;
    date: string;
    user: User;
}

/**
 * This is the raw response sent back from the API
 */
interface RequestResponse {
    date: Date;
    offeredDate: string;
    user: User;
    _id: string;
}

/**
 * This is a parsed request object
 */
interface Request {
    date: string;
    user: User;
    offeredDate: string;
}

/**
 *
 */
type RequestedDays = {
    state: boolean;
    data?: Request;
}[];

type AvailableDays = {
    state: boolean;
    data?: Offer[];
}[];

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
            return {
                state: true,
                data: otherOffers.filter((_, index) => day.getDateStr() === otherOfferDates[index]),
            };
        } else {
            return { state: false };
        }
    });
}

type SetAvailabilityFunction = (availableDays: AvailableDays) => void;
type SetOfferedFunction = (offered: boolean[]) => void;
type SetRequestedFunction = (requested: RequestedDays) => void;

async function getOffers(days: DateFormat[]): Promise<Offer[]> {
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
 */
function setOfferedDaysArray(
    daysState: DateFormat[],
    user: string,
    setOffered: SetOfferedFunction,
    offers: Offer[]
): void {
    const offeredDates = offers
        .filter((data) => data.user._id === user)
        .map((data) => new DateFormat(data.date).getDateStr());
    const isOfferedArray = daysState.map((day) => {
        return offeredDates.includes(day.getDateStr());
    });
    setOffered(isOfferedArray);
}

function setRequestedDaysArray(
    daysState: DateFormat[],
    setRequested: SetRequestedFunction,
    requestedDays: Request[]
): void {
    const requestedDates = requestedDays.map((data) => new DateFormat(data.date).getDateStr());
    const requestedDaysArray = daysState.map((day) => {
        if (requestedDates.includes(day.getDateStr())) {
            return {
                state: true,
                data: requestedDays.find((_, index) => {
                    return day.getDateStr() === requestedDates[index];
                }),
            };
        } else {
            return { state: false };
        }
    });
    console.log(requestedDays, requestedDaysArray);
    setRequested(requestedDaysArray);
}

async function getRequestedDaysForUser(daysState: DateFormat[], user: string): Promise<Request[]> {
    const response = await axios.get('http://localhost:9000/requested', {
        params: {
            user: user,
            startDate: daysState[0].getDateStr(),
            endDate: daysState[daysState.length - 1].getDateStr(),
        },
    });
    return response.data;
}

/**
 * Function that sets days Array to previous/next set of days
 * @param {Array} daysState
 * @param {*} setDays
 * @param {String} operator
 */
function setNewDays(daysState: DateFormat[], setDays, operator) {
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

function updateOfferedDayState(index, offeredDays, setOffered) {
    // Recommended to not mutate array for setState callback
    console.log('updateOfferedDayState has been called.');
    const oDays = offeredDays.map((d, i) => {
        if (i === index) {
            return !d;
        }
        return d;
    });
    setOffered(oDays);
}

function updateRequestedDayState(
    index: number,
    requestResponse: RequestResponse,
    requestedDays: RequestedDays,
    setRequested
): void {
    // Recommended to not mutate array for setState callback
    console.log('updateRequestedDayState has been called.');
    const updatedRequestedDays = requestedDays.map((requestedDay, i) => {
        if (i === index) {
            if (requestedDay.state) {
                return { state: false };
            }
            const { date, user, offeredDate } = requestResponse;
            const request = {
                date: new DateFormat(date).getDateStr(),
                user: user,
                offeredDate: offeredDate,
            } satisfies Request;
            return { state: true, data: request };
        }
        return requestedDay;
    });
    setRequested(updatedRequestedDays);
}

function getCalendarDaysArray(
    days: DateFormat[],
    user: string,
    availability: AvailableDays,
    offeredDays: boolean[],
    setOffered,
    requestedDays: RequestedDays,
    setRequested
) {
    return days.map((day, index) => {
        // TODO:  wrap days.map in useMemo
        return (
            <CalendarDay
                day={day.getDayStr()}
                user={user}
                date={day.getDayMonthStr()}
                key={day.getDayMonthStr()}
                availability={availability[index]}
                toggleOffered={() => updateOfferedDayState(index, offeredDays, setOffered)}
                toggleRequested={(request: RequestResponse) =>
                    updateRequestedDayState(index, request, requestedDays, setRequested)
                }
                requested={requestedDays[index]}
            />
        );
    });
}

export function Calendar({ initialDays }) {
    const [userName, setUser] = useState('Matt');
    const [days, setDays] = useState(initialDays);
    const [offeredDays, setOffered] = useState(days.map(() => false));
    const [availability, setAvailability] = useState(days.map(() => ({ state: false })));
    const [requestedDays, setRequested] = useState(days.map(() => ({ state: false })));

    useEffect(() => {
        async function func() {
            // TODO: consider splitting this into two useEffects, one for offeredDays & available,
            // and one for requestedDays.
            const offers = await getOffers(days);
            const requested = await getRequestedDaysForUser(days, users[userName]);
            setAvailability(getAvailableDaysArray(days, users[userName], offers));
            setOfferedDaysArray(days, users[userName], setOffered, offers);
            setRequestedDaysArray(days, setRequested, requested);
        }
        func();
    }, [days, userName]);

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
