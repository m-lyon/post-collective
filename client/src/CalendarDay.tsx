import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import { CSSTransition } from 'react-transition-group';
import { DateFormat } from './DateFormat';

import { RequestButton } from './RequestDropoff';
import { OfferButton } from './OfferPickup';
import { AvailableDay, RequestedDay } from './types';
import { ToggleOfferedFunction, ToggleRequestedFunction } from './types';

interface CalendarDayProps {
    date: DateFormat;
    user: string;
    availability: AvailableDay;
    toggleOffered: ToggleOfferedFunction;
    toggleRequested: ToggleRequestedFunction;
    requested: RequestedDay;
    offered: boolean;
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
    let className = '';
    if (requested.state) {
        className = 'requested';
    } else if (offered) {
        className = 'offered';
    } else if (availability.state) {
        className = 'available';
    }
    // react-mount-animation for animation
    // https://dev.to/mijim/easily-animate-react-components-when-mount-unmount-223e

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
                    <RequestButton
                        user={user}
                        unselect={() => setSelected(false)}
                        toggleRequested={toggleRequested}
                        availability={availability}
                        requested={requested}
                        offered={offered}
                    />
                    <OfferButton
                        user={user}
                        date={date.getDateStr()}
                        toggleOffered={toggleOffered}
                        requested={requested}
                        offered={offered}
                    />
                </div>
            </CSSTransition>
        </Col>
    );
}
