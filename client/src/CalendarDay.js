import React, { useRef } from 'react';
import { useOutsideAlerter } from './useOutsideAlerter';


export function CalendarDay({ isSelected, unselect, onClick, day, date }) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, isSelected, unselect);

    return (
        <div className="hvr-grow day col-sm-4 bg-white" onClick={onClick} ref={wrapperRef}>
            <div className="day-date-text">
                <span className="day-name text-grey">{day}</span>
                <span className="date text-grey">{date}</span>
            </div>
            {isSelected ?
                <div className="select-box-parent">
                    <div className="select-box bg-white text-grey">Request Drop-off</div>
                    <div className="select-box select-box-lower bg-white text-grey">Offer Pickup</div>
                </div>
                : null}
        </div>
    );
}
