import React, { useState } from 'react';
import { CalendarDay } from "./CalendarDay.js";


export function Calendar(props) {
    const [selectedDay, setSelectedDay] = useState('');
    const calendarDays = props.days.map((day) => {
        const [dayStr, dateStr] = day.split(" ");
        return <CalendarDay
            day={dayStr}
            date={dateStr}
            key={dateStr}
            id={dateStr}
            isSelected={dateStr === selectedDay}
            onClick={() => { setSelectedDay(dateStr) }}
            unselect={() => { setSelectedDay('') }}
        />
    });

    return (
        <div className="row">
            {calendarDays}
        </div>
    );
}
