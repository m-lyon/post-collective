import { useEffect, useState, useContext, useCallback } from 'react';
import { Row, Container } from 'react-bootstrap';
import { getOffers, setOfferedDays } from '../utils/offers';
import { getRequestedDaysForUser, setRequestedDays } from '../utils/requests';
import { Offer, OfferedDays, RequestedDays } from '../utils/types';
import { AvailableDays } from '../utils/types';
import { BHNavbar } from './BHNavbar';
import { UserContext } from '../context/UserContext';
import { DateFormat, getInitialDates } from '../utils/dates';
import { NavigationArrows } from './NavigationArrows';
import { Request } from '../utils/types';
import { toggleOfferedDay } from '../utils/offers';
import { toggleRequestedDay } from '../utils/requests';
import { CalendarDay } from './CalendarDay';
import { DropoffModalProvider } from '../context/ReservationModalContext';
import { DisplayContext } from '../context/DisplayContext';
import { AnimatePresence } from 'framer-motion';

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
                date: data.date,
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

export function MainPage(props) {
    const [userContext] = useContext(UserContext);
    const [days, setDays] = useState<DateFormat[]>([]);
    const [offeredDays, setOffered] = useState<OfferedDays>(() => days.map(() => null));
    const [availability, setAvailability] = useState<AvailableDays>(() => days.map(() => []));
    const [requestedDays, setRequested] = useState<RequestedDays>(() => days.map(() => null));
    const isMobile = useContext(DisplayContext);

    useEffect(() => {
        setDays((days) => {
            if (days.length > 0) {
                return getInitialDates(isMobile, days[0]);
            }
            return getInitialDates(isMobile);
        });
    }, [isMobile]);

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

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCalendarState();
        }, 30 * 1000); // 30s in milliseconds
        return () => clearInterval(intervalId);
    }, [setCalendarState]);

    const getCalendarDaysArray = useCallback(() => {
        return days.map((day, index) => {
            return (
                <CalendarDay
                    date={day}
                    key={day.getDateStr()}
                    availability={availability[index]}
                    toggleOffered={(offer: Offer) => toggleOfferedDay(index, offer, setOffered)}
                    toggleRequested={(request: Request) =>
                        toggleRequestedDay(index, request, setRequested)
                    }
                    request={requestedDays[index]}
                    offer={offeredDays[index]}
                />
            );
        });
    }, [availability, days, offeredDays, requestedDays]);

    const calendarDays = getCalendarDaysArray();

    return (
        <DropoffModalProvider>
            <BHNavbar />
            <AnimatePresence initial={true}>
                <Container>
                    <div className='calendar-div'>
                        <Row className='text-center calendar-rows'>{calendarDays}</Row>
                    </div>
                    <div className='calendar-div'>
                        <NavigationArrows setDays={setDays} />
                    </div>
                </Container>
            </AnimatePresence>
        </DropoffModalProvider>
    );
}
