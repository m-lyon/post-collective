import axios from 'axios';
import { Col } from 'react-bootstrap';
import { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { TopButton } from './TopButton';
import { BottomButton } from './BottomButton';
import { toggleOfferedDay } from '../utils/offers';
import { toggleRequestedDay } from '../utils/requests';
import { AvailableDay, OfferedDays, Request } from '../utils/types';
import { ToggleOfferedFunction, ToggleRequestedFunction } from '../utils/types';
import { RequestedDays, AvailableDays } from '../utils/types';
import { SetOfferedFunction, SetRequestedFunction, Offer } from '../utils/types';
import { UserContext } from '../context/UserContext';
import { getConfig } from '../utils/auth';
import { DateFormat } from '../utils/dates';

async function getRequestsForOfferedDay(token: string, offer: Offer) {
    if (offer === null) {
        return [];
    }
    const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/requested`,
        getConfig(token, { offeredDateId: offer })
    );
    return response.data;
}

interface CalendarDayProps {
    date: DateFormat;
    availability: AvailableDay;
    toggleOffered: ToggleOfferedFunction;
    toggleRequested: ToggleRequestedFunction;
    requested: Request;
    offered: Offer;
}
export function CalendarDay({
    date,
    availability,
    toggleOffered,
    toggleRequested,
    requested,
    offered,
}: CalendarDayProps) {
    const [isSelected, setSelected] = useState(false);
    const [userRequests, setuserRequests] = useState([]);
    const [userContext] = useContext(UserContext);
    const [className, setClassName] = useState('');

    useEffect(() => {
        if (requested !== null) {
            setClassName('requested');
        } else if (offered) {
            if (userRequests.length === 0) {
                setClassName('offered');
            } else {
                setClassName('taken');
            }
        } else if (availability.length !== 0) {
            setClassName('available');
        } else {
            setClassName('');
        }
    }, [requested, offered, availability, userRequests]);

    useEffect(() => {
        async function func() {
            if (userContext.token) {
                const requests = await getRequestsForOfferedDay(userContext.token, offered);
                setuserRequests(requests);
            }
        }
        func();
    }, [userContext.token, offered]);

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
                        unselect={() => setSelected(false)}
                        toggleRequested={toggleRequested}
                        availability={availability}
                        requested={requested}
                        offered={offered}
                        userRequests={userRequests}
                    />
                    <BottomButton
                        unselect={() => setSelected(false)}
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
    availability: AvailableDays,
    offeredDays: OfferedDays,
    setOffered: SetOfferedFunction,
    requestedDays: RequestedDays,
    setRequested: SetRequestedFunction
) {
    console.log('getCalendarDaysArray called');
    return days.map((day, index) => {
        // TODO:  wrap days.map in useMemo
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
}
