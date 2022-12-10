import React, { useState } from "react";
import Col from "react-bootstrap/Col";

export function CalendarDay({ day, date }) {
  const [isSelected, setSelected] = useState(false);
  return (
    <Col
      sm={4}
      className="hvr-grow day bg-white"
      onMouseEnter={() => setSelected(true)}
      onMouseLeave={() => setSelected(false)}
    >
      <div className="day-date-text">
        <span className="day-name text-grey">{day}</span>
        <span className="date text-grey">{date}</span>
      </div>
      {isSelected ? (
        <div className="select-box-parent">
          <div className="select-box bg-white text-grey">Request Drop-off</div>
          <div className="select-box select-box-lower bg-white text-grey">
            Offer Pickup
          </div>
        </div>
      ) : null}
    </Col>
  );
}
