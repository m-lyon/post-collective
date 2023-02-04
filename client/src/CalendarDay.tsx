import axios from 'axios';
import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import { CSSTransition } from 'react-transition-group';

import { DateFormat } from './DateFormat';
import { TopButton } from './TopButton';
import { SERVER_ADDR } from './config';
import { BottomButton } from './BottomButton';
import { toggleOfferedDay } from './offers';
import { toggleRequestedDay } from './requests';
import { AvailableDay, OfferedDays, Request } from './types';
import { ToggleOfferedFunction, ToggleRequestedFunction } from './types';
import { RequestResponse, RequestedDays, AvailableDays } from './types';
import { SetOfferedFunction, SetRequestedFunction, Offer } from './types';

function getClassName(requested: Request, offered: Offer, availability: AvailableDay) {
    if (requested !== null) {
        return 'requested';
    }
    if (offered) {
        return 'offered';
    }
    if (availability.length !== 0) {
        return 'available';
    }
}

async function getRequestsForOfferedDay(offer: Offer) {
    if (offer === null) {
        return [];
    }
    const response = await axios.get(`${SERVER_ADDR}/requested`, {
        params: { offer: offer },
    });
    return response.data;
}

interface CalendarDayProps {
    date: DateFormat;
    user: string;
    availability: AvailableDay;
    toggleOffered: ToggleOfferedFunction;
    toggleRequested: ToggleRequestedFunction;
    requested: Request;
    offered: Offer;
}
export function CalendarDay({
    date,
    user,
    availability,
    toggleOffered,
    toggleRequested,
    requested,
    offered,
}: CalendarDayProps) {
    const [isSelected, setSelected] = useState(false);
    const [userRequests, setuserRequests] = useState([]);
    const className = getClassName(requested, offered, availability);
    // console.log(offered);
    useEffect(() => {
        async function func() {
            const requests = await getRequestsForOfferedDay(offered);
            setuserRequests(requests);
        }
        func();
    }, [offered]);

    return (
        <Col
            sm={4}
            className={`hvr-grow day bg-white ${className}`}
            onMouseEnter={() => setSelected(true)}
            onMouseLeave={() => setSelected(false)}
        >
            <div className='day-date-text'>
                <span className='day-name text-grey'>{date.getDayStr()}</span>
                <span className='date text-grey'>{date.getDayMonthStr()}</span>
            </div>
            <CSSTransition in={isSelected} timeout={200} classNames='dropoff-btns' unmountOnExit>
                <div className='select-box-parent'>
                    <TopButton
                        user={user}
                        unselect={() => setSelected(false)}
                        toggleRequested={toggleRequested}
                        availability={availability}
                        requested={requested}
                        offered={offered}
                        userRequests={userRequests}
                    />
                    <BottomButton
                        user={user}
                        date={date.getDateStr()}
                        toggleOffered={toggleOffered}
                        request={requested}
                        offer={offered}
                    />
                </div>
            </CSSTransition>
        </Col>
    );
}

export function getCalendarDaysArray(
    days: DateFormat[],
    user: string,
    availability: AvailableDays,
    offeredDays: OfferedDays,
    setOffered: SetOfferedFunction,
    requestedDays: RequestedDays,
    setRequested: SetRequestedFunction
) {
    // console.log('offeredDays array before: ', offeredDays);
    return days.map((day, index) => {
        // TODO:  wrap days.map in useMemo
        return (
            <CalendarDay
                date={day}
                user={user}
                key={day.getDayMonthStr()}
                availability={availability[index]}
                toggleOffered={(offer: Offer) =>
                    toggleOfferedDay(index, offer, offeredDays, setOffered)
                }
                toggleRequested={(request: RequestResponse) =>
                    toggleRequestedDay(index, request, requestedDays, setRequested)
                }
                requested={requestedDays[index]}
                offered={offeredDays[index]}
            />
        );
    });
}
