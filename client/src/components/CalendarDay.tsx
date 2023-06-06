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

const bgAlpha: number = 0.3;

const variants = {
    initial: {
        opacity: 0,
    },
    available: {
        opacity: 1,
        backgroundColor: `rgba(23, 157, 32, ${bgAlpha})`,
        boxShadow: 'rgba(23, 157, 32, 0.6) 0px 3px 8px',
        borderColor: 'rgba(23, 157, 32, 0.3)',
    },
    offered: {
        opacity: 1,
        backgroundColor: `rgba(23, 70, 157, ${bgAlpha})`,
        boxShadow: 'rgba(23, 70, 157, 0.6) 0px 3px 8px',
        borderColor: 'rgba(23, 32, 157, 0.8)',
    },
    taken: {
        opacity: 1,
        backgroundColor: `rgba(120, 15, 15, ${bgAlpha})`,
        boxShadow: 'rgba(120, 15, 15, 0.6) 0px 3px 8px',
        borderColor: 'rgba(120, 15, 15, 0.8)',
    },
    requested: {
        opacity: 1,
        backgroundColor: `rgba(183, 192, 50, ${bgAlpha})`,
        boxShadow: 'rgba(113, 120, 15, 0.6) 0px 3px 8px',
        borderColor: 'rgba(113, 120, 15, 0.8)',
    },
    none: {
        opacity: 1,
    },
};

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

    let className: string = 'none';
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
            variants={variants}
            initial='initial'
            animate={className}
            exit='initial'
            transition={{ duration: 1 }}
            key={date.getDateStr()}
            className={`col-sm-4 hvr-grow day`}
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
