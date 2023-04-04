import axios from 'axios';
import { useEffect, useState, useContext, useCallback } from 'react';
import { getCalendarDaysArray } from './CalendarDay';
import { Row, Container } from 'react-bootstrap';
import { DateFormat } from './DateFormat.js';
import { getOffers, setOfferedDays } from './offers';
import { getRequestedDaysForUser, setRequestedDays } from './requests';
import { Offer, OfferedDays, RequestedDays } from './types';
import { AvailableDays } from './types';
import { SetDaysFunction } from './types';
import { BHNavbar } from './BHNavbar';
import { UserContext } from './context/UserContext';
import { getConfig } from './utils';

function NavigationArrows({ days, setDays }) {
    return (
        <Row className='justify-content-end'>
            <div className='svg-arrow'>
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
            </div>
            <div className='svg-arrow'>
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
            </div>
        </Row>
    );
}

/**
 * Requests offered days from other users from backend
 */
function getAvailableDaysArray(
    userId: string,
    daysState: DateFormat[],
    offers: Offer[]
): AvailableDays {
    const otherOffers = offers
        .filter((data) => data.user._id !== userId)
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

export function MainPage({ initialDays }) {
    const [days, setDays] = useState<DateFormat[]>(initialDays);
    const [offeredDays, setOffered] = useState<OfferedDays>(days.map(() => null));
    const [availability, setAvailability] = useState<AvailableDays>(days.map(() => []));
    const [requestedDays, setRequested] = useState<RequestedDays>(days.map(() => null));
    const [userContext, setUserContext] = useContext(UserContext);

    const fetchUserDetails = useCallback(async () => {
        axios
            .get(`${process.env.SERVER_ADDR}/users/me`, getConfig(userContext.token))
            .then(async (res) => {
                const data = await res.data;
                setUserContext((oldValues) => {
                    return { ...oldValues, details: data };
                });
            });
    }, [userContext.token, setUserContext]);

    useEffect(() => {
        if (!userContext.details) {
            fetchUserDetails();
        }
    }, [userContext.details, fetchUserDetails]);

    const setCalendarState = useCallback(async () => {
        if (userContext.token && userContext.details) {
            const offers = await getOffers(userContext.token, days);
            const userRequests = await getRequestedDaysForUser(userContext.token, days);
            setAvailability(getAvailableDaysArray(userContext.details._id, days, offers));
            setOfferedDays(days, userContext.details._id, setOffered, offers);
            setRequestedDays(days, setRequested, userRequests);
        }
    }, [userContext.token, userContext.details, days]);

    useEffect(() => {
        setCalendarState();
    }, [setCalendarState]);

    console.log('offeredDays', offeredDays);
    console.log('requestedDays', requestedDays);

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
            <BHNavbar user={user} setUser={setUser} isLoggedIn={true} />
            <Container className='justify-content-center'>
                <Row className='text-center'>{calendarDays}</Row>
                <NavigationArrows days={days} setDays={setDays} />
            </Container>
        </>
    );
}
