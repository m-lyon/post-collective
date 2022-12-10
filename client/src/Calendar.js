import React, { useState } from "react";
import { CalendarDay } from "./CalendarDay.js";
import Row from "react-bootstrap/Row";

export function Calendar(props) {
  const calendarDays = props.days.map((day) => {
    const [dayStr, dateStr] = day.split(" ");
    return <CalendarDay day={dayStr} date={dateStr} key={dateStr} />;
  });

  return <Row>{calendarDays}</Row>;
}
