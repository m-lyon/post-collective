import { Row } from 'react-bootstrap';
import { SetDaysFunction } from '../utils/types';
import { getStandardDate } from '../utils/dates';

function setNewDays(setDays: SetDaysFunction, operator: string): void {
    if (!['+', '-'].includes(operator)) {
        throw new Error(`Invalid operator given to setNewDays: ${operator}`);
    }
    setDays((days) => {
        const newDays = [];
        for (let day of days) {
            const date = getStandardDate(day.getDateStr());
            if (operator === '+') {
                date.setDate(date.getDate() + days.length);
            } else {
                date.setDate(date.getDate() - days.length);
            }
            newDays.push(date);
        }
        return newDays;
    });
}

interface NavigationArrowsProps {
    setDays: SetDaysFunction;
    isMobile: boolean;
}
export function NavigationArrows(props: NavigationArrowsProps) {
    const { setDays, isMobile } = props;
    const className = isMobile
        ? 'justify-content-end calendar-rows-mobile'
        : 'justify-content-end calendar-rows';
    return (
        <Row className={className}>
            <div className='svg-arrow'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='2em'
                    height='2em'
                    fill='currentColor'
                    className='hvr-grow'
                    viewBox='0 0 16 16'
                    onClick={() => setNewDays(setDays, '-')}
                >
                    <path
                        fillRule='evenodd'
                        d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z'
                    />
                </svg>
            </div>
            <div className='svg-arrow'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='2em'
                    height='2em'
                    fill='currentColor'
                    className='hvr-grow'
                    viewBox='0 0 16 16'
                    onClick={() => setNewDays(setDays, '+')}
                >
                    <path
                        fillRule='evenodd'
                        d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z'
                    />
                </svg>
            </div>
        </Row>
    );
}
