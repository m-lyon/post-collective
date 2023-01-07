import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import { RequestDropoff } from './RequestDropoff';
import { CSSTransition } from 'react-transition-group';

export function CalendarDay({
    day,
    user,
    date,
    availability,
    toggleOffered,
    toggleRequested,
    requested,
}) {
    // TODO: change availability to form {state: bool, data: [db data]}
    const [isSelected, setSelected] = useState(false);
    let className = '';
    if (requested.state) {
        className = 'requested';
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
                <span className='day-name text-grey'>{day}</span>
                <span className='date text-grey'>{date}</span>
            </div>
            <CSSTransition in={isSelected} timeout={200} classNames='dropoff-btns' unmountOnExit>
                <div className='select-box-parent'>
                    <RequestDropoff
                        user={user}
                        unselect={() => setSelected(false)}
                        toggleRequested={toggleRequested}
                        availability={availability}
                        requested={requested}
                    />
                    <div className='select-box select-box-lower bg-white text-grey hvr-grow2'>
                        Offer Pickup
                    </div>
                </div>
            </CSSTransition>
        </Col>
    );
}
