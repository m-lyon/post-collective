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
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const [days, setDays] = useState<DateFormat[]>([]);
    const [offeredDays, setOffered] = useState<OfferedDays>(() => days.map(() => null));
    const [availability, setAvailability] = useState<AvailableDays>(() => days.map(() => []));
    const [requestedDays, setRequested] = useState<RequestedDays>(() => days.map(() => null));

    function handleWindowSizeChange() {
        setIsMobile(window.innerWidth <= 768);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        setDays((days) => {
            console.log('useEffect getInitialDates called');
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
        console.log('getCalendarDaysArray called');
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
                    requested={requestedDays[index]}
                    offered={offeredDays[index]}
                />
            );
        });
    }, [availability, days, offeredDays, requestedDays]);

    const calendarDays = getCalendarDaysArray();
    const className = isMobile ? 'text-center calendar-rows-mobile' : 'text-center calendar-rows';

    return (
        <DropoffModalProvider>
            <BHNavbar />
            <Container className='justify-content-center'>
                <Row className={className}>{calendarDays}</Row>
                <NavigationArrows isMobile={isMobile} setDays={setDays} />
            </Container>
        </DropoffModalProvider>
    );
}
