import axios from 'axios';
import { Col } from 'react-bootstrap';
import { useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { TopButton } from './TopButton';
import { BottomButton } from './BottomButton';
import { AvailableDay, Request } from '../utils/types';
import { ToggleOfferedFunction, ToggleRequestedFunction } from '../utils/types';
import { Offer } from '../utils/types';
import { UserContext } from '../context/UserContext';
import { getConfig } from '../utils/auth';
import { DateFormat } from '../utils/dates';

async function getRequestsForOfferedDay(token: string, offer: Offer) {
    if (!offer) {
        return [];
    }
    console.log('getRequestsForOfferedDay called', offer);
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
export function CalendarDay(props: CalendarDayProps) {
    const { date, availability, toggleOffered, toggleRequested, requested, offered } = props;
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
            className={`hvr-grow day ${className}`}
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
