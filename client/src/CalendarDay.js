import React, { useState, useRef } from 'react';
import Col from 'react-bootstrap/Col';
import { RequestDropoff } from './RequestDropoff';
import { CSSTransition } from 'react-transition-group';

export function CalendarDay({ day, date, isAvailable }) {
    const [isSelected, setSelected] = useState(false);
    const nodeRefMain = useRef(null);
    const nodeRef = useRef(null);

    return (
        // <CSSTransition
        //     nodeRef={nodeRef}
        //     in={true}
        //     timeout={200}
        //     classNames='calendar-trans'
        //     unmountOnExit={true}
        // >
        <Col
            sm={4}
            className={`hvr-grow day bg-white ${isAvailable ? 'available' : ''}`}
            onMouseEnter={() => setSelected(true)}
            onMouseLeave={() => setSelected(false)}
        >
            <div className='day-date-text'>
                <span className='day-name text-grey'>{day}</span>
                <span className='date text-grey'>{date}</span>
            </div>
            <CSSTransition
                nodeRef={nodeRef}
                in={isSelected}
                timeout={200}
                classNames='dropoff-btns'
                unmountOnExit
            >
                <div className='select-box-parent' ref={nodeRef}>
                    <RequestDropoff unselect={() => setSelected(false)} />
                    <div className='select-box select-box-lower bg-white text-grey hvr-grow2'>
                        Offer Pickup
                    </div>
                </div>
            </CSSTransition>
        </Col>
        // </CSSTransition>
    );
}
