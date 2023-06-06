import axios from 'axios';
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
import { motion } from 'framer-motion';

async function getRequestsForOfferedDay(token: string, offer: Offer) {
    if (!offer) {
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
    request: Request;
    offer: Offer;
}
export function CalendarDay(props: CalendarDayProps) {
    const { date, availability, toggleOffered, toggleRequested, request, offer } = props;
    const [isSelected, setSelected] = useState(false);
    const [userRequests, setuserRequests] = useState([]);
    const [userContext] = useContext(UserContext);

    let className: string = '';
    if (request !== null) {
        className = 'requested';
    } else if (offer) {
        if (userRequests.length === 0) {
            className = 'offered';
        } else {
            className = 'taken';
        }
    } else if (availability.length !== 0) {
        className = 'available';
    }

    useEffect(() => {
        async function func() {
            if (userContext.token) {
                const requests = await getRequestsForOfferedDay(userContext.token, offer);
                setuserRequests(requests);
            }
        }
        func();
    }, [userContext.token, offer]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            key={date.getDateStr()}
            className={`col-sm-4 hvr-grow day ${className}`}
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
                        request={request}
                        offer={offer}
                        userRequests={userRequests}
                    />
                    <BottomButton
                        unselect={() => setSelected(false)}
                        date={date.getDateStr()}
                        toggleRequested={toggleRequested}
                        toggleOffered={toggleOffered}
                        request={request}
                        offer={offer}
                    />
                </div>
            </CSSTransition>
        </motion.div>
    );
}
